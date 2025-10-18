# 🎓 TutorHub – Ethiopia

TutorHub – Ethiopia is a modern tutoring platform that connects students with qualified tutors across Ethiopia. It offers an easy way to find tutors, manage learning sessions, and communicate securely — all through intuitive dashboards for Students, Tutors, and Admins.

---

## 🚀 Features

### 🌐 Public Pages
- **Home:** Hero, About, Top-rated Tutors, Testimonials, FAQs  
- **About:** Mission, Vision, Values, Stats, and Social Links  
- **Find Tutor:** Search by subject or grade, view tutor profiles  
- **Contact:** Contact form and details  
- **Auth Pages:** Sign In, Sign Up (Student/Tutor), and Forgot Password (OTP-based)

### 👩‍🎓 Student Dashboard
- Overview of enrolled and completed tutors  
- Search or request tutors  
- Chat with enrolled tutors  
- Manage profile and change password  

### 👨‍🏫 Tutor Dashboard
- Dashboard showing active and completed students  
- Complete and manage tutor profile (admin-approved)  
- View and respond to tutor requests  
- Chat with students  

### 🛠️ Admin Dashboard
- Manage users (students and tutors)  
- Review reports filed against users  
- Approve or reject testimonials  
- View platform stats and admin activity logs  

---

## 🧱 Tech Stack
- **Frontend:** Next.js + Tailwind CSS  
- **Backend:** NestJS + MongoDB *(planned)*  
- **Design:** Responsive, modern UI with Orange, Blue, and White theme  
- **Auth:** JWT & Google OAuth *(planned)*  

---
```
## ⚙️ Project Structure

TutorHub/
├── apps/
│   ├── web/       # Next.js frontend
│   └── backend/   # NestJS backend
├── packages/
│   └── ui/        # Shared UI components
└── turbo.json     # Turborepo config
```

---


## 🧭 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/tutorhub.git
cd tutorhub
```
### 2. Install dependencies
```bash
pnpm install
```
### 3. Run the project
```bash
pnpm dev
```
### 4. Open in browser
```bash
http://localhost:3000
```
---