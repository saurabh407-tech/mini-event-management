const pool = require('../config/db');

const markAttendance = async (req, res) => {
  const { id } = req.params;
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: 'Booking code is required' });
  }

  try {
    const [bookings] = await pool.query(
      `SELECT b.*, u.name, u.email
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       WHERE b.unique_code = ? AND b.event_id = ?`,
      [code, id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ success: false, message: 'Invalid code or wrong event' });
    }

    const booking = bookings[0];

    const [existing] = await pool.query(
      'SELECT * FROM event_attendance WHERE booking_id = ?',
      [booking.id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Attendance already marked' });
    }

    await pool.query(
      'INSERT INTO event_attendance (booking_id, user_id) VALUES (?, ?)',
      [booking.id, booking.user_id]
    );

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total_attended
       FROM event_attendance ea
       JOIN bookings b ON ea.booking_id = b.id
       WHERE b.event_id = ?`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Attendance marked successfully',
      attendee: { name: booking.name, email: booking.email },
      total_tickets_booked: countResult[0].total_attended,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { markAttendance };
