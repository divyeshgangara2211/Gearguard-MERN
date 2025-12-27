import React, { useState, useEffect } from 'react';
import { requestAPI, equipmentAPI, teamAPI } from '../services/api';
import '../styles/Dashboard.css';

function Dashboard({ refreshTrigger }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [equipRes, teamRes, reqRes] = await Promise.all([
        equipmentAPI.getAll(),
        teamAPI.getAll(),
        requestAPI.getAll(),
      ]);

      const requests = reqRes.data || [];
      const newCount = requests.filter(r => r.state === 'new').length;
      const inProgressCount = requests.filter(r => r.state === 'in_progress').length;
      const completedCount = requests.filter(r => r.state === 'repaired').length;

      setStats({
        totalEquipment: equipRes.data?.length || 0,
        totalTeams: teamRes.data?.length || 0,
        totalRequests: requests.length,
        newRequests: newCount,
        inProgressRequests: inProgressCount,
        completedRequests: completedCount,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <p>Welcome back! Here's your maintenance overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card equipment">
          <div className="stat-icon">⚙️</div>
          <div className="stat-content">
            <h3>Total Equipment</h3>
            <p className="stat-number">{stats?.totalEquipment || 0}</p>
            <p className="stat-label">Tracked assets</p>
          </div>
        </div>

        <div className="stat-card teams">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Maintenance Teams</h3>
            <p className="stat-number">{stats?.totalTeams || 0}</p>
            <p className="stat-label">Active teams</p>
          </div>
        </div>

        <div className="stat-card requests">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Total Requests</h3>
            <p className="stat-number">{stats?.totalRequests || 0}</p>
            <p className="stat-label">All requests</p>
          </div>
        </div>

        <div className="stat-card new">
          <div className="stat-icon">🆕</div>
          <div className="stat-content">
            <h3>New Requests</h3>
            <p className="stat-number">{stats?.newRequests || 0}</p>
            <p className="stat-label">Awaiting action</p>
          </div>
        </div>

        <div className="stat-card progress">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-number">{stats?.inProgressRequests || 0}</p>
            <p className="stat-label">Being worked on</p>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-number">{stats?.completedRequests || 0}</p>
            <p className="stat-label">Finished</p>
          </div>
        </div>
      </div>

      <div className="welcome-section">
        <h2>🎯 GearGuard - Your Maintenance Solution</h2>
        <p>Streamline your maintenance operations with our comprehensive tracking system</p>
        
        <div className="features-grid">
          <div className="feature">
            <span className="feature-icon">🔧</span>
            <h4>Equipment Management</h4>
            <p>Track all your assets and machines in one place</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📅</span>
            <h4>Schedule Maintenance</h4>
            <p>Plan preventive maintenance on the calendar</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📋</span>
            <h4>Request Tracking</h4>
            <p>Monitor status with drag-and-drop Kanban board</p>
          </div>
          <div className="feature">
            <span className="feature-icon">👥</span>
            <h4>Team Management</h4>
            <p>Assign teams and technicians to requests</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
