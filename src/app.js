const express = require('express');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(express.json());

const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/events', require('./routes/eventRoutes'));
app.use('/bookings', require('./routes/bookingRoutes'));
app.use('/users', require('./routes/userRoutes'));

const { markAttendance } = require('./controllers/attendanceController');
app.post('/events/:id/attendance', markAttendance);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API Docs at http://localhost:${PORT}/api-docs`);
});
