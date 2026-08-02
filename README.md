# 🚗 TravelBuddy — Complete Campus & Corporate Commute, Carpooling, Auto Share & Trip Planning Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-indigo.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4.svg)](https://tailwindcss.com/)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-blue.svg)](https://cloudinary.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Vite%20Build-Passing%20(100%25)-emerald.svg)](https://vitejs.dev/)

---

## 📌 Executive Summary

**TravelBuddy** is a comprehensive, production-grade MERN Stack web application designed to transform daily commuting and weekend travel for college students (e.g. PCCOER, COEP) and corporate employees (e.g. Infosys, TCS). 

By combining **Core Carpooling & Bike Pooling**, **Auto Rickshaw & Cab Fare Splitting**, **Intermediate Stop Pro-Rated Pricing**, **100-Point Trust Engine**, **Bi-Directional Reputation Ratings**, **Real-Time Eco Carbon Tracking**, **Group Trip Expense Splitting**, **Destination Catalog**, **Community Social Feed**, and an **Executive System Admin Operations Console**, TravelBuddy provides an all-in-one ecosystem for safe, affordable, and eco-friendly transportation.

---

## 📋 Table of Contents

1. [Executive Summary](#-executive-summary)
2. [Complete Project Feature Directory (All 13 Modules)](#-complete-project-feature-directory-all-13-modules)
   - [Module 1: User Auth, Profile Management & Avatar Upload](#module-1-user-auth-profile-management--avatar-upload)
   - [Module 2: Core Carpool & Bike Pooling Engine](#module-2-core-carpool--bike-pooling-engine)
   - [Module 3: Auto Rickshaw & Cab Fare Splitter](#module-3-auto-rickshaw--cab-fare-splitter)
   - [Module 4: Intermediate Stop Pro-Rated Pricing Math](#module-4-intermediate-stop-pro-rated-pricing-math)
   - [Module 5: 100-Point Trust Score & Badge Engine](#module-5-100-point-trust-score--badge-engine)
   - [Module 6: Bi-Directional Rating System & Single-Rating Guard](#module-6-bi-directional-rating-system--single-rating-guard)
   - [Module 7: Dynamic Real-Time Eco Metrics & Carbon Tracker](#module-7-dynamic-real-time-eco-metrics--carbon-tracker)
   - [Module 8: Trip Planner & Group Expense Splitter](#module-8-trip-planner--group-expense-splitter)
   - [Module 9: Destination Discovery & Travel Catalog](#module-9-destination-discovery--travel-catalog)
   - [Module 10: Community Feed & Social Travel Stories](#module-10-community-feed--social-travel-stories)
   - [Module 11: Real-Time System Notifications](#module-11-real-time-system-notifications)
   - [Module 12: Executive System Admin Operations Console](#module-12-executive-system-admin-operations-console)
   - [Module 13: Executive Sunset Indigo UI & Mobile Responsiveness](#module-13-executive-sunset-indigo-ui--mobile-responsiveness)
3. [Algorithmic & Mathematical Foundations](#-algorithmic--mathematical-foundations)
4. [Technology Stack](#-technology-stack)
5. [Complete Repository & Code Structure](#-complete-repository--code-structure)
6. [Complete REST API Reference](#-complete-rest-api-reference)
7. [Database Schemas & Models](#-database-schemas--models)
8. [Local Installation & Running Guide](#-local-installation--running-guide)
9. [Default Test Credentials](#-default-test-credentials)
10. [How to Push Updates to GitHub](#-how-to-push-updates-to-github)
11. [Deployment Instructions (Vercel & Render)](#-deployment-instructions-vercel--render)

---

## 🌟 Complete Project Feature Directory (All 13 Modules)

### Module 1: User Auth, Profile Management & Avatar Upload
- **JWT Authentication & Bcrypt Hashing**: Secure user registration and login with salt-hashed passwords and 30-day JWT sessions.
- **Campus & Corporate Organization Tagging**: Users tag their college or workplace (e.g. `PCCOER`, `Infosys`, `COEP`, `TCS`, `General Commuter`) for verified community commuting.
- **Gender Selection & Avatar Management**: Gender selection (`Male`, `Female`, `Other`) with automatic gender-appropriate default avatars.
- **Device Photo File Upload**: Upload custom profile photos directly from local device (`JPEG/PNG`) via Multer memory buffer and Cloudinary SDK integration (`POST /api/auth/upload-avatar`).
- **Vehicle Profile Registration**: Register vehicle details (Make/Model, License Plate, Vehicle Type: Car, Bike, Scooter, Auto Share, Cab Share, Seat Capacity).

### Module 2: Core Carpool & Bike Pooling Engine
- **Offer a Ride**: Drivers can offer empty seats in cars (Honda City, RE Meteor 350) or bikes by defining departure time, date, total seats, full route price, and ordered intermediate route stops.
- **Search & Filter Engine**: Commuters search rides by Pickup Stop, Drop Stop, Date, Community/Organization, Vehicle Type, or sort by Price and Trust Rating.
- **Index-Based Route Stop Order Algorithm**: Validates that both pickup and drop stops exist in the route array and enforces `pickupIndex < dropIndex`.
- **Available Seat Tracking**: Dynamically updates available seats when requests are accepted and automatically updates status to `'filled'` when capacity is reached.

### Module 3: Auto Rickshaw & Cab Fare Splitter
- **Solo Commute Cost Sharing**: Commuters taking an Auto Rickshaw or Uber/Ola cab alone can post a fare split (e.g. *"Station to PCCOER campus — splitting ₹90 fare with 2 commuters"*).
- **Vehicle Type Options**: Dedicated `🛺 Auto Share` and `🚕 Cab Share` options in the ride offer form.
- **Visual Callouts**: Features distinct visual badges on ride cards for quick identification in search listings.

### Module 4: Intermediate Stop Pro-Rated Pricing Math
- **Proportional Price Calculation**: Calculates price based on the exact route legs traveled ($N-1$ total legs) rather than charging the full route price:
  $$\text{Passenger Price} = (\text{Drop Index} - \text{Pickup Index}) \times \frac{\text{Full Route Price}}{\text{Total Route Legs}}$$
- **Live Seat Booking Price Preview**: `RideDetails.jsx` calculates and displays the exact pro-rated leg contribution in real-time as pickup and drop stops are selected.

### Module 5: 100-Point Trust Score & Badge Engine
- **Transparent 4-Factor Trust Engine**: Evaluates commuter trustworthiness on a 0–100 scale:
  - **40% Rating Weight**: Average rating from reviews ($1.0$ to $5.0$).
  - **30% Completion Rate**: Ratio of completed rides to total rides.
  - **20% Low Cancellation Rate**: Ratio of non-cancelled rides.
  - **10% Review Volume**: Bonus based on review count ($\min(10, \text{Reviews} \times 2)$).
- **Verified Baseline**: New verified commuters start with a fair baseline score of **85/100**.
- **Automated Community Badges**: Awards badges (`Verified Commuter`, `Super Driver`, `Eco Warrior`, `Top Rated`) automatically upon meeting metric milestones.

### Module 6: Bi-Directional Rating System & Single-Rating Guard
- **Bi-Directional Commuter Feedback**:
  - Passengers rate Drivers upon ride completion.
  - Drivers rate Passengers upon ride completion.
- **Single-Submission Rating Protection**: Backend verifies `Review.findOne({ ride, reviewer, reviewee })` to prevent duplicate reviews. Frontend replaces rating buttons with a green **`✓ Rating Submitted`** badge.

### Module 7: Dynamic Real-Time Eco Metrics & Carbon Tracker
- **Automatic Metric Updates**: Completing a ride automatically increments:
  - **Completed Rides**: $+1$
  - **Carbon Saved**: $+2.5 \text{ kg CO}_2$
  - **Reward Points**: $+25 \text{ pts}$
- **Database Query Driven**: 100% MongoDB database query driven — zero dummy data or hardcoded numbers.

### Module 8: Trip Planner & Group Expense Splitter
- **Group Trip Creation**: Create trip itineraries with destination, start/end dates, budget, and members.
- **Expense Splitter**: Add shared trip expenses (fuel, food, toll, stay) and split costs evenly among members.

### Module 9: Destination Discovery & Travel Catalog
- **Curated Travel Destinations**: Explore weekend getaways (Mahabaleshwar, Goa, Lonavala, Udaipur) with descriptions, best times to visit, estimated budget, and popular attractions.
- **Image Fallback Handling**: Built-in `onError` fallback handlers ensure images render reliably.

### Module 10: Community Feed & Social Travel Stories
- **Social Sharing**: Share travel photos, monsoon trek stories, and carpooling tips.
- **Interactive Engagement**: Like counters and comment thread discussion system.

### Module 11: Real-Time System Notifications
- **Alert Notifications**: Instant alerts for seat requests, acceptance, ride completion, and review submissions.
- **Notification Center**: Notification drawer with mark all as read capability.

### Module 12: Executive System Admin Operations Console
- **Admin Dashboard (`/admin`)**: Accessible exclusively to `admin@travelbuddy.com`.
- **Interactive SVG Data Charts**:
  - **Monthly Ride Volume Bar Chart** (Active vs Completed).
  - **Campus Network Donut Chart** (PCCOER, Infosys, COEP, TCS).
  - **Cumulative Carbon Savings Growth Line Chart**.
- **User Moderation Table**: Role auditing, Trust Score display, and account deletion.
- **Global Ride Postings Operations Table**: View and remove ride postings.

### Module 13: Executive Sunset Indigo UI & Mobile Responsiveness
- **Executive Styling System**: Slate Charcoal (`#0f172a`) & Indigo Accent (`#4338ca`) design tokens.
- **Mobile Hamburger Drawer Menu**: Mobile navigation drawer (`lg:hidden`) for smartphones and tablets.
- **Touch-Friendly Horizontal Scrolling**: Touch scrolling for route timelines, data tables, and notifications.

---

## 🧮 Algorithmic & Mathematical Foundations

### 1. Intermediate Stop Pro-Rated Pricing Formula
For a route with $N$ ordered stops `[Stop 0, Stop 1, Stop 2, ..., Stop N-1]`:
$$\text{Total Route Legs} = N - 1$$

$$\text{Price Per Leg} = \frac{\text{Full Route Price}}{\text{Total Route Legs}}$$

$$\text{Passenger Price Per Seat} = (\text{Drop Index} - \text{Pickup Index}) \times \text{Price Per Leg}$$

$$\text{Total Contribution} = \text{Passenger Price Per Seat} \times \text{Seats Requested}$$

### 2. Trust Score Engine Formula (0 to 100)
$$\text{Trust Score} = \left(\frac{\text{Rating}}{5} \times 40\right) + \left(\frac{\text{Completed}}{\text{Total}} \times 30\right) + \left[\left(1 - \frac{\text{Cancelled}}{\text{Total}}\right) \times 20\right] + \min(10, \text{Reviews} \times 2)$$

---

## 🛠️ Technology Stack

| Layer | Technology Used |
| :--- | :--- |
| **Frontend Core** | React 18 (Vite SPA), Hooks, Context API |
| **Styling** | TailwindCSS, Executive Slate Charcoal & Indigo Palette |
| **Icons** | Lucide React |
| **Backend Core** | Node.js & Express.js (REST API Architecture) |
| **Database** | MongoDB & Mongoose (ODM with local fallback connection) |
| **Authentication** | JWT (JSON Web Tokens) & Bcrypt.js password hashing |
| **File Storage** | Cloudinary SDK & Multer memory storage |

---

## 📁 Complete Repository & Code Structure

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

## 🚀 Local Installation & Running Guide

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

Create `.env` file in `backend/`:
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

### 3. Setup & Run Frontend
Open a new terminal tab:
```bash
cd frontend
npm install
npm run dev
```

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

Execute these commands in your terminal inside the project directory:

```bash
# 1. Check changed files
git status

# 2. Stage all updated files
git add .

# 3. Commit changes
git commit -m "Updated README with complete 13-module project documentation"

# 4. Push to GitHub main branch
git push origin main
```

---

## ☁️ Deployment Instructions (Vercel & Render)

- **Frontend (Vercel)**: Set root to `frontend`, build command `npm run build`, output directory `dist`.
- **Backend (Render)**: Set root to `backend`, build command `npm install`, start command `node server.js`.

---

## 📜 License
This project is open-source and available under the **MIT License**.
