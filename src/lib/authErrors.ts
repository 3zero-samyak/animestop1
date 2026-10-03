// Firebase auth error mapper
export function getAuthErrorMessage(error: unknown, context?: 'passwordReset' | 'verification' | 'google'): string {
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

    case 'auth/popup-closed-by-user':
      return 'Google sign-in was canceled.';

    case 'auth/popup-blocked':
      return 'The Google sign-in popup was blocked. We will try a full-page sign-in instead.';

    case 'auth/cancelled-popup-request':
      return 'Google sign-in is already in progress.';

    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for Google sign-in. Check Firebase Authentication settings.';

    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method. Sign in with that method first.';

    case 'auth/operation-not-supported-in-this-environment':
      return 'Google sign-in popup is not available here. Try again or use a full-page sign-in flow.';
    
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    
    case 'auth/operation-not-allowed':
      return context === 'google'
        ? 'Google sign-in is not enabled for this Firebase project.'
        : 'This operation is not allowed.';
    
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
