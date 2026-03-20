CREATE DATABASE IF NOT EXISTS event_management;
USE event_management;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  date DATETIME NOT NULL,
  total_capacity INT NOT NULL,
  remaining_tickets INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unique_code VARCHAR(20) NOT NULL UNIQUE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE event_attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  user_id INT NOT NULL,
  entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (name, email) VALUES
('Rahul Sharma', 'rahul@example.com'),
('Priya Singh', 'priya@example.com');

INSERT INTO events (title, description, date, total_capacity, remaining_tickets) VALUES
('Tech Conference 2025', 'Annual tech summit', '2025-09-15 10:00:00', 100, 100),
('Music Night', 'Live music event', '2025-10-20 18:00:00', 50, 50);
