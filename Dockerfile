# TrustBoost Phase 4 - Production Optimized Dockerfile
# Multi-stage build for optimal size and security

# ==========================================
# STAGE 1: Dependencies
# ==========================================
FROM node:20-alpine AS deps
LABEL stage=deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then \
    npm ci --only=production --ignore-scripts && npm cache clean --force; \
  else \
    echo "Lockfile not found." && exit 1; \
  fi

# ==========================================
# STAGE 2: Build
# ==========================================
FROM node:20-alpine AS builder
LABEL stage=builder

# Add build-time metadata
ARG NEXT_PUBLIC_VERSION
ARG NODE_ENV=production
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT

ENV NODE_ENV=$NODE_ENV
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_VERSION=$NEXT_PUBLIC_VERSION

WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install all dependencies for build (including devDependencies)
RUN npm ci --ignore-scripts

# Build the application
RUN \
  echo "Building TrustBoost Phase 4 v${NEXT_PUBLIC_VERSION}..." && \
  npm run build && \
  echo "Build completed successfully"

# ==========================================
# STAGE 3: Production Runtime
# ==========================================
FROM node:20-alpine AS runner
LABEL maintainer="TrustBoost Team"
LABEL version="$NEXT_PUBLIC_VERSION"
LABEL description="TrustBoost Phase 4 Production Container"

# Security: Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Security & Performance optimizations
RUN apk add --no-cache \
    tini \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Use tini as entrypoint for proper signal handling
ENTRYPOINT ["tini", "--"]
CMD ["node", "server.js"]