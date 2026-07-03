# Dockerfile pour Plateforme_BuildTech (Next.js/Vite)
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copier package files
COPY package*.json ./

# Installer dépendances
RUN npm install

# Copier le code source
COPY . .

# Build pour production
RUN npm run build

# Stage 2: Runtime avec Nginx
FROM nginx:alpine

# Copier les fichiers buildés depuis le stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port
EXPOSE 3000

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
