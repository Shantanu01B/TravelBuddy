# 🚗 TravelBuddy — Peer-to-Peer Campus & Corporate Commute Network

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-indigo.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4.svg)](https://tailwindcss.com/)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-blue.svg)](https://cloudinary.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **TravelBuddy** is a full-stack MERN carpooling, ride-sharing, and fare-splitting platform designed specifically for college students and corporate employees. It enables users to share empty seats in cars/bikes or split Auto Rickshaw and Uber/Ola cab fares along intermediate route stops while tracking their carbon savings and building a verified community trust score.

---

## 🌟 Key Features & Innovations

### 1. 🛺 Auto & Cab Fare Splitter
- **Post Fare Splits**: Travelling solo in an Auto Rickshaw or Uber? Post a fare split (e.g. *"Station to PCCOER campus — splitting ₹90 fare with 2 commuters"*).
- Dedicated **🛺 Auto Rickshaw Fare Split** badges on ride listings.

### 2. 🧮 Proportional Intermediate Stop Pricing
- **Route Leg Math**: Prices are calculated dynamically based on intermediate route legs traveled ($N-1$ total legs):
  $$\text{Passenger Price} = (\text{Drop Index} - \text{Pickup Index}) \times \frac{\text{Full Route Price}}{\text{Total Legs}}$$
- Commuters joining midway pay only for the exact stops traveled!

### 3. 🛡️ 100-Point Transparent Trust Score Engine
- **Fair Math Formula** (`backend/utils/trustScore.js`):
  $$\text{Trust Score} = \left(\frac{\text{Rating}}{5} \times 40\right) + \left(\frac{\text{Completed}}{\text{Total}} \times 30\right) + \left[\left(1 - \frac{\text{Cancelled}}{\text{Total}}\right) \times 20\right] + \min(10, \text{Reviews} \times 2)$$
- New verified commuters receive a respectable baseline score of **85/100**.

### 4. 🔄 Bi-Directional Rating & Reputation System
- **Passenger ↔ Driver Reviews**: Drivers rate Passengers and Passengers rate Drivers upon ride completion.
- Single-submission enforcement prevents duplicate ratings.

### 5. 📷 Custom Profile Photo Uploads
- Direct device image file upload powered by **Multer + Cloudinary**.
- Automatic gender-appropriate avatar defaults (Male / Female).

### 6. 📊 System Admin Operations Console
- Dedicated `/admin` dashboard featuring interactive SVG charts:
  - **Monthly Ride Volume Bar Chart**
  - **Campus Network Distribution Chart** (PCCOER, Infosys, COEP, TCS)
  - **Cumulative Carbon Savings Growth Trend** ($\text{kg CO}_2$)
- User moderation and ride management table.

### 7. 📄 Trip Planner & Expense Splitter
- Create group trip itineraries (e.g. Lonavala / Mahabaleshwar).
- Track and split group trip expenses evenly among members.

---

## 🛠️ Technology Stack

| Layer | Technology Used |
| :--- | :--- |
| **Frontend** | React 18 (Vite SPA), TailwindCSS, Lucide Icons, React Router DOM |
| **Backend** | Node.js, Express.js (REST API Architecture) |
| **Database** | MongoDB (Mongoose ODM with local fallback) |
| **Authentication** | JWT (JSON Web Tokens) with Bcrypt password hashing |
| **File Storage** | Cloudinary SDK + Multer Memory Storage |

---

## 📁 Repository Structure

```text
TravelBuddy/
├── backend/
│   ├── config/          # MongoDB connection & fallback setup
│   ├── controllers/     # Auth, Ride, Request, Trip, Review, Admin controllers
│   ├── middleware/      # JWT Protect, Error handler, Multer upload
│   ├── models/          # Mongoose Schemas (User, RidePost, RideRequest, etc.)
│   ├── routes/          # Express REST API routes
│   ├── utils/           # Trust Score formula, Cloudinary config, Seed script
│   ├── server.js        # Main Express server entry point
│   └── vercel.json      # Backend deployment config
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, RideCard, RouteStopsTimeline, TrustScoreBadge
│   │   ├── context/     # AuthContext state manager
│   │   ├── pages/       # Home, FindRides, OfferRide, Dashboard, Profile, Admin, etc.
│   │   ├── services/    # Axios API instance
│   │   └── index.css    # TailwindCSS styling utilities
│   ├── tailwind.config.js
│   └── vercel.json      # SPA client rewrite rules
├── docs/                # Project viva guide & interview prep docs
└── README.md
```

---

## 🚀 Local Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Server running locally or MongoDB Atlas connection URI

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/TravelBuddy.git
cd TravelBuddy
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/travelbuddy
JWT_SECRET=travelbuddy_super_secret_jwt_key_2026
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Seed initial database (optional):
```bash
node utils/seed.js
```

Start backend development server:
```bash
npm run dev
```
Backend will run on `http://localhost:5000`.

### 3. Setup Frontend
Open a new terminal tab:
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:3000`.

---

## 🔑 Default Credentials for Testing

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Admin** | `admin@travelbuddy.com` | `password123` |
| **Driver (Rahul)** | `rahul@pccoer.edu.in` | `password123` |
| **Passenger (Ananya)** | `ananya@infosys.com` | `password123` |

---

## 📋 How to Push Code to GitHub

Follow these simple step-by-step commands to push your project to GitHub:

### Step 1: Initialize Git (If not already initialized)
In the root directory of `TravelBuddy`:
```bash
git init
```

### Step 2: Stage & Commit All Files
```bash
git add .
git commit -m "Initial commit: Production-ready TravelBuddy MERN App"
```

### Step 3: Create GitHub Repository & Link Remote
1. Go to [GitHub](https://github.com/new) and create a new public repository named `TravelBuddy`.
2. Do **NOT** check "Initialize this repository with a README" (since we already created one).
3. Copy your repository URL (e.g., `https://github.com/YOUR_USERNAME/TravelBuddy.git`).

### Step 4: Set Main Branch & Push
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/TravelBuddy.git
git push -u origin main
```

---

## 📄 Documentation & Viva Prep

Detailed offline documentation and 35+ interview preparation Q&As are available in the `docs/` folder:
- [Technical Master Documentation](file:///docs/PROJECT_DOCUMENTATION_MASTER.md)
- [35+ Interview & Viva Questions](file:///docs/INTERVIEW_QUESTIONS_MASTER.md)
- [Printable PDF Prep Sheet](file:///docs/PRINTABLE_INTERVIEW_PREP.html)

---

## 📜 License
This project is licensed under the **MIT License**.
