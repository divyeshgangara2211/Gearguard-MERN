import React, { useState, useCallback } from 'react';
import { requestAPI, equipmentAPI } from '../services/api';
import '../styles/Kanban.css';

function RequestKanban({ onDataChange, refreshTrigger }) {
  const [requests, setRequests] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'corrective',
    description: '',
    equipmentId: '',
    state: 'new',
  });

  // 🔥 USE CALLBACK TO PREVENT INFINITE LOOPS
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching requests and equipment...');
      const [reqs, equips] = await Promise.all([
        requestAPI.getAll(),
        equipmentAPI.getAll(),
      ]);
      console.log('Requests:', reqs.data);
      console.log('Equipment:', equips.data);
      setRequests(reqs.data || []);
      setEquipment(equips.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      const friendlyMsg = getFriendlyErrorMessage(err);
      setError(friendlyMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ NOW fetchData IS IN DEPENDENCY ARRAY
  React.useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔥 FRIENDLY ERROR MESSAGES
  const getFriendlyErrorMessage = (err) => {
    console.log('Error object:', err);
    const message = err.response?.data?.message || '';
    const status = err.response?.status;

    // Equipment not found
    if (message.includes('Equipment') || message.includes('equipment')) {
      return '❌ Equipment Error!\nPlease select a valid equipment.';
    }

    // 404 Error
    if (status === 404) {
      return '❌ Not Found!\nThe request could not be processed. Please try again.';
    }

    // Validation Error
    if (message.includes('validation') || message.includes('required')) {
      return '❌ Validation Error!\nPlease fill in all required fields.';
    }

    // 500 Server Error
    if (status === 500) {
      return '❌ Server Error!\nSomething went wrong. Please try again later.';
    }

    // 400 Bad Request
    if (status === 400) {
      return '❌ Bad Request!\nPlease check your input.';
    }

    // Default
    return `❌ Error!\n${message || 'Failed to create request. Please try again.'}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.name || formData.name.trim() === '') {
      setError('❌ Request name is required!');
      return;
    }

    // ⚠️ IMPORTANT: Check if equipment is selected
    if (!formData.equipmentId || formData.equipmentId.trim() === '') {
      setError('❌ Please select equipment!');
      return;
    }

    // Prepare data - CORRECT FIELD NAMES FOR BACKEND
    const dataToSend = {
      name: formData.name.trim(),
      type: formData.type,
      description: formData.description.trim(),
      state: formData.state,
      equipment: formData.equipmentId, // ✅ IMPORTANT: Send equipment ID
    };

    try {
      console.log('Sending request data:', dataToSend);
      const response = await requestAPI.create(dataToSend);
      console.log('Request created successfully:', response.data);
      
      setSuccess('✅ Request created successfully!');
      setFormData({
        name: '',
        type: 'corrective',
        description: '',
        equipmentId: '',
        state: 'new',
      });
      setShowForm(false);
      
      // Fetch fresh data
      await fetchData();
      if (onDataChange) onDataChange();
      
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      console.error('Error creating request:', err);
      console.error('Error response:', err.response?.data);
      const friendlyMsg = getFriendlyErrorMessage(err);
      setError(friendlyMsg);
    }
  };

  const handleDragStart = (e, request) => {
    setDraggedItem(request);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newState) => {
    e.preventDefault();
    if (!draggedItem) return;

    try {
      console.log(`Moving request ${draggedItem._id} to ${newState}`);
      await requestAPI.update(draggedItem._id, { state: newState });
      setSuccess('✅ Status updated!');
      await fetchData();
      if (onDataChange) onDataChange();
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('Error updating status:', err);
      const friendlyMsg = getFriendlyErrorMessage(err);
      setError(friendlyMsg);
    } finally {
      setDraggedItem(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;

    try {
      console.log(`Deleting request ${id}`);
      await requestAPI.delete(id);
      setSuccess('✅ Request deleted!');
      await fetchData();
      if (onDataChange) onDataChange();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting:', err);
      const friendlyMsg = getFriendlyErrorMessage(err);
      setError(friendlyMsg);
    }
  };

  const columns = ['new', 'in_progress', 'repaired', 'scrap'];
  const columnNames = {
    new: '🆕 New',
    in_progress: '⏳ In Progress',
    repaired: '✅ Repaired',
    scrap: '❌ Scrap',
  };

  const getCardColor = (type) => {
    return type === 'preventive' ? '#ffd700' : '#ff6b6b';
  };

  const requestsByState = columns.reduce((acc, col) => {
    acc[col] = requests.filter(r => r.state === col);
    return acc;
  }, {});

  return (
    <div className="kanban-container">
      <div className="kanban-header">
        <div>
          <h1>📋 Maintenance Requests</h1>
          <p>Drag cards to change status</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '➕ Create Request'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <strong>⚠️ Oops!</strong>
          <p>{error}</p>
          <button className="alert-close" onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <h3>Create New Request</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Request Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Oil Leakage"
                required
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleInputChange}>
                <option value="corrective">Corrective (Emergency)</option>
                <option value="preventive">Preventive (Scheduled)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the issue..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Equipment * (Required)</label>
              <select 
                name="equipmentId" 
                value={formData.equipmentId} 
                onChange={handleInputChange}
                required
              >
                <option value="">-- Select Equipment --</option>
                {equipment.length > 0 ? (
                  equipment.map(eq => (
                    <option key={eq._id} value={eq._id}>
                      {eq.name} ({eq.serialNumber})
                    </option>
                  ))
                ) : (
                  <option disabled>No equipment available - Add equipment first!</option>
                )}
              </select>
            </div>
            <div className="form-group">
              <label>Initial Status</label>
              <select name="state" value={formData.state} onChange={handleInputChange}>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-success">✔️ Create Request</button>
        </form>
      )}

      {/* Content */}
      {loading ? (
        <div className="loading">Loading requests...</div>
      ) : equipment.length === 0 ? (
        <div className="empty-state">
          ⚠️ No equipment found. Please add equipment in the Equipment tab first!
        </div>
      ) : (
        <div className="kanban-board">
          {columns.map(columnId => (
            <div
              key={columnId}
              className="kanban-column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, columnId)}
            >
              <div className="column-header">
                <h3>{columnNames[columnId]}</h3>
                <span className="count">{requestsByState[columnId].length}</span>
              </div>

              <div className="cards-container">
                {requestsByState[columnId].length === 0 ? (
                  <div className="empty-column">No requests here</div>
                ) : (
                  requestsByState[columnId].map(request => (
                    <div
                      key={request._id}
                      className="kanban-card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, request)}
                      style={{
                        borderLeft: `4px solid ${getCardColor(request.type)}`,
                      }}
                    >
                      <div className="card-header">
                        <h4>{request.name}</h4>
                        <span 
                          className="type-badge" 
                          style={{ backgroundColor: getCardColor(request.type) }}
                        >
                          {request.type}
                        </span>
                      </div>
                      {request.description && (
                        <p className="card-description">{request.description}</p>
                      )}
                      {request.equipment && (
                        <div className="card-footer">
                          <small>
                            ⚙️ {typeof request.equipment === 'object' 
                              ? request.equipment.name 
                              : 'Equipment'}
                          </small>
                        </div>
                      )}
                      <button
                        className="btn-danger btn-sm delete-btn"
                        onClick={() => handleDelete(request._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RequestKanban;
