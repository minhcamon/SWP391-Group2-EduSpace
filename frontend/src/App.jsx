import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "@/pages/HomePage";
import RegisterForm from "@/pages/auth/RegisterPage";
import LoginForm from "@/pages/auth/LoginPage";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { Toaster } from "sonner";
import AdminHomePage from "@/pages/admin/AdminHomePage";
import CreatorHomePage from "@/pages/creator/CreatorHomePage";

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

                    {/* admin route */}
                    <Route path="/admin" element={<AdminHomePage />}></Route>

                    {/* creator route */}
                    <Route
                        path="/creator"
                        element={<CreatorHomePage />}
                    ></Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
