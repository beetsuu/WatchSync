# ---- Build-Stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Erst nur package-Dateien kopieren und installieren (Caching-Trick)
COPY package*.json ./
RUN npm ci

# Restlichen Code kopieren
COPY . .

# API-URL wird zur Build-Zeit eingebettet
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Produktions-Build erstellen
RUN npm run build

# ---- Runtime-Stage ----
FROM nginx:alpine AS final

# Eigene nginx-Config für SPA-Routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Gebaute Dateien aus der Build-Stage kopieren
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
