# Multi-stage: build frontend then serve with nginx
FROM node:20-alpine AS frontend-build
WORKDIR /app
# Copy only dependency manifests first (cache-friendly)
COPY frontend/package.json frontend/package-lock.json* ./frontend/
WORKDIR /app/frontend
RUN npm ci --silent
# Copy the rest of the frontend sources and build
COPY frontend/ ./
RUN npm run build

# --- Etapa final de Nginx ---
FROM nginx:stable-alpine
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
# --- FIN DE LA CORRECCIÓN ---

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
