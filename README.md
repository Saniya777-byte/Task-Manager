# TaskFlow MERN Task Manager

A production-ready MERN stack task management application with JWT authentication, protected APIs, responsive React UI, task CRUD, search, filters, pagination, dashboard statistics, dark mode, toast notifications, and deployment-ready configuration.

## Tech Stack

- Frontend: React, Vite, React Router DOM, Axios, Context API, Tailwind CSS
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT and bcrypt password hashing
- Deployment: Vercel frontend, Render backend, MongoDB Atlas database

## Project Structure

```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
  app.js
  server.js
frontend/
  src/
    components/
    context/
    hooks/
    pages/
    services/
    utils/
    App.jsx
```

## API Endpoints

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Tasks:

- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/status`

## Local Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Update `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/task-manager
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

4. Update `frontend/.env` if your API is not on port `5000`:

```env
VITE_API_URL=http://localhost:5000/api
```

5. Run the backend:

```bash
npm run dev:backend
```

6. Run the frontend:

```bash
npm run dev:frontend
```

Open `http://localhost:5173`.

## Deployment

### MongoDB Atlas

1. Create a MongoDB Atlas project and cluster.
2. Add a database user with read/write permissions.
3. Add your Render backend IP or allow access from `0.0.0.0/0`.
4. Copy the connection string and set it as `MONGO_URI` on Render.

### Backend on Render

1. Create a new Render Web Service from this repository.
2. Set the root directory to `backend`.
3. Set build command:

```bash
npm install
```

4. Set start command:

```bash
npm start
```

5. Add environment variables from `backend/.env.example`.
6. Set `CLIENT_URL` to your deployed Vercel URL.

### Frontend on Vercel

1. Create a Vercel project from this repository.
2. Set the root directory to `frontend`.
3. Set build command:

```bash
npm run build
```

4. Set output directory:

```bash
dist
```

5. Add `VITE_API_URL` with your Render backend URL plus `/api`.

Example:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```
