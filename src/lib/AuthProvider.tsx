'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string, displayName?: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for required Firebase config
    if (typeof window !== 'undefined') {
      const requiredVars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      ];

      const missing = requiredVars.filter(
        (v) => !process.env[v as keyof typeof process.env]
      );

      if (missing.length > 0 && process.env.NODE_ENV === 'development') {
        console.error(
          '[Auth] Missing Firebase configuration. Please check your .env.local file.'
        );
      }
    }

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<UserCredential> => {
    const normalizedEmail = email.trim();
    return signInWithEmailAndPassword(auth, normalizedEmail, password);
  };

  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<UserCredential> => {
    const normalizedEmail = email.trim();
    const credential = await createUserWithEmailAndPassword(
      auth,
      normalizedEmail,
      password
    );

    // Update display name if provided
    if (displayName && credential.user) {
      await updateProfile(credential.user, { displayName });
    }

    return credential;
  };

  const logout = async (): Promise<void> => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string): Promise<void> => {
    const normalizedEmail = email.trim();
    await sendPasswordResetEmail(auth, normalizedEmail);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
