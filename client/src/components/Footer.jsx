import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 items-start">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 md:border-r md:border-gray-800 md:pr-8 pb-6 md:pb-0 text-center md:text-left">
            <h2 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              SITYOG NOTES
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed ">
              Empowering SITYOG GROUP OF INSTITUTIONS students with a collaborative platform for sharing knowledge through notes and previous year questions.
            </p>
          </div>

         <div className="flex items-center justify-between md:justify-start gap-5">
           {/* Quick Links */}
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-gray-400 flex flex-col md:items-start">
              <li><a href="/" className="hover:text-blue-400 transition-colors cursor-pointer">Home</a></li>
              <li><a href="/upload" className="hover:text-blue-400 transition-colors cursor-pointer">Upload Notes</a></li>
              <li><a href="/download" className="hover:text-blue-400 transition-colors cursor-pointer">Download Notes</a></li>
              <li><a href="/about" className="hover:text-blue-400 transition-colors cursor-pointer">About Us</a></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-4 text-gray-400 flex flex-col items-center md:items-start">
              <li><a href="#faq" className="hover:text-blue-400 transition-colors cursor-pointer">FAQ</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">Terms of Service</a></li>
              <li><a href="mailto:support@sityog.edu" className="hover:text-blue-400 transition-colors cursor-pointer">Contact Support</a></li>
            </ul>
          </div>
         </div>

          {/* Contact & Social */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-6">Connect With Us</h3>
            <div className="flex justify-center md:justify-start space-x-5 mb-6">
              <a href="https://github.com/C-W-Praduman" className="text-2xl hover:text-blue-400 transition-colors cursor-pointer"><FaGithub /></a>
              <a href="#" className="text-2xl hover:text-blue-400 transition-colors cursor-pointer"><FaLinkedin /></a>
              <a href="#" className="text-2xl hover:text-blue-400 transition-colors cursor-pointer"><FaTwitter /></a>
              <a href="mailto:sityogstudentaurangabad@gmail.com" className="text-2xl hover:text-blue-400 transition-colors cursor-pointer"><FaEnvelope /></a>
            </div>
            <p className="text-gray-400 text-sm">
              SITYOG GROUP OF INSTITUTIONS<br />
              Aurangabad, Bihar, India
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} SITYOG GROUP OF INSTITUTIONS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
