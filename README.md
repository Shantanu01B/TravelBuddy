# 🚗 TravelBuddy — Peer-to-Peer Campus & Corporate Carpooling, Auto Share & Expense Splitter

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-indigo.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4.svg)](https://tailwindcss.com/)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-blue.svg)](https://cloudinary.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Vite%20Build-Passing%20(100%25)-emerald.svg)](https://vitejs.dev/)

> **TravelBuddy** is a production-grade, full-stack MERN web application engineered for college students (e.g., PCCOER, COEP) and corporate employees (e.g., Infosys, TCS). It solves urban commute challenges by enabling peer-to-peer carpooling, bike pooling, Auto Rickshaw and cab fare splitting along intermediate route stops, transparent 100-point trust scoring, real-time carbon tracking, and group trip expense splitting.

---

## 📋 Table of Contents
1. [Key Features Overview](#-key-features-overview)
2. [Detailed Feature Breakdown](#-detailed-feature-breakdown)
3. [Algorithmic & Mathematical Models](#-algorithmic--mathematical-models)
4. [Technology Stack](#-technology-stack)
5. [System Architecture & Directory Structure](#-system-architecture--directory-structure)
6. [Complete REST API Reference](#-complete-rest-api-reference)
7. [Database Models & Schemas](#-database-models--schemas)
8. [Local Installation & Setup Guide](#-local-installation--setup-guide)
9. [Default Test Credentials](#-default-test-credentials)
10. [How to Push Updates to GitHub](#-how-to-push-updates-to-github)
11. [Deployment Guide (Vercel & Render)](#-deployment-guide-vercel--render)
12. [Offline Viva & Interview Documentation](#-offline-viva--interview-documentation)

---

## 🌟 Key Features Overview

| Feature Category | Description |
| :--- | :--- |
| **🛺 Auto & Cab Fare Split** | Post Auto Rickshaw or Uber/Ola cab splits to share fare with 2-3 commuters. |
| **🧮 Pro-Rated Stop Pricing** | Route leg pricing math ($N-1$ legs) prevents overcharging intermediate commuters. |
| **🛡️ 100-Pt Trust Engine** | Transparent 4-factor formula (Rating, Completion, Low Cancellation, Reviews). |
| **🔄 Bi-Directional Ratings** | Drivers rate Passengers & Passengers rate Drivers with single-submission protection. |
| **📊 Executive Admin Console** | Dedicated operations dashboard featuring interactive SVG data charts & moderation. |
| **📷 Device Photo Uploads** | Profile photo uploads powered by Multer & Cloudinary with gender defaults. |
| **🌱 Real-Time Carbon Metrics** | Dynamic calculation (+2.5 kg CO₂ saved & +25 pts per completed ride). Zero dummy data. |
| **📄 Trip Expense Splitter** | Group trip planning to destinations (Lonavala, Mahabaleshwar) with cost breakdown. |
| **💬 Community Feed** | Social travel story sharing, likes, and comment threads. |
| **📱 Mobile Responsive UI** | Executive Obsidian/Indigo design with mobile hamburger menu drawer & touch scroll. |

---

## 🔍 Detailed Feature Breakdown

### 1. 🚗 Carpool & Bike Pooling Engine
- **Offer a Ride**: Drivers list vehicle details (Honda City, RE Meteor 350, Scooter, or Auto/Cab Split), travel date, departure time, total seats, full route price, and ordered route stops.
- **Search & Filters**: Search rides by Pickup Stop, Drop Stop, Date, Community/Organization (PCCOER, Infosys, COEP, TCS), and Vehicle Type.
- **Index-Based Route Stop Matching**: Route matching algorithm validates that both pickup and drop stops exist in the route array and enforces `pickupIndex < dropIndex`.

### 2. 🛺 Auto Rickshaw & Cab Fare Splitter
- Designed for commuters booking an Auto Rickshaw or Uber/Ola cab alone.
- Option to select `🛺 Auto Share` or `🚕 Cab Share` in the offer ride form.
- Post details such as: *"Booking Auto from Chinchwad Station to PCCOER — need 2 commuters to split ₹90 fare (₹30/person)"*.
- Features dedicated visual callout badges on ride cards.

### 3. 🛡️ 100-Point Transparent Trust Score & Reputation System
- Calculates trust transparently based on 4 weighted components:
  - **40% Rating**: Average rating ($1.0$ to $5.0$).
  - **30% Completion Rate**: Ratio of completed rides to total rides.
  - **20% Low Cancellation Rate**: Ratio of non-cancelled rides.
  - **10% Review Volume**: Bonus based on review count ($\min(10, \text{Reviews} \times 2)$).
- **Verified Baseline**: New verified commuters start with a respectable score of **85/100**.
- **Automated Badges**: Awards badges like `Verified Commuter`, `Super Driver`, `Eco Warrior`, and `Top Rated`.

### 4. 🔄 Bi-Directional Rating & Single-Submission Guard
- **Passenger ↔ Driver Reviews**:
  - Passengers rate Drivers upon ride completion.
  - Drivers rate Passengers upon ride completion.
- **Single-Submission Enforcement**: Backend prevents duplicate rating creation (`Review.findOne({ ride, reviewer, reviewee })`). Frontend replaces rating buttons with a green **`✓ Rating Submitted`** badge after submission.

### 5. 📊 Executive System Admin Operations Console (`/admin`)
- Accessible exclusively to users with `role: 'admin'` (`admin@travelbuddy.com`).
- **Interactive SVG Data Charts**:
  - **Monthly Ride Volume Bar Chart**: Active vs Completed ride volume over time.
  - **Campus & Network Distribution Chart**: Visualizes commuter share across PCCOER, Infosys, COEP, TCS.
  - **Cumulative Carbon Savings Growth Line Chart**: Visualizes total CO₂ reduction ($\text{kg CO}_2$).
- **Moderation Tools**:
  - User Accounts Moderation Table with role auditing, Trust Score display, and account deletion.
  - Global Ride Postings Table with direct post removal capability.

### 6. 📷 Profile Photo Uploads & Gender Selector
- Direct file upload from local device (`JPEG/PNG`) via Multer memory storage and Cloudinary API (`POST /api/auth/upload-avatar`).
- Gender selection (`Male`, `Female`, `Other`) with gender-appropriate default avatars.

### 7. 🌱 Real-Time Dynamic Eco Metrics & Carbon Tracker
- Real-time MongoDB queries calculate completed rides, carbon saved ($\text{Completed Rides} \times 2.5 \text{ kg CO}_2$), and reward points (+25 pts per ride).
- Zero hardcoded or dummy historical values — 100% database query driven.

### 8. 📄 Trip Planner & Group Expense Splitter (`/trips`)
- Plan group trips to destinations like Mahabaleshwar, Goa, Lonavala, or Udaipur.
- Log group expenses (fuel, toll, food, lodging) and split costs evenly among members.

### 9. 🏖️ Destination Discovery (`/destinations`)
- Explore curated weekend getaways with high-resolution photos, best times to visit, estimated budgets, and popular attractions.
- Built-in `onError` image fallback handlers prevent broken image links.

### 10. 📱 100% Mobile Responsive & Executive Sunset/Obsidian Theme
- Executive Slate Charcoal (`#0f172a`) & Indigo Accent (`#4338ca`) design system.
- Mobile hamburger menu drawer (`lg:hidden`) for smartphones and tablets.
- Touch-friendly horizontal scrolling (`overflow-x-auto`) for route timelines and data tables.

---

## 🧮 Algorithmic & Mathematical Models

### 1. Intermediate Stop Pro-Rated Pricing Formula
For a route with $N$ ordered stops `[Stop 0, Stop 1, Stop 2, ..., Stop N-1]`:
$$\text{Total Route Legs} = N - 1$$

$$\text{Price Per Leg} = \frac{\text{Full Route Price}}{\text{Total Route Legs}}$$

$$\text{Passenger Price Per Seat} = (\text{Drop Index} - \text{Pickup Index}) \times \text{Price Per Leg}$$

$$\text{Total Contribution} = \text{Passenger Price Per Seat} \times \text{Seats Requested}$$

*Example: Route with 4 stops (3 legs), Full Price ₹90. Price per leg = ₹30. A passenger traveling 1 leg pays ₹30; traveling 2 legs pays ₹60.*

### 2. Trust Score Formula (0 to 100)
$$\text{Trust Score} = \left(\frac{\text{Rating}}{5} \times 40\right) + \left(\frac{\text{Completed}}{\text{Total}} \times 30\right) + \left[\left(1 - \frac{\text{Cancelled}}{\text{Total}}\right) \times 20\right] + \min(10, \text{Reviews} \times 2)$$

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Core** | React 18 | Vite SPA Architecture, Hooks, Context API |
| **Styling** | TailwindCSS | Executive Obsidian Slate Palette, Custom Glassmorphism |
| **Icons** | Lucide React | Modern vector icon suite |
| **Backend Core** | Node.js & Express.js | Modular RESTful API Architecture |
| **Database** | MongoDB & Mongoose | Schemas, Indexing, ODM Validation, Local Fallback |
| **Authentication** | JWT & Bcrypt.js | JSON Web Tokens with 30-day expiry & salt hashing |
| **File Storage** | Cloudinary SDK & Multer | Memory Buffer Uploads for Profile Avatars |

---

## 📁 System Architecture & Directory Structure

```text
TravelBuddy/
├── backend/
│   ├── config/
│   │   └── db.js                      # MongoDB connection & local fallback logic
│   ├── controllers/
│   │   ├── adminController.js         # System stats & moderation handlers
│   │   ├── authController.js          # Auth, Profile & Cloudinary upload handlers
│   │   ├── communityController.js     # Travel stories, likes & comments
│   │   ├── destinationController.js   # Destination catalog handlers
│   │   ├── expenseController.js       # Group trip expense splitter
│   │   ├── notificationController.js  # System alert notifications
│   │   ├── requestController.js       # Ride booking & stop pricing math
│   │   ├── reviewController.js        # Bi-directional rating handlers
│   │   ├── rideController.js          # Ride posting & route stop matching
│   │   └── tripController.js          # Group trip itinerary planner
│   ├── middleware/
│   │   ├── authMiddleware.js          # JWT authentication guard
│   │   ├── errorMiddleware.js         # Centralized error handler
│   │   └── uploadMiddleware.js        # Multer memory storage configuration
│   ├── models/
│   │   ├── Destination.js             # Travel destination schema
│   │   ├── Expense.js                 # Group expense schema
│   │   ├── Notification.js            # User notification schema
│   │   ├── Post.js                    # Community post schema
│   │   ├── Review.js                  # Bi-directional review schema
│   │   ├── RidePost.js                # Ride offer schema with routeStops
│   │   ├── RideRequest.js             # Seat booking request schema
│   │   ├── Trip.js                    # Group trip schema
│   │   └── User.js                    # User account & trust score schema
│   ├── routes/                        # Express API route modules
│   ├── utils/
│   │   ├── cleanupDuplicateReviews.js # Review cleanup utility
│   │   ├── cloudinary.js              # Cloudinary SDK configuration
│   │   ├── seed.js                    # Database seeder script
│   │   └── trustScore.js              # 100-point trust score formula
│   ├── .env                           # Environment variables
│   ├── server.js                      # Main Express server entry point
│   └── vercel.json                    # Backend Vercel serverless routing
├── frontend/
│   ├── src/
│   │   ├── components/                # Navbar, Footer, RideCard, RouteStopsTimeline, TrustScoreBadge
│   │   ├── context/                   # AuthContext global state
│   │   ├── pages/                     # Home, FindRides, OfferRide, Dashboard, Profile, Admin, etc.
│   │   ├── services/                  # Axios API instance configuration
│   │   ├── App.jsx                    # React Router configuration
│   │   ├── index.css                  # Tailwind CSS utilities
│   │   └── main.jsx                   # Vite entry point
│   ├── tailwind.config.js
│   └── vercel.json                    # Frontend SPA rewrite rules
├── docs/                              # Technical docs & viva interview guides
├── .gitignore                         # Git ignore configuration
└── README.md                          # Master documentation
```

---

## 📡 Complete REST API Reference

### Auth & Profile (`/api/auth`)
- `POST /api/auth/register` — Register a new user account with gender & vehicle info.
- `POST /api/auth/login` — Authenticate user & return JWT token.
- `GET /api/auth/profile` — Fetch current user profile with real-time dynamic metrics.
- `PUT /api/auth/profile` — Update user profile details.
- `POST /api/auth/upload-avatar` — Upload custom profile photo to Cloudinary.

### Rides (`/api/rides`)
- `POST /api/rides` — Offer a new ride or Auto/Cab fare split with ordered stops.
- `GET /api/rides/search` — Search & filter active rides by route stops, date, community, or vehicle type.
- `GET /api/rides/:id` — Get detailed info for a single ride post.
- `GET /api/rides/my-offered` — Get rides offered by the logged-in user.
- `DELETE /api/rides/:id` — Cancel / remove a ride post.

### Requests (`/api/requests`)
- `POST /api/requests` — Request a seat with pro-rated stop price calculation.
- `GET /api/requests/my-booked` — Get seat requests booked by the passenger.
- `GET /api/requests/my-requests` — Get seat requests received by the driver.
- `PUT /api/requests/:id/status` — Accept or reject a seat request.
- `PUT /api/requests/:id/complete` — Mark ride request as completed & update carbon metrics.

### Reviews (`/api/reviews`)
- `POST /api/reviews` — Submit a rating (1-5 stars) and comment for a commuter.
- `GET /api/reviews/my-submitted` — Get reviews submitted by the logged-in user.
- `GET /api/reviews/user/:userId` — Get reviews received by a specific user.

### Admin (`/api/admin`)
- `GET /api/admin/stats` — Fetch global system analytics (Users, Active Rides, Completed Rides, Carbon Saved).
- `GET /api/admin/users` — Fetch all registered user accounts.
- `GET /api/admin/rides` — Fetch all global ride postings.
- `DELETE /api/admin/users/:id` — Delete a user account.

---

## 🚀 Local Installation & Setup Guide

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/TravelBuddy.git
cd TravelBuddy
```

### 2. Setup & Run Backend
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/travelbuddy
JWT_SECRET=travelbuddy_super_secret_jwt_key_2026
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Seed database (optional):
```bash
node utils/seed.js
```

Start backend development server:
```bash
npm run dev
```
Backend will start on `http://localhost:5000`.

### 3. Setup & Run Frontend
Open a new terminal tab:
```bash
cd frontend
npm install
npm run dev
```
Frontend will start on `http://localhost:3000`.

---

## 🔑 Default Test Credentials

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **System Admin** | Admin User | `admin@travelbuddy.com` | `password123` |
| **Driver** | Rahul Sharma | `rahul@pccoer.edu.in` | `password123` |
| **Passenger** | Ananya Roy | `ananya@infosys.com` | `password123` |
| **Commuter** | Vikram Patel | `vikram@coep.ac.in` | `password123` |

---

## 📤 How to Push Updates to GitHub

Follow these exact terminal commands to push your project or any new updates to GitHub:

### 1. Check Git Status
```bash
git status
```

### 2. Stage All Changed Files
```bash
git add .
```

### 3. Commit Changes with a Message
```bash
git commit -m "Updated comprehensive README master documentation and project features"
```

### 4. Push to GitHub Main Branch
```bash
git push origin main
```

*(If setting up a remote repository for the first time)*:
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/TravelBuddy.git
git push -u origin main
```

---

## ☁️ Deployment Guide (Vercel & Render)

### Deploying Frontend on Vercel
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Build Command: `npm run build`, Output Directory: `dist`.
4. Add Environment Variable: `VITE_API_URL=https://your-backend-url.onrender.com/api`.

### Deploying Backend on Render
1. Connect your GitHub repository to [Render](https://render.com).
2. Choose **Web Service**, set Root Directory to `backend`.
3. Build Command: `npm install`, Start Command: `node server.js`.
4. Add Environment Variables (`MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`).

---

## 📄 Offline Viva & Interview Documentation

Master documentation and 35+ interview preparation questions are stored in the `docs/` directory:
- [Technical Master Document](file:///docs/PROJECT_DOCUMENTATION_MASTER.md)
- [35+ Viva & Interview Q&A Guide](file:///docs/INTERVIEW_QUESTIONS_MASTER.md)
- [Printable PDF Prep Sheet](file:///docs/PRINTABLE_INTERVIEW_PREP.html)

---

## 📜 License
This project is open-source and available under the **MIT License**.
