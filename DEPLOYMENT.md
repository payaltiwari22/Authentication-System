# Full-Stack Deployment Guide 🚀

This guide provides the exact step-by-step process for deploying this repository to the live internet using free, high-quality cloud hosting providers.

Because this project is separated into a **Node.js API backend** and a **React frontend**, we will deploy them to two different services configured for their specific environments: **Render** for the backend, and **Vercel** for the frontend UI.

---

## 🏗️ Step 1: Deploying the Backend (Render.com)

You must deploy the backend API first so that we can get a live `https://...` URL for the React app to communicate with.

1. **Create an account:** Go to [Render.com](https://render.com/) and sign up using your GitHub account.
2. **Dashboard:** Once logged in, click the **"New +"** button in the top right corner and select **"Web Service"**.
3. **Connect Repository:** Select your repository from the list (e.g., `payaltiwari22/Authentication-System`).
4. **Configure Settings:** Fill out the deployment details exactly as follows:
   - **Name:** `auth-api-backend` (or whatever you like)
   - **Root Directory:** `backend-node`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:**  (or`npm start` `node server.js`)
   - **Instance Type:** Free Tier
5. **Environment Variables:** Scroll down to the Environment Variables section and click **"Add Environment Variable"**. You must add all the keys from your local `backend-node/.env` file:
   - `SECRET_KEY` = `super-secret-key-for-jwt-change-in-production`
   - `GOOGLE_CLIENT_ID` = `327506...apps.googleusercontent.com`
   - `SMTP_SERVER` = `smtp.gmail.com`
   - `SMTP_PORT` = `587`
   - `SMTP_USERNAME` = `your-email@gmail.com`
   - `SMTP_PASSWORD` = `your-app-password`
6. **Deploy:** Click **Create Web Service**. 
7. **Wait & Copy URL:** Wait a few minutes for Render to build the project. Once you see the green "Live" badge, copy the URL provided at the top left (it will look like `https://auth-api-xyz.onrender.com`).

---

## 🔗 Step 2: Connect the Frontend to the Live Backend

Right now, your React app's code is hardcoded to talk to `http://localhost:8001`. We need to change it to your new live Render URL before deploying the frontend!

1. Open your code editor and navigate to `frontend/src/context/AuthContext.jsx`.
2. Locate the Axios configuration around **Line 14**:
   ```javascript
   const api = axios.create({
     baseURL: 'http://localhost:8001', // REMOVE THIS LINE
   });
   ```
3. **Replace it** with the live URL you copied from Render:
   ```javascript
   const api = axios.create({
     baseURL: 'https://auth-api-xyz.onrender.com', // PASTE YOUR RENDER URL HERE
   });
   ```
4. **Save** the file (`Ctrl + S`).
5. Open your terminal and **Push** this update to GitHub:
   ```bash
   git add .
   git commit -m "Update API URL for production deployment"
   git push
   ```

---

## 🌐 Step 3: Deploy the React Frontend (Vercel.com)

Now that your API is live and your GitHub code is updated to point to it, we can deploy the user interface!

1. **Create an account:** Go to [Vercel.com](https://vercel.com/) and sign up using your GitHub account.
2. **Dashboard:** Once logged in, click **"Add New..."** ➔ **"Project"**.
3. **Import Repository:** You will see a list of your GitHub repositories. Find `Authentication-System` and click **Import**.
4. **Configure Settings:**
   - **Project Name:** `secure-auth-app` (or whatever you like)
   - **Framework Preset:** `Vite` *(Vercel should auto-detect this)*
   - **Root Directory:** Click "Edit" and type `frontend`. Confirm the selection.
5. **Deploy:** Click the bright blue **Deploy** button.
6. **Live!** Within 60 seconds, Vercel will finish building your React app. It will shower you with confetti and provide you with a live domain (e.g., `https://secure-auth-app.vercel.app`).

**🎉 Congratulations! Your full-stack Authentication System is now officially live on the internet!**
