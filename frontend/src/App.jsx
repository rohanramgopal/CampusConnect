import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  GraduationCap, LayoutDashboard, Users, CalendarDays, Megaphone,
  BookOpen, AlertTriangle, ClipboardList, MessageCircle, LogOut,
  Send, Award, UserRound, ShieldCheck
} from "lucide-react";
import "./styles.css";

const API = "http://localhost:5001/api";

const auth = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [page, setPage] = useState("dashboard");

  if (!user) return <AuthPage setUser={setUser} setToken={setToken} />;

  const logout = () => {
    setUser(null);
    setToken("");
    setPage("dashboard");
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandIcon"><GraduationCap /></div>
          <div>
            <h2>CampusConnect</h2>
            <p>{user.role.toUpperCase()} PORTAL</p>
          </div>
        </div>

        <Nav icon={<LayoutDashboard />} text="Dashboard" active={page==="dashboard"} onClick={() => setPage("dashboard")} />

        {user.role === "admin" && (
          <>
            <Nav icon={<Users />} text="Users" active={page==="users"} onClick={() => setPage("users")} />
            <Nav icon={<CalendarDays />} text="Timetable" active={page==="timetable"} onClick={() => setPage("timetable")} />
            <Nav icon={<Megaphone />} text="Announcements" active={page==="announcements"} onClick={() => setPage("announcements")} />
            <Nav icon={<BookOpen />} text="Exams & Events" active={page==="exams"} onClick={() => setPage("exams")} />
            <Nav icon={<AlertTriangle />} text="Complaints" active={page==="complaints"} onClick={() => setPage("complaints")} />
          </>
        )}

        {user.role === "teacher" && (
          <>
            <Nav icon={<Users />} text="My Students" active={page==="students"} onClick={() => setPage("students")} />
            <Nav icon={<CalendarDays />} text="Timetable" active={page==="timetable"} onClick={() => setPage("timetable")} />
            <Nav icon={<ClipboardList />} text="Assignments" active={page==="assignments"} onClick={() => setPage("assignments")} />
            <Nav icon={<Award />} text="Marks Entry" active={page==="marks"} onClick={() => setPage("marks")} />
            <Nav icon={<Megaphone />} text="Updates" active={page==="teacherUpdates"} onClick={() => setPage("teacherUpdates")} />
            <Nav icon={<MessageCircle />} text="Messages" active={page==="messages"} onClick={() => setPage("messages")} />
            <Nav icon={<AlertTriangle />} text="Complaints" active={page==="teacherComplaints"} onClick={() => setPage("teacherComplaints")} />
          </>
        )}

        {user.role === "student" && (
          <>
            <Nav icon={<CalendarDays />} text="Timetable" active={page==="timetable"} onClick={() => setPage("timetable")} />
            <Nav icon={<ClipboardList />} text="Assignments" active={page==="studentAssignments"} onClick={() => setPage("studentAssignments")} />
            <Nav icon={<Award />} text="My Marks" active={page==="studentMarks"} onClick={() => setPage("studentMarks")} />
            <Nav icon={<Megaphone />} text="Updates" active={page==="updates"} onClick={() => setPage("updates")} />
            <Nav icon={<MessageCircle />} text="Messages" active={page==="studentMessages"} onClick={() => setPage("studentMessages")} />
            <Nav icon={<AlertTriangle />} text="Complaint" active={page==="studentComplaint"} onClick={() => setPage("studentComplaint")} />
          </>
        )}

        <button className="logout" onClick={logout}><LogOut size={18}/> Logout</button>
      </aside>

      <main className="main">
        <header className="top">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1>{user.name}</h1>
            <p className="sub">{user.role.toUpperCase()} · {user.department || "Campus"} {user.section ? `· Section ${user.section}` : ""}</p>
          </div>
          <div className="rolePill"><ShieldCheck size={18}/>{user.role}</div>
        </header>

        {page === "dashboard" && <Dashboard user={user} token={token} />}
        {page === "users" && <UsersPage token={token} />}
        {page === "students" && <TeacherStudents token={token} />}
        {page === "timetable" && <Timetable user={user} token={token} />}
        {page === "announcements" && <Announcements token={token} />}
        {page === "exams" && <ExamsEvents token={token} />}
        {page === "complaints" && <AdminComplaints token={token} />}
        {page === "teacherComplaints" && <TeacherComplaints token={token} />}
        {page === "assignments" && <TeacherAssignments token={token} user={user} />}
        {page === "studentAssignments" && <StudentAssignments token={token} />}
        {page === "marks" && <MarksEntry token={token} user={user} />}
        {page === "studentMarks" && <StudentMarks token={token} />}
        {page === "messages" && <TeacherMessages token={token} />}
        {page === "teacherUpdates" && <TeacherUpdates token={token} />}
        {page === "studentMessages" && <StudentMessages token={token} />}
        {page === "updates" && <StudentUpdates token={token} />}
        {page === "studentComplaint" && <StudentComplaint token={token} />}
      </main>
    </div>
  );
}

