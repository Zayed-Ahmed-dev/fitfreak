require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db'); 
const userRoutes = require('./routes/userRoute'); // import your user routes
const goalRoutes = require('./routes/goalRoutes');
const planRoutes = require('./routes/planRoutes')
const postRoutes = require('./routes/postRoutes')
const progressRoutes = require('./routes/progressRoutes')
const cors = require('cors')


const app = express();
app.use(cors())

const PORT = process.env.PORT || 3000;

// Body parser middleware
app.use(express.json());

// ---------------------- ROUTES ----------------------

// Root
app.get('/', (req, res) => {
  res.send('🚀 Fitness App Backend is running...');
});

// User routes
app.use('/api/user', userRoutes); 

// Goal routes
app.use('/api/goals', goalRoutes)

//Plan routes
app.use('/api/plan', planRoutes)

//Progress routes
app.use('/api/progress', progressRoutes)

//Post routes
app.use('/api/posts', postRoutes)

// ---------------------- CONNECT TO DB & START SERVER ----------------------
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to DB:', err);
});
