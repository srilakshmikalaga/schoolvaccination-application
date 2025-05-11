const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Drive = require("../models/VaccinationDrive");

router.get("/summary", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const vaccinated = await Student.countDocuments({
    vaccinations: {
      $elemMatch: {
        vaccine: { $exists: true, $ne: "" }
      }
    }
  });

    const unvaccinated = await Student.countDocuments({
      $or: [
        { vaccinations: { $exists: false } },
        { vaccinations: { $size: 0 } },
        {
          vaccinations: {
            $not: {
              $elemMatch: { vaccine: { $exists: true, $ne: "" } }
            }
          }
        }
      ]
    });

    const upcomingDrives = await Drive.countDocuments({
      date: { $gte: new Date() }
    });

    res.json({
      totalStudents,
      vaccinated,
      unvaccinated,
      upcomingDrives
    });
  } catch (err) {
    res.status(500).json({ error: "Dashboard summary failed." });
  }
});


module.exports = router;
