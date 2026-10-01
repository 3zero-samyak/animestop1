import { User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string;
  emailVerified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

type UserProfileCreatePayload = {
  uid: string;
  displayName: string | null;
  email: string;
  emailVerified: boolean;
  createdAt: ReturnType<typeof serverTimestamp>;
  updatedAt: ReturnType<typeof serverTimestamp>;
};

type UserProfileSyncPayload = {
  displayName: string | null;
  email: string;
  emailVerified: boolean;
  updatedAt: ReturnType<typeof serverTimestamp>;
};

function getProfileCreatePayload(user: User): UserProfileCreatePayload {
  return {
    uid: user.uid,
    displayName: user.displayName ?? null,
    email: user.email ?? '',
    emailVerified: user.emailVerified,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

function getProfileSyncPayload(user: User): UserProfileSyncPayload {
  return {
    displayName: user.displayName ?? null,
    email: user.email ?? '',
    emailVerified: user.emailVerified,
    updatedAt: serverTimestamp(),
  };
}

function logUserProfileError(error: unknown) {
  if (process.env.NODE_ENV !== 'development' || !error || typeof error !== 'object') {
    return;
  }

  const firestoreError = error as { code?: string; message?: string };
  console.error(`[UserProfile] code: ${firestoreError.code ?? 'unknown'}`);
  console.error(`[UserProfile] message: ${firestoreError.message ?? 'Unknown Firestore error'}`);
}

export async function ensureUserProfile(user: User): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  try {
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, getProfileCreatePayload(user));
      return;
    }

    await syncUserProfile(user);
  } catch (error) {
    logUserProfileError(error);
    throw error;
  }
}

export async function syncUserProfile(user: User): Promise<void> {
  const userRef = doc(db, 'users', user.uid);

  try {
    await setDoc(userRef, getProfileSyncPayload(user), { merge: true });
  } catch (error) {
    logUserProfileError(error);
    throw error;
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', uid);
  try {
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    return userSnap.data() as UserProfile;
  } catch (error) {
    logUserProfileError(error);
    throw error;
  }
}