function AuthPage({ setUser, setToken }) {
  const [mode, setMode] = useState("login");
  const [msg, setMsg] = useState("");
  const [login, setLogin] = useState({ email: "admin@campus.com", password: "123456" });
  const [form, setForm] = useState({
    name: "", email: "", password: "123456", role: "student",
    department: "ECE", section: "A", semester: "8", subject: ""
  });

  const doLogin = async () => {
    try {
      setMsg("");
      const res = await axios.post(`${API}/auth/login`, login);
      setUser(res.data.user);
      setToken(res.data.token);
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed. Register or run seed first.");
    }
  };

  const doRegister = async () => {
    try {
      setMsg("");
      await axios.post(`${API}/auth/register`, form);
      setMsg("Account created. Login now.");
      setMode("login");
      setLogin({ email: form.email, password: form.password });
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="authPage">
      <section className="authHero">
        
        <h1>CampusConnect</h1>
        <p>Premium role-based academic management system for Admins, Teachers and Students.</p>
        <div className="heroGrid">
          <Feature title="Role Based Login" text="Admin, Teacher and Student dashboards." />
          <Feature title="Class Communication" text="Class chat and direct messaging." />
          <Feature title="Academic Modules" text="Timetable, assignments, exams and marks." />
          <Feature title="Complaint System" text="Complaints to Admin or Teacher." />
        </div>
      </section>

      <section className="authBox">
        <div className="toggle">
          <button className={mode==="login" ? "active" : ""} onClick={() => setMode("login")}>Login</button>
          <button className={mode==="register" ? "active" : ""} onClick={() => setMode("register")}>Register</button>
        </div>

        {mode === "login" ? (
          <>
            <h2>Secure Login</h2>
            <p className="muted">Enter credentials to access your portal.</p>
            <Input label="Email" value={login.email} onChange={(v)=>setLogin({...login,email:v})}/>
            <Input label="Password" type="password" value={login.password} onChange={(v)=>setLogin({...login,password:v})}/>
            <button className="primary" onClick={doLogin}>Login Securely</button>
            <div className="quick">
              <button onClick={()=>setLogin({email:"admin@campus.com",password:"123456"})}>Admin</button>
              <button onClick={()=>setLogin({email:"teacher@campus.com",password:"123456"})}>Teacher</button>
              <button onClick={()=>setLogin({email:"student@campus.com",password:"123456"})}>Student</button>
            </div>
          </>
        ) : (
          <>
            <h2>Create Account</h2>
            <p className="muted">Register new Admin, Teacher or Student.</p>
            <Input label="Name" value={form.name} onChange={(v)=>setForm({...form,name:v})}/>
            <Input label="Email" value={form.email} onChange={(v)=>setForm({...form,email:v})}/>
            <Input label="Password" type="password" value={form.password} onChange={(v)=>setForm({...form,password:v})}/>
            <label>Role</label>
            <select value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})}>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
            <Input label="Department" value={form.department} onChange={(v)=>setForm({...form,department:v})}/>
            <Input label="Section" value={form.section} onChange={(v)=>setForm({...form,section:v})}/>
            <Input label="Semester" value={form.semester} onChange={(v)=>setForm({...form,semester:v})}/>
            <Input label="Subject for teacher" value={form.subject} onChange={(v)=>setForm({...form,subject:v})}/>
            <button className="primary" onClick={doRegister}>Create Account</button>
          </>
        )}

        {msg && <div className="toast">{msg}</div>}
      </section>
    </div>
  );
}

