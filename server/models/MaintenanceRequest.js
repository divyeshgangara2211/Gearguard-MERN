const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Request name is required'],
      trim: true,
      minlength: 2,
    },
    type: {
      type: String,
      enum: {
        values: ['corrective', 'preventive'],
        message: 'Type must be either corrective or preventive',
      },
      default: 'corrective',
      required: true,
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: false,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintenanceTeam',
      required: false,
    },
    assignedTo: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      enum: {
        values: ['new', 'in_progress', 'repaired', 'scrap'],
        message: 'State must be one of: new, in_progress, repaired, scrap',
      },
      default: 'new',
    },
    scheduledDate: {
      type: Date,
      default: null,
    },
    startDate: {
      type: Date,
      default: null,
    },
    completionDate: {
      type: Date,
      default: null,
    },
    durationHours: {
      type: Number,
      default: 0,
    },
    isOverdue: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ✅ CORRECT PRE-SAVE HOOK
requestSchema.pre('save', function(next) {
  if (this.scheduledDate && ['new', 'in_progress'].includes(this.state)) {
    this.isOverdue = this.scheduledDate < new Date();
  }

//   next();
});


module.exports = mongoose.model('MaintenanceRequest', requestSchema);
