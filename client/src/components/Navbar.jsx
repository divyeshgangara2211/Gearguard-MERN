import React from 'react';
import '../styles/Navbar.css';

function Navbar({ currentPage, setCurrentPage }) {
  const navItems = [
    { id: 'dashboard', label: ' Dashboard', icon: '📊' },
    { id: 'equipment', label: ' Equipment', icon: '⚙️' },
    { id: 'requests', label: ' Requests', icon: '📋' },
    { id: 'calendar', label: ' Calendar', icon: '📅' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h1>⚙️ GearGuard</h1>
          <span className="logo-subtitle">Maintenance Tracker</span>
        </div>

        <ul className="nav-menu">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
                title={item.label}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
