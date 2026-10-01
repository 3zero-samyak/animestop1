'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  reload,
} from 'firebase/auth';
import { auth } from './firebase';
import { ensureUserProfile, syncUserProfile } from './userProfile';

type SignUpResult = {
  credential: UserCredential;
  verificationSent: boolean;
  verificationError?: string;
  verificationErrorCode?: string;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string, displayName?: string) => Promise<SignUpResult>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const signupInProgressRef = React.useRef(false);

  const setFreshUser = () => {
    setUser(auth.currentUser ? { ...auth.currentUser } : null);
  };

  const getVerificationActionCodeSettings = (): { url: string; handleCodeInApp: boolean } => {
    const origin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '';
    return {
      url: `${origin}/account?verification=complete`,
      handleCodeInApp: false,
    };
  };

  const sendVerificationEmailWithCurrentUser = async (): Promise<void> => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    await reload(currentUser);
    setFreshUser();

    if (currentUser.emailVerified) {
      return;
    }

    const actionCodeSettings = getVerificationActionCodeSettings();

    try {
      await sendEmailVerification(currentUser, actionCodeSettings);
    } catch (error) {
      if (process.env.NODE_ENV === 'development' && error && typeof error === 'object') {
        const firebaseError = error as { code?: string; message?: string };
        console.error(`[Firebase verification] code: ${firebaseError.code ?? 'unknown'}`);
        console.error(`[Firebase verification] message: ${firebaseError.message ?? 'Unknown Firebase error'}`);
        console.error(`[Firebase verification] hostname: ${typeof window !== 'undefined' ? window.location.hostname : 'unknown'}`);
        console.error(`[Firebase verification] continue URL: ${actionCodeSettings.url}`);
      }

      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser && !signupInProgressRef.current) {
        try {
          await firebaseUser.getIdToken(true);
          await ensureUserProfile(firebaseUser);
        } catch (error) {
          if (process.env.NODE_ENV === 'development' && error && typeof error === 'object') {
            const firestoreError = error as { code?: string; message?: string };
            console.error(`[UserProfile] code: ${firestoreError.code ?? 'unknown'}`);
            console.error(`[UserProfile] message: ${firestoreError.message ?? 'Unknown Firestore error'}`);
          }
        }
      }

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
  ): Promise<SignUpResult> => {
    signupInProgressRef.current = true;
    const normalizedEmail = email.trim();
    try {
      const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);

      if (displayName && credential.user) {
        const trimmed = displayName.trim();
        if (trimmed) {
          await updateProfile(credential.user, { displayName: trimmed });
          await reload(credential.user);
        }
      }

      setFreshUser();

      let verificationSent = false;
      let verificationError: string | undefined;
      let verificationErrorCode: string | undefined;

      try {
        await sendVerificationEmailWithCurrentUser();
        verificationSent = true;
      } catch (error) {
        const firebaseError = error as { code?: string; message?: string };
        verificationError = firebaseError?.message;
        verificationErrorCode = firebaseError?.code;
      }

      const currentUser = auth.currentUser ?? credential.user;
      await currentUser.getIdToken(true);

      try {
        await ensureUserProfile(currentUser);
      } catch (error) {
        if (process.env.NODE_ENV === 'development' && error && typeof error === 'object') {
          const firestoreError = error as { code?: string; message?: string };
          console.error(`[UserProfile] code: ${firestoreError.code ?? 'unknown'}`);
          console.error(`[UserProfile] message: ${firestoreError.message ?? 'Unknown Firestore error'}`);
        }
      }

      return {
        credential,
        verificationSent,
        verificationError,
        verificationErrorCode,
      };
    } finally {
      signupInProgressRef.current = false;
    }
  };

  const logout = async (): Promise<void> => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const sendVerificationEmail = async (): Promise<void> => {
    await sendVerificationEmailWithCurrentUser();
  };

  const refreshUser = async (): Promise<void> => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    await reload(currentUser);

    if (currentUser.emailVerified) {
      await currentUser.getIdToken(true);
      try {
        await syncUserProfile(currentUser);
      } catch (error) {
        if (process.env.NODE_ENV === 'development' && error && typeof error === 'object') {
          const firestoreError = error as { code?: string; message?: string };
          console.error(`[UserProfile] code: ${firestoreError.code ?? 'unknown'}`);
          console.error(`[UserProfile] message: ${firestoreError.message ?? 'Unknown Firestore error'}`);
        }
      }
    }

    setFreshUser();
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    isEmailVerified: user?.emailVerified ?? false,
    signIn,
    signUp,
    logout,
    resetPassword,
    sendVerificationEmail,
    refreshUser,
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
