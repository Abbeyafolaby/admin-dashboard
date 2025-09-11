import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 4000;


// DB
connectDB(process.env.MONGO_URI);

// Start server
app.listen(PORT, () => {
  console.log(
    `🚀 Admin Dashboard rbac server is running http://localhost:${PORT}`
  );
});
