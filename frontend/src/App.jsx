import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { Toaster } from "sonner";
import RouteProgressBar from "@/components/common/RouteProgressBar";

// Import page anchors
import Home from "@/views/Home";
import Login from "@/views/auth/Login";
import Register from "@/views/auth/Register";
import GoogleCallback from "@/views/auth/GoogleCallback";
import Roadmaps from "@/views/Roadmaps";
import Courses from "@/views/Courses";
import Profile from "@/views/UserProfile";
import CreatorHome from "@/views/creator/Home";
import CreatorCourses from "@/views/creator/Courses";
import CreatorCourseDetail from "@/views/creator/CourseDetail";
import CreatorCourseBuilder from "@/views/creator/CourseBuilder";
import CreatorAnalytics from "@/views/creator/Analytics";
import AdminDashboard from "@/views/admin/Dashboard";
import AdminRequests from "@/views/admin/Requests";
import AdminCourses from "@/views/admin/Courses";
import Error from "@/views/Error";
import LearnerCourseDetail from "@/views/LearnerCourseDetail";
import ClassView from "@/views/learning/ClassView";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <RouteProgressBar />
                <Toaster position="bottom-right" richColors />
                <Routes>
                    {/* public route */}
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/signup" element={<Register />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route
                        path="/oauth2/redirect"
                        element={<GoogleCallback />}
                    ></Route>
                    <Route path="/roadmaps" element={<Roadmaps />}></Route>
                    <Route
                        path="/courses"
                        element={<Courses />}
                    ></Route>
                    <Route
                        path="/courses/:id"
                        element={<LearnerCourseDetail />}
                    ></Route>

                    {/* Authenticated user routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/profile" element={<Profile />}></Route>
                        <Route path="/classes/:classId" element={<ClassView />}></Route>
                    </Route>

                    {/* admin route */}
                    <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                        <Route path="/admin" element={<AdminDashboard />}></Route>
                        <Route
                            path="/admin/creator-requests"
                            element={<AdminRequests />}
                        ></Route>
                        <Route
                            path="/admin/courses-management"
                            element={<AdminCourses />}
                        ></Route>
                    </Route>

                    {/* creator route */}
                    <Route element={<ProtectedRoute allowedRoles={["CREATOR"]} />}>
                        <Route
                            path="/creator"
                            element={<CreatorHome />}
                        ></Route>
                        <Route
                            path="/creator/courses"
                            element={<CreatorCourses />}
                        ></Route>
                        <Route
                            path="/creator/courses/:id"
                            element={<CreatorCourseDetail />}
                        ></Route>
                        <Route
                            path="/creator/courses/:id/edit"
                            element={<CreatorCourseBuilder mode="EDIT" />}
                        ></Route>
                        <Route
                            path="/creator/courses/:id/view"
                            element={<CreatorCourseBuilder mode="VIEW" />}
                        ></Route>
                        <Route
                            path="/creator/analytics"
                            element={<CreatorAnalytics />}
                        ></Route>
                        <Route
                            path="/creator/create-course"
                            element={<CreatorCourseBuilder mode="CREATE" />}
                        ></Route>
                    </Route>

                    <Route path="*" element={<Error />}></Route>

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
