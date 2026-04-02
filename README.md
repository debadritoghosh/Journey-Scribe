# Journey Scribe | Professional Deployment Guide

This project is optimized for a **zero-cost, high-performance** deployment on **Render**.

## 🚀 Deployment on Render (Free Tier)

### 1. Connect to GitHub
- Push your code to a GitHub repository.
- Create a new **Static Site** on [Render](https://render.com).
- Connect your GitHub repository.

### 2. Configure Build Settings
Render will automatically detect the `render.yaml` file, but if you need to set it manually:
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

### 3. Environment Variables
- Go to the **Environment** tab in your Render dashboard.
- Add your `GEMINI_API_KEY` to the environment variables.
- The `vite.config.ts` is already configured to inject this key during the build process.

### 4. Client-Side Routing (SPA)
- We have included a `_redirects` file and a `render.yaml` with a rewrite rule to ensure that all routes point to `index.html`. This allows your React app to handle routing correctly.

## 📱 Mobile App (PWA)
- The application is configured as a **Progressive Web App (PWA)**.
- Once deployed, users can visit your URL on their mobile devices and select **"Add to Home Screen"** to install the app for free.

## 🛡️ Security Note
- For a production-level app, ensure your **Firebase Security Rules** (`firestore.rules`) are deployed to your Firebase project to protect your data.

---
**Journey Scribe** - *Every Journey Deserves a Scribe.*
