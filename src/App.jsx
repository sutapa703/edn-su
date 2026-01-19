import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Protected Route Component
const ProtectedRoute = ({ element, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  }

  return element;
};

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} /> : <Signup />} />
      <Route path="/student" element={<ProtectedRoute element={<StudentDashboard />} requiredRole="student" />} />
      <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />} />
    </Routes>
  );
}