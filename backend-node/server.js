require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const db = require('./database');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 8001;
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

app.use(cors({
  origin: /^http:\/\/localhost:\d+$/,
  credentials: true
}));
app.use(express.json());

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).json({ detail: "Could not validate credentials" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ detail: "Could not validate credentials" });
    req.user = user;
    next();
  });
};

app.post('/register', async (req, res) => {
  const { name, email, phone, password, confirm_password } = req.body;
  if (password !== confirm_password) {
    return res.status(400).json({ detail: "Passwords do not match" });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) return res.status(500).json({ detail: "Database error" });
    if (row) return res.status(400).json({ detail: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (name, email, phone, hashed_password) VALUES (?, ?, ?, ?)',
      [name, email, phone, hashedPassword],
      function(err) {
        if (err) return res.status(500).json({ detail: "Database error" });
        res.json({ id: this.lastID, name, email, phone });
      }
    );
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ detail: "Database error" });
    if (!user || !user.hashed_password) return res.status(400).json({ detail: "Incorrect email or password" });

    const match = await bcrypt.compare(password, user.hashed_password);
    if (!match) return res.status(400).json({ detail: "Incorrect email or password" });

    const token = jwt.sign({ sub: user.email, email: user.email }, SECRET_KEY, { expiresIn: '30m' });
    res.json({ access_token: token, token_type: "bearer" });
  });
});

app.post('/google-login', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { email, name, sub: google_id } = payload;

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
      if (err) return res.status(500).json({ detail: "Database error" });
      
      if (!user) {
        db.run(
          'INSERT INTO users (name, email, google_id) VALUES (?, ?, ?)',
          [name, email, google_id],
          function(err) {
            if (err) return res.status(500).json({ detail: "Database error" });
            const accessToken = jwt.sign({ sub: email, email }, SECRET_KEY, { expiresIn: '30m' });
            return res.json({ access_token: accessToken, token_type: "bearer" });
          }
        );
      } else {
        const accessToken = jwt.sign({ sub: user.email, email: user.email }, SECRET_KEY, { expiresIn: '30m' });
        return res.json({ access_token: accessToken, token_type: "bearer" });
      }
    });
  } catch (error) {
    res.status(400).json({ detail: "Invalid Google token" });
  }
});

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (user) {
      const resetLink = "http://localhost:5173/reset-password?token=PLACEHOLDER_TOKEN";
      
      // SMTP configuration using Nodemailer (Node.js equivalent of aiosmtplib)
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: process.env.SMTP_PORT,
        secure: false, 
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      console.log(`--- MOCK EMAIL SENT ---`);
      console.log(`To: ${email}\nLink: ${resetLink}\n-----------------------`);
      
      // try {
      //   await transporter.sendMail({
      //     from: process.env.SMTP_USERNAME,
      //     to: email,
      //     subject: "Password Reset Request",
      //     text: `You requested a password reset. Click this link to reset your password:\n\n${resetLink}`,
      //   });
      // } catch (e) {
      //   console.error("Failed to send email", e);
      // }
    }
    res.json({ message: "If that email is in our system, we have sent a password reset link." });
  });
});

app.get('/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, name, email, phone FROM users WHERE email = ?', [req.user.email], (err, user) => {
    if (err || !user) return res.status(404).json({ detail: "User not found" });
    res.json(user);
  });
});

app.listen(PORT, () => {
  console.log(`Authentication API (Node.js) running on http://localhost:${PORT}`);
});
