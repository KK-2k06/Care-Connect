# CareConnect

CareConnect is a mental health support platform designed for students, combining AI-aided assistance, confidential counselling, educational resources, and peer-to-peer support in one secure space.

---

## 🚀 Features

### 1. AI-Aided Support
- **Emergency / Sensitive Situations** (e.g., crisis help, severe depression symptoms):  
  - A **custom-trained model** acts as a **detector** to recognize danger.  
  - The response is always a **pre-written, 100% safe script** (no generative AI).  

- **Non-Emergency Situations** (e.g., stress, anxiety, loneliness):  
  - The same model detects these intents.  
  - Responses are powered by **generative AI** for empathetic and helpful conversations.  

---

### 2. Confidential Booking
- Students can schedule **private appointments** with college counsellors.  
- Key features:  
  - 🔐 Secure Login  
  - 📅 View counsellor availability  
  - 📝 Book a slot (no reason required)  
  - ✅ Instant confirmation  

---

### 3. Psychoeducational Resource Hub
- A curated hub of **psychoeducational video resources**.  
- Content available in **all regional languages** for accessibility.  

---

### 4. Peer-to-Peer Support
- An **open platform** where students can connect and share thoughts.  
- Single-room chat with **anonymous names** to ensure safety and privacy.  

---

### 5. Admin Dashboard
- Dedicated **admin login**.  
- Automated **data analysis** based on questions asked.  
- Helps counsellors and admins identify trends and needs.  

---

## 🛠️ Tech Stack (Suggested)
- **Frontend:** React.js + Tailwind CSS  
- **Backend:** Node.js  
- **Database:** MongoDB / SQL
- **AI Models:** Custom-trained intent detectors + Generative AI (for non-emergency cases)  

---

## 🎯 Vision
CareConnect aims to create a **safe, supportive, and stigma-free environment** for students to access help, learn, and share without judgment.

---

## Backend (Node.js + MongoDB Atlas)

This project includes an Express backend scaffold in `backend/` with authentication (JWT) and MongoDB (Mongoose).

### Environment

Create a `.env` in the project root:

```
MONGODB_URI="your atlas connection string"
JWT_SECRET="change_this_to_a_long_random_secret"
PORT=5000
```

### Scripts

```
npm run server   # start backend with nodemon
```

### Endpoints

- POST `/api/auth/signup` { email, password, confirmPassword }
- POST `/api/auth/login` { email, password }
- POST `/api/auth/admin-login` { email, password, adminCode }
- GET `/api/protected` (Authorization: Bearer <token>)
