import { useState } from 'react';
import { PillNavigation } from './components/layout/PillNavigation';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { RolesPage } from './components/roles/RolesPage';
import { CandidatesPage } from './components/candidates/CandidatesPage';
import { ClientsPage } from './components/clients/ClientsPage';
import { SurveysPage } from './components/surveys/SurveysPage';
import { DocumentsPage } from './components/documents/DocumentsPage';
import { InvoicesPage } from './components/invoices/InvoicesPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { SettingsPage } from './components/settings/SettingsPage';

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
      <main className="pt-24">
        <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
          {activePage === 'dashboard' && <DashboardPage />}
          {activePage === 'roles' && <RolesPage />}
          {activePage === 'candidates' && <CandidatesPage />}
          {activePage === 'clients' && <ClientsPage />}
          {activePage === 'surveys' && <SurveysPage />}
          {activePage === 'documents' && <DocumentsPage />}
          {activePage === 'invoices' && <InvoicesPage />}
          {activePage === 'reports' && <ReportsPage />}
          {activePage === 'settings' && <SettingsPage />}
        </div>
      </main>
    </div>
  );
}

export default App;
