import React, { useState, useEffect } from 'react';
import { AuthContext } from './authContextDef';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('resumind_token') || null);
  const [isGuestMode, setIsGuestMode] = useState(() => sessionStorage.getItem('resumind_guest') === 'true');
  const [loading, setLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(true);

  // Modal control (for secondary in-app sign-in / profile upgrade)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'

  // Validate existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('resumind_token');
      const savedUser = localStorage.getItem('resumind_user');

      if (savedToken) {
        // If it's a local/offline token
        if (savedToken.startsWith('local_token_')) {
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch {
              setUser({ name: 'Demo Candidate', email: 'demo@resumind.ai', role: 'candidate' });
            }
          }
          setToken(savedToken);
          setLoading(false);
          return;
        }

        // Otherwise attempt verifying with real backend
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            setToken(savedToken);
            setApiOnline(true);
          } else {
            // Token expired or invalid
            localStorage.removeItem('resumind_token');
            localStorage.removeItem('resumind_user');
            setUser(null);
            setToken(null);
          }
        } catch {
          // If server is offline, retain session if savedUser is available
          setApiOnline(false);
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
              setToken(savedToken);
            } catch {
              setUser(null);
              setToken(null);
            }
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to sign in');
      }

      localStorage.setItem('resumind_token', data.token);
      localStorage.setItem('resumind_user', JSON.stringify(data.user));
      sessionStorage.removeItem('resumind_guest');
      setToken(data.token);
      setUser(data.user);
      setIsGuestMode(false);
      setIsAuthModalOpen(false);
      setApiOnline(true);
      return data.user;
    } catch (err) {
      // If network error (backend server offline / unreachable)
      if (err.name === 'TypeError' || err.message?.includes('fetch') || err.message?.includes('NetworkError')) {
        setApiOnline(false);
        // Provide seamless local authenticated experience
        const fallbackUser = {
          _id: 'local_user_' + Date.now(),
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          email: email.toLowerCase().trim(),
          role: 'candidate',
          isLocal: true
        };
        const fallbackToken = 'local_token_' + Date.now();

        localStorage.setItem('resumind_token', fallbackToken);
        localStorage.setItem('resumind_user', JSON.stringify(fallbackUser));
        sessionStorage.removeItem('resumind_guest');
        setToken(fallbackToken);
        setUser(fallbackUser);
        setIsGuestMode(false);
        setIsAuthModalOpen(false);
        return fallbackUser;
      }
      // Re-throw server business validation errors (e.g. invalid credentials)
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create account');
      }

      localStorage.setItem('resumind_token', data.token);
      localStorage.setItem('resumind_user', JSON.stringify(data.user));
      sessionStorage.removeItem('resumind_guest');
      setToken(data.token);
      setUser(data.user);
      setIsGuestMode(false);
      setIsAuthModalOpen(false);
      setApiOnline(true);
      return data.user;
    } catch (err) {
      // If network error (backend offline)
      if (err.name === 'TypeError' || err.message?.includes('fetch') || err.message?.includes('NetworkError')) {
        setApiOnline(false);
        const fallbackUser = {
          _id: 'local_user_' + Date.now(),
          name: name.trim(),
          email: email.toLowerCase().trim(),
          role: 'candidate',
          isLocal: true
        };
        const fallbackToken = 'local_token_' + Date.now();

        localStorage.setItem('resumind_token', fallbackToken);
        localStorage.setItem('resumind_user', JSON.stringify(fallbackUser));
        sessionStorage.removeItem('resumind_guest');
        setToken(fallbackToken);
        setUser(fallbackUser);
        setIsGuestMode(false);
        setIsAuthModalOpen(false);
        return fallbackUser;
      }
      throw err;
    }
  };

  const guestLogin = () => {
    const guestUser = {
      _id: 'guest_' + Date.now(),
      name: 'Guest Candidate',
      email: 'guest@resumeup.ai',
      role: 'candidate',
      isGuest: true
    };
    sessionStorage.setItem('resumind_guest', 'true');
    setUser(guestUser);
    setIsGuestMode(true);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('resumind_token');
    localStorage.removeItem('resumind_user');
    sessionStorage.removeItem('resumind_guest');
    setToken(null);
    setUser(null);
    setIsGuestMode(false);
  };

  const openLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        apiOnline,
        isGuestMode,
        isAuthModalOpen,
        authModalMode,
        setIsAuthModalOpen,
        setAuthModalMode,
        login,
        register,
        guestLogin,
        logout,
        openLogin,
        openRegister
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

