import { useState } from 'react';
import { PillNavigation } from './components/layout/PillNavigation';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { JobsPage } from './components/jobs/JobsPage';
import { EquipmentPage } from './components/equipment/EquipmentPage';
import { DrawingsPage } from './components/drawings/DrawingsPage';
import { GangsPage } from './components/gangs/GangsPage';
import { AIAssistantPage } from './components/ai/AIAssistantPage';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <div className="min-h-screen bg-white">
      <PillNavigation
        activePage={activePage}
        onNavigate={setActivePage}
        userEmail="guest@example.com"
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
