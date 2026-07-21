import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ allowedRoles, requireMentorMode, allowGuest = false }) => {
    const { user, isLoading, currentMode } = useAuth();

    const isMentorUser = user?.isMentor || user?.role === "CREATOR" || user?.role === "MENTOR";

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
        if (allowGuest) {
            return <Outlet />;
        }
        return <Navigate to="/" replace />;
    }

    // Centralized Creator Redirect
    const isCreatorRoute = allowedRoles && allowedRoles.includes("CREATOR");
    if (user.role === "CREATOR" && !isCreatorRoute && !requireMentorMode) {
        console.warn(`Creator redirected to creator management page.`);
        return <Navigate to="/creator/courses" replace />;
    }

    // Centralized Mentor Redirect
    if (currentMode === "MENTOR" && !requireMentorMode && !isCreatorRoute && (!allowedRoles || !allowedRoles.includes("ADMIN"))) {
        console.warn(`Mentor redirected to teaching config page.`);
        return <Navigate to="/mentor/teaching-config" replace />;
    }

    // Check if mentor mode is required
    if (requireMentorMode) {
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