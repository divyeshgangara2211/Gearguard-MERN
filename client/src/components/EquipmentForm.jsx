import React, { useState } from 'react';
import { equipmentAPI } from '../services/api';

function EquipmentForm({ onEquipmentAdded, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    category: '',
    location: '',
    status: 'active',
    purchaseDate: '',
    lastMaintenanceDate: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await equipmentAPI.create(formData);
      setFormData({
        name: '',
        serialNumber: '',
        category: '',
        location: '',
        status: 'active',
        purchaseDate: '',
        lastMaintenanceDate: '',
        notes: '',
      });
      if (onEquipmentAdded) {
        onEquipmentAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding equipment');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="equipment-form">
      <h3>Add New Equipment</h3>
      
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Equipment Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g., CNC Machine, Drill Press"
        />
      </div>

      <div className="form-group">
        <label>Serial Number *</label>
        <input
          type="text"
          name="serialNumber"
          value={formData.serialNumber}
          onChange={handleChange}
          required
          placeholder="e.g., SN-12345"
        />
      </div>

      <div className="form-group">
        <label>Category *</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="machinery">Machinery</option>
          <option value="tools">Tools</option>
          <option value="electronics">Electronics</option>
          <option value="vehicles">Vehicles</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Location *</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          placeholder="e.g., Workshop A, Floor 2"
        />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="under_maintenance">Under Maintenance</option>
          <option value="scrapped">Scrapped</option>
        </select>
      </div>

      <div className="form-group">
        <label>Purchase Date</label>
        <input
          type="date"
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Last Maintenance Date</label>
        <input
          type="date"
          name="lastMaintenanceDate"
          value={formData.lastMaintenanceDate}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes about the equipment"
          rows="4"
        />
      </div>

      <div className="form-buttons">
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Adding...' : 'Add Equipment'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default EquipmentForm;
