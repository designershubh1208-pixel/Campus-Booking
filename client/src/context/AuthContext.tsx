import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import apiClient from '../api/apiClient';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'STUDENT' | 'ADMIN';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (email: string, password?: string, name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync token to API Client & local storage, and fetch user data from DB
  const syncWithBackend = async (firebaseToken: string, name?: string) => {
    localStorage.setItem('auth_token', firebaseToken);
    setToken(firebaseToken);
    try {
      const payload = name ? { name } : {};
      const response = await apiClient.post('/auth/sync', payload);
      setUser(response.data.user);
    } catch (error) {
      console.error("Backend sync failed", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          await syncWithBackend(idToken);
        } catch (err) {
          console.error("Error fetching token on auth state change", err);
          setUser(null);
          setToken(null);
          localStorage.removeItem('auth_token');
        }
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string) => {
    if (!password) {
      // Mock login fallback if dummy config is used and no password is provided
      const mockUid = email.split('@')[0] + Math.floor(Math.random() * 1000);
      const mockToken = `mock_${mockUid}_${email}`;
      await syncWithBackend(mockToken);
      return;
    }
    
    // Real Firebase login
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    await syncWithBackend(idToken);
  };

  const register = async (email: string, password?: string, name?: string) => {
    if (!password) {
       // Mock register fallback
       const mockUid = email.split('@')[0] + Math.floor(Math.random() * 1000);
       const mockToken = `mock_${mockUid}_${email}`;
       await syncWithBackend(mockToken);
       return;
    }

    // Real Firebase register
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    await syncWithBackend(idToken, name);
  };

  const loginWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const idToken = await userCredential.user.getIdToken();
      const name = userCredential.user.displayName || 'Google User';
      await syncWithBackend(idToken, name);
    } catch (error: any) {
      // Only throw if the user didn't just close the popup
      if (error.code !== 'auth/popup-closed-by-user') {
        throw error;
      }
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
