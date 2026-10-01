// Firebase auth error mapper
export function getAuthErrorMessage(error: unknown, context?: 'passwordReset' | 'verification'): string {
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
      if (context === 'verification') {
        return 'Too many verification emails were requested. Please wait and try again later.';
      }
      return context === 'passwordReset'
        ? 'Too many reset attempts. Please wait and try again later.'
        : 'Too many attempts. Please try again later.';
    
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed.';
    
    case 'auth/requires-recent-login':
      return 'For security, please confirm your password and try again.';
    
    case 'auth/user-token-expired':
      return 'Your session has expired. Please sign in again.';

    case 'auth/invalid-user-token':
      return 'Your session is invalid. Please sign out and sign back in.';

    case 'auth/invalid-continue-uri':
      return 'Invalid verification return URL configuration.';

    case 'auth/unauthorized-continue-uri':
      return 'This verification return domain is not authorized.';
    
    default:
      return 'An error occurred. Please try again.';
  }
}
