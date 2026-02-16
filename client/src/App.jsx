import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import DownloadPage from './pages/DownloadPage';
import AboutPage from './pages/AboutPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserDetailPage from './pages/UserDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  
  if (loading) return null; // Or a loading spinner
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const HostRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (!user || (user.role !== 'host' && user.role !== 'admin')) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#0a0f1d] flex flex-col">
          <Toaster 
            position="top-center" 
            reverseOrder={false} 
            toastOptions={{
              duration: 3000, // Global duration: 3 seconds
              style: {
                background: '#1e293b',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)'
              },
            }}
          />
          <Navbar />

          <main className="grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route 
                path="/upload" 
                element={
                  <ProtectedRoute>
                    <UploadPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/download" element={<DownloadPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route 
                path="/admin" 
                element={
                  <HostRoute>
                    <AdminDashboard />
                  </HostRoute>
                } 
              />
              <Route 
                path="/admin/users/:id" 
                element={
                  <HostRoute>
                    <UserDetailPage />
                  </HostRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
