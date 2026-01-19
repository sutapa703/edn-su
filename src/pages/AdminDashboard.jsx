import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminAPI } from "../services/api";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("courses");
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    instructor: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [coursesRes, usersRes] = await Promise.all([
        adminAPI.getAllCourses(),
        adminAPI.getAllUsers(),
      ]);
      
      setCourses(coursesRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!courseForm.title || !courseForm.description || !courseForm.instructor) {
      setError("All fields are required");
      return;
    }

    try {
      await adminAPI.createCourse(courseForm);
      setCourseForm({ title: "", description: "", instructor: "" });
      setShowCreateCourse(false);
      setError("");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await adminAPI.deleteCourse(courseId);
      setCourses(courses.filter(c => c._id !== courseId));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete course");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleLogout = () => {
    logout();
    nav("/");
  };

  return (
    <div style={layout}>
      <div style={sidebar}>
        <h2>EduNexus</h2>
        <nav style={navList}>
          <p style={{...navItem, borderBottom: "2px solid white"}}>Dashboard</p>
          <p style={navItem}>Analytics</p>
          <p style={navItem}>Settings</p>
          <p style={{...navItem, color: "#ff6b6b", cursor: "pointer"}} onClick={handleLogout}>
            Logout
          </p>
        </nav>
        {user && <p style={userInfo}>Logged in as: {user.name}</p>}
      </div>

      <div style={content}>
        <div style={navbar}>
          <h2>Admin Dashboard</h2>
          {user && <span>{user.email}</span>}
        </div>

        {error && <div style={errorBox}>{error}</div>}

        <div style={tabsContainer}>
          <button
            style={{
              ...tab,
              borderBottom: activeTab === "courses" ? "3px solid #081a33" : "3px solid #ddd",
            }}
            onClick={() => setActiveTab("courses")}
          >
            Courses ({courses.length})
          </button>
          <button
            style={{
              ...tab,
              borderBottom: activeTab === "users" ? "3px solid #081a33" : "3px solid #ddd",
            }}
            onClick={() => setActiveTab("users")}
          >
            Users ({users.length})
          </button>
        </div>

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <>
            {activeTab === "courses" && (
              <div>
                <button style={addBtn} onClick={() => setShowCreateCourse(!showCreateCourse)}>
                  {showCreateCourse ? "Cancel" : "Add New Course"}
                </button>

                {showCreateCourse && (
                  <div style={formContainer}>
                    <h3>Create New Course</h3>
                    <input
                      style={input}
                      placeholder="Course Title"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                    />
                    <input
                      style={input}
                      placeholder="Instructor Name"
                      value={courseForm.instructor}
                      onChange={(e) => setCourseForm({...courseForm, instructor: e.target.value})}
                    />
                    <textarea
                      style={{...input, minHeight: "80px", resize: "vertical"}}
                      placeholder="Course Description"
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                    />
                    <button style={submitBtn} onClick={handleCreateCourse}>Create Course</button>
                  </div>
                )}

                <div style={grid}>
                  {courses.length > 0 ? (
                    courses.map(course => (
                      <div key={course._id} style={card}>
                        <h3>{course.title}</h3>
                        <p><strong>Instructor:</strong> {course.instructor}</p>
                        <p>{course.description}</p>
                        <p><strong>Students Enrolled:</strong> {course.enrolledStudents?.length || 0}</p>
                        <button
                          style={deleteBtn}
                          onClick={() => handleDeleteCourse(course._id)}
                        >
                          Delete Course
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No courses created yet</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div>
                <div style={tableContainer}>
                  <table style={table}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map(user => (
                          <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td><span style={roleBadge}>{user.role}</span></td>
                            <td>
                              <button
                                style={deleteTableBtn}
                                onClick={() => handleDeleteUser(user._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="4">No users found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const layout={display:"flex",minHeight:"100vh",background:"#f4f7fb"};
const sidebar={width:"220px",background:"#081a33",color:"white",padding:"20px",overflowY:"auto"};
const navList={listStyle:"none",padding:"0",margin:"20px 0"};
const navItem={padding:"10px 0",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.2)"};
const userInfo={fontSize:"12px",marginTop:"30px",padding:"10px",background:"rgba(255,255,255,0.1)",borderRadius:"5px"};
const content={flex:1,padding:"20px",overflowY:"auto"};
const navbar={background:"white",padding:"15px 20px",borderRadius:"10px",marginBottom:"20px",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 2px 5px rgba(0,0,0,0.1)"};
const tabsContainer={display:"flex",gap:"0",borderBottom:"1px solid #ddd",marginBottom:"20px"};
const tab={padding:"12px 20px",background:"transparent",border:"none",cursor:"pointer",fontSize:"14px",fontWeight:"500",color:"#666"};
const addBtn={padding:"10px 20px",background:"#28a745",color:"white",border:"none",borderRadius:"6px",cursor:"pointer",fontWeight:"500",marginBottom:"15px"};
const formContainer={background:"white",padding:"20px",borderRadius:"10px",marginBottom:"20px",boxShadow:"0 2px 5px rgba(0,0,0,0.1)"};
const input={width:"100%",padding:"10px",margin:"10px 0",borderRadius:"6px",border:"1px solid #ddd",boxSizing:"border-box",fontFamily:"inherit"};
const submitBtn={width:"100%",padding:"10px",background:"#081a33",color:"white",border:"none",borderRadius:"6px",cursor:"pointer",fontWeight:"500",marginTop:"10px"};
const grid={display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:"20px"};
const card={background:"white",padding:"20px",borderRadius:"12px",boxShadow:"0 4px 10px rgba(0,0,0,0.1)",display:"flex",flexDirection:"column"};
const deleteBtn={width:"100%",padding:"10px",background:"#dc3545",color:"white",border:"none",borderRadius:"6px",marginTop:"auto",cursor:"pointer",fontWeight:"500"};
const tableContainer={background:"white",borderRadius:"10px",boxShadow:"0 2px 5px rgba(0,0,0,0.1)",overflowX:"auto"};
const table={width:"100%",borderCollapse:"collapse"};
const roleBadge={padding:"4px 8px",borderRadius:"4px",background:"#081a33",color:"white",fontSize:"12px"};
const deleteTableBtn={padding:"6px 12px",background:"#dc3545",color:"white",border:"none",borderRadius:"4px",cursor:"pointer",fontSize:"12px"};
const errorBox={background:"#f8d7da",color:"#721c24",padding:"12px",borderRadius:"6px",marginBottom:"15px"};