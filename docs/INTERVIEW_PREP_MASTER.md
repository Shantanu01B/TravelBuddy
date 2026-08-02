# TravelBuddy - Master Interview Preparation Guide

This document contains everything you need to confidently answer technical questions, viva questions, and deep-dive code questions during software engineering placement interviews for **TravelBuddy**.

---

## 1. Project Pitch (2-Minute Elevator Pitch)

> "TravelBuddy is a production-ready MERN stack platform designed for college students, employees, and daily commuters to share empty vehicle seats, cut fuel expenses, plan group trips, and build community trust. Unlike commercial ride-hailing services like Uber or Rapido, drivers are non-commercial commuters sharing pre-existing routes. Key features include an index-based route stop matching algorithm, a weighted Trust Score (0-100), an automated Expense Splitter, and community travel feeds."

---

## 2. Tech Stack Justification

| Technology | Role | Why it was chosen for TravelBuddy |
| :--- | :--- | :--- |
| **React (Vite)** | Frontend UI | Fast HMR build tool, component-based modular structure, smooth UI rendering. |
| **Tailwind CSS** | Styling | Custom design tokens, modern gradient visual aesthetics, zero runtime CSS overhead. |
| **Node.js + Express** | Backend Server | Event-driven non-blocking I/O architecture suited for concurrent API requests. |
| **MongoDB + Mongoose** | Database | Flexible document schema ideal for ordered route stops arrays, populate joins, and indexing. |
| **JWT & bcryptjs** | Security | Stateless authentication with signed tokens and salted password hashing (10 rounds). |

---

## 3. Core Algorithms & Math Logic

### A. Index-Based Route Stop Matching Algorithm
**Problem**: How to check if a driver offering a route `[Chinchwad, Thergaon, Wakad, Ravet]` can accommodate a passenger travelling from `Thergaon` to `Ravet` without heavy Google Maps API dependency?

**Solution**:
```javascript
// Located in backend/controllers/rideController.js
const pickupIndex = ride.routeStops.findIndex(s => s.stopName.toLowerCase().includes(pickup.toLowerCase()));
const dropIndex = ride.routeStops.findIndex(s => s.stopName.toLowerCase().includes(drop.toLowerCase()));

// Ride is matched IF pickup exists, drop exists, AND pickupIndex < dropIndex
const isMatch = pickupIndex !== -1 && dropIndex !== -1 && pickupIndex < dropIndex;
```
- **Complexity**: $O(N)$ where $N$ is the number of stops in the route array (typically $N \le 10$).
- **Interviewer Advantage**: Easy to explain, deterministic, zero third-party API rate limits or costs.

### B. Trust Score Formula (0 - 100 Scale)
```javascript
// Located in backend/utils/trustScore.js
const ratingScore = (averageRating / 5) * 40;            // Max 40 points
const completionScore = (completedRides / totalRides) * 30; // Max 30 points
const lowCancelScore = (1 - (cancelledRides / totalRides)) * 20; // Max 20 points
const reviewBonus = Math.min(10, reviewsCount * 2);        // Max 10 points

const trustScore = Math.round(ratingScore + completionScore + lowCancelScore + reviewBonus);
```

### C. Group Expense Splitter
$$\text{Per Person Share} = \frac{\text{Total Expense Amount}}{\text{Number of Split Members}}$$

---

## 4. Top 20 Interviewer Questions & Expert Answers

### Q1: How does authentication work in TravelBuddy?
**Answer**: On register/login, Express signs a JWT with `jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' })`. The frontend stores this token in `localStorage` and attaches `Authorization: Bearer <token>` to request headers via Axios interceptors. The `protect` middleware extracts the token, verifies the signature, and populates `req.user`.

### Q2: How are passwords secured in MongoDB?
**Answer**: In `models/User.js`, a Mongoose `pre('save')` hook intercepts password modifications, generates a 10-round salt using `bcrypt.genSalt(10)`, and hashes the password before saving. `user.matchPassword(entered)` uses `bcrypt.compare()` for authentication.

### Q3: How are relational joins implemented in MongoDB?
**Answer**: Mongoose schemas store reference ObjectIds (`type: Schema.Types.ObjectId, ref: 'User'`). Controllers call `.populate('driver', 'name avatar trustScore organization')` to dynamically join relational data.

### Q4: Why did you use React Context API instead of Redux?
**Answer**: For session management and profile updates, React Context API avoids extra boilerplate overhead while keeping state global, readable, and lightweight across components.

### Q5: How do you handle operational errors in Express?
**Answer**: Unmatched URLs trigger a 404 `notFound` middleware. All controller operations wrap logic in `try-catch` blocks and pass exceptions to a global `errorHandler` middleware that formats consistent JSON responses.

---

## 5. Quick Demo Credentials
- **Rahul Sharma (PCCOER Student)**: `rahul@pccoer.edu.in` / `password123`
- **Ananya Roy (Infosys Employee)**: `ananya@infosys.com` / `password123`
- **Admin Account**: `admin@travelbuddy.com` / `password123`
