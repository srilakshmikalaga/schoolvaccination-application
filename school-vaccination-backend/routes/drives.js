const express = require("express");
const router = express.Router();
const Drive = require("../models/VaccinationDrive");

// GET today's drives
router.get("/today", async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  try {
    const drives = await Drive.find({
      date: { $gte: startOfToday, $lte: endOfToday }
    });
    res.json(drives);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch today's drives" });
  }
});

// GET /api/drives
router.get("/", async (req, res) => {
  const drives = await Drive.find();
  res.json(drives);
});

router.post("/", async (req, res) => {
  try {
    const { vaccine, date, totalDoses, applicableClasses } = req.body;

    const newDrive = new Drive({
      vaccine,
      date,
      totalDoses,
      applicableClasses,
    });

    const saved = await newDrive.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Failed to add drive:", err.message);
    res.status(400).json({ error: err.message });
  }
});


// PUT /api/drives/:id — update vaccination drive
router.put("/:id", async (req, res) => {
  try {
    const { vaccine, date, totalDoses, applicableClasses } = req.body;

    if (!vaccine || !date || !totalDoses || !applicableClasses) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updated = await Drive.findByIdAndUpdate(
      req.params.id,
      {
        vaccine,
        date,
        totalDoses,
        applicableClasses
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Drive not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating drive:", err.message);
    res.status(500).json({ error: "Update failed" });
  }
});



module.exports = router;
