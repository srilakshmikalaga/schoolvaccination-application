const mongoose = require('mongoose');

const VaccinationRecordSchema = new mongoose.Schema({
  vaccine: String,
  date: Date
}, { _id: false });

const StudentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  class: { type: String, required: true },
  vaccinations: { type: [VaccinationRecordSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