function Dashboard({ user, token }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user.role === "admin") axios.get(`${API}/admin/dashboard`, auth(token)).then(r=>setStats(r.data)).catch(()=>{});
  }, []);

  return (
    <>
      <div className="stats">
        <Stat icon={<UserRound/>} label="Role" value={user.role}/>
        <Stat icon={<GraduationCap/>} label="Department" value={user.department || "All"}/>
        <Stat icon={<Users/>} label="Section" value={user.section || "All"}/>
        <Stat icon={<ShieldCheck/>} label="Status" value="Active"/>
      </div>
      {stats && (
        <div className="stats">
          <Stat icon={<Users/>} label="Total Users" value={stats.users}/>
          <Stat icon={<Megaphone/>} label="Announcements" value={stats.announcements}/>
          <Stat icon={<AlertTriangle/>} label="Complaints" value={stats.complaints}/>
        </div>
      )}
      
    </>
  );
}

function UsersPage({ token }) {
  const [users, setUsers] = useState([]);
  useEffect(()=>{ axios.get(`${API}/admin/users`, auth(token)).then(r=>setUsers(r.data)); },[]);
  return <Panel title="Registered Users"><UserTable users={users}/></Panel>;
}

function TeacherStudents({ token }) {
  const [students, setStudents] = useState([]);
  useEffect(()=>{ axios.get(`${API}/teacher/students`, auth(token)).then(r=>setStudents(r.data)); },[]);
  return <Panel title="My Class Students"><UserTable users={students}/></Panel>;
}

function UserTable({ users }) {
  return (
    <table>
      <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Section</th><th>Semester</th></tr></thead>
      <tbody>{users.map(u=><tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td><span className="tag">{u.role}</span></td><td>{u.department||"-"}</td><td>{u.section||"-"}</td><td>{u.semester||"-"}</td></tr>)}</tbody>
    </table>
  );
}

function Timetable({ user, token }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ department:"ECE", section:"A", semester:"8", day:"Monday", time:"10:00 AM - 11:00 AM", subject:"Cybersecurity", teacher:"Teacher One", room:"Room 101" });

  const load = async () => {
    let url = user.role==="admin" ? "/admin/timetable" : user.role==="teacher" ? "/teacher/timetable" : "/student/timetable";
    const res = await axios.get(`${API}${url}`, auth(token));
    setItems(res.data);
  };

  useEffect(()=>{load();},[]);

  const create = async () => {
    await axios.post(`${API}/admin/timetable`, {
      department: form.department, section: form.section, semester: form.semester, day: form.day,
      periods: [{ time: form.time, subject: form.subject, teacher: form.teacher, room: form.room }]
    }, auth(token));
    load();
  };

  return (
    <>
      {user.role==="admin" && <Panel title="Create Timetable"><Form form={form} setForm={setForm}/><button className="primary small" onClick={create}>Save Timetable</button></Panel>}
      <Panel title="Timetable">
        <div className="cardsGrid">{items.map(t=><div className="dataCard" key={t._id}><h3>{t.day}</h3><p>{t.department} · {t.section} · Sem {t.semester}</p>{t.periods?.map((p,i)=><div className="line" key={i}><b>{p.time}</b><span>{p.subject} · {p.teacher} · {p.room}</span></div>)}</div>)}</div>
      </Panel>
    </>
  );
}

function Announcements({ token }) {
  const [form,setForm]=useState({
    title:"",
    message:"",
    targetRole:"all",
    department:"ECE",
    section:"A"
  });

  const post=async()=>{
    try {
      await axios.post(`${API}/admin/announcements`,form,auth(token));
      alert("Announcement posted successfully");
      setForm({title:"",message:"",targetRole:"all",department:"ECE",section:"A"});
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post announcement");
    }
  };

  return (
    <Panel title="Post Announcement">
      <label>Announcement Title</label>
      <input value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="Example: Urgent Notice" />

      <label>Message</label>
      <textarea value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} placeholder="Write announcement message" />

      <label>Send To</label>
      <select value={form.targetRole} onChange={(e)=>setForm({...form,targetRole:e.target.value})}>
        <option value="all">All Users</option>
        <option value="teacher">Teachers</option>
        <option value="student">Students</option>
      </select>

      <label>Department</label>
      <input value={form.department} onChange={(e)=>setForm({...form,department:e.target.value})} placeholder="ECE" />

      <label>Section</label>
      <input value={form.section} onChange={(e)=>setForm({...form,section:e.target.value})} placeholder="A" />

      <button className="primary small" onClick={post}>Post Announcement</button>
    </Panel>
  );
}

