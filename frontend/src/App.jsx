import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "@/pages/HomePage";
import RegisterForm from "@/pages/auth/RegisterPage";
import LoginForm from "@/pages/auth/LoginPage";
import OAuth2RedirectHandler from "@/pages/auth/OAuth2RedirectHandler";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { Toaster } from "sonner";
import AdminHomePage from "@/pages/admin/AdminHomePage";
import CreatorHomePage from "@/pages/creator/CreatorHomePage";
import UserProfile from "@/pages/UserProfile";
import RoadmapsPage from "@/pages/roadmap/RoadmapsPage";
import Leaderboard from "@/pages/Leaderboard";
import CourseCreate from "@/pages/creator/CourseCreate";
import ListCoursesPage from "@/pages/course/ListCoursesPage";
import ErrorPage from "@/pages/ErrorPage";
import ManageRequestPage from "@/pages/admin/ManageRequestPage";
import ManageCoursePage from "@/pages/admin/ManageCoursePage";

import CourseManagement from "./pages/creator/CourseManagement";
import CreatorAnalytics from "./pages/creator/CreatorAnalytics";
import CourseDetail from "./pages/creator/CourseDetail";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster position="bottom-right" richColors />
                <Routes>
                    {/* public route */}
                    <Route path="/" element={<HomePage />}></Route>
                    <Route path="/signup" element={<RegisterForm />}></Route>
                    <Route path="/login" element={<LoginForm />}></Route>
                    <Route
                        path="/oauth2/redirect"
                        element={<OAuth2RedirectHandler />}
                    ></Route>
                    <Route path="/profile" element={<UserProfile />}></Route>
                    <Route path="/roadmaps" element={<RoadmapsPage />}></Route>
                    <Route
                        path="/courses"
                        element={<ListCoursesPage />}
                    ></Route>
                    <Route path="*" element={<ErrorPage />}></Route>

                    <Route
                        path="/leaderboard"
                        element={<Leaderboard />}
                    ></Route>

                    {/* admin route */}
                    <Route path="/admin" element={<AdminHomePage />}></Route>
                    <Route
                        path="/admin/creator-requests"
                        element={<ManageRequestPage />}
                    ></Route>
                    <Route
                        path="/admin/courses-management"
                        element={<ManageCoursePage />}
                    ></Route>

                    {/* creator route */}
                    <Route
                        path="/creator"
                        element={<CreatorHomePage />}
                    ></Route>
                    <Route
                        path="/creator/courses"
                        element={<CourseManagement />}
                    ></Route>
                    <Route
                        path="/creator/courses/:id"
                        element={<CourseDetail />}
                    ></Route>
                    <Route
                        path="/creator/analytics"
                        element={<CreatorAnalytics />}
                    ></Route>
                    <Route
                        path="/creator/create-course"
                        element={<CourseCreate />}
                    ></Route>

                    {/* Protected Route */}
                    <Route element={<ProtectedRoute />}></Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
