import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SignupPageProps {
  onSuccess: () => void;
  onBackToLogin: () => void;
}

export function SignupPage({ onSuccess, onBackToLogin }: SignupPageProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateForm = (): string | null => {
    // Check all fields are filled
    if (!fullName || !email || !password || !confirmPassword) {
      return 'Please fill in all fields';
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }

    // Check password length
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }

    // Check passwords match
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Step 1: Create auth user with Supabase
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: fullName,
          },
        },
      });

      if (signUpError) {
        console.error('Supabase signup error:', signUpError);
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('User creation failed - no user returned');
      }

      console.log('Auth user created:', authData.user.id);

      // Step 2: Insert into users table
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: email,
          name: fullName,
          role: 'Manager',
        });

      if (insertError) {
        console.error('Error inserting into users table:', insertError);
        // Don't throw here - auth user is created, they can still sign in
        alert(`Warning: User created but profile setup incomplete. Error: ${insertError.message}`);
      } else {
        console.log('User profile created successfully');
      }

      // Step 3: Show success and redirect
      setSuccess(true);
      console.log('Account created successfully for:', email);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        onBackToLogin();
      }, 2000);

    } catch (err: any) {
      console.error('Signup error:', err);
      const errorMessage = err.message || 'Failed to create account. Please try again.';
      setError(errorMessage);
      alert(`Signup Error: ${errorMessage}`);
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
            <h3 className="text-2xl font-black text-white">Create Account</h3>
            <p className="text-base text-[#e5e5e5] font-medium">
              Join FORGE to manage your scaffolding projects
            </p>
          </div>
          <div className="p-6 pt-0">
            {success ? (
              <div className="p-4 bg-[#2d2d2d] border-2 border-green-500 rounded text-sm text-white font-semibold text-center">
                Account created! Please sign in.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 bg-[#2d2d2d] border-2 border-red-500 rounded text-sm text-white font-semibold">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium leading-none text-white">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="John Smith"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                    className="neumorphic-input flex h-11 w-full px-4 py-2 text-sm font-medium placeholder:text-[#e5e5e5] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

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
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="neumorphic-input flex h-11 w-full px-4 py-2 text-sm font-medium placeholder:text-[#e5e5e5] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium leading-none text-white">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={onBackToLogin}
                    disabled={loading}
                    className="text-sm text-[#888] hover:text-[#e5e5e5] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Already have an account? Sign in
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
