import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  const rules = readFileSync(resolve(__dirname, '../firestore.rules'), 'utf8');

  testEnv = await initializeTestEnvironment({
    projectId: 'animestop-test',
    firestore: { rules },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('users emailVerified enforcement', () => {
  test('Authenticated user can create profile with matching emailVerified token', async () => {
    const uid = 'tester-1';
    const authed = testEnv.authenticatedContext(uid, { email_verified: true }).firestore();
    const userRef = doc(authed, 'users', uid);

    await assertSucceeds(setDoc(userRef, {
      uid,
      email: 't1@example.com',
      emailVerified: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }));
  });

  test('Authenticated user cannot create profile with mismatched emailVerified token', async () => {
    const uid = 'tester-2';
    const authed = testEnv.authenticatedContext(uid, { email_verified: false }).firestore();
    const userRef = doc(authed, 'users', uid);

    await assertFails(setDoc(userRef, {
      uid,
      email: 't2@example.com',
      emailVerified: true, // mismatch
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }));
  });

  test('Unverified user cannot create profile claiming verified', async () => {
    const uid = 'tester-3';
    const authed = testEnv.authenticatedContext(uid, { email_verified: false }).firestore();
    const userRef = doc(authed, 'users', uid);

    await assertFails(setDoc(userRef, {
      uid,
      email: 't3@example.com',
      emailVerified: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }));
  });

  test('Verified user can create and then update profile with matching emailVerified', async () => {
    const uid = 'tester-4';
    const authed = testEnv.authenticatedContext(uid, { email_verified: true }).firestore();
    const userRef = doc(authed, 'users', uid);

    await assertSucceeds(setDoc(userRef, {
      uid,
      email: 't4@example.com',
      emailVerified: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }));

    // Update with same verified flag
    await assertSucceeds(setDoc(userRef, {
      uid,
      email: 't4@example.com',
      displayName: 'Tester 4',
      emailVerified: true,
      updatedAt: serverTimestamp(),
    }, { merge: true }));
  });
});
