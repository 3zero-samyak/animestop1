import { getIdTokenResult } from 'firebase/auth';
import { collection, addDoc, doc, getDocs, query, serverTimestamp, Timestamp, updateDoc, where } from 'firebase/firestore';
import { auth, db } from './firebase';

export type JournalCategory = 'creator-note' | 'behind-the-scenes' | 'reflection' | 'story-deep-dive' | 'community';
export type StoryVisibility = 'private' | 'public';

export type StoryPayload = {
  title: string;
  category: string;
  body: string;
  storyIntent: string;
  requestedVisibility: StoryVisibility;
  publicationConsent: boolean;
};

export type JournalPayload = {
  title: string;
  category: JournalCategory;
  body: string;
};

export type StorySubmissionStatus = 'submitted' | 'approved' | 'rejected' | 'published';
export type JournalSubmissionStatus = 'submitted' | 'approved' | 'rejected' | 'published';
export type SubmissionType = 'story' | 'journal';
export type SubmissionStatus = StorySubmissionStatus | JournalSubmissionStatus;
export type ModerationSubmissionType = SubmissionType;
export type ModerationTargetStatus = 'approved' | 'rejected' | 'published';
export type ModerationUpdatePayload = {
  targetStatus: ModerationTargetStatus;
  rejectionReason?: string;
};

export interface MySubmission {
  id: string;
  type: SubmissionType;
  title: string;
  status: SubmissionStatus;
  createdAt: Timestamp | null;
  rejectionReason?: string | null;
}

export interface ModerationSubmission {
  id: string;
  type: ModerationSubmissionType;
  title: string;
  body: string;
  category: string;
  status: SubmissionStatus;
  userDisplayName: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  storyIntent?: string | null;
  requestedVisibility?: StoryVisibility | null;
  publicationConsent?: boolean | null;
  rejectionReason?: string | null;
  intent?: string;
  communityConsent?: boolean;
}

export interface StorySubmissionRecord {
  id: string;
  userId: string;
  userDisplayName?: string | null;
  status: StorySubmissionStatus;
  createdAt?: Timestamp | { seconds: number; nanoseconds: number } | Date;
  updatedAt?: Timestamp | { seconds: number; nanoseconds: number } | Date;
  title: string;
  category: string;
  body: string;
  storyIntent?: string;
  requestedVisibility?: StoryVisibility;
  publicationConsent?: boolean;
  rejectionReason?: string | null;
  intent?: string;
  communityConsent?: boolean;
}

export interface JournalSubmissionRecord {
  id: string;
  userId: string;
  userDisplayName?: string | null;
  status: JournalSubmissionStatus;
  createdAt?: Timestamp | { seconds: number; nanoseconds: number } | Date;
  updatedAt?: Timestamp | { seconds: number; nanoseconds: number } | Date;
  title: string;
  category: JournalCategory;
  body: string;
}

type StorySubmissionCreatePayload = StoryPayload & {
  userId: string;
  userDisplayName: string | null;
  status: StorySubmissionStatus;
  createdAt: ReturnType<typeof serverTimestamp>;
  updatedAt: ReturnType<typeof serverTimestamp>;
};

type JournalSubmissionCreatePayload = JournalPayload & {
  userId: string;
  userDisplayName: string | null;
  status: JournalSubmissionStatus;
  createdAt: ReturnType<typeof serverTimestamp>;
  updatedAt: ReturnType<typeof serverTimestamp>;
};

async function refreshVerifiedToken(context: 'Story submit' | 'Journal submit') {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Not authenticated');

  await currentUser.getIdToken(true);
  const tokenResult = await getIdTokenResult(currentUser, true);

  if (process.env.NODE_ENV === 'development') {
    console.log(`[${context}] uid: ${currentUser.uid}`);
    console.log(`[${context}] emailVerified user: ${currentUser.emailVerified}`);
    console.log(`[${context}] email_verified token: ${String(tokenResult.claims.email_verified)}`);
  }

  return { currentUser, tokenResult };
}

