# Hosting Guide (By 5AM)

This project is a **Node/Express API + React frontend + MongoDB**.

## Option A (Fastest): Render + MongoDB Atlas

### 1) Create MongoDB Atlas
- Create a cluster
- Create a database user + password
- Allow network access (0.0.0.0/0 for quick testing, then tighten)
- Copy your connection string into `MONGODB_URI`

### 2) Deploy Backend (Render Web Service)
- Create **Web Service** from this repo
- Root directory: `ati-nawalapitiya-system`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables (Render → Environment):
  - `MONGODB_URI` = (Atlas connection string)
  - `JWT_SECRET` = (long random string)
  - `JWT_EXPIRE` = `30d`
  - `CORS_ORIGINS` = your frontend URL (see step 3)

Backend URL will look like: `https://<your-backend>.onrender.com`

### 3) Deploy Frontend (Render Static Site)
- Create **Static Site** from `ati-nawalapitiya-system/frontend`
- Build command: `npm install && npm run build`
- Publish directory: `build`
- Environment variables:
  - `REACT_APP_API_URL` = `https://<your-backend>.onrender.com/api`

Frontend URL will look like: `https://<your-frontend>.onrender.com`

### 4) Create director account in production
In Render backend Shell / or local terminal with production `MONGODB_URI`:
- `npm run create-director`

Default (can be changed by env):
- `director@ati.lk / director123`

## Option B: VPS (Ubuntu) + Nginx + PM2

### Backend
- Install Node.js LTS + MongoDB (or use Atlas)
- `npm install`
- Set `.env` (see `.env.example`)
- Run with PM2:
  - `pm2 start backend/server.js --name ati-backend`
  - `pm2 save`

### Frontend
- `cd frontend && npm install && npm run build`
- Serve `frontend/build` via Nginx

### Nginx
- Route `/api` to backend (port 5000)
- Serve React build for everything else

## Notes
- Ensure only **one backend** runs on port 5000.
- Change default passwords before real production.
