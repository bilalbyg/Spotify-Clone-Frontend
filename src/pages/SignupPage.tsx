import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';

function SignupPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0); // 0 = email, 1 = password, 2 = about you, 3 = terms
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [shareDataOptIn, setShareDataOptIn] = useState(false);

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumberOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinLength = password.length >= 10;

  const totalSteps = 3;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  // Progress percentage
  const progressPercent = step === 0 ? 0 : (step / totalSteps) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0a] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm flex flex-col items-center">
          {/* Spotify Logo */}
          <svg viewBox="0 0 496 512" className="h-12 w-12 mb-6">
            <path
              fill="white"
              d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"
            />
          </svg>

          {/* Step 0: Email */}
          {step === 0 && (
            <>
              <h1 className="text-3xl font-bold tracking-tight text-white text-center mb-10 leading-tight">
                {t('auth.signup.title')}
              </h1>

              <div className="w-full mb-4">
                <label className="block text-sm font-semibold text-white mb-2">
                  {t('auth.signup.emailAddress')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.signup.emailPlaceholder')}
                  className="w-full rounded-[4px] border border-zinc-600 bg-transparent px-3.5 py-3 text-sm text-white outline-none transition focus:border-white placeholder:text-zinc-500"
                />
              </div>

              <button
                onClick={handleNext}
                className="w-full rounded-full bg-[#1ed760] py-3 text-base font-bold text-black transition hover:bg-[#1fdf64] hover:scale-[1.02] active:scale-100"
              >
                Next
              </button>

              <div className="w-full flex items-center my-6">
                <div className="flex-1 h-px bg-zinc-800" />
                <span className="px-4 text-sm text-zinc-400">{t('auth.signup.or')}</span>
                <div className="flex-1 h-px bg-zinc-800" />
              </div>

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
                  {t('auth.signup.signUpWithGoogle')}
                </button>

                <button className="relative flex w-full items-center justify-center rounded-full border border-zinc-700 px-4 py-3 text-sm font-bold text-white transition hover:border-zinc-400 hover:bg-zinc-900/50">
                  <span className="absolute left-4">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                  </span>
                  {t('auth.signup.signUpWithApple')}
                </button>
              </div>

              <div className="mt-10 text-center">
                <p className="text-sm text-zinc-400">{t('auth.signup.alreadyHaveAccount')}</p>
                <Link
                  className="mt-2 inline-block text-sm font-semibold text-white underline underline-offset-2 hover:text-emerald-400 transition"
                  to="/signin"
                >
                  {t('auth.signup.signIn')}
                </Link>
              </div>
            </>
          )}

          {/* Steps 1-3: Progress bar + back button */}
          {step > 0 && (
            <>
              {/* Progress bar */}
              <div className="w-full h-0.5 bg-zinc-800 rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-[#1ed760] transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Back + Step indicator */}
              <div className="w-full flex items-center gap-3 mb-6">
                <button
                  onClick={handleBack}
                  className="p-1 text-zinc-400 hover:text-white transition rounded-full"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div>
                  <p className="text-xs text-zinc-400">
                    Step {step} of {totalSteps}
                  </p>
                  <h2 className="text-base font-bold text-white">
                    {step === 1 && 'Create a password'}
                    {step === 2 && 'Tell us about yourself'}
                    {step === 3 && 'Terms & Conditions'}
                  </h2>
                </div>
              </div>
            </>
          )}

          {/* Step 1: Password */}
          {step === 1 && (
            <div className="w-full">
              <label className="block text-sm font-semibold text-white mb-2">
                {t('auth.signup.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.signup.passwordPlaceholder')}
                  className="w-full rounded-[4px] border border-zinc-600 bg-transparent px-3.5 py-3 pr-10 text-sm text-white outline-none transition focus:border-white placeholder:text-zinc-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password requirements */}
              <div className="mt-4">
                <p className="text-sm font-semibold text-white mb-2">
                  Your password must contain at least
                </p>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2 text-sm">
                    <span
                      className={`w-3 h-3 rounded-full flex items-center justify-center ${hasLetter ? 'bg-[#1ed760]' : 'bg-zinc-600'}`}
                    >
                      {hasLetter && (
                        <svg viewBox="0 0 12 12" className="w-2 h-2 fill-black">
                          <path
                            d="M10 3L4.5 8.5 2 6"
                            stroke="black"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="text-zinc-300">1 letter</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span
                      className={`w-3 h-3 rounded-full flex items-center justify-center ${hasNumberOrSpecial ? 'bg-[#1ed760]' : 'bg-zinc-600'}`}
                    >
                      {hasNumberOrSpecial && (
                        <svg viewBox="0 0 12 12" className="w-2 h-2 fill-black">
                          <path
                            d="M10 3L4.5 8.5 2 6"
                            stroke="black"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="text-zinc-300">
                      {'1 number or special character (example: # ? ! &)'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span
                      className={`w-3 h-3 rounded-full flex items-center justify-center ${hasMinLength ? 'bg-[#1ed760]' : 'bg-zinc-600'}`}
                    >
                      {hasMinLength && (
                        <svg viewBox="0 0 12 12" className="w-2 h-2 fill-black">
                          <path
                            d="M10 3L4.5 8.5 2 6"
                            stroke="black"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="text-zinc-300">10 characters</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleNext}
                className="w-full mt-6 rounded-full bg-[#1ed760] py-3 text-base font-bold text-black transition hover:bg-[#1fdf64] hover:scale-[1.02] active:scale-100"
              >
                Next
              </button>
            </div>
          )}

          {/* Step 2: Tell us about yourself (Name + DOB + Gender) */}
          {step === 2 && (
            <div className="w-full space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-white mb-1">Name</label>
                <p className="text-xs text-zinc-400 mb-2">This name will appear on your profile</p>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-[4px] border border-zinc-600 bg-transparent px-3.5 py-3 text-sm text-white outline-none transition focus:border-white placeholder:text-zinc-500"
                />
              </div>

              {/* Date of birth */}
              <div>
                <label className="block text-sm font-bold text-white mb-1">Date of birth</label>
                <p className="text-xs text-zinc-400 mb-2">
                  Why do we need your date of birth?{' '}
                  <a href="#" className="underline">
                    Learn more
                  </a>
                  .
                </p>
                <div className="grid grid-cols-[60px_1fr_80px] gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    placeholder="dd"
                    className="w-full rounded-[4px] border border-zinc-600 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition focus:border-white placeholder:text-zinc-500"
                  />
                  <div className="relative">
                    <select
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      className="w-full rounded-[4px] border border-zinc-600 bg-transparent px-3 py-2.5 pr-8 text-sm text-white outline-none transition focus:border-white appearance-none"
                    >
                      <option value="" className="bg-zinc-900">
                        {t('auth.signup.monthOptions.month')}
                      </option>
                      <option value="1" className="bg-zinc-900">
                        {t('auth.signup.monthOptions.january')}
                      </option>
                      <option value="2" className="bg-zinc-900">
                        {t('auth.signup.monthOptions.february')}
                      </option>
                      <option value="3" className="bg-zinc-900">
                        {t('auth.signup.monthOptions.march')}
                      </option>
                      <option value="4" className="bg-zinc-900">
                        {t('auth.signup.monthOptions.april')}
                      </option>
                      <option value="5" className="bg-zinc-900">
                        {t('auth.signup.monthOptions.may')}
                      </option>
                      <option value="6" className="bg-zinc-900">
                        {t('auth.signup.monthOptions.june')}
                      </option>
                      <option value="7" className="bg-zinc-900">
                        {t('auth.signup.monthOptions.july')}
                      </option>
                      <option value="8" className="bg-zinc-900">
                        {t('auth.signup.monthOptions.august')}
                      </option>
                      <option value="9" className="bg-zinc-900">
                        {t('auth.signup.monthOptions.september')}
                      </option>
                      <option value="10" className="bg-zinc-900">
                        {t('auth.signup.monthOptions.october')}
                      </option>
                      <option value="11" className="bg-zinc-900">
                        {t('auth.signup.monthOptions.november')}
                      </option>
                      <option value="12" className="bg-zinc-900">
                        {t('auth.signup.monthOptions.december')}
                      </option>
                    </select>
                    <svg
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    placeholder="yyyy"
                    className="w-full rounded-[4px] border border-zinc-600 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition focus:border-white placeholder:text-zinc-500"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-bold text-white mb-1">
                  {t('auth.signup.gender')}
                </label>
                <p className="text-xs text-zinc-400 mb-3">
                  We use your gender to help personalize your content recommendations and ads for
                  you.
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {[
                    { value: 'man', label: t('auth.signup.man') },
                    { value: 'woman', label: t('auth.signup.woman') },
                    { value: 'non-binary', label: t('auth.signup.nonBinary') },
                    { value: 'other', label: 'Something else' },
                    { value: 'prefer-not', label: t('auth.signup.preferNotToSay') },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer"
                    >
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${gender === option.value ? 'border-[#1ed760]' : 'border-zinc-500'}`}
                      >
                        {gender === option.value && (
                          <span className="w-2 h-2 rounded-full bg-[#1ed760]" />
                        )}
                      </span>
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={gender === option.value}
                        onChange={(e) => setGender(e.target.value)}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full rounded-full bg-[#1ed760] py-3 text-base font-bold text-black transition hover:bg-[#1fdf64] hover:scale-[1.02] active:scale-100"
              >
                Next
              </button>
            </div>
          )}

          {/* Step 3: Terms & Conditions */}
          {step === 3 && (
            <div className="w-full space-y-4">
              {/* Checkbox options */}
              <label className="flex items-start gap-3 rounded-[4px] bg-zinc-900/70 p-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={(e) => setMarketingOptIn(e.target.checked)}
                  className="sr-only peer"
                />
                <span className="mt-0.5 w-4 h-4 shrink-0 rounded-[3px] border-2 border-zinc-500 flex items-center justify-center peer-checked:group-[]:bg-[#1ed760] peer-checked:group-[]:border-[#1ed760] transition">
                  {marketingOptIn && (
                    <svg viewBox="0 0 12 12" className="w-2.5 h-2.5">
                      <path
                        d="M10 3L4.5 8.5 2 6"
                        stroke="black"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="text-sm text-zinc-300">
                  Please send me news and offers from Spotify
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-[4px] bg-zinc-900/70 p-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={shareDataOptIn}
                  onChange={(e) => setShareDataOptIn(e.target.checked)}
                  className="sr-only peer"
                />
                <span className="mt-0.5 w-4 h-4 shrink-0 rounded-[3px] border-2 border-zinc-500 flex items-center justify-center peer-checked:group-[]:bg-[#1ed760] peer-checked:group-[]:border-[#1ed760] transition">
                  {shareDataOptIn && (
                    <svg viewBox="0 0 12 12" className="w-2.5 h-2.5">
                      <path
                        d="M10 3L4.5 8.5 2 6"
                        stroke="black"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="text-sm text-zinc-300">
                  Share my registration data with Spotify's content providers for marketing
                  purposes.
                </span>
              </label>

              {/* Legal text */}
              <div className="space-y-3 pt-2">
                <p className="text-xs text-zinc-400">Spotify is a personalised service.</p>
                <p className="text-xs text-zinc-400">
                  By clicking on sign-up, you agree to Spotify's{' '}
                  <a href="#" className="text-[#1ed760] underline">
                    Terms and Conditions of Use
                  </a>
                  .
                </p>
                <p className="text-xs text-zinc-400">
                  By clicking on sign-up, you confirm that you have read how we process your
                  personal data in our{' '}
                  <a href="#" className="text-[#1ed760] underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              <Link
                to="/signin"
                className="block w-full mt-2 rounded-full bg-[#1ed760] py-3 text-base font-bold text-black text-center transition hover:bg-[#1fdf64] hover:scale-[1.02] active:scale-100"
              >
                {t('auth.signup.signUp')}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-[11px] leading-5 text-zinc-500 max-w-sm mx-auto px-4">
          {t('auth.signup.recaptchaPrefix')}{' '}
          <a
            href="https://policies.google.com/privacy"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            {t('auth.signup.privacyPolicy')}
          </a>{' '}
          {t('auth.signup.recaptchaMiddle')}{' '}
          <a
            href="https://policies.google.com/terms"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            {t('auth.signup.termsOfService')}
          </a>{' '}
          {t('auth.signup.recaptchaSuffix')}
        </p>
      </footer>
    </main>
  );
}

export default SignupPage;
