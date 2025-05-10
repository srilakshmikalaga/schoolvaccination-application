require('dotenv').config();
const mongoose = require('mongoose');
const VaccinationDrive = require('../models/VaccinationDrive');
const Student = require('../models/Student');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await VaccinationDrive.deleteMany();
    await Student.deleteMany();

    await VaccinationDrive.insertMany([
      {
        vaccine: "Polio",
        date: new Date("2025-05-28"),
        totalDoses: 100,
        applicableClasses: ["5A", "5B"]
      }
    ]);

    await Student.insertMany([
      {
        rollNumber: "STU007",
        name: "Devansh Sinha",
        class: "6B",
        vaccinations: []
      },
      {
        rollNumber: "STU008",
        name: "Priya Raj",
        class: "5A",
        vaccinations: [
          { vaccine: "Polio", date: new Date("2025-05-01") }
        ]
      }
    ]);

    console.log("🌱 Seed complete");
    process.exit();
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
};

seed();
