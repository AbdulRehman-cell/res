# Base image for dependencies
FROM node:18.17.0 AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production --legacy-peer-deps

# Build stage for client
FROM node:18.17.0 AS builder
WORKDIR /app
COPY client/package.json client/package-lock.json ./client/
RUN npm install --prefix client
COPY client ./client
RUN npm run build --prefix client

# Final image for production
FROM node:18.17.0 AS runtime
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/client/build ./client/build
COPY server ./server
COPY package.json ./
CMD ["node", "server/index.js"]

# Healthcheck for the service
HEALTHCHECK CMD curl --fail http://localhost:3000/health || exit 1