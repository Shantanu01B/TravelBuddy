# 🚗 TravelBuddy — Smart Ride Sharing, Fare Splitter & Travel Companion

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-indigo.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4.svg)](https://tailwindcss.com/)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-blue.svg)](https://cloudinary.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **TravelBuddy** is a smart, eco-friendly carpooling, ride sharing, and travel planning web application built for college students and working professionals. Whether you are riding a bike, driving a car, or taking an auto/cab, TravelBuddy helps you connect with fellow commuters to share rides, split fare costs, plan group trips, and reduce carbon emissions.

---

## 💡 What is TravelBuddy? (Core Motto)

The core idea of **TravelBuddy** is simple:
- **Going somewhere on a Bike or Car?** Post your route and time, and let a fellow commuter join you to share the journey and fuel expense.
- **Looking for a ride?** Search for commuters travelling on your route, pick your stops, and join them seamlessly!

As the platform grew, we added powerful real-world features like **Auto & Ola/Uber fare splitting**, **intermediate stop pricing**, **trust ratings**, **group trip planning**, and **community story sharing**.

---

## ✨ Features of TravelBuddy

### 1. 🏍️ Bike Pooling & 🚗 Carpooling
- **Offer a Ride**: Going on a bike or car? Post your route (source to destination), date, time, available seats, and price per seat.
- **Find a Ride**: Search for rides by pickup location, drop location, date, and community (college or company).
- **Route Stop Matching**: Match commuters along ordered intermediate route stops automatically.

### 2. 🛺 Auto Rickshaw & Cab (Ola/Uber) Fare Splitter
- Travelling alone in an Auto Rickshaw or booking an Ola/Uber cab?
- Post an **Auto Share** or **Cab Share** post to invite 2 or 3 colleagues/students to join you and split the total fare equally.

### 3. 🧮 Intermediate Stop Price Breakdown
- Joining a ride midway? You don't have to pay for the full route!
- TravelBuddy automatically breaks down and pro-rates the seat price based on the exact stops you travel.

### 4. 🛡️ 100-Point Trust Score & Bi-Directional Ratings
- **Fair Baseline**: All verified new users start with an acceptable default Trust Score of **85/100**.
- **Two-Way Ratings**: Drivers can rate Passengers, and Passengers can rate Drivers.
- **Single-Rating Rule**: Once a rating is given for a completed ride, the option locks to `✓ Rating Submitted` to prevent duplicate entries.

### 5. 🌱 Real-Time Carbon Savings & Rewards
- Track your environmental impact! Each completed ride dynamically adds **+2.5 kg CO₂ saved** and awards **+25 reward points**.
- Zero dummy data — all metrics update live directly from the database.

### 6. 📄 Trip Planner & Group Expense Splitter
- Planning a weekend getaway with friends to Lonavala, Mahabaleshwar, or Goa?
- Create group trips, set budgets, log shared expenses (fuel, food, stay), and split costs evenly among members.

### 7. 🏖️ Destination Discovery
- Explore popular travel destinations with high-resolution photos, best times to visit, estimated budgets, and top attractions.

### 8. 💬 Community Story Feed
- Share travel stories, photos, and monsoon trek experiences with the community.
- Like posts and discuss in comment threads.

### 9. 🖼️ Custom Profile Photo Uploads
- Select gender (`Male`, `Female`, `Other`) with smart default avatars, or upload your custom profile photo directly from your device using Cloudinary.

### 10. 📊 System Admin Dashboard
- Dedicated Admin Dashboard (`admin@travelbuddy.com`) with graphical SVG charts (Monthly Ride Volume, Campus Share, Carbon Growth) and user moderation controls.

### 11. 📱 Mobile Responsive & Modern Executive UI
- Clean, professional Indigo & Obsidian Slate design with responsive mobile navigation drawer for smartphones and tablets.

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), TailwindCSS, Lucide Icons
- **Backend**: Node.js, Express.js (REST API)
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt password hashing
- **Media Uploads**: Cloudinary SDK & Multer

---

## 📁 Project Structure

```text
TravelBuddy/
├── backend/
│   ├── config/          # MongoDB connection & fallback setup
│   ├── controllers/     # Auth, Ride, Request, Trip, Review, Admin logic
│   ├── models/          # MongoDB Schemas (User, RidePost, RideRequest, etc.)
│   ├── routes/          # Express API routes
│   ├── utils/           # Trust Score, Cloudinary, Seed script
│   └── server.js        # Main backend server
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, RideCard, RouteStopsTimeline
│   │   ├── pages/       # Home, FindRides, OfferRide, Dashboard, Profile, Admin, etc.
│   │   └── services/    # API connection service
│   └── tailwind.config.js
├── docs/                # Project viva guide & interview prep docs
└── README.md
```

---

## 🚀 How to Run TravelBuddy Locally

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/TravelBuddy.git
cd TravelBuddy
```

### 2. Start Backend Server
```bash
cd backend
npm install
npm run dev
```
*(Backend runs on `http://localhost:5000`)*

### 3. Start Frontend App
Open a new terminal tab:
```bash
cd frontend
npm install
npm run dev
```
*(Frontend runs on `http://localhost:3000`)*

---

## 🔑 Default Login Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Admin** | `admin@travelbuddy.com` | `password123` |
| **Driver (Rahul)** | `rahul@pccoer.edu.in` | `password123` |
| **Passenger (Ananya)** | `ananya@infosys.com` | `password123` |

---

## 📤 How to Push Changes to GitHub

Whenever you make changes to your project, run these 4 simple commands in your terminal:

```bash
# Step 1: Check status of changed files
git status

# Step 2: Add all files
git add .

# Step 3: Commit with a short message
git commit -m "Updated TravelBuddy README and features"

# Step 4: Push to GitHub
git push origin main
```

---

## 📜 License
This project is open-source and available under the **MIT License**.
