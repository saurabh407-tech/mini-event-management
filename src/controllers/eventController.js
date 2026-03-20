const pool = require('../config/db');

const getAllEvents = async (req, res) => {
  try {
    const [events] = await pool.query(
      'SELECT * FROM events WHERE date > NOW() ORDER BY date ASC'
    );
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const createEvent = async (req, res) => {
  const { title, description, date, total_capacity } = req.body;

  if (!title || !date || !total_capacity) {
    return res.status(400).json({ success: false, message: 'title, date, and total_capacity are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO events (title, description, date, total_capacity, remaining_tickets) VALUES (?, ?, ?, ?, ?)',
      [title, description, date, total_capacity, total_capacity]
    );
    res.status(201).json({ success: true, message: 'Event created', eventId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getAllEvents, createEvent };
