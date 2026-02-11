# Sityog Notes Nexus

A production-ready full-stack application for sharing student notes and previous year questions (PYQs) for SITYOG students.

## ✨ Features
- **Secure Authentication**: Email verification via OTP (One-Time Password).
- **User Dashboard**: Manage and update your profile with extended information.
- **Academic Vault**: Browse and download notes/PYQs filtered by branch and semester.
- **User Repository**: Securely upload study materials with real-time progress tracking.
- **Futuristic UI**: Modern dark-themed design with responsive mobile support.
- **Robust Security**: Password hashing with bcrypt, JWT session management, server-side validation.
- **Cloud Storage**: Cloudinary integration for reliable file hosting.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), TailwindCSS, react-hot-toast, Axios
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB (Atlas recommended for production)
- **Storage**: Cloudinary (PDFs and media files)
- **Email**: Nodemailer with Gmail App Passwords
- **Authentication**: JWT + OTP

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ (LTS recommended)
- MongoDB Atlas account (free tier available)
- Cloudinary account (free tier available)
- Gmail account with App Passwords enabled

### Local Development Setup

#### 1. Clone and Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

#### 2. Environment Configuration

**Backend** (`server/.env`):
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sityog_nexus
PORT=3000
JWT_SECRET=your_secure_random_string_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`client/.env.local`):
```
VITE_API_BASE_URL=http://localhost:3000
```

#### 3. Start Development Servers
```bash
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend
cd client && npm run dev
```

Visit `http://localhost:5173`

## 📦 Production Deployment

### Environment Variables (Production)
Never commit `.env` files. Use platform-specific secret management:

**Backend Production Variables**:
- `MONGO_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Strong random string (32+ characters)
- `CLOUDINARY_*`: Your Cloudinary credentials
- `EMAIL_USER` & `EMAIL_PASS`: Gmail App Password
- `FRONTEND_URL`: Your production frontend URL

**Frontend Production Variables**:
- `VITE_API_BASE_URL`: Your production backend URL (e.g., `https://api.yourdomain.com`)

### Recommended Deployment Platforms

**Backend** (Node.js):
- Render (free tier available)
- Railway
- Heroku

**Frontend** (React/Vite):
- Vercel (recommended for Vite)
- Netlify
- GitHub Pages

**Database**:
- MongoDB Atlas (free tier: 512MB)

### Pre-Deployment Checklist
- [ ] Replace hardcoded API URLs with environment variables
- [ ] Set strong `JWT_SECRET` in production
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly (include frontend URL)
- [ ] Set up MongoDB Atlas with proper network access
- [ ] Test all authentication flows
- [ ] Verify file uploads work with Cloudinary

## 📂 Project Structure
```
frontend-project/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── context/          # AuthContext for state
│   │   ├── config/           # API configuration
│   │   └── assets/           # Images and icons
│   ├── .env.example          # Environment template
│   └── vite.config.js        # Vite configuration
│
└── server/                    # Express backend
    ├── controllers/          # Business logic
    ├── models/               # MongoDB schemas
    ├── middleware/           # Auth, validation
    ├── services/             # Email service
    ├── config/               # Cloudinary config
    ├── .env.example          # Environment template
    └── server.js             # Main server file
```

## 🔐 Security Best Practices
1. **Never commit `.env` files** - Use `.env.example` as a template
2. **Strong JWT_SECRET** - Use cryptographically secure random string
3. **HTTPS Only** - Always use HTTPS in production
4. **CORS Configuration** - Restrict to your frontend domain
5. **Rate Limiting** - Consider adding rate limiting for auth endpoints
6. **Input Validation** - All inputs are validated on both client and server
7. **Password Hashing** - bcrypt with salt rounds = 10

## 📝 API Endpoints
See `/server/server.js` for complete endpoint documentation.

Key endpoints:
- `POST /api/auth/register` - Register and send OTP
- `POST /api/auth/verify-otp` - Verify email
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get user profile (protected)
- `PUT /api/auth/me` - Update user profile (protected)
- `POST /api/upload` - Upload note (protected)
- `GET /api/notes` - Fetch all notes
- `DELETE /api/deletenote/:id` - Delete note (protected)

## 🐛 Troubleshooting

**MongoDB Connection Failed**:
- Verify MONGO_URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure network conditions allow connection

**Cloudinary Upload Issues**:
- Verify API credentials
- Check file size limits
- Ensure folder "nexus_notes" permissions

**Email OTP Not Received**:
- Verify Gmail App Password (not regular password)
- Check spam folder
- Ensure EMAIL_USER and EMAIL_PASS are correct

## 📄 License
This project is for educational purposes at SITYOG GROUP OF INSTITUTIONS.

---

**Last Updated**: February 2026
