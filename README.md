# 🚗 TravelBuddy — Smart Ride Sharing, Fare Splitter & Travel Companion

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-indigo.svg)](https://react.dev/)
[![Gemini API](https://img.shields.io/badge/AI-Google%20Gemini-8E75C4.svg)](https://ai.google.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4.svg)](https://tailwindcss.com/)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-blue.svg)](https://cloudinary.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **TravelBuddy** is a smart, eco-friendly carpooling, ride sharing, and travel planning web application built for college students and working professionals. Whether you are riding a bike, driving a car, or taking an auto/cab, TravelBuddy helps you connect with fellow commuters to share rides, split fare costs, plan group trips, and reduce carbon emissions.

---

## 💡 What is TravelBuddy? (Core Motto)

The core idea of **TravelBuddy** is simple:
- **Going somewhere on a Bike or Car?** Post your route and time, and let a fellow commuter join you to share the journey and fuel expense.
- **Looking for a ride?** Search for commuters travelling on your route, pick your stops, and join them seamlessly!

As the platform grew, we added powerful real-world features like **AI-powered itinerary generation with Google Gemini**, **Auto & Ola/Uber fare splitting**, **intermediate stop pricing**, **trust ratings**, **group trip planning**, and **community story sharing**.

---

## ✨ Features of TravelBuddy

### 1. 🤖 AI-Powered Trip Itinerary & Budget Planning (Google Gemini API)
- **Smart Day-by-Day Itineraries**: Enter your destination, trip duration, target budget, traveler count, and travel style (Balanced, Backpacker, Adventure, Leisure) to instantly generate realistic, structured daily schedules with morning, afternoon, and evening recommendations.
- **Visual Budget Allocation Breakdown**: Automatically breaks down and estimates total and per-person costs across Stay (40%), Food (25%), Transport (20%), Activities (10%), and Emergency buffer (5%).
- **Smart Peer Commute & Transit Tips**: Provides intelligent recommendations on vehicle sharing, cab splits, and route stops from major railway stations or transit hubs to optimize travel costs.
- **Packing Essentials**: Curates targeted packing checklists customized for the specific destination, season, and activity type.
- **1-Click Trip Saving**: Instantly convert any generated AI plan into an active trip in TravelBuddy with complete member expense tracking.

### 2. 🏍️ Bike Pooling & 🚗 Carpooling
- **Offer a Ride**: Going on a bike or car? Post your route (source to destination), date, time, available seats, and price per seat.
- **Find a Ride**: Search for rides by pickup location, drop location, date, vehicle type, and community (college or company).
- **Route Stop Matching**: Match commuters along ordered intermediate route stops automatically.

### 3. 🛺 Auto Rickshaw & Cab (Ola/Uber) Fare Splitter
- Travelling alone in an Auto Rickshaw or booking an Ola/Uber cab?
- Post an **Auto Share** or **Cab Share** post to invite 2 or 3 colleagues/students to join you and split the total fare equally.

### 4. 🧮 Intermediate Stop Price Breakdown
- Joining a ride midway? You don't have to pay for the full route!
- TravelBuddy automatically breaks down and pro-rates the seat price based on the exact stops you travel.

### 5. 🛡️ 100-Point Trust Score & Bi-Directional Ratings
- **Fair Baseline**: All verified new users start with an acceptable default Trust Score of **85/100**.
- **Two-Way Ratings**: Drivers can rate Passengers, and Passengers can rate Drivers.
- **Single-Rating Rule**: Once a rating is given for a completed ride, the option locks to `✓ Rating Submitted` to prevent duplicate entries.

### 6. 🌱 Real-Time Carbon Savings & Rewards
- Track your environmental impact! Each completed ride dynamically adds **+2.5 kg CO₂ saved** and awards **+25 reward points**.
- Zero dummy data — all metrics update live directly from the database.

### 7. 📄 Trip Planner & Group Expense Splitter
- Planning a weekend getaway with friends to Lonavala, Mahabaleshwar, or Goa?
- Create group trips, set budgets, log shared expenses (fuel, food, stay), and split costs evenly among members.

### 8. 🏖️ Destination Discovery
- Explore popular travel destinations with high-resolution photos, best times to visit, estimated budgets, and top attractions.

### 9. 💬 Community Story Feed
- Share travel stories, photos, and monsoon trek experiences with the community.
- Like posts and discuss in comment threads.

### 10. 🖼️ Custom Profile Photo Uploads
- Select gender (`Male`, `Female`, `Other`) with smart default avatars, or upload your custom profile photo directly from your device using Cloudinary.

### 11. 📊 System Admin Dashboard
- Dedicated Admin Dashboard (`admin@travelbuddy.com`) with graphical SVG charts (Monthly Ride Volume, Campus Share, Carbon Growth) and user moderation controls.

### 12. 📱 Mobile Responsive & Modern Executive UI
- Clean, professional multi-color design with vertical sidebar navigation, zero intrusive emojis in the application UI, and a responsive mobile drawer.

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), TailwindCSS, Lucide Icons, Axios
- **Backend**: Node.js, Express.js (REST API)
- **AI & LLM**: Google Gemini API (`@google/generative-ai`)
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt password hashing
- **Media Uploads**: Cloudinary SDK & Multer

---

## 📁 Project Structure

```text
TravelBuddy/
├── backend/
│   ├── config/          # MongoDB connection & fallback setup
│   ├── controllers/     # Auth, Ride, Request, Trip, Expense, Review, Admin logic
│   ├── models/          # MongoDB Schemas (User, RidePost, RideRequest, Trip, etc.)
│   ├── routes/          # Express API routes
│   ├── services/        # Google Gemini AI trip itinerary & budget service
│   ├── utils/           # Trust Score, Cloudinary, Seed script
│   └── server.js        # Main backend server
├── frontend/
│   ├── src/
│   │   ├── components/  # Sidebar, ProtectedRoute, RideCard, RouteStopsTimeline
│   │   ├── context/     # AuthContext (JWT session management)
│   │   ├── pages/       # Home, FindRides, OfferRide, TripPlanner, Dashboard, Profile, etc.
│   │   └── services/    # Axios API client with 401 interceptor
│   └── tailwind.config.js
├── docs/                # Project viva guide & interview prep docs
└── README.md
```

---

## 🚀 How to Run TravelBuddy Locally

### 1. Clone the Repository
```bash
git clone https://github.com/Shantanu01B/TravelBuddy.git
cd TravelBuddy
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/travelbuddy
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Start Backend Server
```bash
cd backend
npm install
npm run dev
```
*(Backend runs on `http://localhost:5000`)*

### 4. Start Frontend App
Open a new terminal tab:
```bash
cd frontend
npm install
npm run dev
```
*(Frontend runs on `http://localhost:3000` or `http://localhost:3001`)*

---

## 🔑 Default Login Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Admin** | `admin@travelbuddy.com` | `password123` |
| **Driver (Rahul)** | `rahul@pccoer.edu.in` | `password123` |
| **Passenger (Ananya)** | `ananya@infosys.com` | `password123` |

---

## 📜 License
This project is open-source and available under the **MIT License**.
