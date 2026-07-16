import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, AlertCircle, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import authService from "@/services/authService";
import GoogleIcon from "@/assets/google-icon-logo.svg";
import { runWithLoading } from "@/utils/utils";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Button from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/Dialog';

const LoginForm = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [showResendModal, setShowResendModal] = useState(false);
    const [resendEmail, setResendEmail] = useState("");
    const [isResending, setIsResending] = useState(false);

    // Show message from navigation state (e.g., after email verification)
    useEffect(() => {
        if (location.state?.message) {
            toast.info(location.state.message, { duration: 5000 });
            // Clear the state to prevent showing the message again on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

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
                const errorMsg = error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!";
                
                // Check if error is due to unverified account
                if (errorMsg.includes("not verified") || errorMsg.includes("chưa xác thực") || errorMsg.includes("verify your account")) {
                    // Try to extract email from username if it's an email, otherwise leave empty
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    setResendEmail(emailPattern.test(username) ? username : "");
                    setShowResendModal(true);
                } else {
                    toast.error(errorMsg);
                }
            }
        };

        await runWithLoading(setIsSubmitting, handleLogin);
    };

    const handleResendVerification = async () => {
        if (!resendEmail || !resendEmail.includes('@')) {
            toast.error('Vui lòng nhập email hợp lệ');
            return;
        }

        setIsResending(true);
        try {
            await authService.resendVerificationEmail(resendEmail);
            toast.success('Email xác thực mới đã được gửi! Vui lòng kiểm tra hộp thư của bạn.', {
                duration: 6000
            });
            setShowResendModal(false);
            setResendEmail("");
        } catch (error) {
            toast.error(error.message || 'Không thể gửi email xác thực. Vui lòng thử lại.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <>
            {/* Resend Verification Modal */}
            <Dialog open={showResendModal} onOpenChange={(open) => !open && setShowResendModal(false)}>
                <DialogContent className="max-w-md w-full p-6 bg-white rounded-2xl shadow-2xl gap-0" showCloseButton={false}>
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setShowResendModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer z-10"
                        >
                            <X size={20} />
                        </button>

                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-8 h-8 text-orange-600" />
                            </div>
                        </div>

                        {/* Title */}
                        <DialogTitle className="text-2xl font-bold text-gray-900 text-center mb-2">
                            Tài khoản chưa xác thực
                        </DialogTitle>

                        {/* Description */}
                        <DialogDescription className="text-gray-600 text-center mb-6">
                            Vui lòng kiểm tra email để xác thực tài khoản. Nếu bạn chưa nhận được email hoặc link đã hết hạn, hãy nhập email để nhận link mới.
                        </DialogDescription>

                        {/* Email Input */}
                        <div className="mb-6 text-left">
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Email của bạn
                            </Label>
                            <Input
                                type="email"
                                value={resendEmail}
                                onChange={(e) => setResendEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                disabled={isResending}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Link xác thực có hiệu lực trong 1 phút
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <Button
                                onClick={() => setShowResendModal(false)}
                                variant="outline"
                                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={isResending}
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={handleResendVerification}
                                disabled={isResending || !resendEmail}
                                className="flex-1 py-3 px-4 bg-secondary hover:bg-[#ea580c] text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                                isLoading={isResending}
                            >
                                {isResending ? (
                                    "Đang gửi..."
                                ) : (
                                    <>
                                        <Mail size={16} />
                                        Gửi lại email
                                    </>
                                )}
                            </Button>
                        </div>
                </DialogContent>
            </Dialog>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username Field */}
                <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="username">
                        Tên đăng nhập hoặc Email
                    </Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-light z-10">
                            <Mail size={16} />
                        </div>
                        <Input
                            className="pl-10 pr-4 py-3 h-auto bg-bg-base border-border-light/40 rounded-xl"
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
                    <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="password">
                        Mật khẩu
                    </Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-light z-10">
                            <Lock size={16} />
                        </div>
                        <Input
                            className="pl-10 pr-4 py-3 h-auto bg-bg-base border-border-light/40 rounded-xl"
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
                        <Label className="ml-2 text-xs font-semibold text-neutral-medium cursor-pointer" htmlFor="remember-me">
                            Ghi nhớ đăng nhập
                        </Label>
                    </div>
                    <div className="text-xs">
                        <Link to="/forgot-password" className="font-semibold text-primary hover:opacity-95 transition-opacity">
                            Quên mật khẩu?
                        </Link>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        className="w-full py-3.5 h-auto border border-transparent rounded-xl font-semibold text-sm text-white bg-secondary hover:bg-[#ea580c] transition-all duration-200 cursor-pointer shadow-sm shadow-orange-500/20"
                    >
                        Đăng Nhập
                    </Button>
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
                <Button
                    onClick={handleGoogleLogin}
                    disabled={isSubmitting}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2.5 py-3 h-auto bg-bg-base hover:bg-bg-card border border-border-light/40 rounded-xl text-xs font-semibold text-neutral-dark transition-all hover:border-border-light active:scale-[0.98] cursor-pointer shadow-sm"
                    type="button"
                >
                    <img
                        src={GoogleIcon}
                        alt="Google Logo"
                        className="w-4 h-4 object-contain"
                    />
                    Đăng nhập bằng Google
                </Button>
            </div>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-xs text-neutral-medium">
                Chưa có tài khoản?{" "}
                <Link className="font-bold text-primary hover:opacity-95 transition-opacity" to="/signup">
                    Đăng ký ngay
                </Link>
            </p>

            {/* Resend Verification Link */}
            <p className="mt-3 text-center text-xs text-neutral-medium">
                Chưa nhận được email xác thực?{" "}
                <Link className="font-bold text-orange-600 hover:opacity-95 transition-opacity" to="/resend-verification">
                    Gửi lại email
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
