import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps any route that requires authentication
// Usage: <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Role-based guard — frontend layer (backend also enforces this)
// Usage: <RoleRoute roles={["admin"]}><AdminPanel/></RoleRoute>
export function RoleRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/403" replace />;
  return children;
}

// In App.jsx:
// <Routes>
//   <Route path="/login" element={<LoginPage/>}/>
//   <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
//   <Route path="/admin" element={<RoleRoute roles={["admin"]}><Admin/></RoleRoute>}/>
// </Routes>