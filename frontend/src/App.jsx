import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "@/pages/HomePage";
import RegisterForm from "@/pages/auth/RegisterPage";
import LoginForm from "@/pages/auth/LoginPage";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { Toaster } from "sonner";

function App() {
    return (
        <div className="min-h-screen w-full bg-white relative">
            {/* Amber Glow Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
        radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #f59e0b 100%)
      `,
                    backgroundSize: "100% 100%",
                }}
            />
            {/* Your Content/Components */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <BrowserRouter>
                    <AuthProvider>
                        <Toaster position="bottom-right" richColors />
                        <Routes>
                            <Route path="/" element={<HomePage />}></Route>
                            <Route
                                path="/signup"
                                element={<RegisterForm />}
                            ></Route>
                            <Route
                                path="/login"
                                element={<LoginForm />}
                            ></Route>

                            <Route element={<ProtectedRoute />}>
                                {/* Define protected routes here */}
                            </Route>
                        </Routes>
                    </AuthProvider>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
