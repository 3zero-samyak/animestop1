/**
 * Firestore Security Rules Tests
 * 
 * Tests the security rules for the users/{uid} collection
 * 
 * To run these tests:
 * 1. Install test dependencies: npm install -D @firebase/rules-unit-testing jest @types/jest ts-jest
 * 2. Start Firebase emulator: npx firebase emulators:start --only firestore
 * 3. Run tests: npm test
 */

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { collection, doc, getDoc, getDocs, query, setDoc, where, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

let testEnv: RulesTestEnvironment;

const USER_A_UID = 'user-a-uid';
const USER_B_UID = 'user-b-uid';
const ADMIN_UID = 'admin-uid';
const OTHER_UID = 'other-uid';
const USER_A_EMAIL = 'user-a@example.com';
const USER_B_EMAIL = 'user-b@example.com';
const ADMIN_EMAIL = 'admin@example.com';

beforeAll(async () => {
  // Read the Firestore rules
  const rules = readFileSync(resolve(__dirname, '../firestore.rules'), 'utf8');

  // Initialize test environment
  testEnv = await initializeTestEnvironment({
    projectId: 'animestop-test',
    firestore: {
      rules,
      host: 'localhost',
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('Firestore Security Rules - users/{uid}', () => {
  const validProfile = (overrides: Record<string, unknown> = {}) => ({
    uid: USER_A_UID,
    email: USER_A_EMAIL,
    emailVerified: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...overrides,
  });
  
  // ==================================================
  // UNAUTHENTICATED ACCESS
  // ==================================================
  
  describe('Unauthenticated access', () => {
    test('Cannot read any user profile', async () => {
      const unauthedDb = testEnv.unauthenticatedContext().firestore();
      const userRef = doc(unauthedDb, 'users', USER_A_UID);
      
      await assertFails(getDoc(userRef));
    });

    test('Cannot create any user profile', async () => {
      const unauthedDb = testEnv.unauthenticatedContext().firestore();
      const userRef = doc(unauthedDb, 'users', USER_A_UID);
      
      await assertFails(setDoc(userRef, validProfile()));
    });
  });

  // ==================================================
  // PROFILE READ ACCESS
  // ==================================================
  
  describe('Profile read access', () => {
    beforeEach(async () => {
      // Seed profile for User A with rules disabled (fixture setup)
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        const userRef = doc(db, 'users', USER_A_UID);
        await setDoc(userRef, {
          uid: USER_A_UID,
          email: USER_A_EMAIL,
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    test('User can read their own profile', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID).firestore();
      const userRef = doc(userDb, 'users', USER_A_UID);
      
      await assertSucceeds(getDoc(userRef));
    });

    test('User cannot read another user profile', async () => {
      const userBDb = testEnv.authenticatedContext(USER_B_UID).firestore();
      const userARef = doc(userBDb, 'users', USER_A_UID);
      
      await assertFails(getDoc(userARef));
    });
  });

  // ==================================================
  // PROFILE CREATION
  // ==================================================
  
  describe('Profile creation', () => {
    test('User can create their own profile with valid data', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: false }).firestore();
      const userRef = doc(userDb, 'users', USER_A_UID);
      
      await assertSucceeds(setDoc(userRef, validProfile()));
    });

    test('Valid string displayName accepted', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: false }).firestore();
      const userRef = doc(userDb, 'users', USER_A_UID);
      
      await assertSucceeds(setDoc(userRef, validProfile({ displayName: 'User A' })));
    });

    test('Valid null displayName accepted', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: false }).firestore();
      const userRef = doc(userDb, 'users', USER_A_UID);

      await assertSucceeds(setDoc(userRef, validProfile({ displayName: null })));
    });

    test('User cannot create profile for another user', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID).firestore();
      const userBRef = doc(userDb, 'users', USER_B_UID);
      
      await assertFails(setDoc(userBRef, {
        uid: USER_B_UID,
        email: USER_B_EMAIL,
        emailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }));
    });

    test('Cannot create profile with mismatched uid in document', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID).firestore();
      const userRef = doc(userDb, 'users', USER_A_UID);
      
      await assertFails(setDoc(userRef, {
        uid: USER_B_UID, // Mismatched!
        email: USER_A_EMAIL,
        emailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }));
    });

    test('Cannot create profile without required fields', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID).firestore();
      const userRef = doc(userDb, 'users', USER_A_UID);
      
      await assertFails(setDoc(userRef, {
        uid: USER_A_UID,
        email: USER_A_EMAIL,
        // Missing emailVerified, createdAt, updatedAt
      }));
    });

    test('Cannot create profile with invalid email type', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID).firestore();
      const userRef = doc(userDb, 'users', USER_A_UID);
      
      await assertFails(setDoc(userRef, {
        uid: USER_A_UID,
        email: 12345, // Should be string
        emailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }));
    });

    test('Cannot create profile with invalid emailVerified type', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID).firestore();
      const userRef = doc(userDb, 'users', USER_A_UID);

      await assertFails(setDoc(userRef, validProfile({ emailVerified: 'false' })));
    });

    test('Cannot create profile with unknown field', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID).firestore();
      const userRef = doc(userDb, 'users', USER_A_UID);

      await assertFails(setDoc(userRef, validProfile({ role: 'admin' })));
    });
  });

  // ==================================================
  // PROFILE UPDATES
  // ==================================================
  
  describe('Profile updates', () => {
    beforeEach(async () => {
      // Seed initial profile for User A with rules disabled
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        const userRef = doc(db, 'users', USER_A_UID);
        await setDoc(userRef, {
          uid: USER_A_UID,
          email: USER_A_EMAIL,
          emailVerified: false,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        });
      });
    });

    test('User can update their own profile permitted fields', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const userRef = doc(userDb, 'users', USER_A_UID);
      
      await assertSucceeds(setDoc(userRef, {
        uid: USER_A_UID,
        email: 'updated@example.com',
        displayName: 'Updated Name',
        emailVerified: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('User cannot update another user profile', async () => {
      const userBDb = testEnv.authenticatedContext(USER_B_UID, { email: USER_B_EMAIL, email_verified: false }).firestore();
      const userARef = doc(userBDb, 'users', USER_A_UID);
      
      await assertFails(setDoc(userARef, {
        uid: USER_A_UID,
        email: USER_A_EMAIL,
        displayName: 'Malicious Update',
        emailVerified: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('User cannot change their uid field', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: false }).firestore();
      const userRef = doc(userDb, 'users', USER_A_UID);
      
      await assertFails(setDoc(userRef, {
        uid: USER_B_UID, // Attempting to change ownership
        email: USER_A_EMAIL,
        emailVerified: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('User cannot change createdAt timestamp', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: false }).firestore();
      const userRef = doc(userDb, 'users', USER_A_UID);
      
      await assertFails(setDoc(userRef, {
        uid: USER_A_UID,
        email: USER_A_EMAIL,
        emailVerified: false,
        createdAt: new Date('2025-01-01'), // Attempting to change createdAt
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('User cannot update profile with invalid email type', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: false }).firestore();
      const userRef = doc(userDb, 'users', USER_A_UID);

      await assertFails(setDoc(userRef, {
        uid: USER_A_UID,
        email: 42,
        emailVerified: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('User cannot update profile with invalid emailVerified type', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: false }).firestore();
      const userRef = doc(userDb, 'users', USER_A_UID);

      await assertFails(setDoc(userRef, {
        uid: USER_A_UID,
        email: USER_A_EMAIL,
        emailVerified: 'true',
        createdAt: new Date('2024-01-01'),
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });
  });

  // ==================================================
  // PROFILE DELETION
  // ==================================================
  
  describe('Profile deletion', () => {
    beforeEach(async () => {
      // Seed profiles for both users with rules disabled
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        const userARef = doc(db, 'users', USER_A_UID);
        await setDoc(userARef, {
          uid: USER_A_UID,
          email: USER_A_EMAIL,
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const userBRef = doc(db, 'users', USER_B_UID);
        await setDoc(userBRef, {
          uid: USER_B_UID,
          email: USER_B_EMAIL,
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    test('User cannot delete their own profile', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID).firestore();
      const userRef = doc(userDb, 'users', USER_A_UID);
      
      await assertFails(deleteDoc(userRef));
    });

    test('User cannot delete another user profile', async () => {
      const userBDb = testEnv.authenticatedContext(USER_B_UID).firestore();
      const userARef = doc(userBDb, 'users', USER_A_UID);
      
      await assertFails(deleteDoc(userARef));
    });
  });

  // ==================================================
  // DEFAULT DENY RULE
  // ==================================================
  
  describe('Default deny rule', () => {
    test('Cannot access unknown collection', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID).firestore();
      const unknownRef = doc(userDb, 'unknown-collection', 'some-doc');
      
      await assertFails(getDoc(unknownRef));
    });

    test('Cannot write to unknown collection', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID).firestore();
      const unknownRef = doc(userDb, 'unknown-collection', 'some-doc');
      
      await assertFails(setDoc(unknownRef, { data: 'test' }));
    });
  });

  // ==================================================
  // ADMINS COLLECTION RULES
  // ==================================================

  describe('admins rules', () => {
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        await setDoc(doc(db, 'admins', ADMIN_UID), {
          uid: ADMIN_UID,
          active: true,
        });
        await setDoc(doc(db, 'admins', USER_A_UID), {
          uid: USER_A_UID,
          active: true,
        });
      });
    });

    test('Unauthenticated user cannot read admins document', async () => {
      await assertFails(getDoc(doc(testEnv.unauthenticatedContext().firestore(), 'admins', ADMIN_UID)));
    });

    test('Authenticated user can get only their own admin-status document', async () => {
      await assertSucceeds(getDoc(doc(testEnv.authenticatedContext(USER_A_UID).firestore(), 'admins', USER_A_UID)));
    });

    test('Authenticated user cannot get another user admin-status document', async () => {
      await assertFails(getDoc(doc(testEnv.authenticatedContext(USER_A_UID).firestore(), 'admins', ADMIN_UID)));
    });

    test('Normal user cannot list admins', async () => {
      await assertFails(getDocs(collection(testEnv.authenticatedContext(USER_A_UID).firestore(), 'admins')));
    });

    test('Normal user cannot create admin document', async () => {
      await assertFails(setDoc(doc(testEnv.authenticatedContext(USER_A_UID).firestore(), 'admins', USER_A_UID), {
        uid: USER_A_UID,
        active: true,
      }));
    });

    test('Normal user cannot update admin document', async () => {
      await assertFails(setDoc(doc(testEnv.authenticatedContext(USER_A_UID).firestore(), 'admins', USER_A_UID), {
        active: false,
      }, { merge: true }));
    });

    test('Normal user cannot delete admin document', async () => {
      await assertFails(deleteDoc(doc(testEnv.authenticatedContext(USER_A_UID).firestore(), 'admins', USER_A_UID)));
    });
  });

  // ==================================================
  // STORY SUBMISSIONS RULES
  // ==================================================
  describe('storySubmissions rules', () => {
    const validStory = (overrides: Record<string, unknown> = {}) => ({
      userId: USER_A_UID,
      userDisplayName: 'User A',
      title: 'Valid Title',
      category: 'Anime',
      body: 'This is a story body that is long enough to be valid.',
      storyIntent: 'I am sharing this story because it stayed with me for years.',
      requestedVisibility: 'private',
      publicationConsent: false,
      status: 'submitted',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...overrides,
    });

    test('Unauthenticated cannot create story', async () => {
      const unauthedDb = testEnv.unauthenticatedContext().firestore();
      const ref = doc(unauthedDb, 'storySubmissions', 's1');
      await assertFails(setDoc(ref, validStory()));
    });

    test('Unverified authenticated cannot create story', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: false }).firestore();
      const ref = doc(userDb, 'storySubmissions', 's2');
      await assertFails(setDoc(ref, validStory()));
    });

    test('Verified user can create own story with status submitted', async () => {
      const verifiedDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const ref = doc(verifiedDb, 'storySubmissions', 's3');
      await assertSucceeds(setDoc(ref, validStory()));
    });

    test('Verified user cannot create story spoofing another userId', async () => {
      const verifiedDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const ref = doc(verifiedDb, 'storySubmissions', 's4');
      await assertFails(setDoc(ref, validStory({ userId: USER_B_UID })));
    });

    test('Verified user cannot create with status approved', async () => {
      const verifiedDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const ref = doc(verifiedDb, 'storySubmissions', 's5');
      await assertFails(setDoc(ref, validStory({ status: 'approved' })));
    });

    test('Verified user cannot create with status published', async () => {
      const verifiedDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const ref = doc(verifiedDb, 'storySubmissions', 's5b');
      await assertFails(setDoc(ref, validStory({ status: 'published' })));
    });

    test('Verified user cannot create with status rejected', async () => {
      const verifiedDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const ref = doc(verifiedDb, 'storySubmissions', 's5c');
      await assertFails(setDoc(ref, validStory({ status: 'rejected' })));
    });

    test('Valid server timestamps succeed', async () => {
      const verifiedDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const ref = doc(verifiedDb, 'storySubmissions', 's5d');
      await assertSucceeds(setDoc(ref, validStory()));
    });

    test('Invalid story field type fails', async () => {
      const verifiedDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const ref = doc(verifiedDb, 'storySubmissions', 's5e');
      await assertFails(setDoc(ref, validStory({ publicationConsent: 'nope' })));
    });

    test('Author can request public publication with explicit consent', async () => {
      const verifiedDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const ref = doc(verifiedDb, 'storySubmissions', 's5f');
      await assertSucceeds(setDoc(ref, validStory({ requestedVisibility: 'public', publicationConsent: true })));
    });

    test('Public request without required consent is rejected', async () => {
      const verifiedDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const ref = doc(verifiedDb, 'storySubmissions', 's5g');
      await assertFails(setDoc(ref, validStory({ requestedVisibility: 'public', publicationConsent: false })));
    });

    test('Owner can read own submitted story; others cannot; public cannot', async () => {
      // Seed story as User A with rules disabled
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        const ref = doc(db, 'storySubmissions', 'owner-story');
        await setDoc(ref, {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Owner Story',
          category: 'Anime',
          body: 'Body',
          storyIntent: 'This is a private memory that I only want the AnimeStop team to read.',
          requestedVisibility: 'private',
          publicationConsent: false,
          status: 'submitted',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const ownerDb = testEnv.authenticatedContext(USER_A_UID).firestore();
      const otherDb = testEnv.authenticatedContext(USER_B_UID).firestore();
      const unauthDb = testEnv.unauthenticatedContext().firestore();

      const ownerRef = doc(ownerDb, 'storySubmissions', 'owner-story');
      const otherRef = doc(otherDb, 'storySubmissions', 'owner-story');
      const unauthRef = doc(unauthDb, 'storySubmissions', 'owner-story');

      await assertSucceeds(getDoc(ownerRef));
      await assertFails(getDoc(otherRef));
      await assertFails(getDoc(unauthRef));

      // Now mark as published and ensure public read succeeds
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        const ref = doc(db, 'storySubmissions', 'published-story');
        await setDoc(ref, {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Published',
          category: 'Anime',
          body: 'Body',
          storyIntent: 'I want AnimeStop to consider this Story for publication.',
          requestedVisibility: 'public',
          publicationConsent: true,
          status: 'published',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const pubRef = doc(testEnv.unauthenticatedContext().firestore(), 'storySubmissions', 'published-story');
      await assertSucceeds(getDoc(pubRef));
    });

    test('Authenticated unrelated user cannot read submitted story', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        await setDoc(doc(db, 'storySubmissions', 'private-story'), {
          userId: USER_A_UID,
          userDisplayName: null,
          title: 'Private Story',
          category: 'Anime',
          body: 'Body',
          storyIntent: 'Keep this private between me and AnimeStop.',
          requestedVisibility: 'private',
          publicationConsent: false,
          status: 'submitted',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const otherDb = testEnv.authenticatedContext(USER_B_UID, { email: USER_B_EMAIL, email_verified: true }).firestore();
      await assertFails(getDoc(doc(otherDb, 'storySubmissions', 'private-story')));
    });

    test('Owner cannot update submitted story', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        await setDoc(doc(db, 'storySubmissions', 'locked-story'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Locked Story',
          category: 'Anime',
          body: 'Body',
          storyIntent: 'I want feedback from AnimeStop only.',
          requestedVisibility: 'private',
          publicationConsent: false,
          status: 'submitted',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const ownerDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(ownerDb, 'storySubmissions', 'locked-story'), {
        status: 'submitted',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Owner cannot self-publish', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        await setDoc(doc(db, 'storySubmissions', 'publish-attempt'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Publish Attempt',
          category: 'Anime',
          body: 'Body',
          storyIntent: 'This should stay private.',
          requestedVisibility: 'private',
          publicationConsent: false,
          status: 'submitted',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const ownerDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(ownerDb, 'storySubmissions', 'publish-attempt'), {
        status: 'published',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Owner cannot delete submitted story', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        await setDoc(doc(db, 'storySubmissions', 'delete-attempt'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Delete Attempt',
          category: 'Anime',
          body: 'Body',
          storyIntent: 'Private Story for review only.',
          requestedVisibility: 'private',
          publicationConsent: false,
          status: 'submitted',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const ownerDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      await assertFails(deleteDoc(doc(ownerDb, 'storySubmissions', 'delete-attempt')));
    });

    test('Owner query restricted by own UID succeeds and returns only own stories', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        await setDoc(doc(db, 'storySubmissions', 'story-a-1'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'User A Story',
          category: 'Anime',
          body: 'Body',
          storyIntent: 'This is private to AnimeStop.',
          requestedVisibility: 'private',
          publicationConsent: false,
          status: 'submitted',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await setDoc(doc(db, 'storySubmissions', 'story-b-1'), {
          userId: USER_B_UID,
          userDisplayName: 'User B',
          title: 'User B Story',
          category: 'Anime',
          body: 'Body',
          storyIntent: 'Private story B.',
          requestedVisibility: 'private',
          publicationConsent: false,
          status: 'submitted',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const ownerDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const snap = await assertSucceeds(getDocs(query(
        collection(ownerDb, 'storySubmissions'),
        where('userId', '==', USER_A_UID)
      )));

      expect(snap.size).toBe(1);
      expect(snap.docs[0].id).toBe('story-a-1');
    });

    test('Broad private story collection query is not permitted', async () => {
      const ownerDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      await assertFails(getDocs(collection(ownerDb, 'storySubmissions')));
    });

    test('Normal owner cannot approve own Story', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'storySubmissions', 'owner-moderation-story'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Owner Moderation Story',
          category: 'Anime',
          body: 'Body',
          storyIntent: 'Private moderation story.',
          requestedVisibility: 'private',
          publicationConsent: false,
          status: 'submitted',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const ownerDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(ownerDb, 'storySubmissions', 'owner-moderation-story'), {
        status: 'approved',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Normal owner cannot reject own Story', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'storySubmissions', 'owner-reject-story'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Owner Reject Story',
          category: 'Anime',
          body: 'Body',
          storyIntent: 'Please keep this private.',
          requestedVisibility: 'private',
          publicationConsent: false,
          status: 'submitted',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const ownerDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(ownerDb, 'storySubmissions', 'owner-reject-story'), {
        status: 'rejected',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Normal owner cannot publish own Story', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'storySubmissions', 'owner-publish-story'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Owner Publish Story',
          category: 'Anime',
          body: 'Body',
          storyIntent: 'Still private even after approval.',
          requestedVisibility: 'private',
          publicationConsent: false,
          status: 'approved',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const ownerDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(ownerDb, 'storySubmissions', 'owner-publish-story'), {
        status: 'published',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    // Legacy-format (pre-Stage 9 client) regression tests
    test('Legacy-format Story (intent + communityConsent) is accepted by verified user', async () => {
      const verifiedDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const ref = doc(verifiedDb, 'storySubmissions', 'legacy-new');
      await assertSucceeds(setDoc(ref, {
        userId: USER_A_UID,
        userDisplayName: 'User A',
        title: 'Legacy Story',
        category: 'Anime',
        body: 'Story body long enough to be valid for the rules check.',
        intent: 'community',
        communityConsent: true,
        status: 'submitted',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }));
    });

    test('Legacy-format Story with communityConsent=true is not publicly readable (treated as legacy document)', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'storySubmissions', 'legacy-published'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Legacy Published',
          category: 'Anime',
          body: 'Body',
          intent: 'community',
          communityConsent: true,
          status: 'published',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
      await assertFails(getDoc(doc(testEnv.unauthenticatedContext().firestore(), 'storySubmissions', 'legacy-published')));
    });

    test('Admin cannot publish a legacy-format Story (missing new consent fields)', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'storySubmissions', 'legacy-approved'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Legacy Approved',
          category: 'Anime',
          body: 'Body',
          intent: 'community',
          communityConsent: true,
          status: 'approved',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(adminDb, 'storySubmissions', 'legacy-approved'), {
        status: 'published',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });
  });

  // ==================================================
  // JOURNAL SUBMISSIONS RULES
  // ==================================================
  describe('journalSubmissions rules', () => {
    const validJournal = (overrides: Record<string, unknown> = {}) => ({
      userId: USER_A_UID,
      userDisplayName: 'User A',
      title: 'Good Journal',
      category: 'reflection',
      body: 'This is a journal body that is long enough to be valid.',
      status: 'submitted',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...overrides,
    });

    test('Unauthenticated cannot create journal', async () => {
      const unauthedDb = testEnv.unauthenticatedContext().firestore();
      const ref = doc(unauthedDb, 'journalSubmissions', 'j1');
      await assertFails(setDoc(ref, validJournal()));
    });

    test('Unverified cannot create journal', async () => {
      const userDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: false }).firestore();
      const ref = doc(userDb, 'journalSubmissions', 'j2');
      await assertFails(setDoc(ref, validJournal()));
    });

    test('Verified owner can create submitted journal', async () => {
      const verifiedDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const ref = doc(verifiedDb, 'journalSubmissions', 'j3');
      await assertSucceeds(setDoc(ref, validJournal()));
    });

    test('Verified cannot spoof another userId for journal', async () => {
      const verifiedDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const ref = doc(verifiedDb, 'journalSubmissions', 'j4');
      await assertFails(setDoc(ref, validJournal({ userId: USER_B_UID })));
    });

    test('Verified cannot create journal with status approved', async () => {
      const verifiedDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const ref = doc(verifiedDb, 'journalSubmissions', 'j4b');
      await assertFails(setDoc(ref, validJournal({ status: 'approved' })));
    });

    test('Verified cannot create journal with status published', async () => {
      const verifiedDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const ref = doc(verifiedDb, 'journalSubmissions', 'j4c');
      await assertFails(setDoc(ref, validJournal({ status: 'published' })));
    });

    test('Verified cannot create journal with status rejected', async () => {
      const verifiedDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const ref = doc(verifiedDb, 'journalSubmissions', 'j4d');
      await assertFails(setDoc(ref, validJournal({ status: 'rejected' })));
    });

    test('Valid journal server timestamps succeed', async () => {
      const verifiedDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const ref = doc(verifiedDb, 'journalSubmissions', 'j4e');
      await assertSucceeds(setDoc(ref, validJournal()));
    });

    test('Invalid required journal field type fails', async () => {
      const verifiedDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const ref = doc(verifiedDb, 'journalSubmissions', 'j4f');
      await assertFails(setDoc(ref, validJournal({ title: 42 })));
    });

    test('Invalid journal category value fails', async () => {
      const verifiedDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const ref = doc(verifiedDb, 'journalSubmissions', 'j4g');
      await assertFails(setDoc(ref, validJournal({ category: 'anime' })));
    });

    test('Owner can read own submitted journal; others cannot; public can read published', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        const ref = doc(db, 'journalSubmissions', 'owner-journal');
        await setDoc(ref, {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Owner Journal',
          category: 'creator-note',
          body: 'Body',
          status: 'submitted',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const ownerDb = testEnv.authenticatedContext(USER_A_UID).firestore();
      const otherDb = testEnv.authenticatedContext(USER_B_UID).firestore();
      const unauthDb = testEnv.unauthenticatedContext().firestore();

      await assertSucceeds(getDoc(doc(ownerDb, 'journalSubmissions', 'owner-journal')));
      await assertFails(getDoc(doc(otherDb, 'journalSubmissions', 'owner-journal')));
      await assertFails(getDoc(doc(unauthDb, 'journalSubmissions', 'owner-journal')));

      // Published
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        const ref = doc(db, 'journalSubmissions', 'published-journal');
        await setDoc(ref, {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Published Journal',
          category: 'creator-note',
          body: 'Body',
          status: 'published',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      await assertSucceeds(getDoc(doc(testEnv.unauthenticatedContext().firestore(), 'journalSubmissions', 'published-journal')));
    });

    test('Authenticated unrelated user cannot read submitted journal', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        await setDoc(doc(db, 'journalSubmissions', 'private-journal'), {
          userId: USER_A_UID,
          userDisplayName: null,
          title: 'Private Journal',
          category: 'creator-note',
          body: 'Body',
          status: 'submitted',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const otherDb = testEnv.authenticatedContext(USER_B_UID, { email: USER_B_EMAIL, email_verified: true }).firestore();
      await assertFails(getDoc(doc(otherDb, 'journalSubmissions', 'private-journal')));
    });

    test('Owner cannot update submitted journal', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        await setDoc(doc(db, 'journalSubmissions', 'locked-journal'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Locked Journal',
          category: 'reflection',
          body: 'Body',
          status: 'submitted',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const ownerDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(ownerDb, 'journalSubmissions', 'locked-journal'), {
        status: 'submitted',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Owner cannot self-publish journal', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        await setDoc(doc(db, 'journalSubmissions', 'publish-journal'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Publish Journal',
          category: 'reflection',
          body: 'Body',
          status: 'submitted',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const ownerDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(ownerDb, 'journalSubmissions', 'publish-journal'), {
        status: 'published',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Owner cannot delete journal', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        await setDoc(doc(db, 'journalSubmissions', 'delete-journal'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Delete Journal',
          category: 'reflection',
          body: 'Body',
          status: 'submitted',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const ownerDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      await assertFails(deleteDoc(doc(ownerDb, 'journalSubmissions', 'delete-journal')));
    });

    test('Owner query restricted by own UID succeeds and returns only own journals', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        await setDoc(doc(db, 'journalSubmissions', 'journal-a-1'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'User A Journal',
          category: 'reflection',
          body: 'Body',
          status: 'submitted',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await setDoc(doc(db, 'journalSubmissions', 'journal-b-1'), {
          userId: USER_B_UID,
          userDisplayName: 'User B',
          title: 'User B Journal',
          category: 'reflection',
          body: 'Body',
          status: 'submitted',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const ownerDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      const snap = await assertSucceeds(getDocs(query(
        collection(ownerDb, 'journalSubmissions'),
        where('userId', '==', USER_A_UID)
      )));

      expect(snap.size).toBe(1);
      expect(snap.docs[0].id).toBe('journal-a-1');
    });

    test('Broad private journal collection query is not permitted', async () => {
      const ownerDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      await assertFails(getDocs(collection(ownerDb, 'journalSubmissions')));
    });

    test('Normal owner cannot approve own Journal', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'journalSubmissions', 'owner-approve-journal'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Owner Approve Journal',
          category: 'reflection',
          body: 'Body',
          status: 'submitted',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const ownerDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(ownerDb, 'journalSubmissions', 'owner-approve-journal'), {
        status: 'approved',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Normal owner cannot publish own Journal', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'journalSubmissions', 'owner-publish-journal'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Owner Publish Journal',
          category: 'reflection',
          body: 'Body',
          status: 'approved',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const ownerDb = testEnv.authenticatedContext(USER_A_UID, { email: USER_A_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(ownerDb, 'journalSubmissions', 'owner-publish-journal'), {
        status: 'published',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });
  });

  // ==================================================
  // ADMIN MODERATION RULES
  // ==================================================

  describe('admin moderation rules', () => {
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();

        await setDoc(doc(db, 'admins', ADMIN_UID), {
          uid: ADMIN_UID,
          active: true,
        });

        await setDoc(doc(db, 'storySubmissions', 'admin-story-user-a'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Admin Story A',
          category: 'Anime',
          body: 'Story body A',
          storyIntent: 'Keep this Story private for AnimeStop review.',
          requestedVisibility: 'private',
          publicationConsent: false,
          intent: 'private',
          communityConsent: false,
          status: 'submitted',
          createdAt: new Date('2026-01-01'),
          updatedAt: new Date('2026-01-01'),
        });

        await setDoc(doc(db, 'storySubmissions', 'admin-story-user-b'), {
          userId: USER_B_UID,
          userDisplayName: 'User B',
          title: 'Admin Story B',
          category: 'Anime',
          body: 'Story body B',
          storyIntent: 'Please consider this Story for public publication.',
          requestedVisibility: 'public',
          publicationConsent: true,
          intent: 'community',
          communityConsent: true,
          status: 'submitted',
          createdAt: new Date('2026-01-02'),
          updatedAt: new Date('2026-01-02'),
        });

        await setDoc(doc(db, 'journalSubmissions', 'admin-journal-user-a'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Admin Journal A',
          category: 'reflection',
          body: 'Journal body A',
          status: 'submitted',
          createdAt: new Date('2026-01-03'),
          updatedAt: new Date('2026-01-03'),
        });

        await setDoc(doc(db, 'journalSubmissions', 'admin-journal-user-b'), {
          userId: USER_B_UID,
          userDisplayName: 'User B',
          title: 'Admin Journal B',
          category: 'community',
          body: 'Journal body B',
          status: 'submitted',
          createdAt: new Date('2026-01-04'),
          updatedAt: new Date('2026-01-04'),
        });
      });
    });

    test('Admin can read USER_A private Story', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertSucceeds(getDoc(doc(adminDb, 'storySubmissions', 'admin-story-user-a')));
    });

    test('Admin can read USER_B private Story', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertSucceeds(getDoc(doc(adminDb, 'storySubmissions', 'admin-story-user-b')));
    });

    test('Admin can read USER_A private Journal', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertSucceeds(getDoc(doc(adminDb, 'journalSubmissions', 'admin-journal-user-a')));
    });

    test('Admin can read USER_B private Journal', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertSucceeds(getDoc(doc(adminDb, 'journalSubmissions', 'admin-journal-user-b')));
    });

    test('Admin collection query for storySubmissions succeeds', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      const snap = await assertSucceeds(getDocs(collection(adminDb, 'storySubmissions')));
      expect(snap.size).toBe(2);
    });

    test('Admin collection query for journalSubmissions succeeds', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      const snap = await assertSucceeds(getDocs(collection(adminDb, 'journalSubmissions')));
      expect(snap.size).toBe(2);
    });

    test('Active false admin document does not receive admin access', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'admins', ADMIN_UID), {
          uid: ADMIN_UID,
          active: false,
        });
      });

      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(getDocs(collection(adminDb, 'storySubmissions')));
    });

    test('UID mismatch admin document does not receive admin access', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'admins', ADMIN_UID), {
          uid: OTHER_UID,
          active: true,
        });
      });

      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(getDocs(collection(adminDb, 'storySubmissions')));
    });

    test('Admin can submitted -> approved for Story', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertSucceeds(setDoc(doc(adminDb, 'storySubmissions', 'admin-story-user-a'), {
        status: 'approved',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin can submitted -> rejected for Story', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertSucceeds(setDoc(doc(adminDb, 'storySubmissions', 'admin-story-user-a'), {
        status: 'rejected',
        rejectionReason: 'This Story needs more detail and must avoid unsupported claims before it can be reviewed again.',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin cannot submitted -> published for Story', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(adminDb, 'storySubmissions', 'admin-story-user-a'), {
        status: 'published',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin can approved -> published for Story', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'storySubmissions', 'admin-story-approved'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Approved Story',
          category: 'Anime',
          body: 'Body',
          storyIntent: 'I want this Story considered for publication.',
          requestedVisibility: 'public',
          publicationConsent: true,
          intent: 'community',
          communityConsent: true,
          status: 'approved',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertSucceeds(setDoc(doc(adminDb, 'storySubmissions', 'admin-story-approved'), {
        status: 'published',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin can approved -> rejected for Story', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'storySubmissions', 'admin-story-approved-reject'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Approved Story Reject',
          category: 'Anime',
          body: 'Body',
          storyIntent: 'Please review for publication.',
          requestedVisibility: 'public',
          publicationConsent: true,
          intent: 'community',
          communityConsent: true,
          status: 'approved',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertSucceeds(setDoc(doc(adminDb, 'storySubmissions', 'admin-story-approved-reject'), {
        status: 'rejected',
        rejectionReason: 'We need clearer context and a more complete explanation before considering this for publication.',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin cannot rejected -> published for Story', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'storySubmissions', 'admin-story-rejected'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Rejected Story',
          category: 'Anime',
          body: 'Body',
          storyIntent: 'Rejected public story.',
          requestedVisibility: 'public',
          publicationConsent: true,
          rejectionReason: 'This Story requires revision before it can be considered again.',
          intent: 'community',
          communityConsent: true,
          status: 'rejected',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(adminDb, 'storySubmissions', 'admin-story-rejected'), {
        status: 'published',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin cannot mutate published Story status', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'storySubmissions', 'admin-story-published'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Published Story',
          category: 'Anime',
          body: 'Body',
          storyIntent: 'Approved for public publication.',
          requestedVisibility: 'public',
          publicationConsent: true,
          intent: 'community',
          communityConsent: true,
          status: 'published',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(adminDb, 'storySubmissions', 'admin-story-published'), {
        status: 'approved',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin cannot mutate Story title during moderation', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(adminDb, 'storySubmissions', 'admin-story-user-a'), {
        status: 'approved',
        title: 'Changed Title',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Private Stories cannot be publicly published', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'storySubmissions', 'admin-private-approved'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Private Approved Story',
          category: 'Anime',
          body: 'Body',
          storyIntent: 'Keep private forever.',
          requestedVisibility: 'private',
          publicationConsent: false,
          intent: 'private',
          communityConsent: false,
          status: 'approved',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(adminDb, 'storySubmissions', 'admin-private-approved'), {
        status: 'published',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin rejection requires a valid reason for Story', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(adminDb, 'storySubmissions', 'admin-story-user-a'), {
        status: 'rejected',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Legacy published Story without verifiable consent is not publicly readable', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'storySubmissions', 'legacy-published-story'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Legacy Story',
          category: 'Anime',
          body: 'Body',
          intent: 'community',
          communityConsent: true,
          status: 'published',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      await assertFails(getDoc(doc(testEnv.unauthenticatedContext().firestore(), 'storySubmissions', 'legacy-published-story')));
    });

    test('Admin cannot mutate Story body during moderation', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(adminDb, 'storySubmissions', 'admin-story-user-a'), {
        status: 'approved',
        body: 'Changed Body',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin cannot mutate Story userId during moderation', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(adminDb, 'storySubmissions', 'admin-story-user-a'), {
        status: 'approved',
        userId: USER_B_UID,
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin cannot mutate Story createdAt during moderation', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(adminDb, 'storySubmissions', 'admin-story-user-a'), {
        status: 'approved',
        createdAt: new Date('2030-01-01'),
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin cannot mutate Story intent during moderation', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(adminDb, 'storySubmissions', 'admin-story-user-a'), {
        status: 'approved',
        intent: 'community',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin can submitted -> approved for Journal', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertSucceeds(setDoc(doc(adminDb, 'journalSubmissions', 'admin-journal-user-a'), {
        status: 'approved',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin cannot submitted -> published for Journal', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(adminDb, 'journalSubmissions', 'admin-journal-user-a'), {
        status: 'published',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin can submitted -> rejected for Journal', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertSucceeds(setDoc(doc(adminDb, 'journalSubmissions', 'admin-journal-user-a'), {
        status: 'rejected',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin can approved -> published for Journal', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'journalSubmissions', 'admin-journal-approved'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Approved Journal',
          category: 'reflection',
          body: 'Body',
          status: 'approved',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertSucceeds(setDoc(doc(adminDb, 'journalSubmissions', 'admin-journal-approved'), {
        status: 'published',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin can approved -> rejected for Journal', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'journalSubmissions', 'admin-journal-approved-reject'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Approved Journal Reject',
          category: 'reflection',
          body: 'Body',
          status: 'approved',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertSucceeds(setDoc(doc(adminDb, 'journalSubmissions', 'admin-journal-approved-reject'), {
        status: 'rejected',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin cannot rejected -> published for Journal', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'journalSubmissions', 'admin-journal-rejected'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Rejected Journal',
          category: 'reflection',
          body: 'Body',
          status: 'rejected',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(adminDb, 'journalSubmissions', 'admin-journal-rejected'), {
        status: 'published',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin cannot mutate published Journal status', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'journalSubmissions', 'admin-journal-published'), {
          userId: USER_A_UID,
          userDisplayName: 'User A',
          title: 'Published Journal',
          category: 'reflection',
          body: 'Body',
          status: 'published',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(adminDb, 'journalSubmissions', 'admin-journal-published'), {
        status: 'approved',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin cannot mutate Journal title during moderation', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(adminDb, 'journalSubmissions', 'admin-journal-user-a'), {
        status: 'approved',
        title: 'Changed Journal Title',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin cannot mutate Journal body during moderation', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(adminDb, 'journalSubmissions', 'admin-journal-user-a'), {
        status: 'approved',
        body: 'Changed Journal Body',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin cannot mutate Journal category during moderation', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(adminDb, 'journalSubmissions', 'admin-journal-user-a'), {
        status: 'approved',
        category: 'community',
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });

    test('Admin cannot mutate Journal createdAt during moderation', async () => {
      const adminDb = testEnv.authenticatedContext(ADMIN_UID, { email: ADMIN_EMAIL, email_verified: true }).firestore();
      await assertFails(setDoc(doc(adminDb, 'journalSubmissions', 'admin-journal-user-a'), {
        status: 'approved',
        createdAt: new Date('2030-01-01'),
        updatedAt: serverTimestamp(),
      }, { merge: true }));
    });
  });
});
