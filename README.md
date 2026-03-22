# 💊 MediSure360 — Professional Medical Store Management System

![Version](https://img.shields.io/badge/version-2.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Status](https://img.shields.io/badge/status-Active-brightgreen)

A production-ready, full-stack **Medical Store Management System** built with the **MERN stack** (MongoDB + Express + React + Node.js) using **Vite**. Features comprehensive inventory management, point-of-sale (POS) billing, sales tracking, analytics with charts, and expiry management.

---

## 🎯 Table of Contents
- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [User Workflows](#user-workflows)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Database Seeding](#database-seeding)
- [Deployment Guide](#deployment-guide)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🌐 Overview

**MediSure360** is a comprehensive medical store management solution that streamlines operations from inventory management to sales tracking. It's designed for pharmacy stores and medical shops to efficiently manage medicines, track sales, monitor expiry dates, and generate insightful analytics.

### Core Use Cases:
- ✅ Maintain real-time medicine inventory
- ✅ Process billing with point-of-sale (POS) system
- ✅ Manage expiry dates and send alerts
- ✅ Track sales history and generate reports
- ✅ Visualize business metrics with interactive charts
- ✅ Role-based access control (Admin & Staff)

---

## 🏗️ System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Frontend)                   │
│  React 18.3 + Vite | Context API | Axios | Chart.js | Tailwind  │
│  ┌──────────┬──────────────┬──────────────┬──────────┬──────────┐
│  │ Dashboard│  Inventory   │  POS Billing │ Analytics│  Alerts  │
│  │  Page    │    Page      │   Page       │   Page   │  Page    │
│  └──────────┴──────────────┴──────────────┴──────────┴──────────┘
└─────────────────────────────────────────────────────────────────┘
                              ↓
                      REST API (JSON/HTTP)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     API LAYER (Backend)                          │
│  Express.js 4.19 | Node.js | JWT Auth | CORS Enabled            │
│  ┌──────────────┬──────────────┬──────────────┬───────────────┐
│  │ Auth Routes  │ Medicine API │  Sales API   │ Analytics API │
│  │ /api/auth    │ /api/med...  │ /api/sales   │ /api/analytics│
│  └──────────────┴──────────────┴──────────────┴───────────────┘
│                          ↓
│                   Middleware & Controllers
│  ┌──────────────────────────────────────────────────────────┐
│  │ Auth Middleware (JWT Validation)                         │
│  │ Error Handling | CORS | Body Parser | Rate Limiting      │
│  └──────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER (Database)                       │
│  MongoDB Atlas 8.4 | Mongoose 8.4 ODM                           │
│  ┌──────────────┬──────────────┬──────────────┐                │
│  │  Users       │  Medicines   │  Sales       │                │
│  │  Collection  │  Collection  │  Collection  │                │
│  └──────────────┴──────────────┴──────────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
User Action (Frontend)
      ↓
React Event Handler
      ↓
API Call via Axios (with JWT token)
      ↓
Express Route Handler
      ↓
Authentication Middleware (JWT Verification)
      ↓
Controller Logic (Business Logic)
      ↓
Database Query (Mongoose ODM)
      ↓
MongoDB (Data Persistence)
      ↓
Response (JSON)
      ↓
Frontend Update (Context API / State)
      ↓
UI Re-render
```

### Component Architecture

```
Frontend Structure:
├── Context (Global State)
│   └── AuthContext → User authentication state
├── Pages (Screen Components)
│   ├── LoginPage → Authentication
│   ├── DashboardPage → KPI Overview
│   ├── InventoryPage → Medicine List & Management
│   ├── AddMedicinePage → Create/Edit Medicines
│   ├── POSPage → Billing Interface
│   ├── ReceiptPage → Bill Preview
│   ├── ExpiryAlertPage → Expiry Management
│   ├── SalesHistoryPage → Transaction Records
│   └── AnalyticsPage → Charts & Reports
└── Components (Reusable)
    └── Sidebar → Navigation

Backend Structure:
├── Models (Database Schemas)
│   ├── User → Authentication & Authorization
│   ├── Medicine → Inventory Items
│   └── Sale → Transaction Records
├── Controllers (Business Logic)
│   ├── authController → User authentication
│   ├── medicineController → Inventory operations
│   ├── saleController → POS & billing
│   └── analyticsController → Reports & charts
├── Routes (API Endpoints)
│   ├── authRoutes → /api/auth/*
│   ├── medicineRoutes → /api/medicines/*
│   ├── saleRoutes → /api/sales/*
│   └── analyticsRoutes → /api/analytics/*
├── Middleware (Cross-cutting concerns)
│   └── authMiddleware → JWT verification
└── Seed (Database initialization)
    └── seedData → 25 medicines + 6 months sample data
```

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- **User Registration & Login** with JWT tokens
- **Role-based Access Control**: Admin and Staff roles
- **Session Management** with token-based auth
- **Password Hashing** using bcryptjs

### 📦 Inventory Management
- **Add/Edit/Delete Medicines** with full details
- **Real-time Stock Tracking** with quantity updates
- **Medicine Categories**: Antibiotics, Analgesics, Antacids, etc.
- **Batch Number Management** (unique tracking)
- **Storage Location Tracking**
- **Advanced Medicine Search** (by name, manufacturer, category)

### 💳 Point of Sale (POS) System
- **Quick Billing Interface** for fast transactions
- **Multiple Item Selection** with quantity management
- **Real-time Stock Validation** (prevents overselling)
- **Discount Support** on total bill amount
- **Automatic Profit Calculation**
- **Payment Method Tracking** (Cash, Card, etc.)

### 📊 Sales Tracking
- **Complete Transaction History** with timestamps
- **Sale Items** with medicine snapshots
- **Profit Analytics** per transaction
- **Filter & Search** sales by date range
- **Transaction IDs** for accountability

### 📈 Analytics & Reporting
- **Interactive Charts** using Chart.js & react-chartjs-2
- **Sales Over Time** (weekly/monthly trends)
- **Revenue Metrics** (total, average, growth)
- **Medicine Performance** (top sellers, low stock)
- **Profit Analysis** (profit margins, trends)
- **Inventory Insights** (stock levels, turnover)

### ⏰ Expiry Management
- **Expiry Date Tracking** for all medicines
- **Expiry Alerts** for medicines expiring soon
- **Expired Medicines List** for removal
- **Visual Indicators** for expiry status

### 📱 User Interface
- **Responsive Design** (Desktop & Tablet optimized)
- **Dark/Light Theme Support** (via Tailwind CSS)
- **Toast Notifications** (success, error, info)
- **Loading States** and Spinners
- **Error Handling** with user-friendly messages
- **Printable Receipts** for sales transactions

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3.1 | UI library |
| **Vite** | 5.3.1 | Build tool & dev server |
| **React Router** | 6.24.0 | Client-side routing |
| **Axios** | 1.7.2 | HTTP client |
| **Chart.js** | 4.4.3 | Charts & analytics visualization |
| **react-chartjs-2** | 5.2.0 | React wrapper for Chart.js |
| **React Icons** | 5.2.1 | Icon library |
| **React Hot Toast** | 2.4.1 | Toast notifications |
| **Tailwind CSS** | Latest | CSS framework |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | Latest LTS | Runtime environment |
| **Express.js** | 4.19.2 | Web framework |
| **MongoDB** | Cloud | NoSQL database |
| **Mongoose** | 8.4.0 | MongoDB ODM |
| **JWT** | 9.0.2 | Authentication |
| **bcryptjs** | 2.4.3 | Password hashing |
| **CORS** | 2.8.5 | Cross-origin requests |
| **dotenv** | 16.4.5 | Environment variables |
| **Nodemon** | 3.1.3 | Dev auto-restart |

### Development Tools
| Tool | Purpose |
|------|---------|
| **Concurrently** | Run frontend & backend simultaneously |
| **git** | Version control |

---

## 📋 Prerequisites

Before installation, ensure you have:

- **Node.js** v16.0.0 or higher ([Download](https://nodejs.org/))
- **npm** v7.0.0 or higher (comes with Node.js)
- **MongoDB Atlas Account** ([Free tier](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))
- **Text Editor/IDE** (VS Code recommended)

### Verify Installation:
```bash
node --version      # v16.0.0+
npm --version       # v7.0.0+
git --version       # Latest
```

---

## 📁 Project Structure

```
MediSure360 - V2/
├── backend/                        # Express API Server
│   ├── src/
│   │   ├── config/                # Configuration files
│   │   ├── controllers/           # Business logic handlers
│   │   │   ├── authController.js       # User auth (register, login, me)
│   │   │   ├── medicineController.js   # Medicine CRUD & search
│   │   │   ├── saleController.js       # Sales & billing operations
│   │   │   └── analyticsController.js  # Analytics & reports
│   │   ├── middleware/            # Custom middleware
│   │   │   └── authMiddleware.js       # JWT verification & authorization
│   │   ├── models/                # Database schemas
│   │   │   ├── User.js                 # User schema (name, email, password, role)
│   │   │   ├── Medicine.js             # Medicine schema (inventory items)
│   │   │   └── Sale.js                 # Sale schema (transactions & items)
│   │   ├── routes/                # API endpoint definitions
│   │   │   ├── authRoutes.js           # Auth endpoints
│   │   │   ├── medicineRoutes.js       # Medicine endpoints
│   │   │   ├── saleRoutes.js           # Sales endpoints
│   │   │   └── analyticsRoutes.js      # Analytics endpoints
│   │   ├── seed/                  # Database utilities
│   │   │   └── seedData.js             # Sample data (25 medicines + 6 months sales)
│   │   └── server.js              # Express app entry point
│   ├── .env.example               # Environment variables template
│   ├── package.json               # Backend dependencies
│   └── .gitignore
│
├── frontend/                       # React + Vite Frontend
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   │   └── Sidebar.jsx             # Navigation sidebar
│   │   ├── context/               # Global state management
│   │   │   └── AuthContext.jsx         # User auth state & functions
│   │   ├── pages/                 # Page components (screens)
│   │   │   ├── LoginPage.jsx           # User authentication screen
│   │   │   ├── DashboardPage.jsx       # Overview with KPIs
│   │   │   ├── InventoryPage.jsx       # Medicine inventory list
│   │   │   ├── AddMedicinePage.jsx     # Create/edit medicines
│   │   │   ├── POSPage.jsx             # Point-of-sale billing
│   │   │   ├── ReceiptPage.jsx         # Receipt display & print
│   │   │   ├── ExpiryAlertPage.jsx     # Expiry management
│   │   │   ├── SalesHistoryPage.jsx    # Transaction history
│   │   │   └── AnalyticsPage.jsx       # Charts & reports
│   │   ├── utils/                 # Utility functions
│   │   │   └── api.js                  # Axios instance with interceptors
│   │   ├── App.jsx                # Root component & routing
│   │   ├── index.css              # Global styles
│   │   └── main.jsx               # React entry point
│   ├── index.html                 # HTML template
│   ├── vite.config.js             # Vite configuration
│   ├── package.json               # Frontend dependencies
│   └── .gitignore
│
├── package.json                   # Root workspace configuration
├── README.md                      # This file
└── .gitignore

**Legend:**
├── = folder level
│   ├── = file/folder
│   └── = last item
```

---

## ⚙️ Installation & Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/MediSure360.git
cd MediSure360
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Install Dependencies
```bash
npm install
```

#### 2.3 Create Environment File
Create a `.env` file in the `backend/` directory with the following variables:
```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medisure360?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_recommended
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Get MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Drivers" → Copy connection string
4. Replace `<username>`, `<password>`, and `<dbname>`

### Step 3: Frontend Setup

#### 3.1 Navigate to Frontend Directory
```bash
cd ../frontend
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Create Environment File (Optional)
Create a `.env` file in `frontend/` (optional - API proxy is configured in `vite.config.js`):
```env
VITE_API_URL=/api
```

---

## 🌐 API Endpoints

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/register` | Register a new user | ❌ No |
| POST | `/login` | Login user & get JWT token | ❌ No |
| GET | `/me` | Get current user profile | ✅ Yes |

**Register Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Login Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "staff"
  }
}
```

---

### Medicine Endpoints (`/api/medicines`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/` | Get all medicines with pagination | ✅ Yes |
| GET | `/search?q=aspirin` | Search medicines by name/manufacturer | ✅ Yes |
| GET | `/stats` | Get medicine statistics | ✅ Yes |
| GET | `/:id` | Get specific medicine by ID | ✅ Yes |
| POST | `/` | Create new medicine | ✅ Yes |
| PUT | `/:id` | Update medicine details | ✅ Yes |
| DELETE | `/:id` | Delete medicine | ✅ Yes |

**Create/Update Medicine Request:**
```json
{
  "name": "Ibuprofen 200mg",
  "manufacturer": "Pharma Corp",
  "batchNumber": "BATCH20245001",
  "location": "A1",
  "category": "Analgesics",
  "purchasePrice": 50,
  "sellingPrice": 100,
  "expiryDate": "2025-12-31",
  "quantityInStock": 500,
  "description": "Pain reliever and anti-inflammatory"
}
```

**Get Medicines Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Ibuprofen 200mg",
      "manufacturer": "Pharma Corp",
      "batchNumber": "BATCH20245001",
      "location": "A1",
      "category": "Analgesics",
      "purchasePrice": 50,
      "sellingPrice": 100,
      "expiryDate": "2025-12-31",
      "quantityInStock": 500,
      "description": "Pain reliever and anti-inflammatory"
    }
  ]
}
```

---

### Sales Endpoints (`/api/sales`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/` | Get all sales with filters | ✅ Yes |
| GET | `/:id` | Get specific sale details | ✅ Yes |
| POST | `/` | Create new sale (POS transaction) | ✅ Yes |
| GET | `/history` | Get sales history with analytics | ✅ Yes |

**Create Sale Request:**
```json
{
  "items": [
    {
      "medicine": "507f1f77bcf86cd799439011",
      "medicineName": "Ibuprofen 200mg",
      "batchNumber": "BATCH20245001",
      "quantitySold": 5,
      "priceAtSale": 100,
      "purchasePriceAtSale": 50
    }
  ],
  "totalAmount": 500,
  "discount": 0,
  "paymentMethod": "Cash",
  "notes": "Regular customer"
}
```

**Sale Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "transactionId": "TXN20240321001",
    "items": [...],
    "totalAmount": 500,
    "totalProfit": 250,
    "discount": 0,
    "paymentMethod": "Cash",
    "createdAt": "2024-03-21T10:30:00Z"
  }
}
```

---

### Analytics Endpoints (`/api/analytics`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/kpis` | Key performance indicators | ✅ Yes |
| GET | `/sales-trend` | Sales trend over time | ✅ Yes |
| GET | `/top-medicines` | Best-selling medicines | ✅ Yes |
| GET | `/revenue-breakdown` | Revenue by category | ✅ Yes |
| GET | `/medicine-performance` | Medicine performance metrics | ✅ Yes |
| GET | `/expiry-report` | Expiry status report | ✅ Yes |

**KPI Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 50000,
    "totalProfit": 25000,
    "totalSales": 120,
    "totalMedicines": 500,
    "expiringMedicines": 15,
    "expiredMedicines": 3
  }
}
```

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'staff'], default: 'staff'),
  createdAt: Date,
  updatedAt: Date
}
```

### Medicine Collection
```javascript
{
  _id: ObjectId,
  name: String (required, max 100),
  manufacturer: String (required, max 100),
  batchNumber: String (required, unique),
  location: String (default: 'A1'),
  category: String (enum: ['Antibiotics', 'Analgesics', ...]),
  purchasePrice: Number (required, min 0),
  sellingPrice: Number (required, min 0),
  expiryDate: Date (required),
  quantityInStock: Number (required, default 0),
  description: String (max 500),
  
  // Virtual fields
  profit: Number (sellingPrice - purchasePrice),
  profitMargin: Number ((profit / sellingPrice) * 100),
  
  createdAt: Date,
  updatedAt: Date
}
```

### Sale Collection
```javascript
{
  _id: ObjectId,
  transactionId: String (unique),
  items: [
    {
      medicine: ObjectId (ref: Medicine),
      medicineName: String,
      batchNumber: String,
      quantitySold: Number,
      priceAtSale: Number,
      purchasePriceAtSale: Number,
      // Virtual: subtotal = quantitySold * priceAtSale
      // Virtual: profit = quantitySold * (priceAtSale - purchasePriceAtSale)
    }
  ],
  totalAmount: Number (required),
  totalProfit: Number (default 0),
  discount: Number (default 0),
  paymentMethod: String (enum: ['Cash', 'Card', 'Online']),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Relationships Diagram
```
User (1) ──────────────→ (Many) Sale
User (1) ──────────────→ (Many) Medicine (Created by)
Medicine (1) ──────────→ (Many) SaleItem (in Sale)
```

---

## 🔐 Authentication & Authorization

### JWT Token Flow
```
1. User Registers/Logs In
        ↓
2. Server verifies credentials
        ↓
3. Server generates JWT token
        ↓
4. Token sent to client (localStorage)
        ↓
5. Client sends token in Authorization header for subsequent requests
        ↓
6. Server verifies token with authMiddleware
        ↓
7. Request processed or rejected
```

### Token Structure
```javascript
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "id": "user_id_here",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Authorization Levels

| Role | Permissions | Access |
|------|------------|--------|
| **Admin** | Full system access | All features + User management |
| **Staff** | Limited access | Dashboard, POS, Inventory, Sales |

### Middleware Protection
```javascript
// authMiddleware checks:
1. JWT token in Authorization header
2. Token validity (expiry, signature)
3. User existence in database
4. Sets req.user object
5. Passes to controller
```

---

## 👥 User Workflows

### 1. **Admin Registration & Login Flow**
```
┌─────────────────┐
│   Admin User    │
└────────┬────────┘
         │ Registers/Logs in
         ↓
┌─────────────────────────────┐
│     LoginPage.jsx           │
│  - Enter email & password   │
└────────┬────────────────────┘
         │ Submit credentials
         ↓
┌─────────────────────────────┐
│   POST /api/auth/login      │
└────────┬────────────────────┘
         │ Validate credentials
         ↓
┌─────────────────────────────┐
│   Generate JWT token        │
│   Store in localStorage     │
└────────┬────────────────────┘
         │ Redirect to Dashboard
         ↓
┌─────────────────────────────┐
│   Authenticated Sidebar     │
│   All features unlocked     │
└─────────────────────────────┘
```

### 2. **Medicine Inventory Management Workflow**
```
┌──────────────────────┐
│  Admin/Staff User    │
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     │           │
     ↓           ↓
  View       Add/Edit
  Inventory  Medicine
     │           │
     ↓           ↓
┌─────────────────────────────┐
│  InventoryPage.jsx          │
│  - List medicines           │
│  - Search/Filter options    │
│  - Edit/Delete buttons      │
└────────┬────────────────────┘
         │
     ┌───┴────────────┐
     │                │
     ↓                ↓
  Edit/Create    Delete
     │                │
     ↓                ↓
┌─────────────────────────────┐
│  AddMedicinePage.jsx        │
│  - Fill medicine form       │
│  - Upload details           │
└────────┬────────────────────┘
         │ Submit
         ↓
┌─────────────────────────────┐
│  PUT/POST /api/medicines    │
│  Update/Create in MongoDB   │
└────────┬────────────────────┘
         │ Success
         ↓
┌─────────────────────────────┐
│  Toast notification         │
│  Refresh inventory list     │
└─────────────────────────────┘
```

### 3. **Point of Sale (POS) Billing Workflow**
```
┌──────────────────────┐
│  Cashier/Staff User  │
└──────────┬───────────┘
           │ Navigate to POS
           ↓
┌──────────────────────────────┐
│     POSPage.jsx              │
│  - Search medicine           │
│  - Add to cart               │
│  - Manage quantities         │
└──────────┬───────────────────┘
           │ Items selected
           ↓
┌──────────────────────────────┐
│  - Review items              │
│  - Apply discount (optional) │
│  - Generate bill amount      │
└──────────┬───────────────────┘
           │ Process payment
           ↓
┌──────────────────────────────┐
│  POST /api/sales             │
│  - Create sale record        │
│  - Update medicine stock     │
│  - Calculate profit          │
└──────────┬───────────────────┘
           │ Success
           ↓
┌──────────────────────────────┐
│    ReceiptPage.jsx           │
│  - Display bill details      │
│  - Print receipt             │
│  - Save transaction          │
└──────────────────────────────┘
```

### 4. **Analytics & Reporting Workflow**
```
┌──────────────────────┐
│   Admin User         │
└──────────┬───────────┘
           │ View Analytics
           ↓
┌──────────────────────────────┐
│  AnalyticsPage.jsx           │
│  - Load KPI cards            │
│  - Fetch sales data          │
└──────────┬───────────────────┘
           │ Data request
           ↓
┌──────────────────────────────┐
│  GET /api/analytics/*        │
│  - KPIs, trends, breakdown   │
└──────────┬───────────────────┘
           │ Receive data
           ↓
┌──────────────────────────────┐
│  Chart.js visualization      │
│  - Line charts (trends)      │
│  - Bar charts (comparison)   │
│  - Pie charts (breakdown)    │
└──────────────────────────────┘
```

### 5. **Expiry Management Workflow**
```
┌──────────────────────┐
│   Admin/Staff User   │
└──────────┬───────────┘
           │ View expiry alerts
           ↓
┌──────────────────────────────┐
│  ExpiryAlertPage.jsx         │
│  - List expiring medicines   │
│  - List expired medicines    │
│  - Take action               │
└──────────┬───────────────────┘
           │
     ┌─────┴──────┐
     │            │
     ↓            ↓
  Reorder    Remove from
  Stock      Inventory
     │            │
     ↓            ↓
┌──────────────────────────────┐
│  PUT /api/medicines/:id      │
│  - Update quantity/status    │
└──────────────────────────────┘
```

---

## 🔧 Environment Variables

### Backend `.env` Example

```env
# ========================================
# DATABASE CONFIGURATION
# ========================================
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/medisure360?retryWrites=true&w=majority

# ========================================
# SERVER CONFIGURATION
# ========================================
PORT=5000
NODE_ENV=development

# ========================================
# JWT CONFIGURATION
# ========================================
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_recommended_for_production
JWT_EXPIRE=7d

# ========================================
# CORS CONFIGURATION
# ========================================
FRONTEND_URL=http://localhost:5173

# ========================================
# OPTIONAL: EMAIL CONFIGURATION (for future use)
# ========================================
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASS=your_app_password
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
```

**For Production:**
- Use strong JWT_SECRET (min 32 chars, mix of upper, lower, numbers, symbols)
- Set NODE_ENV=production
- Use production MongoDB connection
- Update FRONTEND_URL to your domain

---

## ▶️ Running the Application

### Option 1: Run Both Backend & Frontend Together (Recommended)

```bash
# From root directory
npm install:all          # Install all dependencies
npm run dev             # Run both backend & frontend with concurrently
```

**Output:**
```
$ concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
[0] > nodemon src/server.js
[1] > vite
[0] ✅ Connected to MongoDB Atlas
[0] 🚀 Server running on port 5000
[1]   VITE v5.3.1  ready in 500 ms
[1]   ➜  Local:   http://localhost:5173/
```

### Option 2: Run Backend & Frontend Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

### Option 3: Production Mode

```bash
# Backend
cd backend
npm start              # Runs with node (not nodemon)

# Frontend
cd frontend
npm run build          # Creates optimized production build
npm run preview        # Preview production build locally
```

---

## 🌱 Database Seeding

### Seed Sample Data (25 medicines + 6 months sales history)

```bash
cd backend
npm run seed
```

**What gets seeded:**
- ✅ Admin user: `admin@medisure.com` / password: `admin123`
- ✅ Staff user: `staff@medisure.com` / password: `staff123`
- ✅ 25 sample medicines across different categories
- ✅ 6 months of historical sales data (180+ transactions)
- ✅ Realistic pricing and stock quantities

**Seed Output:**
```
🌱 Seeding database...
✅ Created sample users
✅ Created 25 sample medicines
✅ Created sample sales data
✅ Database seed completed successfully!
```

### Login After Seeding

```
Admin Account:
Email: admin@medisure.com
Password: admin123

Staff Account:
Email: staff@medisure.com
Password: staff123
```

---

## 🚀 Deployment Guide

### Deploy Backend to Heroku

#### 1. Create Heroku Account
- Sign up at https://www.heroku.com

#### 2. Install Heroku CLI
```bash
# Windows
choco install heroku-cli

# Mac
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

#### 3. Deploy Backend
```bash
cd backend
heroku login
heroku create your-app-name
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set JWT_SECRET="your_jwt_secret"
git push heroku main
heroku logs --tail
```

### Deploy Frontend to Vercel

#### 1. Create Vercel Account
- Sign up at https://vercel.com

#### 2. Connect GitHub & Deploy
```bash
# In frontend directory
npm run build
```

Or use Vercel CLI:
```bash
npm i -g vercel
vercel
```

#### 3. Set Environment Variables in Vercel Dashboard
```
VITE_API_URL=https://your-backend.herokuapp.com/api
```

### Alternative: Docker Deployment

```dockerfile
# Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY src src
EXPOSE 5000
CMD ["node", "src/server.js"]
```

```bash
docker build -t medisure-backend .
docker run -p 5000:5000 \
  -e MONGODB_URI="your_uri" \
  -e JWT_SECRET="your_secret" \
  medisure-backend
```

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Error
**Error:** `❌ MongoDB connection error: getaddrinfo ENOTFOUND`

**Solutions:**
1. Check MongoDB URI format in `.env`
2. Verify IP whitelist in MongoDB Atlas (0.0.0.0/0 for development)
3. Check internet connection
4. Verify credentials are URL-encoded if they contain special characters

---

### Issue: CORS Error in Frontend
**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solutions:**
1. Ensure backend is running on `http://localhost:5000`
2. Check `vite.config.js` proxy settings
3. Verify CORS middleware in `server.js`
4. Clear browser cache

---

### Issue: JWT Token Expired
**Error:** `401 - Not authorized, invalid token`

**Solutions:**
1. Log out and log back in
2. Check JWT_EXPIRE in `.env` (should be reasonable like 7d)
3. Check system clock synchronization

---

### Issue: Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F

# Kill process (Mac/Linux)
lsof -ti:5000 | xargs kill -9
```

Or change PORT in `.env`:
```env
PORT=5001
```

---

### Issue: Seed Data Script Fails
**Error:** `Cannot read property '_id' of undefined`

**Solutions:**
1. Verify MongoDB connection works
2. Clear MongoDB collections before seeding
3. Run with verbose logging: `node src/seed/seedData.js`

---

### Issue: Frontend Not Loading
**Error:** `Cannot GET /`

**Solutions:**
1. Ensure frontend server is running (check port 5173)
2. Verify `index.html` exists in frontend root
3. Check console for build errors
4. Clear `.next` or `dist` folder and rebuild

---

### Issue: Medicine Stock Not Updating After Sale
**Error:** Stock quantity unchanged after POS transaction

**Solutions:**
1. Verify sale controller updates medicine stock
2. Check MongoDB transaction atomicity
3. Ensure medicine ID is correctly linked in sale items
4. Check for race conditions in concurrent sales

---

### Performance Optimization Tips

```javascript
// 1. Add Indexes to MongoDB (in seed file or manually)
db.medicines.createIndex({ "name": 1 })
db.medicines.createIndex({ "batchNumber": 1 })
db.medicines.createIndex({ "expiryDate": 1 })
db.sales.createIndex({ "createdAt": -1 })

// 2. Enable Response Caching in Frontend
// Use SWR or React Query for automatic caching

// 3. Paginate Large Datasets
// Implement pagination in GET /api/medicines

// 4. Compress API Responses
// Use gzip compression in Express
```

---

## 📝 Contributing

We welcome contributions! Here's how to contribute:

### 1. Fork the Repository
```bash
git clone https://github.com/yourusername/MediSure360.git
cd MediSure360
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes & Commit
```bash
git add .
git commit -m "Add: description of your changes"
```

### 4. Push & Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

### Code Style Guidelines
- Use ES6+ syntax
- Follow existing code patterns
- Add comments for complex logic
- Test your changes before submitting

---

## 📄 License

This project is licensed under the **MIT License** - see LICENSE file for details.

---

## 👨‍💻 Project Info

- **Version**: 2.0.0
- **Last Updated**: March 2024
- **Author**: Development Team
- **Status**: Active & Maintained

---

## 📞 Support & Questions

- 📧 Email: support@medisure360.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/MediSure360/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/MediSure360/discussions)

---

## 🎉 Acknowledgments

- **MongoDB** for reliable cloud database
- **React & Vite** for modern frontend tooling
- **Express.js** for lightweight backend framework
- **Chart.js** for beautiful data visualization
- All contributors and community members

---

## 📈 Future Enhancements

- [ ] Mobile app for Android/iOS (React Native)
- [ ] Email notifications for low stock
- [ ] SMS reminders for expiry alerts
- [ ] Barcode scanning for quick inventory
- [ ] Multi-location warehouse management
- [ ] Advanced reporting & PDF export
- [ ] Supplier management module
- [ ] Integration with accounting software
- [ ] Real-time inventory sync
- [ ] AI-powered demand forecasting

---

**Happy coding! 💊✨**
    │   ├── utils/
    │   │   └── api.js                  # Axios instance with JWT
    │   ├── App.jsx                     # Router + protected routes
    │   ├── main.jsx
    │   └── index.css                   # Full dark theme design system
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Setup Instructions

### 1. MongoDB Atlas Setup
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) and create a free cluster
2. Create a database user (username + password)
3. Whitelist your IP (or use `0.0.0.0/0` for development)
4. Copy your connection string: `mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/`

---

### 2. Backend Setup

```bash
cd backend
npm install

# Create your .env file
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://youruser:yourpass@yourcluster.mongodb.net/medical_store?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret_key_here
NODE_ENV=development
```

**Seed the database** (25 medicines + 6 months of realistic sales):
```bash
npm run seed
```

**Start the backend:**
```bash
npm run dev      # Development (nodemon)
npm start        # Production
```

Backend runs on: **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

## 🔐 Demo Login Credentials

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@medstore.com     | admin123   |
| Staff | staff@medstore.com     | staff123   |

---

## ✨ Features

### 📊 Dashboard
- Live KPI cards: total medicines, stock value, low stock count, expiring count
- Recent transactions list
- Low stock alert list

### 💊 Inventory
- Full medicine list with search (name, batch, manufacturer)
- Filter by category, low stock, expiring, expired
- Edit / Delete medicines
- Color-coded stock and expiry status badges

### ➕ Add / Edit Medicine
- Complete form: name, manufacturer, batch, location, category
- Pricing with live profit margin calculator
- Stock quantity and expiry date

### 🧾 Point of Sale (Billing)
- Live search — type to find medicines instantly
- Add to cart, adjust quantities, remove items
- Customer name, payment method (Cash/Card/UPI/Other)
- Apply discount
- Finalize and generate printable receipt
- Auto stock deduction on sale

### 📋 Sales History
- Paginated list of all transactions
- Filter by date range
- View individual receipts
- Running total for filtered period

### ⚠️ Expiry Alerts
- Three tabs: Expiring Soon / Expired / All
- Color-coded urgency (red/yellow)
- Sorted by days remaining

### 📈 Analytics (6 Charts + Tables)
- **Revenue & Profit Over Time** — line chart (daily/monthly)
- **Top Selling Medicines** — horizontal bar chart by units sold
- **Sales by Category** — donut chart by revenue share
- **Daily Transactions** — bar chart of bill counts
- **Payment Methods** — donut chart breakdown
- **Stock Expiry Health** — donut with medicine expiry grouping
- **Top Medicines Table** — with revenue share progress bars
- Period filter: 7D / 30D / 90D / 1Y
- KPI cards with % change vs previous period

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint         | Description        |
|--------|------------------|--------------------|
| POST   | /api/auth/login  | Login              |
| POST   | /api/auth/register | Register         |
| GET    | /api/auth/me     | Get current user   |

### Medicines
| Method | Endpoint                    | Description             |
|--------|-----------------------------|-------------------------|
| GET    | /api/medicines              | List (search/filter)    |
| GET    | /api/medicines/search       | Live POS search         |
| GET    | /api/medicines/stats        | Dashboard stats         |
| POST   | /api/medicines              | Add medicine            |
| PUT    | /api/medicines/:id          | Update medicine         |
| DELETE | /api/medicines/:id          | Delete medicine         |

### Sales
| Method | Endpoint       | Description        |
|--------|----------------|--------------------|
| POST   | /api/sales     | Create sale (POS)  |
| GET    | /api/sales     | List all sales     |
| GET    | /api/sales/:id | Get receipt        |

### Analytics
| Method | Endpoint                       | Description            |
|--------|--------------------------------|------------------------|
| GET    | /api/analytics/summary         | KPI summary + changes  |
| GET    | /api/analytics/revenue         | Revenue over time      |
| GET    | /api/analytics/top-medicines   | Top sellers            |
| GET    | /api/analytics/category-sales  | Sales by category      |
| GET    | /api/analytics/transactions    | Daily transaction count|
| GET    | /api/analytics/payment-methods | Payment breakdown      |
| GET    | /api/analytics/stock-health    | Expiry health          |

---

## 🛠️ Tech Stack

| Layer     | Technology                            |
|-----------|---------------------------------------|
| Database  | MongoDB Atlas (Cloud)                 |
| Backend   | Node.js + Express.js                  |
| Auth      | JWT (jsonwebtoken) + bcryptjs         |
| Frontend  | Vite + React 18                       |
| Charts    | Chart.js + react-chartjs-2            |
| Routing   | React Router v6                       |
| HTTP      | Axios (with interceptors)             |
| Toasts    | react-hot-toast                       |
| Icons     | react-icons                           |
| Fonts     | Plus Jakarta Sans + JetBrains Mono    |

---

## 🌙 Design System

Dark theme inspired by GitHub's dark mode:
- Background: `#0d1117` / `#161b22` / `#1c2333`
- Green accent: `#2ea043`
- Blue accent: `#388bfd`
- Typography: Plus Jakarta Sans (UI) + JetBrains Mono (numbers/code)