function ExamsEvents({ token }) {
  const [exam,setExam]=useState({title:"Internal Exam",subject:"Cybersecurity",department:"ECE",section:"A",semester:"8",date:"2026-05-20",time:"10:00 AM",room:"Room 101"});
  const [event,setEvent]=useState({title:"Tech Fest",description:"College technical event",date:"2026-05-25",time:"11:00 AM",venue:"Auditorium"});
  return <div className="twoCol"><Panel title="Create Exam"><Form form={exam} setForm={setExam}/><button className="primary small" onClick={async()=>{await axios.post(`${API}/admin/exams`,exam,auth(token));alert("Exam saved");}}>Save Exam</button></Panel><Panel title="Create Event"><Form form={event} setForm={setEvent} textarea="description"/><button className="primary small" onClick={async()=>{await axios.post(`${API}/admin/events`,event,auth(token));alert("Event saved");}}>Save Event</button></Panel></div>;
}

function AdminComplaints({ token }) {
  const [items,setItems]=useState([]);
  const load=()=>axios.get(`${API}/admin/complaints`,auth(token)).then(r=>setItems(r.data));
  useEffect(()=>{load();},[]);
  const update=async(id,status)=>{await axios.put(`${API}/admin/complaints/${id}`,{status},auth(token));load();};
  return <Panel title="Complaints Sent to Admin"><div className="cardsGrid">{items.map(c=><div className="dataCard danger" key={c._id}><h3>{c.referenceCode}</h3><p><b>{c.category}</b></p><p>{c.message}</p><select value={c.status} onChange={(e)=>update(c._id,e.target.value)}><option>pending</option><option>reviewed</option><option>resolved</option></select></div>)}</div></Panel>;
}

function TeacherComplaints({ token }) {
  const [items,setItems]=useState([]);
  useEffect(()=>{axios.get(`${API}/teacher/complaints`,auth(token)).then(r=>setItems(r.data));},[]);
  return <Panel title="Complaints Sent to Me"><div className="cardsGrid">{items.map(c=><div className="dataCard danger" key={c._id}><h3>{c.referenceCode}</h3><p><b>{c.category}</b></p><p>{c.message}</p><p>Status: {c.status}</p></div>)}</div></Panel>;
}

function TeacherAssignments({ token, user }) {
  const [items,setItems]=useState([]);
  const [form,setForm]=useState({title:"Assignment 1",description:"Submit your work",subject:user.subject||"Cybersecurity",department:user.department||"ECE",section:user.section||"A",semester:user.semester||"8",dueDate:"2026-05-30"});
  const load=()=>axios.get(`${API}/teacher/assignments`,auth(token)).then(r=>setItems(r.data));
  useEffect(()=>{load();},[]);
  const create=async()=>{await axios.post(`${API}/teacher/assignments`,form,auth(token));load();};
  return <><Panel title="Create Assignment"><Form form={form} setForm={setForm} textarea="description"/><button className="primary small" onClick={create}>Create Assignment</button></Panel><Panel title="My Assignments"><List items={items}/></Panel></>;
}

function StudentAssignments({ token }) {
  const [items,setItems]=useState([]);
  const [answers,setAnswers]=useState({});
  useEffect(()=>{axios.get(`${API}/student/assignments`,auth(token)).then(r=>setItems(r.data));},[]);
  const submit=async(id)=>{await axios.post(`${API}/student/assignments/${id}/submit`,{answer:answers[id]||""},auth(token)); alert("Submitted");};
  return <Panel title="My Assignments"><div className="cardsGrid">{items.map(a=><div className="dataCard" key={a._id}><h3>{a.title}</h3><p>{a.description}</p><p><b>Due:</b> {a.dueDate}</p><textarea placeholder="Write answer" onChange={(e)=>setAnswers({...answers,[a._id]:e.target.value})}/><button className="primary small" onClick={()=>submit(a._id)}>Submit</button></div>)}</div></Panel>;
}

