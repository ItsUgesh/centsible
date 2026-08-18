# 💰 Centsible — Personal Finance Tracker

<div align="center">

[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

**Track income. Control spending. Build wealth.**

[🌐 Live Demo](https://centsible.uk) · [🐛 Report Bug](https://github.com/ItsUgesh/centsible/issues) · [✨ Request Feature](https://github.com/ItsUgesh/centsible/issues) · [👤 Author Portfolio](https://www.ugeshsimkhada.com.np/)

</div>

---

## 📸 Preview

> A clean, modern finance tracker with real-time charts, smart spending predictions, and a fully responsive UI — built from scratch with a React frontend and a Node.js + PostgreSQL backend.

---

## ✨ Features

- 📊 **Visual Dashboard** — Monthly bar chart, spending breakdown donut chart, and a predicted next-month spend card
- 💳 **Transaction Management** — Add, edit, delete transactions with custom categories and emoji picker
- 🔐 **Authentication** — Email/password signup with email verification + Google OAuth
- 📧 **Email Verification** — Powered by [Resend](https://resend.com) — spam-filter safe
- 🔑 **JWT Security** — Tokens stored in `httpOnly` cookies, never exposed to JavaScript
- 🛡️ **Input Validation** — Every endpoint protected with [Zod](https://zod.dev) schemas
- ⚡ **Rate Limiting** — Brute-force protection on login (10 attempts / 15 min)
- 📱 **Fully Responsive** — Desktop sidebar + mobile bottom tab bar
- 🎨 **Premium UI** — Space Grotesk typography, emerald gradient palette, smooth animations

---

## 🧰 Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 18 + Vite | UI framework and dev server |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Recharts | Bar and donut charts |
| Axios | HTTP client with cookie support |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| Prisma ORM | Type-safe database access |
| PostgreSQL | Relational database |
| bcryptjs | Password hashing |
| JSON Web Tokens | Stateless authentication |
| Passport.js | Google OAuth 2.0 |
| Resend | Transactional email |
| Zod | Schema validation |
| express-rate-limit | API rate limiting |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18+
- [PostgreSQL](https://www.postgresql.org) v14+ running locally
- A [Resend](https://resend.com) account (free tier) for emails
- A [Google Cloud](https://console.cloud.google.com) project with OAuth 2.0 credentials

### 1. Clone the repository

```bash
git clone https://github.com/ItsUgesh/centsible.git
cd centsible
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/centsible"
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Resend (email verification)
RESEND_API_KEY=your-resend-api-key
```

Run Prisma migrations and seed default categories:

```bash
npx prisma migrate dev
npm run seed
```

Start the backend:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`

---

## 📁 Project Structure

```
centsible/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── seed.js              # Default categories seed
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js            # Prisma client
│   │   │   └── passport.js      # Google OAuth strategy
│   │   ├── controllers/         # Route handler logic
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT guard
│   │   │   └── validate.js      # Zod validation middleware
│   │   ├── routes/              # Express routers
│   │   └── services/
│   │       └── emailService.js  # Resend email templates
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Layout.jsx        # Sidebar + bottom nav wrapper
        │   ├── Logo.jsx          # SVG logo with unique gradient IDs
        │   ├── Sidebar.jsx       # Desktop navigation
        │   ├── BottomNav.jsx     # Mobile tab bar
        │   └── PrivateRoute.jsx  # Auth guard HOC
        ├── context/
        │   └── AuthContext.jsx   # Global auth state
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── CheckEmail.jsx
        │   ├── VerifyEmail.jsx
        │   ├── Dashboard.jsx
        │   ├── Transactions.jsx
        │   └── Settings.jsx
        └── services/
            └── api.js            # Axios instance
```

---

## 🔐 Security

- Passwords hashed with **bcrypt** (salt rounds: 10) — never stored plain text
- JWTs in **httpOnly cookies** — inaccessible to JavaScript/XSS
- All endpoints validated with **Zod** schemas
- Login **rate limited** to prevent brute-force attacks
- Email verification tokens expire after **24 hours**
- Google OAuth users auto-verified (Google already verified their email)

---

## 🤝 Contributing

Contributions are welcome and appreciated! Whether it's a bug fix, a new feature, or a UI improvement — all help is valued.

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

---

## 👤 Author

**Ugesh Simkhada**

- 🌐 Portfolio: [ugeshsimkhada.com.np](https://www.ugeshsimkhada.com.np/)
- 🐙 GitHub: [@ItsUgesh](https://github.com/ItsUgesh)

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE) — free to use, fork, and build on.

---

<div align="center">
  Made with ❤️ and way too much coffee ☕
</div>