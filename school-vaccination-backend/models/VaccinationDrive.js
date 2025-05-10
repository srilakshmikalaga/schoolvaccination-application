const mongoose = require("mongoose");

const VaccinationDriveSchema = new mongoose.Schema({
  vaccine: { type: String, required: true },
  date: { type: Date, required: true },
  totalDoses: { type: Number, required: true },
  applicableClasses: { type: [String], default: [] },
}, {
  timestamps: true,
  collection: "vaccinationdrives" // force collection name
});


module.exports = mongoose.model("VaccinationDrive", VaccinationDriveSchema);
