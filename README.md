# 🏥 MDMS - Medical Distribution Management System

> A full-stack inventory management platform built for medical distributors to manage inventory, monitor sales, track expiry dates, and prevent stock losses in real-time.

## 📸 Dashboard

![Dashboard](https://github.com/user-attachments/assets/23ca52c5-39f8-4257-9a10-a46b021ee2ad)

## 🌐 Live Demo
👉 **[https://mdms-frontend-tawny.vercel.app](https://mdms-frontend-tawny.vercel.app)**

---
### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | demo@mdms.com | demo123 |

---

## 💡 Problem It Solves

Medical stores waste hours on manual inventory tracking, leading to:
- ❌ Stock running out unexpectedly
- ❌ Products expiring unnoticed
- ❌ No visibility into sales performance
- ❌ No role-based access control

**MDMS automates all of this** with real-time alerts, sales analytics, and secure role-based access.

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based login and registration
- Role-based access control (Admin / Staff / User)
- Protected routes on both frontend and backend
- JWT token-based authentication with protected routes

### 📦 Product Management
- Add, edit, and delete products
- Track batch numbers and expiry dates
- Real-time stock monitoring
- Search and filter products

### 💊 Sales Management
- Sell products with customer details
- Automatic stock deduction on sale
- Complete sales history with filters
- Date-based filtering (Today / Week / Month)

### 📊 Analytics Dashboard
- Real-time sales overview chart
- Total revenue tracking
- Low stock count
- Expiring soon alerts
- Inventory value calculation

### ⚠️ Alerts System
- Low stock warnings (below 10 units)
- Expiring soon alerts (within 30 days)
- Out of stock notifications
- Direct restock from alerts page

### 👥 User Management (Admin Only)
- View all registered users
- Change user roles (Admin / Staff / User)
- Role-based sidebar navigation

### 📱 Responsive Design
- Mobile-first approach
- Collapsible sidebar
- Works on all screen sizes

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend | React.js |
| Styling | Tailwind CSS |
| Charts | Recharts |
| HTTP Client | Axios |
| Routing | React Router DOM |
| Authentication | JWT (JSON Web Token) |
| Deployment | Vercel |

---

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── component/
│   │   ├── Sidebar.jsx
│   │   ├── NavbarTemp.jsx
│   │   ├── SalesChart.jsx
│   │   ├── RecentSales.jsx
│   │   ├── CardTemp.jsx
│   │   └── Alert.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── AddProduct.jsx
│   │   ├── SellData.jsx
│   │   ├── Sales.jsx
│   │   ├── Alerts.jsx
│   │   ├── Users.jsx
│   │   └── Profile.jsx
│   ├── api.js
│   ├── App.jsx
│   └── main.jsx
├── .env
├── vercel.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
```
Node.js v18+
npm or yarn
```

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/priyanshisin477/mdms-frontend.git
cd mdms-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Create `.env` file**
```env
VITE_API_URL=https://mdms-backend.onrender.com
```

**4. Run development server**
```bash
npm run dev
```

**5. Open in browser**
```
http://localhost:5173
```

---

## 🔗 Backend Repository

👉 **[MDMS Backend](https://github.com/priyanshisin477/mdms-backend)**

Backend built with Node.js + Express + MongoDB

---

## 📸 Screenshots

### Dashboard
![Dashboard](https://github.com/user-attachments/assets/134c88fc-3410-4fbd-8a71-5756f29ee293)

### Products
![Products](https://github.com/user-attachments/assets/41b5a3c0-060f-4d09-b5af-f0a99f125c3f)

### Sales History
![Sales](https://github.com/user-attachments/assets/2fea4ee7-f851-4142-9d17-c618618f4151)

### Alerts
![Alerts](https://github.com/user-attachments/assets/54e85580-d7ea-4c84-bdda-ea337352ffd9)

---

## 🎯 Role Based Access

| Feature | Admin | Staff | User |
|---------|-------|-------|------|
| View Products | ✅ | ✅ | ✅ |
| Add Product | ✅ | ❌ | ❌ |
| Edit/Delete Product | ✅ | ❌ | ❌ |
| Sell Product | ✅ | ✅ | ❌ |
| View Sales History | ✅ | ✅ | ❌ |
| View Alerts | ✅ | ✅ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| View Profile | ✅ | ✅ | ✅ |

---

## 🐛 Key Challenges & Solutions

### Challenge 1 — Sales Not Saving
```
Problem: Sale.create() was written after 
         the return statement
Solution: Moved Sale.create() before 
          return res.json()
Learning: Code after return never executes!
```

### Challenge 2 — Token Not Saving
```
Problem: Used res.data.token (axios syntax) 
         with fetch API
Solution: Changed to data.token after 
          await res.json()
Learning: fetch and axios handle 
          responses differently
```

### Challenge 3 — Role Not Updating
```
Problem: Old token had previous role,
         MongoDB role was updated
Solution: Logout and login again 
          to get fresh token
Learning: JWT tokens are stateless — 
          changes reflect on new token only
```

---

## 🔮 Future Improvements

- [ ] Shopping cart for users
- [ ] PDF invoice generation
- [ ] Real-time notifications (Socket.io)
- [ ] React Native mobile app
- [ ] Payment gateway (Razorpay)
- [ ] Email/SMS alerts

---

## 👩‍💻 Developer

**Priyanshi Singh**
- GitHub: [@priyanshisin477](https://github.com/priyanshisin477)
- LinkedIn: [priyanshisin477](https://linkedin.com/in/priyanshisin477)
- Email: priyanshisin477@gmail.com

---

## 📄 License

This project is licensed under the 
MIT License

---

⭐ **If you found this project helpful, 
please give it a star!**
