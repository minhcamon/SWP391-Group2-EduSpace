import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
                <div className="text-sm font-medium text-slate-500 animate-pulse">
                    Đang tải dữ liệu EduSpace...
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.warn(`Truy cập bị từ chối: Role ${user.role} không có quyền.`);
        return <Navigate to="/*" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;