import { Navigate, Outlet, useParams, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import learnService from "@/services/learnService";

const ProtectedRoute = ({ allowedRoles, requireMentorMode, allowGuest = false }) => {
    const { user, isLoading, currentMode } = useAuth();
    const { pathname } = useLocation();
    const { courseId, classId, id: courseIdFromDetail } = useParams();
    const activeCourseId = courseId || courseIdFromDetail;

    const [checkingCompletion, setCheckingCompletion] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState(null);

    const isMentorUser = user?.isMentor || user?.role === "CREATOR" || user?.role === "MENTOR";

    const isStaffUser = user?.role === "CREATOR" || user?.role === "ADMIN";
    const isAlreadyOnCertificate = pathname.endsWith("/certificate");
    const isLearnerRoute = pathname.startsWith("/courses") || pathname.startsWith("/classes");

    useEffect(() => {
        if (!user || isStaffUser || isAlreadyOnCertificate || !isLearnerRoute) {
            setRedirectUrl(null);
            return;
        }

        const checkCompletion = async () => {
            try {
                setCheckingCompletion(true);
                const myCourses = await learnService.getMyLearningCourses();

                let targetCourse = null;
                if (activeCourseId) {
                    targetCourse = myCourses.find(c => c.courseId?.toString() === activeCourseId.toString());
                } else if (classId) {
                    targetCourse = myCourses.find(c => c.classId?.toString() === classId.toString());
                }

                if (targetCourse && targetCourse.isCompleted && targetCourse.classId) {
                    setRedirectUrl(`/classes/${targetCourse.classId}/certificate`);
                } else {
                    setRedirectUrl(null);
                }
            } catch (e) {
                console.error("Lỗi kiểm tra hoàn thành trong ProtectedRoute:", e);
                setRedirectUrl(null);
            } finally {
                setCheckingCompletion(false);
            }
        };

        if (activeCourseId || classId) {
            checkCompletion();
        } else {
            setRedirectUrl(null);
        }
    }, [user, activeCourseId, classId, isMentorUser, isStaffUser, isAlreadyOnCertificate, isLearnerRoute]);

    if (isLoading || checkingCompletion) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
                <div className="text-sm font-medium text-slate-500 animate-pulse">
                    Đang tải dữ liệu EduSpace...
                </div>
            </div>
        );
    }

    if (redirectUrl && pathname !== redirectUrl) {
        return <Navigate to={redirectUrl} replace />;
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

    // Centralized Admin Redirect
    const isAdminRoute = allowedRoles && allowedRoles.includes("ADMIN");
    if (user.role === "ADMIN" && !isAdminRoute && !requireMentorMode) {
        console.warn(`Admin redirected to admin dashboard.`);
        return <Navigate to="/admin" replace />;
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