# Archon Orchestrator Main Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache curl git

# Copy package.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY src/ ./src/
COPY jules-hybrid-deploy.js ./
COPY jules-quick-deploy.js ./

# Create necessary directories
RUN mkdir -p /app/logs /app/data /app/temp

# Health check endpoint script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'node -e "' >> /app/start.sh && \
    echo 'const http = require(\"http\");' >> /app/start.sh && \
    echo 'const server = http.createServer((req, res) => {' >> /app/start.sh && \
    echo '  if (req.url === \"/health\") {' >> /app/start.sh && \
    echo '    res.writeHead(200, {\"Content-Type\": \"application/json\"});' >> /app/start.sh && \
    echo '    res.end(JSON.stringify({status: \"healthy\", timestamp: new Date().toISOString()}));' >> /app/start.sh && \
    echo '  }' >> /app/start.sh && \
    echo '});' >> /app/start.sh && \
    echo 'server.listen(3456, () => console.log(\"Archon Orchestrator healthy on port 3456\"));' >> /app/start.sh && \
    echo '" &' >> /app/start.sh && \
    echo 'exec node jules-hybrid-deploy.js "$@"' >> /app/start.sh && \
    chmod +x /app/start.sh

# Non-root user for security
RUN adduser -D -s /bin/sh appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 3456 8080

# Start Archon with health endpoint
CMD ["./start.sh", "daemon"]