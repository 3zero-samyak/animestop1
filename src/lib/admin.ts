import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface AdminAuthority {
  uid: string;
  active: boolean;
}

export async function isAdminUser(uid: string): Promise<boolean> {
  if (!uid) {
    return false;
  }

  try {
    const snap = await getDoc(doc(db, 'admins', uid));
    if (!snap.exists()) {
      return false;
    }

    const data = snap.data() as Partial<AdminAuthority>;
    return data.uid === uid && data.active === true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development' && error && typeof error === 'object') {
      const adminError = error as { code?: string; message?: string };
      console.error(`[Admin] code: ${adminError.code ?? 'unknown'}`);
      console.error(`[Admin] message: ${adminError.message ?? 'Unknown Firestore error'}`);
    }
    return false;
  }
}