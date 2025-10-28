# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.7.0-alpine

# Development stage
FROM node:${NODE_VERSION} AS development
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
EXPOSE 4200
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]

# Production build stage
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginxinc/nginx-unprivileged:alpine3.22 AS production
USER nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx --from=builder /app/dist/ec_frontend/browser /usr/share/nginx/html
EXPOSE 8080
ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]