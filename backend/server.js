const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

// ================= MYSQL CONNECTION =================

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed");
    console.log(err);
  } else {
    console.log("Connected to MySQL ✅");
  }
});

// ================= HOME ROUTE =================

app.get("/", (req, res) => {
  res.send("Poornima Talkies Backend Running 🚀");
});

// ================= GET MOVIES =================

app.get("/movies", (req, res) => {

  const sql = "SELECT * FROM movies";

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching movies");
    }

    res.json(result);
  });
});

// ================= ADD MOVIE =================

app.post("/add-movie", (req, res) => {

  const {
    movie_name,
    genre,
    duration,
    language,
    show_time,
    theatre_name,
    poster_url,
    show_date
  } = req.body;

  const sql = `
    INSERT INTO movies
    (movie_name, genre, duration, language, show_time, theatre_name, poster_url, show_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      movie_name,
      genre,
      duration,
      language,
      show_time,
      theatre_name,
      poster_url,
      show_date
    ],
    (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).send("Error saving movie");
      }

      res.json({ success: true });
    }
  );
});

// ================= DELETE MOVIE =================

app.delete("/delete-movie/:id", (req, res) => {

  const movieId = req.params.id;

  const sql = "DELETE FROM movies WHERE id=?";

  db.query(sql, [movieId], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).send("Error deleting movie");
    }

    res.json({ success: true });
  });
});

// ================= SAVE BOOKING =================

app.post("/book-seat", (req, res) => {

  const {
    movie_name,
    show_time,
    show_date,
    seat_number,
    user_phone
  } = req.body;

  const sql = `
    INSERT INTO bookings
    (movie_name, show_time, show_date, seat_number, user_phone)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      movie_name,
      show_time,
      show_date,
      seat_number,
      user_phone
    ],
    (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).send("Booking failed");
      }

      res.json({ success: true });
    }
  );
});

// ================= GET BOOKINGS =================

app.get("/bookings", (req, res) => {

  const sql = "SELECT * FROM bookings";

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching bookings");
    }

    res.json(result);
  });
});

// ================= DELETE BOOKING =================

app.delete("/delete-booking/:id", (req, res) => {

  const bookingId = req.params.id;

  const sql = "DELETE FROM bookings WHERE id=?";

  db.query(sql, [bookingId], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).send("Error deleting booking");
    }

    res.json({ success: true });
  });
});

// ================= START SERVER =================

app.listen(5000, () => {
  console.log("Server running on port 5000");
});