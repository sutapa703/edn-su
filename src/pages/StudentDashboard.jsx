import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { studentAPI } from "../services/api";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("available");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [allCoursesRes, enrolledRes] = await Promise.all([
        studentAPI.getAllCourses(),
        studentAPI.getEnrolledCourses(),
      ]);
      
      setCourses(allCoursesRes.data);
      setEnrolledCourses(enrolledRes.data.map(c => c._id));
    } catch (err) {
      setError("Failed to load courses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await studentAPI.enrollCourse(courseId);
      setEnrolledCourses([...enrolledCourses, courseId]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to enroll");
    }
  };

  const handleUnenroll = async (courseId) => {
    try {
      await studentAPI.unenrollCourse(courseId);
      setEnrolledCourses(enrolledCourses.filter(id => id !== courseId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to unenroll");
    }
  };

  const handleLogout = () => {
    logout();
    nav("/");
  };

  const availableCourses = courses.filter(c => !enrolledCourses.includes(c._id));
  const myEnrolledCourses = courses.filter(c => enrolledCourses.includes(c._id));

  return (
    <div style={layout}>
      <div style={sidebar}>
        <h2>EduNexus</h2>
        <nav style={navList}>
          <p style={{...navItem, borderBottom: "2px solid white"}}>Dashboard</p>
          <p style={navItem}>Profile</p>
          <p style={navItem}>Settings</p>
          <p style={{...navItem, color: "#ff6b6b", cursor: "pointer"}} onClick={handleLogout}>
            Logout
          </p>
        </nav>
        {user && <p style={userInfo}>Logged in as: {user.name}</p>}
      </div>

      <div style={content}>
        <div style={navbar}>
          <h2>Student Dashboard</h2>
          {user && <span>{user.email}</span>}
        </div>

        {error && <div style={errorBox}>{error}</div>}

        <div style={tabsContainer}>
          <button
            style={{
              ...tab,
              borderBottom: activeTab === "available" ? "3px solid #081a33" : "3px solid #ddd",
            }}
            onClick={() => setActiveTab("available")}
          >
            Available Courses ({availableCourses.length})
          </button>
          <button
            style={{
              ...tab,
              borderBottom: activeTab === "enrolled" ? "3px solid #081a33" : "3px solid #ddd",
            }}
            onClick={() => setActiveTab("enrolled")}
          >
            My Courses ({myEnrolledCourses.length})
          </button>
        </div>

        {loading ? (
          <p>Loading courses...</p>
        ) : (
          <div style={grid}>
            {activeTab === "available" ? (
              availableCourses.length > 0 ? (
                availableCourses.map(course => (
                  <div key={course._id} style={courseCard}>
                    <h3>{course.title}</h3>
                    <p><strong>Instructor:</strong> {course.instructor}</p>
                    <p>{course.description}</p>
                    <button
                      style={enrollBtn}
                      onClick={() => handleEnroll(course._id)}
                    >
                      Enroll
                    </button>
                  </div>
                ))
              ) : (
                <p>No available courses</p>
              )
            ) : (
              myEnrolledCourses.length > 0 ? (
                myEnrolledCourses.map(course => (
                  <div key={course._id} style={courseCard}>
                    <h3>{course.title}</h3>
                    <p><strong>Instructor:</strong> {course.instructor}</p>
                    <p>{course.description}</p>
                    <button
                      style={unenrollBtn}
                      onClick={() => handleUnenroll(course._id)}
                    >
                      Unenroll
                    </button>
                  </div>
                ))
              ) : (
                <p>You haven't enrolled in any courses yet</p>
              )
            )}
          </div>
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
const grid={display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:"20px"};
const courseCard={background:"white",padding:"20px",borderRadius:"12px",boxShadow:"0 4px 10px rgba(0,0,0,0.1)",display:"flex",flexDirection:"column"};
const enrollBtn={width:"100%",padding:"10px",background:"#081a33",color:"white",border:"none",borderRadius:"6px",marginTop:"auto",cursor:"pointer",fontWeight:"500"};
const unenrollBtn={width:"100%",padding:"10px",background:"#dc3545",color:"white",border:"none",borderRadius:"6px",marginTop:"auto",cursor:"pointer",fontWeight:"500"};
const errorBox={background:"#f8d7da",color:"#721c24",padding:"12px",borderRadius:"6px",marginBottom:"15px"};