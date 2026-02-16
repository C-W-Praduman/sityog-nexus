import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Listen to Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const idToken = await firebaseUser.getIdToken();
                    setToken(idToken);
                    
                    // Sync user with backend using the ID token for authentication
                    const response = await axios.post(`${API_BASE_URL}/api/auth/sync-user`, 
                        { name: firebaseUser.displayName || firebaseUser.email.split('@')[0] },
                        { headers: { Authorization: `Bearer ${idToken}` } }
                    );
                    
                    // Merge only essential properties to avoid circular references and keep state clean
                    const fullUser = { 
                        ...response.data.user,
                        uid: firebaseUser.uid,
                        photoURL: firebaseUser.photoURL,
                        emailVerified: firebaseUser.emailVerified
                    };
                    setUser(fullUser);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    localStorage.setItem('token', idToken); // Backup for some pages using localStorage
                } catch (err) {
                    console.error('Failed to sync user:', err);
                    // Even if backend sync fails, keep a minimal user object from Firebase so UI functions
                    setUser({
                        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                        email: firebaseUser.email,
                        uid: firebaseUser.uid,
                        isSyncing: false,
                        syncError: true
                    });
                    toast.error('Session sync failed. Some features may be limited.');
                }
            } else {
                setUser(null);
                setToken(null);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const register = async (email, password) => {
        await createUserWithEmailAndPassword(auth, email, password);
        // The onAuthStateChanged listener will handle the backend sync
        return { success: true };
    };

    const login = async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const forgotPassword = async (email) => {
        await sendPasswordResetEmail(auth, email);
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            setUser,
            token, 
            register, 
            login, 
            forgotPassword,
            logout, 
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
