const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            enum: ['mechanics', 'electricians', 'it_support', 'general'],
            required: true
        },
        manager: String,
        members: [
            {
                name: String,
                email: String,
                role: String
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('MaintenanceTeam', teamSchema);
