<div align="center">

<h1>HealthTracker</h1>

<strong>AI-Powered Fitness & Health Tracking Platform</strong>

<br/><br/>

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](#)

> A full-stack MERN application that leverages Google's Gemini AI to generate highly personalized fitness routines and diet plans, complete with progress tracking and a resilient backend architecture.

</div>

---

# 🚀 Overview

HealthTracker is a comprehensive fitness application designed to help users achieve their health goals. By integrating Google's Gemini AI, the platform generates dynamic workout schedules and diet charts based on individual user profiles. It features a highly resilient backend that gracefully handles API rate limits, interactive charts for progress tracking, and a secure admin dashboard.

# ✨ Key Features

## 🧠 Personalized AI Plans

- Dynamic generation of structured workout routines.
- AI-powered calorie-matched diet plans.
- Supports Gym, Home Workout, Yoga, and more.
- Uses Gemini AI JSON output for reliable data storage.

## 📈 Progress Tracking & Analytics

- Daily weight tracking.
- Calorie intake monitoring.
- Sleep tracking.
- Water consumption tracking.
- Interactive charts using Recharts.

## 👑 Admin Dashboard

- Role-Based Access Control (RBAC).
- Admin-only protected routes.
- User statistics and analytics.
- Generated plan monitoring.

## 💬 Integrated AI Assistant

- Built-in fitness chatbot.
- Context-aware responses.
- Personalized fitness and nutrition guidance.

## 🛡️ Resilient Backend Architecture

- Custom asynchronous retry logic.
- Handles API rate limits (429) and server overloads (503).
- Prevents backend crashes with graceful error handling.
- Provides clean user feedback during failures.


# 🛠️ Technology Stack

### Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Recharts
- Lucide React

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### AI Integration
- Google Gemini 2.5 Flash
- Google Generative AI SDK

### Security
- Bcrypt.js
- JWT Authentication

---

# 💻 Local Setup & Installation

## 1. Prerequisites

- Node.js (v18+)
- MongoDB Atlas Account
- Gemini API Key

## 2. Clone Repository

```bash
git clone https://github.com/prince00795/health_tracker.git
cd health_tracker
```

## 3. Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## 4. Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

## 5. Run Application

### Backend

```bash
npm run server
```

### Frontend

```bash
npm start
```

---

# 📊 Core Functionalities

- User Authentication
- AI Workout Plan Generation
- AI Diet Plan Generation
- Progress Tracking
- Analytics Dashboard
- Admin Panel
- Fitness Chat Assistant
- Secure Password Storage

---

# 🔮 Future Improvements

- Workout Reminder Notifications
- Mobile Application
- Wearable Device Integration
- Social Fitness Community
- Advanced Health Analytics

---

# 👨‍💻 Author

Prince Raj

Built with ❤️ using the MERN Stack and Google Gemini AI.