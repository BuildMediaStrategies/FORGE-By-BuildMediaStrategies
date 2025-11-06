import { useState, useEffect } from 'react';
import { PillNavigation } from './components/layout/PillNavigation';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { JobsPage } from './components/jobs/JobsPage';
import { EquipmentPage } from './components/equipment/EquipmentPage';
import { DrawingsPage } from './components/drawings/DrawingsPage';
import { GangsPage } from './components/gangs/GangsPage';
import { AIAssistantPage } from './components/ai/AIAssistantPage';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';

interface UserData {
  id: string;
  email: string;
  role?: string;
}

function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          await fetchUserData(session.user);
        }
      } catch (err) {
        console.error('Unexpected error checking session:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);

      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserData(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (authUser: User) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        // Fallback to auth user email if users table query fails
        setUser({
          id: authUser.id,
          email: authUser.email || 'unknown@email.com',
          role: 'User'
        });
        return;
      }

      setUser({
        id: data.id,
        email: data.email || authUser.email || 'unknown@email.com',
        role: data.role || 'User'
      });

      console.log('User data loaded:', data);
    } catch (err) {
      console.error('Unexpected error fetching user:', err);
      // Fallback to auth user email
      setUser({
        id: authUser.id,
        email: authUser.email || 'unknown@email.com',
        role: 'User'
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
        alert(`Logout Error: ${error.message}`);
      } else {
        console.log('User logged out successfully');
        setUser(null);
        setActivePage('dashboard');
      }
    } catch (err: any) {
      console.error('Unexpected error during logout:', err);
      alert(`Logout Error: ${err.message || 'Failed to log out'}`);
    }
  };


  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // TEMPORARILY DISABLED: Show login/signup page if no user is authenticated
  // if (!user) {
  //   if (showSignup) {
  //     return (
  //       <SignupPage
  //         onSuccess={() => {
  //           console.log('Signup successful');
  //           setShowSignup(false);
  //         }}
  //         onBackToLogin={() => setShowSignup(false)}
  //       />
  //     );
  //   }
  //   return (
  //     <LoginPage
  //       onSuccess={handleLoginSuccess}
  //       onShowSignup={() => setShowSignup(true)}
  //     />
  //   );
  // }

  // Show main app once authenticated
  return (
    <div className="min-h-screen bg-black">
      <PillNavigation
        activePage={activePage}
        onNavigate={setActivePage}
        userEmail={user?.email || 'guest@example.com'}
        onLogout={handleLogout}
      />
      <div>
        {activePage === 'ai' ? (
          <AIAssistantPage />
        ) : (
          <main className="pt-24">
            <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
              {activePage === 'dashboard' && <DashboardPage />}
              {activePage === 'jobs' && <JobsPage />}
              {activePage === 'equipment' && <EquipmentPage />}
              {activePage === 'drawings' && <DrawingsPage />}
              {activePage === 'gangs' && <GangsPage />}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