export async function submitStory(payload: StoryPayload) {
  const { currentUser, tokenResult } = await refreshVerifiedToken('Story submit');

  const submissionPayload: StorySubmissionCreatePayload = {
    ...payload,
    userId: currentUser.uid,
    userDisplayName: currentUser.displayName || null,
    status: 'submitted',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Story submit] status: ${submissionPayload.status}`);
    console.log(`[Story submit] userId matches: ${String(submissionPayload.userId === currentUser.uid)}`);
  }

  try {
    const docRef = await addDoc(collection(db, 'storySubmissions'), submissionPayload);

    return docRef.id;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Story submit] permission context emailVerified user: ${currentUser.emailVerified}`);
      console.log(`[Story submit] permission context email_verified token: ${String(tokenResult.claims.email_verified)}`);
      console.log(`[Story submit] permission context uid: ${currentUser.uid}`);
      console.log(`[Story submit] permission context payload.userId: ${submissionPayload.userId}`);
      console.log(`[Story submit] permission context payload.status: ${submissionPayload.status}`);
    }

    throw error;
  }
}

export async function submitJournal(payload: JournalPayload) {
  const { currentUser, tokenResult } = await refreshVerifiedToken('Journal submit');

  const submissionPayload: JournalSubmissionCreatePayload = {
    ...payload,
    userId: currentUser.uid,
    userDisplayName: currentUser.displayName || null,
    status: 'submitted',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Journal submit] status: ${submissionPayload.status}`);
    console.log(`[Journal submit] userId matches: ${String(submissionPayload.userId === currentUser.uid)}`);
  }

  try {
    const docRef = await addDoc(collection(db, 'journalSubmissions'), submissionPayload);

    return docRef.id;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Journal submit] permission context emailVerified user: ${currentUser.emailVerified}`);
      console.log(`[Journal submit] permission context email_verified token: ${String(tokenResult.claims.email_verified)}`);
      console.log(`[Journal submit] permission context uid: ${currentUser.uid}`);
      console.log(`[Journal submit] permission context payload.userId: ${submissionPayload.userId}`);
      console.log(`[Journal submit] permission context payload.status: ${submissionPayload.status}`);
    }

    throw error;
  }
}

export async function getUserStorySubmissions(uid: string): Promise<StorySubmissionRecord[]> {
  const q = query(collection(db, 'storySubmissions'), where('userId', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<StorySubmissionRecord, 'id'>) }));
}

export async function getUserJournalSubmissions(uid: string): Promise<JournalSubmissionRecord[]> {
  const q = query(collection(db, 'journalSubmissions'), where('userId', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<JournalSubmissionRecord, 'id'>) }));
}

function normalizeCreatedAt(value: StorySubmissionRecord['createdAt'] | JournalSubmissionRecord['createdAt']): Timestamp | null {
  if (!value) {
    return null;
  }

  if (value instanceof Timestamp) {
    return value;
  }

  if (typeof value === 'object' && value !== null && 'seconds' in value && 'nanoseconds' in value) {
    return new Timestamp(value.seconds, value.nanoseconds);
  }

  if (value instanceof Date) {
    return Timestamp.fromDate(value);
  }

  return null;
}

function getTimestampMillis(value: Timestamp | null): number {
  return value ? value.toMillis() : 0;
}

function normalizeUpdatedAt(value: StorySubmissionRecord['updatedAt'] | JournalSubmissionRecord['updatedAt']): Timestamp | null {
  if (!value) {
    return null;
  }

  if (value instanceof Timestamp) {
    return value;
  }

  if (typeof value === 'object' && value !== null && 'seconds' in value && 'nanoseconds' in value) {
    return new Timestamp(value.seconds, value.nanoseconds);
  }

  if (value instanceof Date) {
    return Timestamp.fromDate(value);
  }

  return null;
}

function normalizeStoryIntent(submission: Omit<StorySubmissionRecord, 'id'>): string | null {
  if (typeof submission.storyIntent === 'string' && submission.storyIntent.trim()) {
    return submission.storyIntent;
  }

  if (typeof submission.intent === 'string' && submission.intent.trim()) {
    return submission.intent;
  }

  return null;
}

function normalizeStoryVisibility(submission: Omit<StorySubmissionRecord, 'id'>): StoryVisibility | null {
  if (submission.requestedVisibility === 'private' || submission.requestedVisibility === 'public') {
    return submission.requestedVisibility;
  }

  return null;
}

