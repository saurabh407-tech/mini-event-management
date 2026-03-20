const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const createBooking = async (req, res) => {
  const { user_id, event_id } = req.body;

  if (!user_id || !event_id) {
    return res.status(400).json({ success: false, message: 'user_id and event_id are required' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [events] = await connection.query(
      'SELECT * FROM events WHERE id = ? FOR UPDATE',
      [event_id]
    );

    if (events.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const event = events[0];

    if (event.remaining_tickets <= 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'No tickets available' });
    }

    const uniqueCode = 'EVT-' + uuidv4().substring(0, 8).toUpperCase();

    await connection.query(
      'INSERT INTO bookings (user_id, event_id, unique_code) VALUES (?, ?, ?)',
      [user_id, event_id, uniqueCode]
    );

    await connection.query(
      'UPDATE events SET remaining_tickets = remaining_tickets - 1 WHERE id = ?',
      [event_id]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Booking confirmed!',
      booking_code: uniqueCode,
    });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: 'Booking failed', error: error.message });
  } finally {
    connection.release();
  }
};

const getUserBookings = async (req, res) => {
  const { id } = req.params;
  try {
    const [bookings] = await pool.query(
      `SELECT b.id, b.unique_code, b.booking_date, e.title, e.date, e.description
       FROM bookings b
       JOIN events e ON b.event_id = e.id
       WHERE b.user_id = ?`,
      [id]
    );
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { createBooking, getUserBookings };
