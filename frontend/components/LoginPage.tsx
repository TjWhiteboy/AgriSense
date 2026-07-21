import React, { useState } from "react";
import { authService } from '../services/authService';

const IllustrationPanel = () => (
  <div className="hidden lg:flex flex-col items-center justify-center h-full hero-gradient text-white p-12 relative overflow-hidden">
    {/* Decorative circles */}
    <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/5 rounded-full" />
    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
    <div className="animate-float text-8xl mb-8">🌿</div>
    <h2 className="font-heading font-extrabold text-4xl text-center mb-4 relative z-10">
      Smart Agriculture, Powered by AI
    </h2>
    <p className="text-white/75 text-center max-w-sm leading-relaxed relative z-10">
      Get real-time disease detection, crop recommendations, and weather insights — all in one platform trusted by 50,000+ farmers.
    </p>
    <div className="mt-10 flex flex-col gap-3 w-full max-w-sm relative z-10">
      {['🔬 AI Disease Detection','🌦️ Hyper-Local Weather','🌾 Crop Recommendations'].map(f => (
        <div key={f} className="flex items-center gap-3 glass rounded-xl px-4 py-2.5">
          <span className="text-sm font-medium">{f}</span>
        </div>
      ))}
    </div>
  </div>
);

export default function LoginPage({ onLogin }: { onLogin: (name: string, email: string) => void }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const data = isRegistering
              ? await authService.register(name, email, password)
              : await authService.login(email, password);

            if (data.token) {
                localStorage.setItem("token", data.token);
                onLogin(data.user?.name || name, data.user?.email || email);
            } else if (isRegistering && data.user) {
                setIsRegistering(false);
                setSuccessMsg("Account created! Please log in.");
            } else {
                setErrorMsg(data.error || data.message || "Authentication failed");
            }
        } catch (err: any) {
            setErrorMsg(err.message || "An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
          {/* Left — Illustration */}
          <div className="lg:w-1/2">
            <IllustrationPanel />
          </div>

          {/* Right — Form */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-md">
              {/* Logo Header */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-4xl">🌿</span>
                <div>
                  <h1 className="font-heading font-extrabold text-2xl text-gray-900 dark:text-white">AgriSense</h1>
                  <p className="text-xs text-gray-400 font-mono tracking-wide">AI FARM INTELLIGENCE</p>
                </div>
              </div>

              <h2 className="font-heading font-bold text-3xl text-gray-900 dark:text-white mb-1">
                {isRegistering ? "Create your account" : "Welcome back"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                {isRegistering ? "Join thousands of smart farmers." : "Sign in to continue to AgriSense."}
              </p>

              {/* Alerts */}
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl text-sm">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl text-sm">
                  ✅ {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegistering && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                    <input
                      type="text" value={name} onChange={e => setName(e.target.value)}
                      required={isRegistering} disabled={isSubmitting} placeholder="e.g. Ramesh Kumar"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600 backdrop-blur-sm transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    required disabled={isSubmitting} placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600 backdrop-blur-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                      required disabled={isSubmitting} placeholder="••••••••" minLength={6}
                      className="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600 backdrop-blur-sm transition-all"
                    />
                    <button
                      type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 text-base"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit" disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-800 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-800/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : isRegistering ? '🌱 Create Account' : '🔑 Sign In'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                {isRegistering ? "Already have an account? " : "Don't have an account? "}
                <button
                  onClick={() => { setIsRegistering(v => !v); setErrorMsg(""); setSuccessMsg(""); }}
                  className="text-primary-700 dark:text-primary-400 font-semibold hover:underline"
                >
                  {isRegistering ? "Sign In" : "Register Free"}
                </button>
              </p>
            </div>
          </div>
        </div>
    );
}
