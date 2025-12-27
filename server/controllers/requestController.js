const MaintenanceRequest = require('../models/MaintenanceRequest');
const Equipment = require('../models/Equipment');

// ✅ GET ALL REQUESTS
exports.getAllRequests = async (req, res) => {
  try {
    console.log('📥 Fetching all requests...');
    const requests = await MaintenanceRequest.find()
      .populate('equipment', 'name serialNumber category')
      .populate('teamId')
      .sort({ createdAt: -1 });

    console.log('✅ Requests found:', requests.length);
    res.status(200).json(requests);
  } catch (error) {
    console.error('❌ Error fetching requests:', error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET REQUESTS BY EQUIPMENT
exports.getRequestsByEquipment = async (req, res) => {
  try {
    console.log('📥 Fetching requests for equipment:', req.params.equipmentId);
    const requests = await MaintenanceRequest.find({
      equipment: req.params.equipmentId,
    })
      .populate('teamId')
      .populate('equipment');

    console.log('✅ Equipment requests found:', requests.length);
    res.status(200).json(requests);
  } catch (error) {
    console.error('❌ Error fetching equipment requests:', error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ CREATE REQUEST
exports.createRequest = async (req, res) => {
  try {
    console.log('='.repeat(50));
    console.log('📥 CREATE REQUEST - Received data:', req.body);
    console.log('='.repeat(50));

    const { name, type, description, state, equipment } = req.body;

    // Validation 1: name is required
    if (!name || name.trim() === '') {
      console.log('❌ Validation failed: Name is empty');
      return res.status(400).json({ message: 'Request name is required' });
    }
    console.log('✅ Name validation passed:', name);

    // Validation 2: Check if equipment exists (if provided)
    if (equipment && equipment !== '') {
      console.log('🔍 Checking equipment exists:', equipment);
      
      try {
        const equipmentExists = await Equipment.findById(equipment);
        console.log('✅ Equipment query result:', equipmentExists ? 'FOUND' : 'NOT FOUND');
        
        if (!equipmentExists) {
          console.log('❌ Equipment not found in database:', equipment);
          return res.status(400).json({
            message: 'Equipment not found',
          });
        }
        console.log('✅ Equipment validation passed');
      } catch (equipmentError) {
        console.error('❌ Equipment lookup error:', equipmentError.message);
        return res.status(400).json({ message: 'Invalid equipment ID' });
      }
    }

    // Create request
    console.log('📝 Creating request document...');
    const requestData = {
      name: name.trim(),
      type: type || 'corrective',
      description: description ? description.trim() : '',
      state: state || 'new',
      equipment: equipment || null,
      teamId: null,
      assignedTo: null,
    };
    console.log('📄 Request data:', requestData);

    try {
      const newRequest = new MaintenanceRequest(requestData);
      console.log('📝 Model instance created');
      
      const savedRequest = await newRequest.save();
      console.log('✅ Request saved to DB:', savedRequest._id);

      // Populate and return
      const populatedRequest = await MaintenanceRequest.findById(savedRequest._id)
        .populate('equipment', 'name serialNumber category')
        .populate('teamId');

      console.log('✅ Request populated and ready');
      console.log('='.repeat(50));
      res.status(201).json(populatedRequest);
    } catch (saveError) {
      console.error('❌ Save error details:', saveError);
      console.error('Save error name:', saveError.name);
      console.error('Save error message:', saveError.message);
      
      if (saveError.name === 'ValidationError') {
        const messages = Object.values(saveError.errors).map((e) => e.message);
        console.error('❌ Validation errors:', messages);
        return res.status(400).json({ message: messages.join(', ') });
      }
      
      throw saveError;
    }
  } catch (error) {
    console.error('='.repeat(50));
    console.error('❌ ERROR CREATING REQUEST');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    console.error('='.repeat(50));
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

// ✅ UPDATE REQUEST
exports.updateRequest = async (req, res) => {
  try {
    console.log('📥 UPDATE REQUEST:', req.params.id);
    const { id } = req.params;
    const { state, equipment } = req.body;

    const request = await MaintenanceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (equipment && equipment !== '') {
      const equipmentExists = await Equipment.findById(equipment);
      if (!equipmentExists) {
        return res.status(400).json({ message: 'Equipment not found' });
      }
      request.equipment = equipment;
    }

    if (state) {
      request.state = state;
      if (state === 'repaired' && request.equipment) {
        await Equipment.findByIdAndUpdate(request.equipment, {
          status: 'active',
        });
      } else if (state === 'scrap' && request.equipment) {
        await Equipment.findByIdAndUpdate(request.equipment, {
          status: 'scrapped',
        });
      }
    }

    request.updatedAt = Date.now();
    const updatedRequest = await request.save();

    const populatedRequest = await MaintenanceRequest.findById(
      updatedRequest._id
    )
      .populate('equipment', 'name serialNumber category')
      .populate('teamId');

    console.log('✅ Request updated');
    res.status(200).json(populatedRequest);
  } catch (error) {
    console.error('❌ Error updating request:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE REQUEST
exports.deleteRequest = async (req, res) => {
  try {
    console.log('📥 DELETE REQUEST:', req.params.id);
    const { id } = req.params;
    const deletedRequest = await MaintenanceRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    console.log('✅ Request deleted');
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting request:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET STATS
exports.getStats = async (req, res) => {
  try {
    console.log('📥 Getting stats...');
    const total = await MaintenanceRequest.countDocuments();
    const byState = await MaintenanceRequest.aggregate([
      { $group: { _id: '$state', count: { $sum: 1 } } },
    ]);
    const byType = await MaintenanceRequest.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    console.log('✅ Stats fetched');
    res.status(200).json({ total, byState, byType });
  } catch (error) {
    console.error('❌ Error fetching stats:', error.message);
    res.status(500).json({ message: error.message });
  }
};
