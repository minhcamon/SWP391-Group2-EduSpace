import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ allowedRoles, requireMentorMode }) => {
    const { user, isLoading, currentMode } = useAuth();

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

    // Check if mentor mode is required
    if (requireMentorMode) {
        const isMentorUser = user.isMentor || user.role === "CREATOR" || user.role === "ADMIN" || user.username?.startsWith("mentor");
        if (!isMentorUser || currentMode !== "MENTOR") {
            console.warn(`Truy cập bị từ chối: Yêu cầu tài khoản có quyền Mentor và phải chuyển sang chế độ Mentor.`);
            return <Navigate to="/" replace />;
        }
        return <Outlet />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.warn(`Truy cập bị từ chối: Role ${user.role} không có quyền.`);
        return <Navigate to="/*" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;