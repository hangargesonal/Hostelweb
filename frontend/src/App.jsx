import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, CalendarCheck, LogOut, MoreHorizontal,
  Menu, X, BedDouble, Bell, Search, Plus, Pencil, Trash2,
  CheckCircle2, XCircle, Clock3, UserRound
} from 'lucide-react'
import { studentApi, attendanceApi, leavingApi, dashboardApi } from './api'

const today = new Date().toISOString().slice(0, 10)

function Layout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const items = [
    { to: '/', label: 'Home', icon: LayoutDashboard },
    { to: '/students', label: 'Students', icon: Users },
    { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/leaving', label: 'Leaving', icon: LogOut },
    { to: '/other', label: 'Other', icon: MoreHorizontal },
  ]

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-icon"><BedDouble size={25} /></div>
          <div>
            <h2>HostelHub</h2>
            <span>Management System</span>
          </div>
          <button className="mobile-close" onClick={() => setOpen(false)}><X /></button>
        </div>

        <nav>
          <p className="nav-title">MAIN MENU</p>
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-card">
          <div className="mini-icon"><Bell size={18}/></div>
          <strong>Hostel notice</strong>
          <p>Keep attendance updated every evening.</p>
        </div>
      </aside>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      <main className="main">
        <header className="topbar">
          <button className="menu-button" onClick={() => setOpen(true)}><Menu /></button>
          <div>
            <p className="breadcrumb">Hostel Management /</p>
            <h3>{items.find(i => i.to === location.pathname)?.label || 'Hostel'}</h3>
          </div>
          <div className="top-actions">
            <div className="date-chip">{today}</div>
            <div className="avatar">HM</div>
          </div>
        </header>

        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leaving" element={<Leaving />} />
            <Route path="/other" element={<Other />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

function Dashboard() {
  const [data, setData] = useState({ totalStudents: 0, presentToday: 0, absentToday: 0, leavingRequests: 0 })
  const [students, setStudents] = useState([])
  useEffect(() => {
    async function fetchData() {
      try {
        const dashboardRes = await dashboardApi.get();
        setData(dashboardRes.data);

        const studentRes = await studentApi.all();
        setStudents(studentRes.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
    fetchData();
  }, []);


  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">WELCOME BACK</p>
          <h1>Hostel Dashboard</h1>
          <p>Manage students, attendance and leaving requests from one place.</p>
        </div>
        <div className="hero-art"><BedDouble size={78}/></div>
      </section>

      <div className="stats-grid">
        <Stat title="Total Students" value={data.totalStudents} icon={<Users/>} />
        <Stat title="Present Today" value={data.presentToday} icon={<CheckCircle2/>} />
        <Stat title="Absent Today" value={data.absentToday} icon={<XCircle/>} />
        <Stat title="Leaving Requests" value={data.leavingRequests} icon={<LogOut/>} />
      </div>

      <section className="panel">
        <div className="panel-heading">
          <div><h2>Recent Students</h2><p>Latest students registered in the hostel</p></div>
          <NavLink className="btn btn-primary" to="/students"><Plus size={17}/> Add Student</NavLink>
        </div>
        <StudentTable students={students} compact />
      </section>
    </>
  )
}

function Stat({ title, value, icon }) {
  return <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div><span>{title}</span><strong>{value}</strong></div>
  </div>
}

function Students() {
  const empty = { name:'', rollNo:'', course:'', year:'', roomNo:'', phone:'', guardianName:'', guardianPhone:'', address:'' }
  const [students, setStudents] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [show, setShow] = useState(false)
  const [search, setSearch] = useState('')

  const load = () => {
    studentApi.all()
      .then(r => setStudents(r.data))
      .catch(() => alert('Could not load students. Start Spring Boot first.'))
  }

  useEffect(() => {
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (editing) await studentApi.update(editing, form)
      else await studentApi.create(form)
      setShow(false); setEditing(null); setForm(empty); load()
    } catch (e) { alert(e.response?.data?.message || 'Could not save student') }
  }

  const edit = (s) => { setEditing(s.id); setForm(s); setShow(true) }
  const remove = async (id) => {
    if (!confirm('Delete this student?')) return
    await studentApi.remove(id); load()
  }

  const filtered = students.filter(s =>
    `${s.name} ${s.rollNo} ${s.roomNo} ${s.course}`.toLowerCase().includes(search.toLowerCase())
  )

  return <>
    <div className="page-heading">
      <div><h1>Students</h1><p>Register and manage hostel students.</p></div>
      <button className="btn btn-primary" onClick={() => {setEditing(null);setForm(empty);setShow(true)}}><Plus size={18}/> Add Student</button>
    </div>

    <div className="toolbar">
      <div className="search"><Search size={18}/><input placeholder="Search name, roll no, room..." value={search} onChange={e => setSearch(e.target.value)}/></div>
      <span className="count">{filtered.length} students</span>
    </div>

    <section className="panel"><StudentTable students={filtered} onEdit={edit} onDelete={remove}/></section>

    {show && <Modal title={editing ? 'Edit Student' : 'Add New Student'} onClose={() => setShow(false)}>
      <form className="form-grid" onSubmit={submit}>
        <Field label="Student Name" required value={form.name} onChange={v => setForm({...form,name:v})}/>
        <Field label="Roll Number" required value={form.rollNo} onChange={v => setForm({...form,rollNo:v})}/>
        <Field label="Course" value={form.course} onChange={v => setForm({...form,course:v})}/>
        <Field label="Year" value={form.year} onChange={v => setForm({...form,year:v})}/>
        <Field label="Room Number" value={form.roomNo} onChange={v => setForm({...form,roomNo:v})}/>
        <Field label="Phone" value={form.phone} onChange={v => setForm({...form,phone:v})}/>
        <Field label="Guardian Name" value={form.guardianName} onChange={v => setForm({...form,guardianName:v})}/>
        <Field label="Guardian Phone" value={form.guardianPhone} onChange={v => setForm({...form,guardianPhone:v})}/>
        <div className="field full"><label>Address</label><textarea value={form.address} onChange={e => setForm({...form,address:e.target.value})}/></div>
        <div className="form-actions full"><button type="button" className="btn btn-light" onClick={() => setShow(false)}>Cancel</button><button className="btn btn-primary">{editing ? 'Update Student' : 'Save Student'}</button></div>
      </form>
    </Modal>}
  </>
}

function StudentTable({ students, onEdit, onDelete, compact=false }) {
  return <div className="table-wrap">
    <table>
      <thead><tr><th>Student</th><th>Roll No.</th><th>Course</th><th>Year</th><th>Room</th>{!compact && <th>Phone</th>}{(onEdit || onDelete) && <th>Action</th>}</tr></thead>
      <tbody>
        {students.length === 0 ? <tr><td colSpan="8" className="empty">No students found.</td></tr> :
        students.map(s => <tr key={s.id}>
          <td><div className="student-cell"><div className="student-avatar">{s.name?.charAt(0)?.toUpperCase()}</div><strong>{s.name}</strong></div></td>
          <td>{s.rollNo}</td><td>{s.course || '-'}</td><td>{s.year || '-'}</td><td><span className="room-pill">{s.roomNo || '-'}</span></td>
          {!compact && <td>{s.phone || '-'}</td>}
          {(onEdit || onDelete) && <td><div className="actions"><button className="icon-btn" onClick={() => onEdit(s)}><Pencil size={16}/></button><button className="icon-btn danger" onClick={() => onDelete(s.id)}><Trash2 size={16}/></button></div></td>}
        </tr>)}
      </tbody>
    </table>
  </div>
}

function Attendance() {
  const [students, setStudents] = useState([])
  const [records, setRecords] = useState({})
  const [date, setDate] = useState(today)
  const [loading, setLoading] = useState(false)

  useEffect(() => { studentApi.all().then(r => setStudents(r.data)); }, [])
  useEffect(() => {
    attendanceApi.byDate(date).then(r => {
      const obj = {}
      r.data.forEach(a => obj[a.student.id] = a.status)
      setRecords(obj)
    }).catch(() => setRecords({}))
  }, [date])

  const mark = async (studentId, status) => {
    setLoading(true)
    try {
      await attendanceApi.save({ studentId, date, status })
      setRecords(prev => ({...prev, [studentId]: status}))
    } catch { alert('Could not save attendance') }
    setLoading(false)
  }

  const present = Object.values(records).filter(x => x === 'PRESENT').length
  const absent = Object.values(records).filter(x => x === 'ABSENT').length

  return <>
    <div className="page-heading">
      <div><h1>Attendance</h1><p>Mark daily hostel attendance for every student.</p></div>
      <input className="date-input" type="date" value={date} onChange={e => setDate(e.target.value)}/>
    </div>

    <div className="attendance-summary">
      <div><CheckCircle2/><span>Present <b>{present}</b></span></div>
      <div><XCircle/><span>Absent <b>{absent}</b></span></div>
      <div><Clock3/><span>Not marked <b>{students.length - present - absent}</b></span></div>
    </div>

    <section className="panel">
      <div className="panel-heading"><div><h2>Daily Attendance</h2><p>{date}</p></div><span className="badge">{loading ? 'Saving...' : 'Auto saved'}</span></div>
      <div className="attendance-list">
        {students.map(s => <div className="attendance-row" key={s.id}>
          <div className="student-cell"><div className="student-avatar">{s.name?.charAt(0)?.toUpperCase()}</div><div><strong>{s.name}</strong><small>{s.rollNo} · Room {s.roomNo || '-'}</small></div></div>
          <div className="attendance-buttons">
            <button className={records[s.id] === 'PRESENT' ? 'selected present' : ''} onClick={() => mark(s.id,'PRESENT')}><CheckCircle2 size={17}/> Present</button>
            <button className={records[s.id] === 'ABSENT' ? 'selected absent' : ''} onClick={() => mark(s.id,'ABSENT')}><XCircle size={17}/> Absent</button>
          </div>
        </div>)}
        {!students.length && <div className="empty">Add students first to mark attendance.</div>}
      </div>
    </section>
  </>
}

function Leaving() {
  const [students, setStudents] = useState([])
  const [requests, setRequests] = useState([])
  const [form, setForm] = useState({studentId:'',fromDate:today,toDate:today,reason:''})

  const load = () => leavingApi.all().then(r => setRequests(r.data))
  useEffect(() => { studentApi.all().then(r => setStudents(r.data)); load() }, [])

  const submit = async e => {
    e.preventDefault()
    if (!form.studentId) return alert('Select a student')
    await leavingApi.create({...form, studentId:Number(form.studentId)})
    setForm({studentId:'',fromDate:today,toDate:today,reason:''}); load()
  }

  const changeStatus = async (id,status) => { await leavingApi.status(id,status); load() }

  return <>
    <div className="page-heading"><div><h1>Leaving Requests</h1><p>Manage student leave and out-pass requests.</p></div></div>

    <section className="panel leave-form-panel">
      <div className="panel-heading"><div><h2>New Request</h2><p>Create a leaving request for a student.</p></div></div>
      <form className="form-grid" onSubmit={submit}>
        <div className="field"><label>Student</label><select value={form.studentId} onChange={e => setForm({...form,studentId:e.target.value})}><option value="">Select student</option>{students.map(s => <option key={s.id} value={s.id}>{s.name} — {s.rollNo}</option>)}</select></div>
        <Field label="From Date" type="date" value={form.fromDate} onChange={v => setForm({...form,fromDate:v})}/>
        <Field label="To Date" type="date" value={form.toDate} onChange={v => setForm({...form,toDate:v})}/>
        <Field label="Reason" value={form.reason} onChange={v => setForm({...form,reason:v})}/>
        <div className="form-actions full"><button className="btn btn-primary">Submit Request</button></div>
      </form>
    </section>

    <section className="panel">
      <div className="panel-heading"><div><h2>All Requests</h2><p>Approve or reject submitted requests.</p></div></div>
      <div className="table-wrap"><table><thead><tr><th>Student</th><th>Dates</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead><tbody>
        {requests.length ? requests.map(r => <tr key={r.id}><td><strong>{r.student?.name}</strong><small className="block">{r.student?.rollNo}</small></td><td>{r.fromDate} → {r.toDate}</td><td>{r.reason || '-'}</td><td><span className={`status ${r.status.toLowerCase()}`}>{r.status}</span></td><td><div className="actions">{r.status === 'PENDING' && <><button className="approve" onClick={() => changeStatus(r.id,'APPROVED')}>Approve</button><button className="reject" onClick={() => changeStatus(r.id,'REJECTED')}>Reject</button></>}</div></td></tr>) : <tr><td colSpan="5" className="empty">No leaving requests yet.</td></tr>}
      </tbody></table></div>
    </section>
  </>
}

function Other() {
  return <>
    <div className="page-heading"><div><h1>Other</h1><p>Useful hostel management information.</p></div></div>
    <div className="other-grid">
      <InfoCard icon={<BedDouble/>} title="Room Management" text="Use the student room number to maintain room allocation records."/>
      <InfoCard icon={<Bell/>} title="Notices" text="Keep hostel notices and important announcements in one place."/>
      <InfoCard icon={<UserRound/>} title="Guardian Details" text="Student profiles store guardian name and phone number for contact."/>
    </div>
    <section className="panel notice-panel"><h2>Project Modules</h2><p>Home • Students • Attendance • Leaving Requests • Other</p><p className="muted">This starter project can be extended with rooms, fees, complaints, visitors, mess and login modules.</p></section>
  </>
}

function InfoCard({icon,title,text}) {
  return <div className="info-card"><div className="info-icon">{icon}</div><h2>{title}</h2><p>{text}</p></div>
}

function Field({label, value, onChange, type='text', required=false}) {
  return <div className="field"><label>{label}</label><input type={type} required={required} value={value || ''} onChange={e => onChange(e.target.value)}/></div>
}

function Modal({title,children,onClose}) {
  return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose}><X/></button></div>{children}</div></div>
}

export default function App() { return <Layout/> }
