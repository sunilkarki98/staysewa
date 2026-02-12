# Production Dockerfile for StaySewa Backend
# Multi-stage build with Node.js

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first for caching
COPY package.json tsconfig.json tsup.config.ts ./

# Install all dependencies
RUN npm install

# Copy source code and config
COPY src ./src
COPY drizzle.config.ts ./
COPY drizzle ./drizzle

# Build the application
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist

# Install production dependencies only
RUN npm install --omit=dev && npm cache clean --force

COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./

USER nodejs

EXPOSE 4000

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
