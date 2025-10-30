import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { signInWithRememberMe } from '../../lib/supabase';

interface LoginPageProps {
  onSuccess: () => void;
}

export function LoginPage({ }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Use signInWithRememberMe helper to handle storage based on checkbox
      // If Remember Me is checked: uses localStorage (persists across browser restarts)
      // If unchecked: uses sessionStorage (clears when browser closes)
      const { error } = await signInWithRememberMe(email, password, rememberMe);

      if (error) {
        throw error;
      }

      console.log('User signed in successfully:', email, 'Remember Me:', rememberMe);
      setSuccess(true);
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Failed to sign in. Please check your credentials.';
      setError(errorMessage);
      alert(`Login Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    console.log('Create account clicked - feature coming soon');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black p-4">
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4">
        <div className="neumorphic-pill flex items-center justify-center px-6 h-[70px]" style={{ minWidth: '200px' }}>
          <span className="text-[32px] font-black text-white tracking-tight">FORGE</span>
        </div>
      </nav>

      <div className="w-full max-w-md mt-20">
        <div className="text-center mb-8">
          <p className="text-[#e5e5e5] font-medium">by BuildMediaStrategies</p>
          <p className="text-white font-semibold mt-2">AI-Powered Project Management</p>
        </div>

        <div className="neumorphic-card border border-[#2d2d2d] shadow-none bg-[#1a1a1a]">
          <div className="space-y-1 pb-6 p-6">
            <h3 className="text-2xl font-black text-white">Welcome back</h3>
            <p className="text-base text-[#e5e5e5] font-medium">
              Sign in to manage your scaffolding projects
            </p>
          </div>
          <div className="p-6 pt-0">
            {success ? (
              <div className="p-4 bg-[#2d2d2d] border-2 border-green-500 rounded text-sm text-white font-semibold text-center">
                Successfully signed in! Redirecting...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 bg-[#2d2d2d] border-2 border-red-500 rounded text-sm text-white font-semibold">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none text-white">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="john.smith@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="neumorphic-input flex h-11 w-full px-4 py-2 text-sm font-medium placeholder:text-[#e5e5e5] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium leading-none text-white">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="neumorphic-input flex h-11 w-full px-4 py-2 text-sm font-medium placeholder:text-[#e5e5e5] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    className="w-4 h-4 rounded border-[#2d2d2d] bg-[#1a1a1a] text-white focus:ring-2 focus:ring-white disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <label htmlFor="rememberMe" className="text-sm font-medium text-white cursor-pointer">
                    Remember Me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 neumorphic-button hover:bg-[#252525] text-white font-bold transition-colors border border-[#2d2d2d] rounded-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleCreateAccount}
                    disabled={loading}
                    className="text-sm text-[#888] hover:text-[#e5e5e5] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Don't have an account? Create one
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-[#e5e5e5] mt-6 font-medium">
          Secure project management for scaffolding companies
        </p>
      </div>
    </div>
  );
}
