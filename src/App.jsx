import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ShieldCheck,
  GraduationCap,
  Users,
  CalendarDays,
  Megaphone,
  ClipboardList,
  MessageCircle,
  AlertTriangle,
  LogOut,
  BookOpen,
  PlusCircle
} from "lucide-react";
import "./styles.css";

const API_BASE = "http://localhost:5001/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [screen, setScreen] = useState("dashboard");

  const api = useMemo(() => {
    return axios.create({
      baseURL: API_BASE,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  }, [token]);

  const logout = () => {
    setUser(null);
    setToken("");
    setScreen("dashboard");
  };

  if (!user) {
    return <AuthPage setUser={setUser} setToken={setToken} />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <GraduationCap size={30} />
          </div>
          <div>
            <h2>CampusConnect</h2>
            <p>{user.role.toUpperCase()} PORTAL</p>
          </div>
        </div>

        <nav>
          <NavItem icon={<ShieldCheck />} label="Dashboard" active={screen === "dashboard"} onClick={() => setScreen("dashboard")} />

          {user.role === "admin" && (
            <>
              <NavItem icon={<Users />} label="Users" active={screen === "users"} onClick={() => setScreen("users")} />
              <NavItem icon={<CalendarDays />} label="Timetable" active={screen === "timetable"} onClick={() => setScreen("timetable")} />
              <NavItem icon={<Megaphone />} label="Announcements" active={screen === "announcements"} onClick={() => setScreen("announcements")} />
              <NavItem icon={<BookOpen />} label="Exams & Events" active={screen === "exams"} onClick={() => setScreen("exams")} />
              <NavItem icon={<AlertTriangle />} label="Complaints" active={screen === "complaints"} onClick={() => setScreen("complaints")} />
            </>
          )}

          {user.role === "teacher" && (
            <>
              <NavItem icon={<CalendarDays />} label="Timetable" active={screen === "timetable"} onClick={() => setScreen("timetable")} />
              <NavItem icon={<ClipboardList />} label="Assignments" active={screen === "assignments"} onClick={() => setScreen("assignments")} />
              <NavItem icon={<MessageCircle />} label="Class Messages" active={screen === "messages"} onClick={() => setScreen("messages")} />
            </>
          )}

          {user.role === "student" && (
            <>
              <NavItem icon={<CalendarDays />} label="Timetable" active={screen === "timetable"} onClick={() => setScreen("timetable")} />
              <NavItem icon={<ClipboardList />} label="Assignments" active={screen === "assignments"} onClick={() => setScreen("assignments")} />
              <NavItem icon={<Megaphone />} label="Updates" active={screen === "updates"} onClick={() => setScreen("updates")} />
              <NavItem icon={<MessageCircle />} label="Class Chat" active={screen === "messages"} onClick={() => setScreen("messages")} />
              <NavItem icon={<AlertTriangle />} label="Complaint" active={screen === "complaint"} onClick={() => setScreen("complaint")} />
            </>
          )}
        </nav>

        <button className="logout-btn" onClick={logout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="main">
        <Header user={user} />

        {screen === "dashboard" && <Dashboard api={api} user={user} />}
        {screen === "users" && user.role === "admin" && <AdminUsers api={api} />}
        {screen === "timetable" && <Timetable api={api} user={user} />}
        {screen === "announcements" && user.role === "admin" && <AdminAnnouncements api={api} />}
        {screen === "exams" && user.role === "admin" && <AdminExamsEvents api={api} />}
        {screen === "complaints" && user.role === "admin" && <AdminComplaints api={api} />}
        {screen === "assignments" && user.role === "teacher" && <TeacherAssignments api={api} user={user} />}
        {screen === "assignments" && user.role === "student" && <StudentAssignments api={api} />}
        {screen === "messages" && user.role === "teacher" && <TeacherMessages api={api} />}
        {screen === "messages" && user.role === "student" && <StudentMessages api={api} />}
        {screen === "updates" && user.role === "student" && <StudentUpdates api={api} />}
        {screen === "complaint" && user.role === "student" && <StudentComplaint api={api} />}
      </main>
    </div>
  );
}

function AuthPage({ setUser, setToken }) {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [loginForm, setLoginForm] = useState({
    email: "admin@campus.com",
    password: "123456"
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "123456",
    role: "student",
    department: "ECE",
    section: "A",
    semester: "8",
    subject: ""
  });

  const login = async () => {
    try {
      setLoading(true);
      setMsg("");
      const res = await axios.post(`${API_BASE}/auth/login`, loginForm);
      setUser(res.data.user);
      setToken(res.data.token);
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed. Register user first.");
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    try {
      setLoading(true);
      setMsg("");
      await axios.post(`${API_BASE}/auth/register`, registerForm);
      setMsg("Account created successfully. Now login.");
      setMode("login");
      setLoginForm({
        email: registerForm.email,
        password: registerForm.password
      });
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const data = {
      admin: ["admin@campus.com", "123456"],
      teacher: ["teacher@campus.com", "123456"],
      student: ["student@campus.com", "123456"]
    };
    setLoginForm({ email: data[role][0], password: data[role][1] });
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="premium-badge">COLLEGE MANAGEMENT SYSTEM</div>
        <h1>CampusConnect</h1>
        <p>
          Premium role-based academic communication platform for admins, teachers and students.
        </p>

        <div className="feature-grid">
          <Feature icon={<ShieldCheck />} title="Role Security" text="JWT-based Admin, Teacher and Student access." />
          <Feature icon={<ClipboardList />} title="Assignments" text="Create, submit and track academic tasks." />
          <Feature icon={<AlertTriangle />} title="Anonymous Complaints" text="Students can report issues safely." />
          <Feature icon={<MessageCircle />} title="Class Communication" text="Section-wise communication system." />
        </div>
      </div>

      <div className="auth-card">
        <div className="toggle">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Login</button>
          <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Register</button>
        </div>

        {mode === "login" ? (
          <>
            <h2>Welcome Back</h2>
            <p className="muted">Login to continue to your dashboard.</p>

            <input placeholder="Email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
            <input placeholder="Password" type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />

            <button className="primary-btn" onClick={login} disabled={loading}>
              {loading ? "Checking..." : "Login Securely"}
            </button>

            <div className="demo-buttons">
              <button onClick={() => fillDemo("admin")}>Admin</button>
              <button onClick={() => fillDemo("teacher")}>Teacher</button>
              <button onClick={() => fillDemo("student")}>Student</button>
            </div>
          </>
        ) : (
          <>
            <h2>Create Account</h2>
            <p className="muted">Register Admin, Teacher or Student.</p>

            <input placeholder="Name" value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} />
            <input placeholder="Email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} />
            <input placeholder="Password" type="password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} />

            <select value={registerForm.role} onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>

            <input placeholder="Department" value={registerForm.department} onChange={(e) => setRegisterForm({ ...registerForm, department: e.target.value })} />
            <input placeholder="Section" value={registerForm.section} onChange={(e) => setRegisterForm({ ...registerForm, section: e.target.value })} />
            <input placeholder="Semester" value={registerForm.semester} onChange={(e) => setRegisterForm({ ...registerForm, semester: e.target.value })} />
            <input placeholder="Subject only for teacher" value={registerForm.subject} onChange={(e) => setRegisterForm({ ...registerForm, subject: e.target.value })} />

            <button className="primary-btn" onClick={register} disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </>
        )}

        {msg && <div className="message">{msg}</div>}
      </div>
    </div>
  );
}

function Header({ user }) {
  return (
    <div className="header">
      <div>
        <h1>Welcome, {user.name}</h1>
        <p>{user.role} dashboard · {user.department || "Campus"} {user.section ? `· Section ${user.section}` : ""}</p>
      </div>
      <div className="profile-pill">{user.role.toUpperCase()}</div>
    </div>
  );
}

function Dashboard({ api, user }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user.role === "admin") {
      api.get("/admin/dashboard").then((res) => setStats(res.data)).catch(() => {});
    }
  }, []);

  return (
    <>
      <div className="cards">
        <Stat title="Role" value={user.role.toUpperCase()} icon={<ShieldCheck />} />
        <Stat title="Department" value={user.department || "All"} icon={<GraduationCap />} />
        <Stat title="Section" value={user.section || "All"} icon={<Users />} />
        <Stat title="System" value="Live" icon={<CalendarDays />} />
      </div>

      {user.role === "admin" && stats && (
        <div className="cards">
          <Stat title="Users" value={stats.users} icon={<Users />} />
          <Stat title="Complaints" value={stats.complaints} icon={<AlertTriangle />} />
          <Stat title="Announcements" value={stats.announcements} icon={<Megaphone />} />
        </div>
      )}

      <div className="panel">
        <h2>CampusConnect Overview</h2>
        <p>
          This platform centralizes college communication, timetable management,
          announcements, assignments, exams, events, class messages and anonymous complaints.
        </p>
      </div>
    </>
  );
}

