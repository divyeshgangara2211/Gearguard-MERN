# GearGuard – Maintenance Management Dashboard (MERN)

GearGuard is a full‑stack **MERN** application for managing industrial equipment, maintenance requests, and technician teams in one place. It provides a Kanban‑style workflow and calendar view so maintenance work never falls through the cracks. [web:175]

---

## ✨ Key Features

- **Equipment management**
  - Create, edit, delete, and list equipment with status and key metadata.
  - Track lifecycle from active usage to scrap. [web:168]

- **Maintenance requests**
  - Kanban board with columns like New, In Progress, Completed, Scrap.
  - Update status with drag‑and‑drop style interactions (depending on UI) for better visibility. [web:175]

- **Calendar view**
  - Visualize upcoming and past maintenance requests on a calendar.
  - Quickly spot overloaded days and overdue tasks. [web:158]

- **Team management**
  - Maintain maintenance teams and associate requests/equipment with teams.
  - Clear ownership for each maintenance task. [web:181]

- **Clean modular architecture**
  - Separate `client` (React) and `server` (Node/Express) folders.
  - Controllers, models, and routes split by domain for easier scaling. [web:175]

---

## 🧱 Tech Stack

- **Frontend**
  - React (SPA)
  - React components for Dashboard, Equipment, Requests, Teams pages
  - Custom CSS modules for Calendar, Kanban, Navbar, Teams, Equipment views [web:158]

- **Backend**
  - Node.js, Express.js
  - RESTful APIs for equipment, maintenance requests, and teams
  - Centralized error handling middleware [web:175]

- **Database**
  - MongoDB with Mongoose models:
    - `Equipment`
    - `MaintenanceRequest`
    - `MaintenanceTeam` [web:181]

- **Tooling & Others**
  - Axios for API calls from client
  - dotenv for environment variables
  - nodemon for backend development [web:181]

---

## 📁 Project Structure


Gearguard-MERN/
├── client/                     # React frontend
│   ├── README.md
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── index.js
│       ├── index.css
│       ├── reportWebVitals.js
│       ├── setupTests.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── EquipmentForm.jsx
│       │   ├── EquipmentList.jsx
│       │   ├── RequestCalendar.jsx
│       │   ├── RequestKanban.jsx
│       │   └── TeamList.jsx
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Equipment.jsx
│       │   ├── Requests.jsx
│       │   └── Teams.jsx
│       ├── services/
│       │   └── api.js
│       └── styles/
│           ├── Calendar.css
│           ├── Dashboard.css
│           ├── Equipment.css
│           ├── Kanban.css
│           ├── Navbar.css
│           └── Teams.css
│
├── server/                     # Express backend
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── .env                     # not committed (ignored)
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── equipmentController.js
│   │   ├── requestController.js
│   │   └── teamController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Equipment.js
│   │   ├── MaintenanceRequest.js
│   │   └── MaintenanceTeam.js
│   └── routes/
│       ├── equipment.js
│       ├── request.js
│       └── team.js
│
├── .gitignore
└── README.md


---

## 🚀 Getting Started (Local Setup)

Follow the steps below to run the **Gearguard MERN** project locally.

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/divyeshgangara2211/Gearguard-MERN.git
cd Gearguard-MERN



### 2. Backend setup (`server`)

```bash
cd server
npm install


## Create a `.env` file inside `server`:

```bash
MONGO_URI=your_mongodb_connection_string
PORT=5000



## Run the backend:

```bash
npm run dev


## Backend API will be available at:
```bash
http://localhost:5000



### 3. Frontend setup (`client`)

In a new terminal from project root:

```bash
cd client
npm install
npm start


React application will be available at:
```bash
http://localhost:3000


---

## 🔌 Core API Design

> Exact URLs may differ slightly based on your route definitions, but this is the intended API surface.

### Equipment APIs

- `GET    /api/equipment` – Fetch all equipment
- `POST   /api/equipment` – Create new equipment
- `PUT    /api/equipment/:id` – Update equipment
- `DELETE /api/equipment/:id` – Delete equipment [web:175]

### Maintenance Request APIs

- `GET    /api/requests` – List all maintenance requests
- `POST   /api/requests` – Create a maintenance request
- `PUT    /api/requests/:id` – Update status/details of a request [web:175]

### Team APIs

- `GET    /api/teams` – Get all maintenance teams
- `POST   /api/teams` – Create a team
- `PUT    /api/teams/:id` – Update team info [web:181]

The React client talks to these endpoints through a centralized `services/api.js` module for cleaner API handling. [web:158]

---

## 🧠 What This Project Demonstrates

This project is designed to showcase skills that are directly relevant for a **MERN stack / backend** role:

- End‑to‑end CRUD flows (DB ↔ API ↔ UI) for multiple entities.
- Separation of concerns with controllers, models, routes, and middleware. [web:175]
- Consuming REST APIs from React with a clean service layer. [web:158]
- State driven UI for Kanban boards and calendar‑style visualizations. [web:186]
- Practical handling of environment variables and `.gitignore` for production‑ready code. [web:178]

---

## 📌 Future Enhancements

- Authentication and authorization (admin vs technician)
- Advanced filters (by status, priority, team, date range)
- Analytics dashboard (MTTR, open vs closed requests, equipment downtime)
- File uploads for equipment documents and maintenance reports
- Deployment to cloud (Render/railway for backend, Vercel/Netlify for frontend) [web:178]

---

## 🤝 Contributing / Feedback

This is a learning and portfolio project.  
Feedback, suggestions, and PRs are welcome—especially around:

- API design best practices
- UI/UX improvements for maintenance workflows
- Ideas to extend it into a production‑grade CMMS‑like tool [web:154]
