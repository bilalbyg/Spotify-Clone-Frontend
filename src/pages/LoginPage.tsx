import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, token, username, email: responseEmail } = response.data;
      const authToken = accessToken || token;

      if (!authToken) {
        throw new Error('Login response did not include an access token');
      }

      const loggedUser = {
        id: 'me', // Default ID for correct routing
        email: responseEmail || email,
        username: username,
        name: username, // Fallback name to username
      };

      login(loggedUser, authToken);

      const previousLocation = (
        location.state as {
          from?: { pathname?: string; search?: string; hash?: string };
        } | null
      )?.from;
      const redirectPath = previousLocation?.pathname
        ? `${previousLocation.pathname}${previousLocation.search ?? ''}${previousLocation.hash ?? ''}`
        : '/home';

      navigate(redirectPath, { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0a] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm flex flex-col items-center">
          {/* Spotify Logo */}
          <svg viewBox="0 0 496 512" className="h-12 w-12 mb-8">
            <path
              fill="white"
              d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"
            />
          </svg>

          {/* Title */}
          <h1 className="text-3xl font-bold tracking-tight text-white text-center mb-10">
            {t('auth.login.welcomeBack')}
          </h1>

          <form onSubmit={handleLogin} className="w-full flex flex-col items-center">
            {/* Error message */}
            {error && (
              <div className="w-full mb-4 p-3 rounded bg-red-500/20 text-red-500 text-sm text-center border border-red-500/50">
                {error}
              </div>
            )}

            {/* Email input */}
            <div className="w-full mb-4">
              <label className="block text-sm font-semibold text-white mb-2">
                {t('auth.login.emailOrUsername')}
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[4px] border border-zinc-600 bg-transparent px-3.5 py-3 text-sm text-white outline-none transition focus:border-white placeholder:text-zinc-500"
                placeholder={t('auth.login.emailOrUsername')}
                required
              />
            </div>

            {/* Password input */}
            <div className="w-full mb-6">
              <label className="block text-sm font-semibold text-white mb-2">
                {t('auth.login.password', 'Password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[4px] border border-zinc-600 bg-transparent px-3.5 py-3 text-sm text-white outline-none transition focus:border-white placeholder:text-zinc-500"
                placeholder={t('auth.login.password', 'Password')}
                required
              />
            </div>

            {/* Continue button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#1ed760] py-3 text-base font-bold text-black transition hover:bg-[#1fdf64] hover:scale-[1.02] active:scale-100 disabled:opacity-50"
            >
              {loading ? '...' : t('auth.login.continue')}
            </button>
          </form>

          {/* Divider */}
          <div className="w-full flex items-center my-6">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="px-4 text-sm text-zinc-400">{t('auth.login.or')}</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Social buttons */}
          <div className="w-full space-y-3">
            <button className="relative flex w-full items-center justify-center rounded-full border border-zinc-700 px-4 py-3 text-sm font-bold text-white transition hover:border-zinc-400 hover:bg-zinc-900/50">
              <span className="absolute left-4">
                <svg className="h-5 w-5" viewBox="0 0 48 48">
                  <path
                    fill="#FFC107"
                    d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                  />
                  <path
                    fill="#FF3D00"
                    d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                  />
                </svg>
              </span>
              {t('auth.login.continueWithGoogle')}
            </button>

            <button className="relative flex w-full items-center justify-center rounded-full border border-zinc-700 px-4 py-3 text-sm font-bold text-white transition hover:border-zinc-400 hover:bg-zinc-900/50">
              <span className="absolute left-4">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </span>
              {t('auth.login.continueWithFacebook')}
            </button>

            <button className="relative flex w-full items-center justify-center rounded-full border border-zinc-700 px-4 py-3 text-sm font-bold text-white transition hover:border-zinc-400 hover:bg-zinc-900/50">
              <span className="absolute left-4">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              </span>
              {t('auth.login.continueWithApple')}
            </button>
          </div>

          {/* Sign up link */}
          <div className="mt-10 text-center">
            <p className="text-sm text-zinc-400">{t('auth.login.noAccount')}</p>
            <Link
              className="mt-2 inline-block text-sm font-semibold text-white underline underline-offset-2 hover:text-emerald-400 transition"
              to="/signup"
            >
              {t('auth.login.signUp')}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer - reCAPTCHA notice */}
      <footer className="py-6 text-center">
        <p className="text-[11px] leading-5 text-zinc-500 max-w-sm mx-auto px-4">
          {t('auth.login.recaptchaPrefix')}{' '}
          <a
            href="https://policies.google.com/privacy"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            {t('auth.login.privacyPolicy')}
          </a>{' '}
          {t('auth.login.recaptchaMiddle')}{' '}
          <a
            href="https://policies.google.com/terms"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            {t('auth.login.termsOfService')}
          </a>{' '}
          {t('auth.login.recaptchaSuffix')}
        </p>
      </footer>
    </main>
  );
}

export default LoginPage;
