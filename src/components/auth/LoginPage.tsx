import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LoginPageProps {
  onSuccess: () => void;
}

export function LoginPage({ }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link. Please try again.');
    } finally {
      setLoading(false);
    }
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
                Check your email for the magic link!
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 neumorphic-button hover:bg-[#252525] text-white font-bold transition-colors border border-[#2d2d2d] rounded-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                      Sending magic link...
                    </>
                  ) : (
                    'Send Magic Link'
                  )}
                </button>
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
