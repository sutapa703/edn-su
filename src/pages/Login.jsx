import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const result = await login(email, password);
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
      handleLogin();
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h1>EduNexus</h1>
        <h3>Login</h3>

        {error && <p style={errorStyle}>{error}</p>}

        <input 
          style={input} 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <input 
          style={input} 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <button style={btn} onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          New user? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}

const page={background:"#081a33",minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"center"};
const card={background:"white",padding:"35px",width:"350px",borderRadius:"15px",textAlign:"center",boxShadow:"0 0 25px rgba(0,0,0,0.4)"};
const input={width:"100%",padding:"12px",margin:"10px 0",borderRadius:"8px",border:"1px solid #ccc",boxSizing:"border-box"};
const btn={width:"100%",padding:"12px",background:"#081a33",color:"white",border:"none",borderRadius:"8px",marginTop:"10px",cursor:"pointer"};
const errorStyle={color:"#dc3545",marginBottom:"15px",fontSize:"14px"};