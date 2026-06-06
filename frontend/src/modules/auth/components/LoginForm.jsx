import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import authService from "@/services/authService";
import GoogleIcon from "@/assets/google-icon-logo.svg";
import { runWithLoading } from "@/utils/utils";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [rememberMe, setRememberMe] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const { login } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        if (isSubmitting) return;
        window.location.href = authService.getGoogleAuthUrl();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = formData;

        const handleLogin = async () => {
            try {
                await login(username, password);
                console.log("Login successful");
                toast.success("Đăng nhập thành công!");
                navigate("/");
            } catch (error) {
                console.error("Login failed at LoginForm:", error);
                toast.error(error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
            }
        };

        await runWithLoading(setIsSubmitting, handleLogin());
    };

    return (
        <>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username Field */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="username">
                        Tên đăng nhập hoặc Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-light">
                            <Mail size={16} />
                        </div>
                        <input
                            className="w-full pl-10 pr-4 py-3 bg-bg-base border border-border-light/40 rounded-xl text-sm text-neutral-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-neutral-light"
                            id="username"
                            name="username"
                            placeholder="Tên đăng nhập hoặc email"
                            required
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="password">
                        Mật khẩu
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-light">
                            <Lock size={16} />
                        </div>
                        <input
                            className="w-full pl-10 pr-4 py-3 bg-bg-base border border-border-light/40 rounded-xl text-sm text-neutral-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-neutral-light"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center">
                        <input
                            className="h-4 w-4 text-primary focus:ring-primary border-border-light rounded bg-bg-base cursor-pointer"
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className="ml-2 block text-xs font-semibold text-neutral-medium cursor-pointer" htmlFor="remember-me">
                            Ghi nhớ đăng nhập
                        </label>
                    </div>
                    <div className="text-xs">
                        <Link to="#" className="font-semibold text-primary hover:opacity-95 transition-opacity">
                            Quên mật khẩu?
                        </Link>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl font-semibold text-sm text-white bg-secondary hover:bg-[#ea580c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer shadow-sm shadow-orange-500/20"
                        type="submit"
                    >
                        {isSubmitting ? "Đang xử lý..." : "Đăng Nhập"}
                    </button>
                </div>
            </form>

            {/* Divider */}
            <div className="my-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border-light/30"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-white text-neutral-light font-medium">
                            Hoặc đăng nhập bằng
                        </span>
                    </div>
                </div>
            </div>

            {/* Social Logins */}
            <div className="space-y-3">
                <button
                    onClick={handleGoogleLogin}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-bg-base hover:bg-bg-card border border-border-light/40 rounded-xl text-xs font-semibold text-neutral-dark transition-all hover:border-border-light active:scale-[0.98] cursor-pointer shadow-sm"
                    type="button"
                >
                    <img
                        src={GoogleIcon}
                        alt="Google Logo"
                        className="w-4 h-4 object-contain"
                    />
                    Đăng nhập bằng Google
                </button>
            </div>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-xs text-neutral-medium">
                Chưa có tài khoản?{" "}
                <Link className="font-bold text-primary hover:opacity-95 transition-opacity" to="/signup">
                    Đăng ký ngay
                </Link>
            </p>

            {/* Return to Home link */}
            <p className="mt-4 text-center text-xs">
                <Link className="font-semibold text-neutral-light hover:text-neutral-medium transition-colors" to="/">
                    Quay về trang chủ
                </Link>
            </p>
        </>
    );
};

export default LoginForm;
