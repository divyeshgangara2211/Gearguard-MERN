import React, { useState, useEffect } from 'react';
import { equipmentAPI } from '../services/api';
import '../styles/Equipment.css';

function EquipmentList({ onDataChange, refreshTrigger }) {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    category: 'machinery',
    location: '',
    purchaseDate: '',
    status: 'active',
  });

  useEffect(() => {
    fetchEquipment();
  }, [refreshTrigger]);

  const fetchEquipment = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await equipmentAPI.getAll();
      setEquipment(response.data || []);
    } catch (err) {
      console.error('Error fetching equipment:', err);
      setError('Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  //  HELPER FUNCTION: Friendly Error Messages
const getFriendlyErrorMessage = (err) => {

  console.log('Full error object:', err); // Debug log
  console.log('Error message:', err.response?.data?.message); // Debug log
  
  const message = err.response?.data?.message || '';
  const status = err.response?.status;

  //  DUPLICATE SERIAL NUMBER ERROR
  if (message.includes('E11000') || message.includes('duplicate') || message.includes('dup key')) {
    return '⚠️ Serial Number Already Exists!\nThis serial number is already in use. Please use a different one.';
  }

  //  VALIDATION ERROR - Name field
  if (message.includes('name') && message.includes('required')) {
    return '❌ Equipment name is required!\nPlease enter a valid equipment name.';
  }

  //  VALIDATION ERROR - Serial Number field
  if (message.includes('serialNumber') && message.includes('required')) {
    return '❌ Serial number is required!\nPlease enter a valid serial number.';
  }

  //  VALIDATION ERROR - General
  if (message.includes('validation failed') || message.includes('ValidationError')) {
    return '❌ Validation Error!\nPlease check all required fields are filled correctly.';
  }

  //  INVALID STATUS ENUM ERROR
  if (message.includes('enum') || message.includes('not a valid')) {
    return '❌ Invalid Status Selected!\nPlease choose: Active, Inactive, or In Maintenance.';
  }

  //  SERVER ERRORS
  if (status === 500) {
    return '❌ Server Error!\nSomething went wrong on the server. Please try again later.';
  }

  if (status === 400) {
    return '❌ Bad Request!\nPlease check your input and try again.';
  }

  if (status === 409) {
    return '⚠️ Conflict!\nThis equipment already exists in the system.';
  }

  //  NETWORK ERRORS
  if (!err.response) {
    return '❌ Connection Error!\nPlease check your internet connection and try again.';
  }

  //  DEFAULT ERROR
  return `❌ Error!\n${message || 'Failed to add equipment. Please try again.'}`;
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);

  // Client-side validation
  if (!formData.name || !formData.serialNumber) {
    setError('❌ Equipment name and serial number are required!');
    return;
  }

  if (formData.serialNumber.length < 3) {
    setError('❌ Serial number must be at least 3 characters long.');
    return;
  }

  try {
    console.log('Sending equipment data:', formData);
    await equipmentAPI.create(formData);
    
    setSuccess('✅ Equipment added successfully!');
    setFormData({
      name: '',
      serialNumber: '',
      category: 'machinery',
      location: '',
      purchaseDate: '',
      status: 'active',
    });
    setShowForm(false);
    fetchEquipment();
    if (onDataChange) onDataChange();
    setTimeout(() => setSuccess(null), 4000);
  } catch (err) {
    console.error('Error adding equipment:', err);
    // ✅ USE THE FRIENDLY MESSAGE FUNCTION HERE!
    const friendlyMessage = getFriendlyErrorMessage(err);
    setError(friendlyMessage);
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm('Delete this equipment?')) return;

    try {
      await equipmentAPI.delete(id);
      setSuccess('✅ Equipment deleted!');
      fetchEquipment();
      if (onDataChange) onDataChange();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting:', err);
      setError('Failed to delete equipment');
    }
  };

  return (
    <div className="equipment-container">
      <div className="equipment-header">
        <div>
          <h1>⚙️ Equipment Management</h1>
          <p>Manage your equipment and assets</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '➕ Add Equipment'}
        </button>
      </div>

       {/* Error Message - Styled Nice */}
      {error && (
        <div className="alert alert-error">
          <strong>⚠️ Oops!</strong>
          <p>{error}</p>
          <button 
            className="alert-close"
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Success Message - Styled Nice */}
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {/* Form Section */}
      {showForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <h3>Add New Equipment</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Equipment Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="CNC Machine 001"
                required
              />
            </div>
            <div className="form-group">
              <label>Serial Number *</label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleInputChange}
                placeholder="CNM-2024-001"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange}>
                <option value="machinery">Machinery</option>
                <option value="vehicle">Vehicle</option>
                <option value="computer">Computer</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Factory Floor"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Purchase Date</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">In Maintenance</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-success">✔️ Add Equipment</button>
        </form>
      )}

      {/* Equipment Table */}
      {loading ? (
        <div className="loading">Loading equipment...</div>
      ) : equipment.length === 0 ? (
        <div className="empty-state">No equipment found</div>
      ) : (
        <div className="table-container">
          <table className="equipment-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Serial Number</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map(item => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.serialNumber}</td>
                  <td>{item.category}</td>
                  <td>{item.location || '—'}</td>
                  <td>
                    <span className={`status-badge ${item.status}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-danger btn-sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EquipmentList;
