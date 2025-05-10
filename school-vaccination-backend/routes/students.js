const Student = require('../models/Student');
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
router.get('/test',studentController.test )

router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

router.post("/", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const saved = await newStudent.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Failed to save student:", err.message);
    res.status(400).json({ error: err.message });
  }
});

router.get("/v2", async (req, res) => {
  try {
    const students = await Student.find();

    const enriched = students.map((s) => ({
      _id: s._id,
      rollNumber: s.rollNumber,
      name: s.name,
      class: s.class,
      vaccinations: s.vaccinations,
      vaccinesTaken: s.vaccinations.map((v) => v.vaccine), // ⬅️ this is what your UI will display
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students v2" });
  }
});

// POST /students/bulk — insert multiple students at once
router.post("/bulk", async (req, res) => {
  try {
    const students = req.body; // expect an array
    if (!Array.isArray(students)) {
      return res.status(400).json({ error: "Expected an array of students" });
    }

    const result = await Student.insertMany(students, { ordered: false }); // ordered: false = continue on errors
    res.status(201).json({ inserted: result.length });
  } catch (err) {
    console.error("❌ Bulk insert error:", err.message);
    res.status(500).json({ error: "Bulk insert failed", details: err.message });
  }
});

// PUT /students/:id — update a student
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student updated successfully", student });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
});
module.exports = router;
