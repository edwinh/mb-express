const mongoose = require('mongoose')

const harvestSchema = new mongoose.Schema({
  timeEntryId: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  clientId: {
    type: Number,
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  projectId: {
      type: Number,
      required: true
  },
  projectName: {
      type: String,
      required: true
  },
  taskId: {
      type: Number,
      required: true
  },
  taskName: {
      type: String,
      required: true
  },
  spentDate: {
    type: Date,
    required: true
  },
  hours: {
      type: Number,
      required: true
  },
  billable: {
      type: Boolean,
      required: true
  },
  updateDate: {
    type: Date,
    required: true,
    default: Date.now
  }
  
})

module.exports = mongoose.model('Harvest', harvestSchema)