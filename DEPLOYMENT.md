# Deployment Guide for Bookmark Manager

This guide covers deploying the MERN bookmark manager to production using MongoDB Atlas, a Node.js host for the backend, and a static frontend host such as Vercel or Netlify.

## 1) Create a MongoDB Atlas cluster

1. Sign in to MongoDB Atlas and create a new project.
2. Build a new cluster using the free shared tier if you want to start with a low-cost option.
3. Once the cluster is ready, click Connect.
4. Choose Connect your application.
5. Copy the connection string and replace the placeholder username/password with your Atlas credentials.
6. In Network Access, add your local development IP address and the deployment platform IPs if needed.
7. If your hosting provider does not expose a fixed IP, use 0.0.0.0/0 for testing only if you understand the security tradeoff.

Recommended local setup:

- MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/bookmark-manager?retryWrites=true&w=majority

## 2) Prepare backend environment variables

Create a production environment file for the backend and set these values in your hosting platform:

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/bookmark-manager?retryWrites=true&w=majority
FRONTEND_URL=https://your-frontend-domain.vercel.app
JWT_SECRET=your_long_random_access_secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_long_random_refresh_secret
JWT_ACCESS_SECRET=your_long_random_access_secret
JWT_REFRESH_SECRET=your_long_random_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Backend deployment steps

#### Render

1. Create a new Web Service on Render.
2. Connect your repository.
3. Set the root directory to the project root if your service runs from there, or set the service directory to backend if the repo contains a separate backend folder.
4. Build command: `npm install`
5. Start command: `npm run start:prod`
6. Add the environment variables listed above.
7. Deploy.

#### Railway

1. Create a new project and select Deploy from GitHub.
2. Link the repository.
3. Set the start command to `npm run start:prod` inside the backend folder if needed.
4. Add the same environment variables.
5. Deploy the service.

## 3) Update backend CORS for the deployed frontend

The backend currently restricts CORS to the frontend origin. Update the production frontend URL in the environment variables so the deployed frontend is allowed.

Example:

```env
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

If you are using Netlify, the origin will be something like `https://your-site.netlify.app`.

## 4) Deploy the frontend

### Vercel

1. Import the frontend project into Vercel.
2. In the project settings, set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Add this environment variable:

```env
VITE_API_URL=https://your-backend-domain.onrender.com
```

### Netlify

1. Import the frontend project into Netlify.
2. Use the Vite build settings if needed.
3. Set the build command to `npm run build`.
4. Set the publish directory to `dist`.
5. Add:

```env
VITE_API_URL=https://your-backend-domain.onrender.com
```

## 5) Final production checks

1. Confirm the backend health endpoint works: `https://your-backend-domain/.../api/health`.
2. Confirm frontend login/register works against the deployed backend.
3. Confirm the backend accepts requests from the frontend origin only.
4. Check that no real secrets are committed to git or included in source files.
5. Verify MongoDB Atlas network access includes the deployed backend and your local machine.

## 6) Security reminder

Do not commit `.env` files to version control. Keep secrets in your hosting platform environment variables only.
