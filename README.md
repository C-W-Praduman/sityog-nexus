# Sityog Notes Nexus

## Live Link: https://sityog-nexus.vercel.app/

A full-stack web application for sharing student notes and previous year questions (PYQs) for SITYOG students.

## ✨ Features
- **Firebase Authentication**: Email/password registration and login, Google Sign-In, and email-based password reset powered by Firebase Authentication (eliminating custom SMTP/Nodemailer hosting issues in serverless/cloud deployments).
- **Backend Session Sync & Role Control**: Verifies Firebase ID tokens with `firebase-admin` on the Express backend and syncs user records and roles (`user`, `host`, `admin`) in MongoDB.
- **User Dashboard**: Manage and update your profile (`name`, `mobile`, `rollNo`, `branch`, `semester`).
- **Academic Vault**: Browse and preview/download notes and PYQs filtered by branch (`Common`, `CSE`, `Electrical`, `Electronics`, `Civil`, `Mechanical`) and semester (`1`–`6`).
- **Protected Note Uploads**: Authenticated PDF uploads with real-time upload progress tracking and Cloudinary raw file storage.
- **Admin Panel**: Host/admin dashboard to view users, edit user profiles/roles, block or unblock accounts, remove users (MongoDB + Firebase), and delete uploaded notes.
- **Responsive UI**: Dark-themed React + Tailwind CSS v4 interface with toast notifications and mobile navigation.

## 🛠️ Tech Stack
- **Frontend**: React 19 (Vite), React Router DOM, Tailwind CSS v4 (`@tailwindcss/vite`), Firebase Web SDK, Axios, `react-hot-toast`, `react-icons`, Swiper
- **Backend**: Node.js, Express 5, Mongoose, Firebase Admin SDK, Multer (`multer`, `multer-storage-cloudinary`)
- **Database**: MongoDB (Atlas recommended for production)
- **Storage**: Cloudinary (PDFs stored as `raw` assets in the `nexus_notes` folder)
- **Authentication**: Firebase Authentication (Email/Password, Google OAuth, Password Reset) + `firebase-admin` token verification

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- MongoDB Atlas account (or local MongoDB instance)
- Firebase project with **Authentication** enabled (Email/Password and Google sign-in providers)
- Cloudinary account

### Local Development Setup

#### 1. Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

#### 2. Environment Configuration

**Backend** (`server/.env` — see [server/.env.example](server/.env.example)):
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sityog_nexus?retryWrites=true&w=majority
PORT=3000
FIREBASE_PROJECT_ID=your_firebase_project_id
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://sityog-nexus.vercel.app
```
> **Note**: Deleting users via the admin endpoint (`admin.auth().deleteUser`) requires `GOOGLE_APPLICATION_CREDENTIALS` or default Google service account credentials in your server environment.

**Frontend** (`client/.env.local` — see [client/.env.example](client/.env.example)):
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### 3. Start Development Servers
```bash
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend
cd client && npm run dev
```

Visit `http://localhost:5173`.

## 📦 Production Deployment

### Environment Variables (Production)
Never commit `.env` or `.env.local` files. Configure secrets in your hosting provider's dashboard:

**Backend Production Variables (e.g., Render)**:
- `MONGO_URI`: MongoDB Atlas connection string
- `PORT`: Server port (assigned automatically on Render, defaults to `3000`)
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary credentials
- `FRONTEND_URL`: Deployed frontend URL
- `GOOGLE_APPLICATION_CREDENTIALS` (optional): Needed if using admin user deletion in Firebase Auth

**Frontend Production Variables (Vercel)**:
- `VITE_API_BASE_URL`: Your deployed backend URL (falls back to `https://sityog-nexus.onrender.com` if unset)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### Recommended Platforms
- **Frontend**: Vercel (SPA routing configured via `client/vercel.json`)
- **Backend**: Render
- **Database**: MongoDB Atlas

### Pre-Deployment Checklist
- [ ] Add your Vercel domain (e.g., `sityog-nexus.vercel.app`) to **Firebase Console → Authentication → Settings → Authorized domains**
- [ ] Configure all `VITE_FIREBASE_*` and `VITE_API_BASE_URL` variables in Vercel
- [ ] Configure `MONGO_URI`, `FIREBASE_PROJECT_ID`, and `CLOUDINARY_*` variables on your backend host
- [ ] Verify MongoDB Atlas network access allows your backend host
- [ ] Test Email/Password, Google Sign-In, Password Reset, and PDF upload flows

