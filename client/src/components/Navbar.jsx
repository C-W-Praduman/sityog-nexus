import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => {
    const activeColor = isScrolled ? "text-blue-600" : "text-blue-400";
    const inactiveColor = isScrolled ? "text-gray-900" : "text-white";
    
    return location.pathname === path 
      ? `${activeColor} font-extrabold` 
      : `${inactiveColor} font-semibold hover:text-blue-400 transition-all duration-300 hover:scale-105`;
  };

  return (
    <>
      {/* Background Overlay for mobile menu */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 z-40 md:hidden cursor-pointer ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={toggleMenu}
      />

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-white/70 backdrop-blur-md shadow-[0_8px_32px_-5px_rgba(0,0,0,0.1)] border-b border-gray-200/50" 
          : "bg-transparent"
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="shrink-0">
            <Link to="/" className="flex items-center cursor-pointer">
              <Logo isScrolled={isScrolled} />
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-10">
            <Link to="/" className={`${isActive('/')} px-1 py-1 text-sm font-bold tracking-normal uppercase cursor-pointer`}>
              Home
            </Link>
            <Link to="/upload" className={`${isActive('/upload')} px-1 py-1 text-sm font-bold tracking-normal uppercase cursor-pointer`}>
              Upload
            </Link>
            <Link to="/download" className={`${isActive('/download')} px-1 py-1 text-sm font-bold tracking-normal uppercase cursor-pointer`}>
              Download
            </Link>
            <Link to="/about" className={`${isActive('/about')} px-1 py-1 text-sm font-bold tracking-normal uppercase cursor-pointer`}>
              About
            </Link>
            {(user?.role === 'host' || user?.role === 'admin') && (
              <Link to="/admin" className={`${isActive('/admin')} px-1 py-1 text-sm font-bold tracking-normal uppercase text-purple-400 cursor-pointer`}>
                Admin Panel
              </Link>
            )}
            
            {user ? (
              <div className="flex items-center gap-6 pl-4 border-l border-gray-400/20">
                <div className="flex items-center gap-2">
                  <FaUserCircle className={isScrolled ? "text-blue-600" : "text-blue-400"} size={20} />
                  <Link to="/dashboard" className={`text-sm font-bold uppercase cursor-pointer ${isScrolled ? "text-gray-900" : "text-white"}`}>
                    {user.name}
                  </Link>
                </div>
                <button 
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold uppercase transition-all duration-300 cursor-pointer"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  to="/login" 
                  className={`px-6 py-2 rounded-full border border-blue-500/50 cursor-pointer ${isScrolled ? "text-blue-600" : "text-white"} text-xs font-bold uppercase hover:bg-blue-500 hover:text-white transition-all duration-300`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2 rounded-full bg-blue-600 text-white text-xs font-bold uppercase hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all duration-300 cursor-pointer"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu} 
              className={`${isScrolled ? "text-gray-900" : "text-white"} hover:text-blue-500 focus:outline-none transition-transform duration-300 cursor-pointer`}
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Refined Glassmorphism */}
      <div 
        className={`md:hidden fixed top-25 left-6 right-6 rounded-3xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-50 ${
          isOpen 
            ? "opacity-100 translate-y-0 scale-100 visible" 
            : "opacity-0 -translate-y-10 scale-95 invisible pointer-events-none"
        }`}
      >
        <div className="px-8 py-10 space-y-6 flex flex-col items-center justify-center bg-white/95 backdrop-blur-2xl border border-white/40 shadow-2xl">
          <Link 
            to="/" 
            onClick={toggleMenu}
            className="text-gray-900 text-2xl font-black tracking-normal hover:text-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            HOME
          </Link>
          <Link 
            to="/upload" 
            onClick={toggleMenu}
            className="text-gray-900 text-2xl font-black tracking-normal hover:text-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            UPLOAD
          </Link>
          <Link 
            to="/download" 
            onClick={toggleMenu}
            className="text-gray-900 text-2xl font-black tracking-normal hover:text-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            DOWNLOAD
          </Link>
          <Link 
            to="/about" 
            onClick={toggleMenu}
            className="text-gray-900 text-2xl font-black tracking-normal hover:text-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            ABOUT
          </Link>
          {(user?.role === 'host' || user?.role === 'admin') && (
            <Link 
              to="/admin" 
              onClick={toggleMenu}
              className="text-purple-600 text-2xl font-black tracking-normal hover:text-purple-500 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              ADMIN PANEL
            </Link>
          )}
          
          <div className="w-full h-px bg-gray-200/50 my-2"></div>
          
          {user ? (
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="flex items-center gap-3">
                <FaUserCircle className="text-blue-600" size={32} />
                <Link to="/dashboard" onClick={toggleMenu} className="text-2xl font-black tracking-normal text-gray-900 cursor-pointer">{user.name}</Link>
              </div>
              <button 
                onClick={() => { logout(); toggleMenu(); }}
                className="w-full py-4 rounded-2xl bg-red-500 text-white font-black text-xl flex items-center justify-center gap-3 cursor-pointer"
              >
                <FaSignOutAlt />
                LOGOUT
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full">
              <Link 
                to="/login" 
                onClick={toggleMenu}
                className="w-full py-4 rounded-2xl border-2 border-blue-600 text-blue-600 font-black text-xl flex items-center justify-center cursor-pointer"
              >
                LOGIN
              </Link>
              <Link 
                to="/register" 
                onClick={toggleMenu}
                className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center cursor-pointer"
              >
                REGISTER
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
    </>
  );
}

export default Navbar;
