// utils/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error('❌ Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
};
