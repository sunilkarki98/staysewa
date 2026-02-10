# Production Dockerfile for StaySewa Backend
# Using Bun for maximum performance

# Stage 1: Build
FROM oven/bun:1.1 AS builder

WORKDIR /app

# Copy dependency files first for caching
COPY package.json bun.lock tsconfig.json tsup.config.ts ./

# Install all dependencies
RUN bun install

# Copy source code
COPY src ./src

# Build the application
RUN bun run build

# Stage 2: Production Runtime
FROM oven/bun:1.1-slim AS runner

WORKDIR /app

# Non-root user for security
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -s /bin/sh -m nodejs

COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist

# Install production dependencies only
RUN bun install --production

USER nodejs

EXPOSE 4000

ENV NODE_ENV=production

CMD ["bun", "run", "start"]
