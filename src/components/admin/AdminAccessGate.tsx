import { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { PageRoute } from '../../types';
import {
  formatAuthErrorMessage,
  validateAdminLoginForm,
} from '../../utils/authValidation';
import { Button } from '../ui/Button';

interface AdminAccessGateProps {
  readonly onNavigate: (route: PageRoute) => void;
}

export function AdminAccessGate({ onNavigate }: AdminAccessGateProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<{
    readonly email?: string;
    readonly password?: string;
  }>({});
  const [authError, setAuthError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('');

    const validation = validateAdminLoginForm(email, password);
    if (!validation.ok) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthError(formatAuthErrorMessage(error.message));
      }
    } catch {
      setAuthError(formatAuthErrorMessage());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby="admin-gate-heading"
      className="mx-auto w-full max-w-xl px-5 py-12 sm:px-8 sm:py-20"
    >
      <div className="rounded-xl border border-brand-secondary/45 bg-white/90 p-7 sm:p-10">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-brand-secondary/45 bg-brand-ivory text-brand-primary">
            <ShieldCheck
              className="h-6 w-6 text-brand-primary"
              aria-hidden="true"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-secondary">
              Authorized Staff Access
            </p>
            <h1
              id="admin-gate-heading"
              className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-brand-primary"
            >
              Gang Sabarang Admin Login
            </h1>
            <p className="mt-2.5 text-base leading-relaxed text-brand-ink/80">
              Sign in with your Supabase staff account to manage the restaurant menu, cottage rates, gallery photos, and property contact settings.
            </p>
          </div>
        </div>

        {authError ? (
          <div
            role="alert"
            data-testid="admin-login-error"
            className="mt-6 flex items-start gap-2.5 rounded-lg border border-brand-accent/60 bg-brand-ivory px-4 py-3 text-sm text-brand-ink"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent"
              aria-hidden="true"
            />
            <span className="font-medium">{authError}</span>
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          noValidate
          data-testid="admin-login-form"
          className="mt-7 space-y-5"
        >
          <div>
            <label
              htmlFor="admin-login-email"
              className="block text-sm font-medium text-brand-primary"
            >
              Staff Email
            </label>
            <input
              id="admin-login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="manager@gangsabarang.com"
              disabled={isSubmitting}
              className="mt-1.5 min-h-[44px] w-full rounded-lg border border-brand-primary/25 bg-brand-ivory/40 px-3.5 py-2 text-sm text-brand-ink placeholder:text-brand-ink/45 focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary disabled:opacity-60"
            />
            {fieldErrors.email ? (
              <p className="mt-1 text-xs font-medium text-brand-accent">
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="admin-login-password"
              className="block text-sm font-medium text-brand-primary"
            >
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="admin-login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                disabled={isSubmitting}
                className="min-h-[44px] w-full rounded-lg border border-brand-primary/25 bg-brand-ivory/40 pl-3.5 pr-11 py-2 text-sm text-brand-ink placeholder:text-brand-ink/45 focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary disabled:opacity-60"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-md text-brand-ink/60 hover:bg-brand-primary/8 hover:text-brand-primary cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {fieldErrors.password ? (
              <p className="mt-1 text-xs font-medium text-brand-accent">
                {fieldErrors.password}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigate('home')}
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Back to Home</span>
            </Button>

            <Button
              type="submit"
              variant="primary"
              data-testid="admin-login-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  <span>Sign In</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
