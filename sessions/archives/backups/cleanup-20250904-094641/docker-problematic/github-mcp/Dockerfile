# GitHub MCP Server Dockerfile
FROM golang:1.23-alpine AS builder

WORKDIR /build

# Install git and other dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Clone the official GitHub MCP server
RUN git clone https://github.com/github/github-mcp-server.git .

# Build the application
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o github-mcp-server .

# Final stage
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates curl

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /build/github-mcp-server .
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo

# Create logs directory
RUN mkdir -p /app/logs

# Health check script
RUN echo '#!/bin/sh' > /app/health-check.sh && \
    echo 'curl -f http://localhost:3000/health || exit 1' >> /app/health-check.sh && \
    chmod +x /app/health-check.sh

# Non-root user for security
RUN adduser -D -s /bin/sh appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 3000

# Start the server with health endpoint
CMD ["./github-mcp-server", "--port", "3000"]