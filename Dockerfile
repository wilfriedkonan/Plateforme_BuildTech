# Dockerfile pour Plateforme_BuildTech (Vite + React SPA)

# ── Stage 1 : compilation ────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les manifestes de dépendances en premier (meilleur cache layer)
COPY package*.json ./

# Installer toutes les dépendances (dev incluses, nécessaires au build)
RUN npm install

# Copier le code source
COPY . .

# Compiler pour la production
RUN NODE_ENV=production npm run build

# ── Stage 2 : runtime Nginx (non-root) ──────────────────────────────────────
# Version épinglée sur la branche stable — à mettre à jour lors des mises à jour de sécurité Nginx
FROM nginx:1.26-alpine

# Copier les fichiers statiques buildés avec les droits de l'utilisateur nginx (uid=101)
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Copier la configuration nginx
COPY nginx.conf /etc/nginx/nginx.conf

# nginx doit pouvoir écrire dans ces dossiers (cache, logs, tmp) quand il tourne en non-root
RUN chown -R nginx:nginx /var/cache/nginx /var/log/nginx \
 && chmod -R 755 /var/cache/nginx /var/log/nginx

# Port >1024 : accessible sans privilèges root
EXPOSE 3000

# Basculer sur l'utilisateur non-root fourni par l'image nginx
USER nginx

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
