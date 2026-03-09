import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("voya.db");

// Initialize database
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      type TEXT, -- 'flight', 'train', 'hotel', 'package'
      details TEXT, -- JSON string
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
  console.log("Database initialized successfully");
} catch (err) {
  console.error("Database initialization failed:", err);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/api/health", (req, res) => {
    try {
      const usersCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
      const bookingsCount = db.prepare("SELECT COUNT(*) as count FROM bookings").get() as any;
      res.json({ 
        status: "ok", 
        users: usersCount.count, 
        bookings: bookingsCount.count,
        dbPath: path.resolve("voya.db")
      });
    } catch (err) {
      res.status(500).json({ status: "error", error: String(err) });
    }
  });

  // Auth Endpoints
  app.post("/api/auth/register", (req, res) => {
    const { email, password, name } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)");
      const info = stmt.run(email, password, name);
      res.json({ success: true, userId: info.lastInsertRowid });
    } catch (e) {
      res.status(400).json({ success: false, error: "Email already exists" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    if (user) {
      res.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
    } else {
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  });

  // Booking Endpoints
  app.post("/api/bookings", (req, res) => {
    const { userId, type, details } = req.body;
    console.log(`Creating booking for user ${userId}, type ${type}`);
    try {
      const stmt = db.prepare("INSERT INTO bookings (user_id, type, details) VALUES (?, ?, ?)");
      const info = stmt.run(userId, type, JSON.stringify(details));
      console.log(`Booking created with ID ${info.lastInsertRowid}`);
      res.json({ success: true, bookingId: info.lastInsertRowid });
    } catch (err) {
      console.error("Error creating booking:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  });

  app.get("/api/bookings/:userId", (req, res) => {
    console.log(`Fetching bookings for user ${req.params.userId}`);
    const bookings = db.prepare("SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC").all(Number(req.params.userId));
    console.log(`Found ${bookings.length} bookings`);
    res.json(bookings.map((b: any) => ({ ...b, details: JSON.parse(b.details) })));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
