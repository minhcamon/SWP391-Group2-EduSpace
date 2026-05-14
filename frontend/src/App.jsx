import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import RegisterForm from "./pages/auth/RegisterPage";
import LoginForm from "./pages/auth/LoginPage";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />}></Route>
                    <Route path="/signup" element={<RegisterForm />}></Route>
                    <Route path="/login" element={<LoginForm />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
