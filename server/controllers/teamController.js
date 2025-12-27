const MaintenanceTeam = require('../models/MaintenanceTeam');

// GET all teams
exports.getAllTeams = async (req, res) => {
    try {
        const teams = await MaintenanceTeam.find();
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE team
exports.createTeam = async (req, res) => {
    const team = new MaintenanceTeam(req.body);
    try {
        const newTeam = await team.save();
        res.status(201).json(newTeam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// UPDATE team
exports.updateTeam = async (req, res) => {
    try {
        const team = await MaintenanceTeam.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE team
exports.deleteTeam = async (req, res) => {
    try {
        await MaintenanceTeam.findByIdAndDelete(req.params.id);
        res.json({ message: 'Team deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
