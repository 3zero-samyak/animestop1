// Firebase auth error mapper
export function getAuthErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return 'An unexpected error occurred. Please try again.';
  }

  const code = (error as { code?: string }).code;

  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address.';
    
    case 'auth/missing-password':
      return 'Password is required.';
    
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';
    
    case 'auth/email-already-in-use':
      return 'An account already exists with this email.';
    
    case 'auth/weak-password':
      return 'Password does not meet the required security rules.';
    
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed.';
    
    case 'auth/requires-recent-login':
      return 'Please sign in again to continue.';
    
    default:
      return 'An error occurred. Please try again.';
  }
}
