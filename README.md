# UniGuajira News

App multiplataforma (Web + Android/iOS) para acceso optimizado a noticias de la Universidad de La Guajira.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS |
| Mobile | Capacitor (Android APK / iOS IPA) |
| Backend | Node.js + Express (servidor proxy) |
| Base de datos | MariaDB (caché de noticias) |
| Scraping | Cheerio + Axios |

## Desarrollo

```bash
# 1. Iniciar MariaDB
echo 1234 | sudo -S mariadbd-safe --skip-grant-tables &

# 2. Crear base de datos
echo 1234 | sudo -S mariadb -u root -puniguajira2026 uniguajira_news < database/schema.sql

# 3. Backend (puerto 3000)
cd server && npm start

# 4. Frontend (puerto 5173)
cd app && npm run dev
```

---

## PRODUCCIÓN

### Opción 1: Servidor VPS (Recomendada)

#### 1. Requisitos del servidor
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install -y nodejs npm mariadb-server
sudo systemctl start mariadb && sudo systemctl enable mariadb
```

#### 2. Clonar y construir
```bash
git clone <tu-repo> ~/proyecto_de_grado
cd ~/proyecto_de_grado
chmod +x deploy.sh && ./deploy.sh
```

#### 3. Servicio systemd (auto-inicio)
```bash
sudo cp uniguajira-news.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable uniguajira-news
sudo systemctl start uniguajira-news
```

#### 4. Proxy inverso con Nginx (para HTTPS y dominio)
```nginx
# /etc/nginx/sites-available/uniguajira
server {
    listen 80;
    server_name tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
```bash
# SSL gratis con Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.com
```

#### 5. Health check
```
https://tudominio.com/api/health
```

---

### Opción 2: Servicio Cloud (Render / Railway)

#### Render.com (gratuito)
1. Crea cuenta en https://render.com
2. Conecta tu repo de GitHub
3. Crea un **Web Service**:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
   - **Environment Variables**:
     - `NODE_ENV=production`
     - `DB_HOST=host_de_mariadb_en_la_nube`
     - `DB_PASSWORD=...`
4. Crea un **Static Site** para el frontend:
   - **Root Directory**: `app`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

---

### APK para Play Store

#### Requisitos
```bash
# Android SDK (instalar Android Studio)
# Java 17+
sudo apt install -y openjdk-17-jdk
```

#### Generar APK
```bash
cd app
npm run build
npx cap sync android
npx cap open android
# En Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
# El APK estará en: android/app/build/outputs/apk/debug/
```

#### Generar AAB (Play Store)
```bash
# En Android Studio: Build → Generate Signed Bundle / APK
# Seleccionar Android App Bundle
# Crear keystore o usar uno existente
# El AAB estará en: android/app/release/
```

---

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/news?category=X&limit=N` | Noticias cacheadas |
| POST | `/api/news/refresh` | Forzar scrapeo y refrescar caché |
| GET | `/api/news/categories` | Listar categorías |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registrarse |

---

## Variables de Entorno (server/.env)

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PORT` | `3000` | Puerto del servidor |
| `NODE_ENV` | `development` | `production` para servir frontend |
| `DB_HOST` | `localhost` | Host de MariaDB |
| `DB_PORT` | `3306` | Puerto de MariaDB |
| `DB_USER` | `root` | Usuario BD |
| `DB_PASSWORD` | `` | Contraseña BD |
| `DB_NAME` | `uniguajira_news` | Nombre BD |
| `CORS_ORIGIN` | `*` | Origen permitido CORS |

---

## Estructura del Proyecto

```
proyecto_de_grado/
├── server/           # Backend API (Express + MariaDB + Scraper)
│   └── src/
│       ├── index.js        # Servidor principal
│       ├── scraper.js      # Web scraping uniguajira.edu.co
│       ├── cache.js        # Caché en MariaDB
│       ├── config/db.js    # Conexión BD
│       ├── routes/         # API REST
│       └── middleware/     # Auth
├── app/              # Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/    # Componentes UI
│   │   ├── pages/         # Páginas
│   │   ├── context/       # ThemeContext
│   │   ├── services/      # API client
│   │   └── types/         # TypeScript types
│   ├── android/           # Proyecto Android nativo (Capacitor)
│   ├── ios/               # Proyecto iOS nativo (Capacitor)
│   └── capacitor.config.ts
├── database/
│   └── schema.sql         # Esquema MariaDB
├── deploy.sh              # Script de build + deploy
└── uniguajira-news.service # Systemd service
```
