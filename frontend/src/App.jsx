import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "@/pages/HomePage";
import RegisterForm from "@/pages/auth/RegisterPage";
import LoginForm from "@/pages/auth/LoginPage";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { Toaster } from "sonner";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Toaster position="bottom-right" richColors />
                <Routes>
                    <Route path="/" element={<HomePage />}></Route>
                    <Route path="/signup" element={<RegisterForm />}></Route>
                    <Route path="/login" element={<LoginForm />}></Route>

                    <Route element={<ProtectedRoute />}>
                        {/* Define protected routes here */}
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
