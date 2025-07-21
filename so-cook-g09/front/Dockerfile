# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default nginx config with our server block
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove nginx entrypoint scripts to clean up startup logs
RUN rm -rf /docker-entrypoint.d/*

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
