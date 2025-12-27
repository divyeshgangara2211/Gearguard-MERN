const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: [true, 'Equipment name is required']
        },
        serialNumber: {
            type: String,
            required: [true, 'Serial number is required'],
            unique: true,
            trim: true
        },
        category: {
            type: String,
            enum: ['machinery', 'vehicle', 'computer', 'tool', 'other'],
            required: true
        },
        location: {
            type: String,
            required: true
        },
        department: String,
        employee: String,
        purchaseDate: Date,
        warrantyExpiry: Date,
        status: {
            type: String,
            enum: ['active', 'inactive', 'maintenance'],
            default: 'active'
        },
        maintenanceTeamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MaintenanceTeam',
            required: false
        },
        defaultTechnicianId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Equipment', equipmentSchema);