function AdminUsers({ api }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/admin/users").then((res) => setUsers(res.data)).catch(() => {});
  }, []);

  return (
    <Panel title="Registered Users">
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Section</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><span className="tag">{u.role}</span></td>
              <td>{u.department || "-"}</td>
              <td>{u.section || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

function Timetable({ api, user }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    department: "ECE",
    section: "A",
    semester: "8",
    day: "Monday",
    time: "10:00 AM - 11:00 AM",
    subject: "Cybersecurity",
    teacher: "Teacher One",
    room: "Room 101"
  });

  const load = () => {
    if (user.role === "admin") api.get("/admin/timetable").then((res) => setItems(res.data));
    if (user.role === "teacher") api.get("/teacher/timetable").then((res) => setItems(res.data));
    if (user.role === "student") api.get("/student/timetable").then((res) => setItems(res.data));
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    await api.post("/admin/timetable", {
      department: form.department,
      section: form.section,
      semester: form.semester,
      day: form.day,
      periods: [{ time: form.time, subject: form.subject, teacher: form.teacher, room: form.room }]
    });
    load();
  };

  return (
    <>
      {user.role === "admin" && (
        <Panel title="Create Timetable">
          <FormGrid form={form} setForm={setForm} />
          <button className="primary-btn small" onClick={create}><PlusCircle size={18} /> Save Timetable</button>
        </Panel>
      )}

      <Panel title="Timetable">
        <div className="grid-list">
          {items.map((t) => (
            <div className="mini-card" key={t._id}>
              <h3>{t.day}</h3>
              <p>{t.department} · {t.section} · Sem {t.semester}</p>
              {t.periods?.map((p, i) => (
                <div className="period" key={i}>
                  <b>{p.time}</b>
                  <span>{p.subject} · {p.teacher} · {p.room}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function AdminAnnouncements({ api }) {
  const [form, setForm] = useState({ title: "", message: "", targetRole: "all", department: "", section: "" });

  const create = async () => {
    await api.post("/admin/announcements", form);
    alert("Announcement posted");
    setForm({ title: "", message: "", targetRole: "all", department: "", section: "" });
  };

  return (
    <Panel title="Post Announcement">
      <FormGrid form={form} setForm={setForm} textarea="message" />
      <button className="primary-btn small" onClick={create}>Post Announcement</button>
    </Panel>
  );
}

function AdminExamsEvents({ api }) {
  const [exam, setExam] = useState({
    title: "Internal Exam",
    subject: "Cybersecurity",
    department: "ECE",
    section: "A",
    semester: "8",
    date: "2026-05-20",
    time: "10:00 AM",
    room: "Room 101"
  });

  const [event, setEvent] = useState({
    title: "Tech Fest",
    description: "College technical event",
    date: "2026-05-25",
    time: "11:00 AM",
    venue: "Auditorium"
  });

  return (
    <div className="two-col">
      <Panel title="Create Exam">
        <FormGrid form={exam} setForm={setExam} />
        <button className="primary-btn small" onClick={async () => { await api.post("/admin/exams", exam); alert("Exam added"); }}>Save Exam</button>
      </Panel>

      <Panel title="Create Event">
        <FormGrid form={event} setForm={setEvent} textarea="description" />
        <button className="primary-btn small" onClick={async () => { await api.post("/admin/events", event); alert("Event added"); }}>Save Event</button>
      </Panel>
    </div>
  );
}

function AdminComplaints({ api }) {
  const [items, setItems] = useState([]);

  const load = () => api.get("/admin/complaints").then((res) => setItems(res.data));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/admin/complaints/${id}`, { status });
    load();
  };

  return (
    <Panel title="Anonymous Complaints">
      <div className="grid-list">
        {items.map((c) => (
          <div className="mini-card danger" key={c._id}>
            <h3>{c.referenceCode}</h3>
            <p><b>{c.category}</b></p>
            <p>{c.message}</p>
            <select value={c.status} onChange={(e) => updateStatus(c._id, e.target.value)}>
              <option value="pending">pending</option>
              <option value="reviewed">reviewed</option>
              <option value="resolved">resolved</option>
            </select>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function TeacherAssignments({ api, user }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: "Assignment 1",
    description: "Submit your work",
    subject: user.subject || "Cybersecurity",
    department: user.department || "ECE",
    section: user.section || "A",
    semester: user.semester || "8",
    dueDate: "2026-05-30"
  });

  const load = () => api.get("/teacher/assignments").then((res) => setItems(res.data));
  useEffect(() => { load(); }, []);

  const create = async () => {
    await api.post("/teacher/assignments", form);
    load();
  };

  return (
    <>
      <Panel title="Create Assignment">
        <FormGrid form={form} setForm={setForm} textarea="description" />
        <button className="primary-btn small" onClick={create}>Create Assignment</button>
      </Panel>

      <Panel title="My Assignments">
        <div className="grid-list">
          {items.map((a) => (
            <div className="mini-card" key={a._id}>
              <h3>{a.title}</h3>
              <p>{a.description}</p>
              <p><b>Due:</b> {a.dueDate}</p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function StudentAssignments({ api }) {
  const [items, setItems] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    api.get("/student/assignments").then((res) => setItems(res.data)).catch(() => {});
  }, []);

  const submit = async (id) => {
    await api.post(`/student/assignments/${id}/submit`, { answer: answers[id] || "" });
    alert("Assignment submitted");
  };

  return (
    <Panel title="Assignments">
      <div className="grid-list">
        {items.map((a) => (
          <div className="mini-card" key={a._id}>
            <h3>{a.title}</h3>
            <p>{a.description}</p>
            <p><b>Due:</b> {a.dueDate}</p>
            <textarea placeholder="Write your answer" value={answers[a._id] || ""} onChange={(e) => setAnswers({ ...answers, [a._id]: e.target.value })} />
            <button className="primary-btn small" onClick={() => submit(a._id)}>Submit</button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function TeacherMessages({ api }) {
  const [form, setForm] = useState({ department: "ECE", section: "A", message: "" });

  const send = async () => {
    await api.post("/teacher/messages", form);
    alert("Message sent");
    setForm({ ...form, message: "" });
  };

  return (
    <Panel title="Send Class Message">
      <FormGrid form={form} setForm={setForm} textarea="message" />
      <button className="primary-btn small" onClick={send}>Send Message</button>
    </Panel>
  );
}

function StudentMessages({ api }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/student/messages").then((res) => setItems(res.data)).catch(() => {});
  }, []);

  return (
    <Panel title="Class Messages">
      <div className="grid-list">
        {items.map((m) => (
          <div className="mini-card" key={m._id}>
            <h3>{m.senderName}</h3>
            <p>{m.message}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function StudentUpdates({ api }) {
  const [announcements, setAnnouncements] = useState([]);
  const [exams, setExams] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/student/announcements").then((res) => setAnnouncements(res.data)).catch(() => {});
    api.get("/student/exams").then((res) => setExams(res.data)).catch(() => {});
    api.get("/student/events").then((res) => setEvents(res.data)).catch(() => {});
  }, []);

  return (
    <>
      <Panel title="Announcements">
        <Cards items={announcements} titleKey="title" textKey="message" />
      </Panel>
      <Panel title="Exams">
        <Cards items={exams} titleKey="subject" textKey="date" />
      </Panel>
      <Panel title="Events">
        <Cards items={events} titleKey="title" textKey="venue" />
      </Panel>
    </>
  );
}

function StudentComplaint({ api }) {
  const [form, setForm] = useState({ category: "Academic", message: "" });

  const submit = async () => {
    const res = await api.post("/student/complaints", form);
    alert(`Complaint submitted. Reference: ${res.data.referenceCode}`);
    setForm({ category: "Academic", message: "" });
  };

  return (
    <Panel title="Submit Anonymous Complaint">
      <p className="muted">Your identity is not attached to this complaint.</p>
      <FormGrid form={form} setForm={setForm} textarea="message" />
      <button className="primary-btn small" onClick={submit}>Submit Complaint</button>
    </Panel>
  );
}

function Cards({ items, titleKey, textKey }) {
  return (
    <div className="grid-list">
      {items.map((x) => (
        <div className="mini-card" key={x._id}>
          <h3>{x[titleKey]}</h3>
          <p>{x[textKey]}</p>
        </div>
      ))}
    </div>
  );
}

function FormGrid({ form, setForm, textarea }) {
  return (
    <div className="form-grid">
      {Object.keys(form).map((key) =>
        key === textarea ? (
          <textarea key={key} placeholder={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
        ) : (
          <input key={key} placeholder={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
        )
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>
      {React.cloneElement(icon, { size: 18 })}
      {label}
    </button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Stat({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="feature">
      {icon}
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
