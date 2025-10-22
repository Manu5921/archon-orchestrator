# Jules MCP Server Dockerfile
FROM node:18-alpine AS builder

WORKDIR /build

# Install git and build dependencies
RUN apk add --no-cache git python3 make g++ chromium

# Set Puppeteer to use system Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Clone Jules MCP repository
RUN git clone https://github.com/samihalawa/google-jules-mcp.git .

# Install pnpm
RUN npm install -g pnpm

# Install dependencies and build
RUN pnpm install
RUN pnpm run build

# Production stage
FROM node:18-alpine

# Install runtime dependencies
RUN apk add --no-cache chromium curl

# Set Puppeteer to use system Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# Copy built application
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package.json ./package.json

# Create necessary directories
RUN mkdir -p /app/logs /app/data

# Health check script
RUN echo '#!/bin/sh' > /app/health-check.sh && \
    echo 'curl -f http://localhost:3001/health || exit 1' >> /app/health-check.sh && \
    chmod +x /app/health-check.sh

# Non-root user for security
RUN adduser -D -s /bin/sh appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 3001

# Start the Jules MCP server
CMD ["node", "dist/index.js", "--port", "3001"]