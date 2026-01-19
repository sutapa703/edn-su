import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const nav = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const result = await signup(name, email, password, role);
      if (result.success) {
        // Navigate based on role
        if (result.user.role === 'admin') {
          nav("/admin");
        } else {
          nav("/student");
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignup();
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h1>EduNexus</h1>
        <h3>Create Account</h3>

        {error && <p style={errorStyle}>{error}</p>}

        <input 
          style={input} 
          placeholder="Full Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input 
          style={input} 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          style={input} 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <select 
          style={input} 
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <button style={btn} onClick={handleSignup} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

const page={background:"#081a33",minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"center"};
const card={background:"white",padding:"35px",width:"350px",borderRadius:"15px",textAlign:"center",boxShadow:"0 0 25px rgba(0,0,0,0.4)"};
const input={width:"100%",padding:"12px",margin:"10px 0",borderRadius:"8px",border:"1px solid #ccc",boxSizing:"border-box",fontFamily:"inherit"};
const btn={width:"100%",padding:"12px",background:"#081a33",color:"white",border:"none",borderRadius:"8px",marginTop:"10px",cursor:"pointer"};
const errorStyle={color:"#dc3545",marginBottom:"15px",fontSize:"14px"};