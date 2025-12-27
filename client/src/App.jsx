import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import EquipmentList from './components/EquipmentList';
import RequestKanban from './components/RequestKanban';
import RequestCalendar from './components/RequestCalendar';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard refreshTrigger={refreshTrigger} />;
      case 'equipment':
        return <EquipmentList onDataChange={handleDataChange} refreshTrigger={refreshTrigger} />;
      case 'requests':
        return <RequestKanban onDataChange={handleDataChange} refreshTrigger={refreshTrigger} />;
      case 'calendar':
        return <RequestCalendar refreshTrigger={refreshTrigger} />;
      default:
        return <Dashboard refreshTrigger={refreshTrigger} />;
    }
  };

  return (
    <div className="app">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
      <footer className="app-footer">
        <p>© 2025 GearGuard - Maintenance Tracker | Built with MERN Stack</p>
      </footer>
    </div>
  );
}

export default App;