function normalizePublicationConsent(submission: Omit<StorySubmissionRecord, 'id'>): boolean | null {
  if (typeof submission.publicationConsent === 'boolean') {
    return submission.publicationConsent;
  }

  return null;
}

function normalizeRejectionReason(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

export async function getMySubmissions(userId: string): Promise<MySubmission[]> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const [stories, journals] = await Promise.all([
    getUserStorySubmissions(userId),
    getUserJournalSubmissions(userId),
  ]);

  const combined: MySubmission[] = [
    ...stories.map((submission) => ({
      id: submission.id,
      type: 'story' as const,
      title: submission.title,
      status: submission.status,
      createdAt: normalizeCreatedAt(submission.createdAt),
      rejectionReason: normalizeRejectionReason(submission.rejectionReason),
    })),
    ...journals.map((submission) => ({
      id: submission.id,
      type: 'journal' as const,
      title: submission.title,
      status: submission.status,
      createdAt: normalizeCreatedAt(submission.createdAt),
    })),
  ];

  combined.sort((left, right) => getTimestampMillis(right.createdAt) - getTimestampMillis(left.createdAt));

  return combined;
}

export async function getModerationSubmissions(): Promise<ModerationSubmission[]> {
  const [storySnap, journalSnap] = await Promise.all([
    getDocs(collection(db, 'storySubmissions')),
    getDocs(collection(db, 'journalSubmissions')),
  ]);

  const submissions: ModerationSubmission[] = [
    ...storySnap.docs.map((submission) => {
      const data = submission.data() as Omit<StorySubmissionRecord, 'id'>;
      return {
        id: submission.id,
        type: 'story' as const,
        title: data.title,
        body: data.body,
        category: data.category,
        status: data.status,
        userDisplayName: data.userDisplayName ?? null,
        createdAt: normalizeCreatedAt(data.createdAt),
        updatedAt: normalizeUpdatedAt(data.updatedAt),
        storyIntent: normalizeStoryIntent(data),
        requestedVisibility: normalizeStoryVisibility(data),
        publicationConsent: normalizePublicationConsent(data),
        rejectionReason: normalizeRejectionReason(data.rejectionReason),
        intent: data.intent,
        communityConsent: data.communityConsent,
      };
    }),
    ...journalSnap.docs.map((submission) => {
      const data = submission.data() as Omit<JournalSubmissionRecord, 'id'>;
      return {
        id: submission.id,
        type: 'journal' as const,
        title: data.title,
        body: data.body,
        category: data.category,
        status: data.status,
        userDisplayName: data.userDisplayName ?? null,
        createdAt: normalizeCreatedAt(data.createdAt),
        updatedAt: normalizeUpdatedAt(data.updatedAt),
      };
    }),
  ];

  submissions.sort((left, right) => getTimestampMillis(right.createdAt) - getTimestampMillis(left.createdAt));

  return submissions;
}

function isAllowedModerationTransition(currentStatus: SubmissionStatus, targetStatus: ModerationTargetStatus): boolean {
  return (currentStatus === 'submitted' && (targetStatus === 'approved' || targetStatus === 'rejected'))
    || (currentStatus === 'approved' && (targetStatus === 'published' || targetStatus === 'rejected'));
}

function getSubmissionCollection(type: ModerationSubmissionType): 'storySubmissions' | 'journalSubmissions' {
  return type === 'story' ? 'storySubmissions' : 'journalSubmissions';
}

export async function updateSubmissionStatus(
  type: ModerationSubmissionType,
  id: string,
  currentStatus: SubmissionStatus,
  update: ModerationUpdatePayload,
): Promise<void> {
  if (!id) {
    throw new Error('Submission ID is required');
  }

  if (!isAllowedModerationTransition(currentStatus, update.targetStatus)) {
    throw new Error('Invalid moderation transition');
  }

  const payload: Record<string, unknown> = {
    status: update.targetStatus,
    updatedAt: serverTimestamp(),
  };

  if (update.targetStatus === 'rejected') {
    const trimmedReason = update.rejectionReason?.trim() ?? '';
    if (trimmedReason.length < 20) {
      throw new Error('A meaningful rejection reason is required');
    }

    payload.rejectionReason = trimmedReason;
  }

  await updateDoc(doc(db, getSubmissionCollection(type), id), payload);
}

