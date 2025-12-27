import React, { useState, useEffect } from 'react';
import { equipmentAPI } from '../services/api';
import EquipmentForm from '../components/EquipmentForm';
import '../styles/Equipment.css';

function Equipment() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await equipmentAPI.getAll();
      setEquipment(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      alert('Error fetching equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await equipmentAPI.delete(id);
        setEquipment(equipment.filter(e => e._id !== id));
        alert('Equipment deleted successfully');
      } catch (error) {
        console.error('Error deleting equipment:', error);
        alert('Error deleting equipment');
      }
    }
  };

  const handleEquipmentAdded = () => {
    setShowForm(false);
    fetchEquipment();
  };

  if (loading) {
    return <div className="loading">Loading equipment...</div>;
  }

  return (
    <div className="equipment-container">
      <div className="equipment-header">
        <h2>Equipment Management</h2>
        <button 
          className="btn-add-equipment"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Equipment'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <EquipmentForm 
            onEquipmentAdded={handleEquipmentAdded}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {equipment.length === 0 ? (
        <div className="empty-state">
          <p>No equipment found. Click "Add Equipment" to get started.</p>
        </div>
      ) : (
        <div className="equipment-grid">
          {equipment.map(item => (
            <div key={item._id} className="equipment-card">
              <div className="card-header">
                <h3>{item.name}</h3>
                <span className={`status ${item.status}`}>{item.status}</span>
              </div>
              <div className="card-body">
                <p><strong>Serial:</strong> {item.serialNumber}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Location:</strong> {item.location}</p>
                {item.purchaseDate && (
                  <p><strong>Purchased:</strong> {new Date(item.purchaseDate).toLocaleDateString()}</p>
                )}
                {item.notes && (
                  <p><strong>Notes:</strong> {item.notes}</p>
                )}
              </div>
              <div className="card-actions">
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(item._id)}
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

export default Equipment;
