export interface LoginFormValidation {
  readonly ok: boolean;
  readonly errors: {
    readonly email?: string;
    readonly password?: string;
  };
}

const BASIC_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAdminLoginForm(
  email: string,
  password: string,
): LoginFormValidation {
  const trimmedEmail = email.trim();
  const errors: { email?: string; password?: string } = {};

  if (!trimmedEmail) {
    errors.email = 'Admin email is required.';
  } else if (!BASIC_EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  }

  return {
    ok: !errors.email && !errors.password,
    errors,
  };
}

export function formatAuthErrorMessage(rawMessage?: string | null): string {
  const message = (rawMessage ?? '').trim().toLowerCase();
  if (!message) {
    return 'Unable to sign in right now. Please check your credentials and try again.';
  }
  if (message.includes('invalid login credentials')) {
    return 'Incorrect email or password. Please verify your Gang Sabarang staff credentials.';
  }
  if (message.includes('email not confirmed')) {
    return 'Your email address has not been confirmed yet. Please confirm it in Supabase Auth.';
  }
  if (message.includes('too many requests') || message.includes('rate limit')) {
    return 'Too many sign-in attempts. Please wait a moment before trying again.';
  }
  return 'Sign-in failed. Please verify your email and password and try again.';
}
