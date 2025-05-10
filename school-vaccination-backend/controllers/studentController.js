
exports.test = (req, res) => {
  console.log('haggu')
  res.json({ message: 'Students route is working' });
};

exports.getStudentById = async (req, res) => {
  console.log('📦 Controller called with ID:', req.params.id);
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