## 📂 Project Structure
```text
frontend-project/
├── client/                        # React + Vite frontend
│   ├── public/                    # Static public assets (favicon)
│   ├── src/
│   │   ├── assets/illustrations/  # Landing page illustrations
│   │   ├── components/            # Navbar, Footer, Logo, and download UI components
│   │   ├── config/                # API base URL & Firebase Web SDK setup
│   │   ├── context/               # AuthContext (Firebase listener + backend sync)
│   │   ├── pages/                 # App pages (Landing, Login, Register, Upload, Download, Dashboard, Admin)
│   │   ├── App.jsx                # Route definitions & auth route guards
│   │   ├── index.css              # Tailwind CSS v4 & global styles
│   │   └── main.jsx               # React entry point
│   ├── .env.example               # Frontend environment template
│   ├── eslint.config.js           # ESLint configuration
│   ├── index.html                 # HTML entry template
│   ├── package.json               # Frontend dependencies & scripts
│   ├── vercel.json                # Vercel SPA rewrite configuration
│   └── vite.config.js             # Vite & Tailwind CSS plugin config
│
└── server/                        # Express backend
    ├── config/
    │   ├── cloudinary.js          # Cloudinary v2 configuration
    │   └── firebase.js            # Firebase Admin SDK initialization
    ├── models/
    │   ├── Note.js                # Note Mongoose schema
    │   └── User.js                # User Mongoose schema
    ├── .env.example               # Backend environment template
    ├── package.json               # Backend dependencies & scripts
    └── server.js                  # Express server, Firebase auth middleware & API routes
```

## 🔐 Security Practices
1. **Never commit `.env` or `.env.local` files** — use `.env.example` templates.
2. **Firebase Token Verification** — Protected API routes verify Firebase ID tokens via `admin.auth().verifyIdToken(...)`.
3. **Role-Based Admin Routes** — Admin endpoints and note deletion require `host` or `admin` role in MongoDB.
4. **Blocked User Enforcement** — Blocked users are rejected on both `/api/auth/sync-user` and protected endpoints.
5. **CORS Allowlist** — Backend restricts browser origins to `https://sityog-nexus.vercel.app` and local development ports.

## 📝 API Endpoints
Defined in [server/server.js](server/server.js):

- `GET /` — API welcome message
- `GET /api/notes` — Fetch notes (optional `?branch=` and `?semester=` filters)
- `POST /api/upload` — Upload PDF note to Cloudinary and save metadata (Protected)
- `DELETE /api/deletenote/:id` — Delete note from Cloudinary and MongoDB (Protected: `host` / `admin`)
- `POST /api/auth/sync-user` — Verify Firebase ID token and sync/create user in MongoDB
- `GET /api/auth/me` — Get current authenticated user profile (Protected)
- `PUT /api/user/profile` — Update current user's profile (`name`, `mobile`, `rollNo`, `branch`, `semester`) (Protected)
- `GET /api/admin/users` — List all users (Protected: `host` / `admin`)
- `GET /api/admin/users/:id` — Get a user's details (Protected: `host` / `admin`)
- `PUT /api/admin/users/:id` — Update a user's profile/role (Protected: `host` / `admin`)
- `PUT /api/admin/users/:id/block` — Toggle user block/suspend status (Protected: `host` / `admin`)
- `DELETE /api/admin/users/:id` — Delete user from Firebase Auth and MongoDB (Protected: `host` / `admin`)

## 🐛 Troubleshooting

**Firebase Login / Google Sign-In Fails on Vercel**:
- Ensure your Vercel domain is listed under **Firebase Console → Authentication → Settings → Authorized domains**.
- Verify all `VITE_FIREBASE_*` environment variables are set in Vercel and redeploy.

**Backend Token Verification / Sync Fails**:
- Verify `FIREBASE_PROJECT_ID` in `server/.env` matches the Firebase project used by the frontend.
- Verify `VITE_API_BASE_URL` points to the running backend server.

**MongoDB Connection Failed**:
- Verify `MONGO_URI` is correct and MongoDB Atlas IP Access List allows your server's IP.

**Cloudinary Upload Issues**:
- Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
- Ensure uploads are PDFs (`resource_type: "raw"` in the `nexus_notes` folder).

## 📄 License
This project is for educational purposes at SITYOG GROUP OF INSTITUTIONS.
