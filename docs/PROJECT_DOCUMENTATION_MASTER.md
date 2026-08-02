# 🚗 TravelBuddy - Complete Technical Project Documentation

> **Project Name**: TravelBuddy  
> **Tech Stack**: MERN (MongoDB, Express.js, React, Node.js) + Tailwind CSS + Cloudinary  
> **Target Audience**: College Commuters, Tech Park Employees, Weekend Travelers  
> **Architecture Pattern**: Decoupled MVC RESTful API + Single Page Application (SPA)

---

## 📌 Executive Summary

**TravelBuddy** is a modern, production-grade commuter ride sharing and group trip planning platform built specifically for university campuses and corporate tech parks. Unlike generic ride-hailing applications, TravelBuddy eliminates costly third-party GPS APIs by using an **Ordered Route Stop Matching Algorithm** ($O(N)$), enabling commuters to share rides along intermediate pickup points safely. 

The platform features an automated **Trust Score Math Engine (0-100)** to verify commuter reliability, an integrated **Group Trip Expense Splitter**, an eco-impact tracker (**Carbon Saved in kg CO₂**), and **Cloudinary Cloud Media Storage**.

---

## 🏗️ System Architecture & Workflow

```
┌───────────────────────────────────────────────────────────┐
│                 React SPA Frontend (Vite)                 │
│    (Navbar, Home, Dashboard, RideCards, TripPlanner, etc.) │
└─────────────────────────────┬─────────────────────────────┘
                              │ Axios REST API Calls (JSON)
                              ▼
┌───────────────────────────────────────────────────────────┐
│               Express.js REST API Server                  │
│       (Auth, JWT Guard, Controllers, Middleware)          │
└──────────────┬──────────────────────────────┬─────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────┐    ┌───────────────────────────┐
│   MongoDB Database       │    │  Cloudinary Cloud Storage │
│ (Mongoose ODM Collections│    │ (Avatars & Travel Photos) │
└──────────────────────────┘    └───────────────────────────┘
```

---

## 🗄️ Database Schemas (Mongoose Models)

### 1. User Schema (`models/User.js`)
- `name`: String (Required)
- `email`: String (Required, Unique, Lowercase)
- `password`: String (Hashed with bcrypt 10 rounds)
- `role`: Enum `['user', 'admin']` (Default: `'user'`)
- `gender`: Enum `['Male', 'Female', 'Other']` (Default: `'Male'`)
- `organization`: String (Default: `'General Commuter'`)
- `vehicle`: `{ makeModel, licensePlate, type, capacity }`
- `avatar`: String (Cloudinary CDN URL)
- `trustScore`: Number (0 to 100, Default: 75)
- `rewardPoints`: Number (Default: 50)
- `badges`: `[String]` (e.g. `'Verified Commuter'`, `'Trusted Driver'`, `'Eco Rider'`)
- `completedRides`: Number
- `totalRides`: Number
- `cancelledRides`: Number
- `carbonSaved`: Number (kg CO₂)

### 2. RidePost Schema (`models/RidePost.js`)
- `driver`: ObjectId (Ref: `'User'`)
- `vehicleType`: Enum `['Car', 'Bike', 'Scooter']`
- `vehicleName`: String
- `source`: String
- `destination`: String
- `routeStops`: `[{ stopName: String, pickupPoint: String, stopOrder: Number }]`
- `date`: String (YYYY-MM-DD)
- `time`: String (HH:MM AM/PM)
- `totalSeats`: Number
- `availableSeats`: Number
- `pricePerSeat`: Number
- `community`: String
- `status`: Enum `['active', 'completed', 'cancelled']`

### 3. RideRequest Schema (`models/RideRequest.js`)
- `ride`: ObjectId (Ref: `'RidePost'`)
- `passenger`: ObjectId (Ref: `'User'`)
- `driver`: ObjectId (Ref: `'User'`)
- `pickupStop`: String
- `dropStop`: String
- `seatsRequested`: Number
- `totalPrice`: Number
- `status`: Enum `['pending', 'accepted', 'rejected', 'completed', 'cancelled']`

### 4. Trip & Expense Schemas (`models/Trip.js`, `models/Expense.js`)
- `Trip`: `{ title, destination, budget, startDate, endDate, creator, members: [User], notes }`
- `Expense`: `{ trip: Trip, title, category, amount, paidBy: User, splitBetween: [User], perPersonAmount }`

---

## ⚡ Core Business Algorithms

### 1. Intermediate Route Stop Matching ($O(N)$ Array Indexing)
When a passenger searches for a ride from **Thergaon** to **Ravet**, TravelBuddy filters rides where:
1. `pickupIndex` = index of `Thergaon` in `routeStops` array.
2. `dropIndex` = index of `Ravet` in `routeStops` array.
3. `isMatch` = `pickupIndex !== -1 && dropIndex !== -1 && pickupIndex < dropIndex`.

```javascript
const pickupIndex = ride.routeStops.findIndex(s => s.stopName.toLowerCase().includes(pickup.toLowerCase()));
const dropIndex = ride.routeStops.findIndex(s => s.stopName.toLowerCase().includes(drop.toLowerCase()));
const isMatch = pickupIndex !== -1 && dropIndex !== -1 && pickupIndex < dropIndex;
```

### 2. Trust Score Calculation Formula (0 - 100)
Calculated automatically based on 4 weighted components:
$$\text{Score} = \left(\frac{\text{Rating}}{5} \times 40\right) + \left(\frac{\text{Completed}}{\text{Total}} \times 30\right) + \left[\left(1 - \frac{\text{Cancelled}}{\text{Total}}\right) \times 20\right] + \min(10, \text{Reviews} \times 2)$$

---

## 🚀 Deployment Guide

### Deploying Frontend to Vercel
1. Root folder: `frontend/`
2. Framework Preset: `Vite`
3. Build Command: `npm run build`
4. Output Directory: `dist`

### Deploying Backend to Render / Vercel
1. Root folder: `backend/`
2. Build Command: `npm install`
3. Start Command: `npm start` (or `node server.js`)
4. Environment Variables:
   - `PORT=5000`
   - `MONGODB_URI=your_mongodb_atlas_url`
   - `JWT_SECRET=your_secret_key`
   - `CLOUDINARY_CLOUD_NAME=rt7wszdp`
   - `CLOUDINARY_API_KEY=225811514831915`
   - `CLOUDINARY_API_SECRET=your_secret`
