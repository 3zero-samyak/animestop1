# Firestore Security Rules - Deployment Guide

## Overview

AnimeStop uses Firestore to store user profile data. This document explains how to deploy and test the security rules.

## Current Collections

### `users/{uid}`

**Schema:**
```typescript
{
  uid: string;           // Firebase Auth UID (immutable)
  email: string;         // User email address
  displayName?: string;  // Optional display name
  emailVerified: boolean; // Email verification status
  createdAt: Timestamp;  // Account creation time (immutable)
  updatedAt: Timestamp;  // Last update time
}
```

**Security Model:**
- Users can only read their own profile
- Users can only create/update their own profile
- Users cannot change their `uid` (ownership is immutable)
- Users cannot change `createdAt` timestamp
- Users can delete their own profile (for account deletion)

## Files

- `firestore.rules` - Production security rules
- `firestore.indexes.json` - Firestore indexes configuration
- `firebase.json` - Firebase project configuration
- `tests/firestore.rules.test.ts` - Security rules test suite

## Deploying Rules

### Option 1: Firebase Console (Recommended for initial setup)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **animestop-b9dfd**
3. Navigate to **Firestore Database** → **Rules**
4. Copy the contents of `firestore.rules` and paste into the editor
5. Click **Publish**

### Option 2: Firebase CLI

1. Install Firebase CLI (if not already installed):
   ```powershell
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```powershell
   firebase login
   ```

3. Initialize Firebase project (first time only):
   ```powershell
   firebase init firestore
   ```
   - Select existing project: **animestop-b9dfd**
   - Use existing `firestore.rules` and `firestore.indexes.json`

4. Deploy rules:
   ```powershell
   firebase deploy --only firestore:rules
   ```

## Testing Rules

### Install Test Dependencies

```powershell
npm install -D @firebase/rules-unit-testing jest @types/jest ts-jest
```

### Start Firebase Emulator

```powershell
npx firebase emulators:start --only firestore
```

The emulator will start on:
- Firestore: `localhost:8080`
- Emulator UI: `http://localhost:4000`

### Run Tests

In a separate terminal:

```powershell
# Run all tests
npm test

# Run only rules tests
npm run test:rules

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

## Test Coverage

The test suite covers:

✅ **Unauthenticated Access**
- Cannot read any user profile
- Cannot create any user profile

✅ **Profile Read Access**
- User can read their own profile
- User cannot read another user's profile

✅ **Profile Creation**
- User can create their own profile with valid data
- User can include optional displayName
- User cannot create profile for another user
- Cannot create profile with mismatched uid
- Cannot create profile without required fields
- Cannot create profile with invalid field types

✅ **Profile Updates**
- User can update their own profile permitted fields
- User cannot update another user's profile
- User cannot change their uid field
- User cannot change createdAt timestamp

✅ **Profile Deletion**
- User can delete their own profile
- User cannot delete another user's profile

✅ **Default Deny Rule**
- Cannot access unknown collections
- Cannot write to unknown collections

## Security Checklist

Before going to production, verify:

- [ ] Rules are deployed to Firebase Console
- [ ] All tests pass locally
- [ ] Rules tests run in emulator (not just mocked)
- [ ] Manual testing completed:
  - [ ] User can create account and profile is created
  - [ ] User can update display name
  - [ ] User can delete their account and profile is deleted
  - [ ] User cannot access another user's profile
- [ ] No secrets or credentials in repository
- [ ] .env.local is in .gitignore
- [ ] Firebase console shows rules are active

## Future Collections

When adding Story or Journal submissions:

1. Add collection schema to this document
2. Add security rules to `firestore.rules`
3. Add test cases to `tests/firestore.rules.test.ts`
4. Require `request.auth.token.email_verified == true` for submissions
5. Enforce ownership: `request.resource.data.userId == request.auth.uid`
6. Test all rules before deploying

## Troubleshooting

### Rules tests fail with "Connection refused"

**Problem:** Firebase emulator is not running.

**Solution:** Start the emulator in a separate terminal:
```powershell
npx firebase emulators:start --only firestore
```

### Rules tests timeout

**Problem:** Test timeout is too short.

**Solution:** Tests are configured with 30-second timeout in `tests/setup.ts`.

### Cannot deploy rules

**Problem:** Not authenticated with Firebase CLI.

**Solution:**
```powershell
firebase login
firebase projects:list
firebase use animestop-b9dfd
```

### Rules not applied in production

**Problem:** Rules were not deployed.

**Solution:** Check Firebase Console → Firestore Database → Rules to verify the deployed rules match `firestore.rules`.

## Additional Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Rules Unit Testing](https://firebase.google.com/docs/rules/unit-tests)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
