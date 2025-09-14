// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Server error';
  if (status >= 500) {
    console.error('Unhandled error:', err);
  }
  res.status(status).json({ message });
};

// 404 handler
const notFound = (req, res) => {
  res.status(404).json({ message: 'Not found' });
};

export { errorHandler, notFound };

