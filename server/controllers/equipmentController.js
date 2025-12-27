const Equipment = require('../models/Equipment');

// GET all equipment
exports.getAllEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find()
            .populate('maintenanceTeamId', 'name');
        res.json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET single equipment
exports.getEquipmentById = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id)
            .populate('maintenanceTeamId');
        if (!equipment) return res.status(404).json({ message: 'Not found' });
        res.json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE equipment
exports.createEquipment = async (req, res) => {
    const equipment = new Equipment(req.body);
    try {
        const newEquipment = await equipment.save();
        res.status(201).json(newEquipment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// UPDATE equipment
exports.updateEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json(equipment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE equipment
exports.deleteEquipment = async (req, res) => {
    try {
        await Equipment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Equipment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
