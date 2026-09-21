import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, type Role } from "../context/AuthContex";

export default function ProtectedRoute({allowedRoles}: { allowedRoles?: Role[] }) {
    const {user,loading} = useAuth();
    const loaction = useLocation();

    if (loading) return <div>Loading...</div>
    if (!user) return <Navigate to={"/login"} state={{from:loaction}} replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={"/unauthorized"} replace />;
    
    return <Outlet />;
    
}