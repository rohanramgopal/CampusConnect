cat > README.md <<'EOF'
# 🎓 CampusConnect — Premium College Management System

![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/API-Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Status](https://img.shields.io/badge/Status-Major_Project-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

CampusConnect is a premium full-stack college management system designed to centralize communication and academic workflows between administrators, teachers, and students. It replaces scattered WhatsApp groups, manual registers, notice boards, informal updates, and untracked complaints with a structured digital platform.

The system provides separate role-based dashboards for Admin, Teacher, and Student users. Each role gets only the features and permissions required for their responsibilities, making the platform secure, organized, and easy to use.

## 🚀 Key Highlights

- Premium web dashboard interface
- Role-based authentication using JWT
- Separate Admin, Teacher, and Student portals
- Admin-controlled announcements, exams, events, timetable, users, and complaints
- Teacher tools for assignments, class messaging, direct student messaging, marks entry, and complaint viewing
- Student tools for assignments, timetable, updates, marks, class chat, direct teacher messaging, and complaints
- Class-wise communication based on department, section, and semester
- Complaint system from student to admin or selected teacher
- Marks entry system for teachers and marks viewing system for students
- MongoDB database with Mongoose models
- REST API architecture using Express.js
- Clean, scalable, major-project-level implementation

## 🧠 Problem Statement

Colleges often depend on disconnected tools such as WhatsApp groups, physical notice boards, spreadsheets, verbal communication, and manual registers. These methods create confusion, missed updates, lack of accountability, and poor academic tracking.

CampusConnect solves this problem by providing one centralized system where administrators, teachers, and students can manage academic communication and college activities in a structured way.

## 🎯 Objectives

- Build a centralized college management system
- Provide secure login for Admin, Teacher, and Student users
- Enable admins to manage academic communication
- Allow teachers to manage assignments, marks, and class communication
- Allow students to access academic information from one dashboard
- Provide direct messaging between teachers and students
- Provide class-wise communication based on section and semester
- Allow students to raise complaints to admin or teacher
- Improve transparency, tracking, and accountability in college workflows

## 👤 User Roles

### Admin

The Admin has complete control over the system.

Admin can:

- View registered users
- Manage timetables
- Post announcements
- Schedule exams
- Add college events
- View student complaints
- Track dashboard statistics

### Teacher

The Teacher manages class-level academic activities.

Teacher can:

- View assigned students
- View timetable
- Create assignments
- View assignment submissions
- Send messages to the entire class
- Send direct messages to individual students
- Enter student marks
- View complaints sent by students

### Student

The Student accesses academic information and communicates with teachers.

Student can:

- View timetable
- View assignments
- Submit assignment answers
- View announcements
- View exams and events
- View marks entered by teachers
- Send direct messages to teachers
- View class messages
- Raise complaints to admin or teacher

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Axios
- Lucide React Icons
- CSS3
- Responsive dashboard UI

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- CORS
- dotenv

### Database

- MongoDB local or MongoDB Atlas

### Tools

- VS Code
- Git
- GitHub
- Postman or Thunder Client
- Terminal

## 🏗️ Architecture

```mermaid
flowchart TD

    A[Admin User] --> F[React Web Frontend]
    B[Teacher User] --> F
    C[Student User] --> F

    F --> API[Express REST API]

    API --> AUTH[Authentication Module]
    API --> USER[User Management Module]
    API --> TIME[Timetable Module]
    API --> ANN[Announcement Module]
    API --> EXAM[Exam and Event Module]
    API --> ASSIGN[Assignment Module]
    API --> MSG[Messaging Module]
    API --> MARKS[Marks Module]
    API --> COMP[Complaint Module]

    AUTH --> DB[(MongoDB Database)]
    USER --> DB
    TIME --> DB
    ANN --> DB
    EXAM --> DB
    ASSIGN --> DB
    MSG --> DB
    MARKS --> DB
    COMP --> DB

    DB --> API
    API --> F
```

## 🔐 Authentication Flow

```mermaid
sequenceDiagram

    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Enter email and password
    Frontend->>Backend: Send login request
    Backend->>Database: Find user by email
    Database-->>Backend: Return user data
    Backend->>Backend: Compare hashed password
    Backend->>Backend: Generate JWT token
    Backend-->>Frontend: Return token and user role
    Frontend->>Frontend: Store session state
    Frontend-->>User: Redirect to role dashboard
```

## 📢 Announcement Flow

```mermaid
flowchart LR

    A[Admin Creates Announcement] --> B[Backend Validates Admin Token]
    B --> C[Save Announcement in MongoDB]

    C --> D{Target Role}

    D -->|All| E[Visible to Teachers and Students]
    D -->|Teacher| F[Visible to Teachers]
    D -->|Student| G[Visible to Students]
```

## 💬 Messaging Flow

```mermaid
flowchart TD

    A[Teacher Sends Class Message]
    --> B[Saved with Department Section Semester]
    --> C[All Students in Same Class Can View]

    D[Teacher Sends Direct Message]
    --> E[Saved with Receiver Student ID]
    --> F[Only Selected Student Can View]

    G[Student Sends Direct Message]
    --> H[Saved with Receiver Teacher ID]
    --> I[Only Selected Teacher Can View]
```

## 📝 Complaint Flow

```mermaid
flowchart TD

    A[Student Raises Complaint]
    --> B{Send To}

    B -->|Admin| C[Admin Complaint Dashboard]
    B -->|Teacher| D[Selected Teacher Complaint Dashboard]

    C --> E[Admin Reviews Status]
    D --> F[Teacher Reviews Complaint]
```

## 📊 Marks Flow

```mermaid
flowchart LR

    A[Teacher Selects Student]
    --> B[Enter Subject Exam Marks Remarks]
    --> C[Save Marks in MongoDB]
    --> D[Student Views Marks in Dashboard]
```