function MarksEntry({ token, user }) {
  const [students,setStudents]=useState([]);
  const [marks,setMarks]=useState([]);
  const [form,setForm]=useState({studentId:"",subject:user.subject||"Cybersecurity",examName:"Internal 1",marksObtained:"",totalMarks:"100",remarks:"Good"});
  const load=()=>{axios.get(`${API}/teacher/students`,auth(token)).then(r=>{setStudents(r.data); if(r.data[0]&&!form.studentId)setForm(f=>({...f,studentId:r.data[0]._id}));}); axios.get(`${API}/teacher/marks`,auth(token)).then(r=>setMarks(r.data));};
  useEffect(()=>{load();},[]);
  const save=async()=>{await axios.post(`${API}/teacher/marks`,form,auth(token));load();};
  return <><Panel title="Enter Student Marks"><label>Select Student</label><select value={form.studentId} onChange={(e)=>setForm({...form,studentId:e.target.value})}>{students.map(s=><option key={s._id} value={s._id}>{s.name} - {s.email}</option>)}</select><Form form={{subject:form.subject,examName:form.examName,marksObtained:form.marksObtained,totalMarks:form.totalMarks,remarks:form.remarks}} setForm={(f)=>setForm({...form,...f})}/><button className="primary small" onClick={save}>Save Marks</button></Panel><Panel title="Marks Entered"><div className="cardsGrid">{marks.map(m=><div className="dataCard" key={m._id}><h3>{m.studentId?.name}</h3><p>{m.subject} · {m.examName}</p><h2>{m.marksObtained}/{m.totalMarks}</h2><p>{m.remarks}</p></div>)}</div></Panel></>;
}

function StudentMarks({ token }) {
  const [marks,setMarks]=useState([]);
  useEffect(()=>{axios.get(`${API}/student/marks`,auth(token)).then(r=>setMarks(r.data));},[]);
  return <Panel title="My Marks"><div className="cardsGrid">{marks.map(m=><div className="dataCard" key={m._id}><h3>{m.subject}</h3><p>{m.examName}</p><h2>{m.marksObtained}/{m.totalMarks}</h2><p>Teacher: {m.teacherId?.name}</p><p>{m.remarks}</p></div>)}</div></Panel>;
}

function TeacherMessages({ token }) {
  const [students,setStudents]=useState([]);
  const [messages,setMessages]=useState([]);
  const [receiverId,setReceiverId]=useState("");
  const [classMsg,setClassMsg]=useState("");
  const [directMsg,setDirectMsg]=useState("");

  const load=()=>{axios.get(`${API}/teacher/students`,auth(token)).then(r=>{setStudents(r.data); if(r.data[0]&&!receiverId)setReceiverId(r.data[0]._id);}); axios.get(`${API}/teacher/messages`,auth(token)).then(r=>setMessages(r.data));};
  useEffect(()=>{load();},[]);
  const sendClass=async()=>{await axios.post(`${API}/teacher/messages/class`,{message:classMsg},auth(token));setClassMsg("");load();};
  const sendDirect=async()=>{await axios.post(`${API}/teacher/messages/direct`,{receiverId,message:directMsg},auth(token));setDirectMsg("");load();};

  return <><Panel title="Class Message"><textarea value={classMsg} onChange={(e)=>setClassMsg(e.target.value)} placeholder="Send to full class"/><button className="primary small" onClick={sendClass}><Send size={16}/> Send to Class</button></Panel><Panel title="Direct Message to Student"><select value={receiverId} onChange={(e)=>setReceiverId(e.target.value)}>{students.map(s=><option key={s._id} value={s._id}>{s.name}</option>)}</select><textarea value={directMsg} onChange={(e)=>setDirectMsg(e.target.value)} placeholder="Private message to selected student"/><button className="primary small" onClick={sendDirect}>Send Direct</button></Panel><Panel title="Message History"><Chat messages={messages}/></Panel></>;
}

function StudentMessages({ token }) {
  const [teachers,setTeachers]=useState([]);
  const [messages,setMessages]=useState([]);
  const [receiverId,setReceiverId]=useState("");
  const [msg,setMsg]=useState("");
  const load=()=>{axios.get(`${API}/student/teachers`,auth(token)).then(r=>{setTeachers(r.data); if(r.data[0]&&!receiverId)setReceiverId(r.data[0]._id);}); axios.get(`${API}/student/messages`,auth(token)).then(r=>setMessages(r.data));};
  useEffect(()=>{load();},[]);
  const send=async()=>{await axios.post(`${API}/student/messages/direct`,{receiverId,message:msg},auth(token));setMsg("");load();};
  return <><Panel title="Message Teacher"><select value={receiverId} onChange={(e)=>setReceiverId(e.target.value)}>{teachers.map(t=><option key={t._id} value={t._id}>{t.name} - {t.subject}</option>)}</select><textarea value={msg} onChange={(e)=>setMsg(e.target.value)} placeholder="Message your teacher"/><button className="primary small" onClick={send}>Send Message</button></Panel><Panel title="Class Chat & Direct Messages"><Chat messages={messages}/></Panel></>;
}


