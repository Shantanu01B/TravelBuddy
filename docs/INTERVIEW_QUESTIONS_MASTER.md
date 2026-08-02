# 🎓 TravelBuddy - Master Interview Question & Answer Bank

> **Target Roles**: Software Development Engineer (SDE-1), Full Stack MERN Developer, Backend / Frontend Developer.  
> **Total Questions Covered**: 35+ Questions & Answers across Architecture, Node.js/Express, MongoDB, React, Security, and Algorithms.

---

## 🏆 SECTION 1: Elevator Pitch & Project Overview

### Q1: Can you explain your project TravelBuddy in 2 minutes?
**Answer**:
"TravelBuddy is a full-stack MERN (MongoDB, Express, React, Node.js) commuter ride-sharing and group trip planning platform built for university campuses and corporate tech parks. 

Unlike commercial apps like Uber that require complex Google Maps API billing, TravelBuddy introduces an efficient **Ordered Route Stop Matching Algorithm** ($O(N)$) that checks intermediate pickup points along a driver's path. 

Key features include:
1. **Route Stop Matching**: Passengers search matching pickup and drop stops.
2. **Trust Score Engine (0-100)**: Evaluates user reliability based on ratings, completed rides, low cancellations, and campus email domain verification.
3. **Trip Expense Splitter**: Calculates exact per-person costs for group travel (stay, fuel, food).
4. **Eco Impact Tracker**: Tracks carbon savings ($\text{kg CO}_2$) achieved through carpooling.
5. **Cloud Media Storage**: Integrated with Cloudinary for fast CDN image delivery with built-in fallback handling."

---

### Q2: What motivated you to build TravelBuddy?
**Answer**:
"Daily college commuters and tech park employees face high fuel costs and traffic congestion, while many commuters drive with 3 or 4 empty seats. Existing apps charge high commission fees and don't verify peer identity within specific campus networks (like PCCOER or Infosys). TravelBuddy solves this by offering a zero-commission, community-verified commuter network."

---

## ⚡ SECTION 2: Architecture & System Design

### Q3: Why did you choose the MERN Stack for this project?
**Answer**:
- **MongoDB**: Schema-flexible NoSQL database perfect for JSON documents with embedded arrays like `routeStops` and `comments`.
- **Express.js & Node.js**: High-throughput, non-blocking asynchronous I/O ideal for handling concurrent REST API requests.
- **React (Vite)**: Component-based architecture with virtual DOM for snappy, high-performance user interfaces without full page reloads.

---

### Q4: How do you handle file uploads in TravelBuddy?
**Answer**:
"We use **Multer** as memory storage middleware to intercept multipart form data. The image buffer is streamed to **Cloudinary** using the official `cloudinary` Node.js SDK. The returned secure HTTPS CDN URL is saved in MongoDB. If Cloudinary keys are missing or unconfigured, our custom fallback helper returns high-resolution placeholder URLs so the app never crashes."

---

## 🔑 SECTION 3: Security & Authentication

### Q5: How is Authentication and Authorization implemented?
**Answer**:
"We use **JSON Web Tokens (JWT)** and **bcryptjs** password hashing:
1. When a user logs in, `bcrypt.compare()` checks the hashed password.
2. A JWT token containing `{ id: user._id }` signed with a secret key is sent to the client.
3. The React frontend stores the token in `localStorage` and attaches it to every Axios request in an HTTP `Authorization: Bearer <token>` header via an Axios Interceptor.
4. On the backend, `authMiddleware.js` verifies the token using `jwt.verify()` and attaches the user document to `req.user`."

---

### Q6: How do you prevent unauthorized access to Admin routes?
**Answer**:
"We use role-based authorization middleware `adminOnly`:
```javascript
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin rights required' });
  }
};
```
On the frontend, React Router wraps admin routes inside `<AdminRoute />` which checks `user.role === 'admin'` before rendering."

---

## 📐 SECTION 4: Algorithms & Data Structures

### Q7: Explain the Route Stop Matching Algorithm in code.
**Answer**:
"Each ride document contains an ordered array of route stops: `routeStops: [{ stopName, pickupPoint, stopOrder }]`.
```javascript
const pickupIndex = ride.routeStops.findIndex(s => 
  s.stopName.toLowerCase().includes(pickup.toLowerCase())
);
const dropIndex = ride.routeStops.findIndex(s => 
  s.stopName.toLowerCase().includes(drop.toLowerCase())
);

const isMatch = pickupIndex !== -1 && dropIndex !== -1 && pickupIndex < dropIndex;
```
This ensures the passenger's pickup stop appears **before** their drop stop in the driver's sequence of travel."

---

### Q8: How is the Trust Score calculated?
**Answer**:
$$\text{Trust Score} = (\text{Rating}/5 \times 40) + (\text{Completion Rate} \times 30) + (\text{Low Cancel Rate} \times 20) + \min(10, \text{Reviews} \times 2)$$

---

## 🌐 SECTION 5: Database & Queries

### Q9: How do you handle concurrent seat bookings to prevent overbooking?
**Answer**:
"When a driver accepts a seat request, we execute a Mongoose atomic update:
```javascript
const ride = await RidePost.findById(rideId);
if (ride.availableSeats >= seatsRequested) {
  ride.availableSeats -= seatsRequested;
  if (ride.availableSeats === 0) ride.status = 'filled';
  await ride.save();
}
```
This prevents negative seat balances."

---

## 🎨 SECTION 6: Frontend & UI Performance

### Q10: How do you optimize React performance and prevent unnecessary re-renders?
**Answer**:
1. Using **Vite** for sub-second module hot replacement and small bundle sizes.
2. Storing user state centrally in `AuthContext` to avoid prop drilling.
3. Component decomposition: Reusable components like `RideCard`, `TrustScoreBadge`, and `RouteStopsTimeline`.
