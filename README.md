# Authentication System Project

A full-stack authentication system built with a React frontend and Node.js/Express backend. This project features a highly secure, scalable, and fully functional authentication portal from scratch with modern Cyberpunk/Glassmorphism aesthetics.

## Project Presentation (PPT Outline)

Use the following slide notes to build your PowerPoint or Google Slides deck:

### Slide 1: Title Slide
- **Title:** Secure End-to-End Authentication System
- **Subtitle:** Built with React, Node.js, and SQLite

### Slide 2: What We Built
- **Objective:** To create a highly secure, scalable, and fully functional authentication portal from scratch.
- **Problem Solved:** Managing user identities, securely storing passwords, and providing seamless access.
- **Outcome:** A robust web app featuring Registration, Login, and Protected Profile views.

### Slide 3: Technology Stack
- **Frontend (UI):** React.js (Vite) with custom creative CSS (Glassmorphism & animations).
- **Backend (API):** Node.js & Express routing system.
- **Database:** SQLite3 for lightweight, native relational data tracking.

### Slide 4: Key Features
1. **Email & Password Auth:** Full registration & login flow.
2. **Google OAuth 2.0:** "Continue with Google" integration for friction-less sign-ups.
3. **Forgot Password:** Secure mock integration using `Nodemailer`.
4. **Protected Routes:** Profiles are strictly locked behind client-side route guards and JWT verification.

### Slide 5: System Architecture & Data Flow
- **Client Request:** React sends credentials via API requests.
- **Processing:** The Express server checks the SQLite database using `bcrypt`.
- **Token Generation:** Upon success, a JSON Web Token (JWT) is minted and sent back.
- **Storage:** React stores the JWT locally and attaches it to the `Authorization` header for all future requests to access the `/profile` dashboard.

### Slide 6: Implemented Security Measures
- **Password Hashing:** `bcrypt` ensures passwords are never stored in plain-text.
- **Stateless Tokens:** JWT simplifies session authenticity without server-side memory bottlenecks.
- **OAuth Validation:** `google-auth-library` to securely verify Google IDs.
- **CORS Protection:** Configured cross-origin resource sharing securely.

---

## How to Run the Project Locally

### 1. Backend (Node.js)
Open a terminal and run the following commands:
```bash
cd backend-node
npm install
npm start
```
*The API will run on http://localhost:8001*

### 2. Frontend (React)
Open a second terminal and run the following commands:
```bash
cd frontend
npm install
npm run dev
```
*The web app will be available at http://localhost:5175 (or 5173).*