function TeacherUpdates({ token }) {
  const [announcements,setAnnouncements]=useState([]);

  useEffect(()=>{
    axios.get(`${API}/teacher/announcements`,auth(token))
      .then(r=>setAnnouncements(r.data))
      .catch(()=>{});
  },[]);

  return (
    <Panel title="Announcements for Teachers">
      <div className="cardsGrid">
        {announcements.map(a=>(
          <div className="dataCard" key={a._id}>
            <h3>{a.title}</h3>
            <p>{a.message}</p>
            <p><b>Target:</b> {a.targetRole}</p>
            <p><b>Department:</b> {a.department || "All"}</p>
            <p><b>Section:</b> {a.section || "All"}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}


function StudentUpdates({ token }) {
  const [ann,setAnn]=useState([]),[exams,setExams]=useState([]),[events,setEvents]=useState([]);
  useEffect(()=>{axios.get(`${API}/student/announcements`,auth(token)).then(r=>setAnn(r.data));axios.get(`${API}/student/exams`,auth(token)).then(r=>setExams(r.data));axios.get(`${API}/student/events`,auth(token)).then(r=>setEvents(r.data));},[]);
  return <><Panel title="Announcements"><List items={ann}/></Panel><Panel title="Exams"><List items={exams}/></Panel><Panel title="Events"><List items={events}/></Panel></>;
}

function StudentComplaint({ token }) {
  const [teachers,setTeachers]=useState([]);
  const [form,setForm]=useState({sendToRole:"admin",sendToTeacherId:"",category:"Academic",message:""});
  useEffect(()=>{axios.get(`${API}/student/teachers`,auth(token)).then(r=>{setTeachers(r.data); if(r.data[0])setForm(f=>({...f,sendToTeacherId:r.data[0]._id}));});},[]);
  const submit=async()=>{const payload={...form,sendToTeacherId:form.sendToRole==="teacher"?form.sendToTeacherId:null}; const res=await axios.post(`${API}/student/complaints`,payload,auth(token)); alert(`Complaint submitted. Ref: ${res.data.referenceCode}`);};
  return <Panel title="Raise Complaint"><label>Send To</label><select value={form.sendToRole} onChange={(e)=>setForm({...form,sendToRole:e.target.value})}><option value="admin">Admin</option><option value="teacher">Teacher</option></select>{form.sendToRole==="teacher"&&<><label>Select Teacher</label><select value={form.sendToTeacherId} onChange={(e)=>setForm({...form,sendToTeacherId:e.target.value})}>{teachers.map(t=><option key={t._id} value={t._id}>{t.name} - {t.subject}</option>)}</select></>}<Form form={{category:form.category,message:form.message}} setForm={(f)=>setForm({...form,...f})} textarea="message"/><button className="primary small" onClick={submit}>Submit Complaint</button></Panel>;
}

function Chat({ messages }) {
  return <div className="chat">{messages.map(m=><div className="bubble" key={m._id}><b>{m.senderName} · {m.senderRole}</b><p>{m.message}</p><small>{m.messageType}</small></div>)}</div>;
}

function List({ items }) {
  return <div className="cardsGrid">{items.map(x=><div className="dataCard" key={x._id}><h3>{x.title || x.subject || x.senderName || x.referenceCode}</h3><p>{x.message || x.description || x.date || x.venue || x.status}</p></div>)}</div>;
}

function Form({ form, setForm, textarea }) {
  return <div className="formGrid">{Object.keys(form).map(k=>k===textarea?<textarea key={k} placeholder={k} value={form[k]} onChange={(e)=>setForm({...form,[k]:e.target.value})}/>:<input key={k} placeholder={k} value={form[k]} onChange={(e)=>setForm({...form,[k]:e.target.value})}/>)}</div>;
}

function Input({ label, value, onChange, type="text" }) {
  return <><label>{label}</label><input type={type} value={value} onChange={(e)=>onChange(e.target.value)} placeholder={label}/></>;
}

function Panel({ title, children }) {
  return <section className="panel"><h2>{title}</h2>{children}</section>;
}

function Stat({ icon, label, value }) {
  return <div className="stat">{icon}<p>{label}</p><h3>{value}</h3></div>;
}

function Feature({ title, text }) {
  return <div className="feature"><h3>{title}</h3><p>{text}</p></div>;
}

function Nav({ icon, text, active, onClick }) {
  return <button className={`nav ${active ? "active" : ""}`} onClick={onClick}>{React.cloneElement(icon,{size:18})}<span>{text}</span></button>;
}
