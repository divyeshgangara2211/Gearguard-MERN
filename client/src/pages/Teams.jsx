import React, { useState, useEffect } from 'react';
import '../styles/Teams.css';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    members: '',
    specialization: '',
    availability: 'available',
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      // For now, using localStorage since no API endpoint exists
      const savedTeams = localStorage.getItem('teams');
      if (savedTeams) {
        setTeams(JSON.parse(savedTeams));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTeam = {
      _id: Date.now().toString(),
      ...formData,
      members: formData.members.split(',').map(m => m.trim()),
      createdAt: new Date()
    };
    
    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
    
    setFormData({
      name: '',
      members: '',
      specialization: '',
      availability: 'available',
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this team?')) {
      const updated = teams.filter(t => t._id !== id);
      setTeams(updated);
      localStorage.setItem('teams', JSON.stringify(updated));
    }
  };

  if (loading) {
    return <div className="loading">Loading teams...</div>;
  }

  return (
    <div className="teams-container">
      <div className="teams-header">
        <h2>Maintenance Teams</h2>
        <button 
          className="btn-add-team"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Team'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="team-form">
          <h3>Create New Team</h3>
          
          <div className="form-group">
            <label>Team Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Team A, Electrical Team"
            />
          </div>

          <div className="form-group">
            <label>Team Members (comma-separated) *</label>
            <input
              type="text"
              name="members"
              value={formData.members}
              onChange={handleChange}
              required
              placeholder="e.g., John, Sarah, Mike"
            />
          </div>

          <div className="form-group">
            <label>Specialization</label>
            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
            >
              <option value="">Select Specialization</option>
              <option value="electrical">Electrical</option>
              <option value="mechanical">Mechanical</option>
              <option value="hydraulic">Hydraulic</option>
              <option value="general">General</option>
            </select>
          </div>

          <div className="form-group">
            <label>Availability</label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
            >
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <button type="submit" className="btn-submit">Create Team</button>
        </form>
      )}

      {teams.length === 0 ? (
        <div className="empty-state">
          <p>No teams created yet. Click "Add Team" to create one.</p>
        </div>
      ) : (
        <div className="teams-grid">
          {teams.map(team => (
            <div key={team._id} className="team-card">
              <div className="card-header">
                <h3>{team.name}</h3>
                <span className={`availability ${team.availability}`}>
                  {team.availability}
                </span>
              </div>
              <div className="card-body">
                <p><strong>Members:</strong> {team.members.join(', ')}</p>
                {team.specialization && (
                  <p><strong>Specialization:</strong> {team.specialization}</p>
                )}
              </div>
              <div className="card-actions">
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(team._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Teams;
