import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import InputField from "@/components/UI/InputField";
import SecondaryButton from "@/components/UI/SecondaryButton";
import { Mail, Lock, Book } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import authService from "@/services/authService";
import GoogleIcon from "@/assets/google-icon-logo.svg"

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        if (isLoading) return;
        window.location.href = authService.getGoogleAuthUrl();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        try {
            await login(email, password);
            console.log("Login successful");
            toast.success("Đăng nhập thành công!");
            navigate("/");
        } catch (error) {
            console.error("Login failed at LoginForm:", error);
            toast.error(error.message);
        }
    };

    return (
        <div className="flex items-center min-h-screen justify-center">
            <div className="p-8 border border-blue-500 rounded-2xl shadow shadow-gray-700">
                <div>
                    <div className="flex">
                        <Book className=" text-primary" size={44} />
                        <h1 className="ml-2 font-bold text-4xl text-primary">
                            EduSpace
                        </h1>
                    </div>
                    <h1 className="my-4 text-black font-bold text-4xl">
                        Chào mừng trở lại
                    </h1>
                    <p className="text-gray-500 font-m pr-20">
                        Đăng nhập vào tài khoản của bạn để tiếp tục các bài học
                    </p>
                </div>
                <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="mb-2 font-bold">Địa chỉ Email</div>
                    <InputField
                        icon={Mail}
                        inputType="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="nguyenVanA@gmail.com"
                    />

                    <div className="mt-4 mb-2 font-bold">Mật khẩu</div>
                    <InputField
                        icon={Lock}
                        inputType="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu"
                    />

                    <div className="mt-8">
                        <SecondaryButton
                            type="submit"
                            disabled={isLoading} 
                            buttonText={isLoading ? "Đang xử lý..." : "Đăng nhập"} />
                    </div>

                    <div className="flex items-center my-6">
                        <div className="grow border-t border-gray-200"></div>
                        <span className="mx-4 text-gray-400 text-sm font-semibold select-none">Hoặc</span>
                        <div className="grow border-t border-gray-200"></div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-3 w-full bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl py-2.5 px-4 shadow-sm hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-100 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                    >
                        <img
                            src={GoogleIcon}
                            alt="Google Logo"
                            className="w-5 h-5 object-contain"
                        />
                        <span>Đăng nhập với Google</span>
                    </button>

                    <div className="mt-8 font-semibold text-center">
                        <div className="flex justify-around">
                            <div className="text-primary">
                                <Link to="/">Quay về trang chủ</Link>
                            </div>
                            <div>
                                Chưa có tài khoản?{" "}
                                <Link to="/signup" className="text-primary">
                                    Đăng ký ngay
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
