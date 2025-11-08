import { useState, useEffect } from 'react';
import { PillNavigation } from './components/layout/PillNavigation';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { JobsPage } from './components/jobs/JobsPage';
import { EquipmentPage } from './components/equipment/EquipmentPage';
import { DrawingsPage } from './components/drawings/DrawingsPage';
import { GangsPage } from './components/gangs/GangsPage';
import { AIAssistantPage } from './components/ai/AIAssistantPage';
import { supabase } from './lib/supabase';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [userEmail, setUserEmail] = useState('guest@example.com');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserEmail(user.email || 'guest@example.com');
      setIsAuthenticated(true);
    }
  }

  async function handleDevLogin() {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'joshua.johnsonlcs4@gmail.com',
        password: 'testpassword123',
      });

      if (error) throw error;

      if (data.user) {
        setUserEmail(data.user.email || 'guest@example.com');
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Dev login error:', error);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUserEmail('guest@example.com');
    setIsAuthenticated(false);
  }

  return (
    <div className="min-h-screen bg-black">
      <PillNavigation
        activePage={activePage}
        onNavigate={setActivePage}
        userEmail={userEmail}
        onLogout={handleLogout}
        onDevLogin={handleDevLogin}
        isAuthenticated={isAuthenticated}
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
