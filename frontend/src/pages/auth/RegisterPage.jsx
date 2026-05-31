import { useState } from "react";
import { Book, Lock, Mail, User, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router";
import AuthService from "@/services/authService";
import { toast } from "sonner";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!agreeTerms) {
            return toast.error("Vui lòng đồng ý với Điều khoản và Điều kiện!");
        }

        if (formData.password !== formData.confirmPassword) {
            return toast.error("Mật khẩu xác nhận không khớp!");
        }

        setIsSubmitting(false);
        try {
            const successMessage = await AuthService.register(formData);
            toast.success(successMessage || "Đăng ký tài khoản thành công!");
            navigate("/login");
        } catch (error) {
            console.error("Registration failed: ", error);
            toast.error(error.message || "Đăng ký thất bại. Vui lòng thử lại!");
        }
    };

    return (
        <div className="min-h-screen bg-bg-base text-neutral-dark font-sans flex w-full overflow-hidden">
            {/* Left Panel: Sign Up Form */}
            <div className="w-full lg:w-[48%] flex flex-col justify-center px-6 sm:px-12 lg:px-[6%] py-12 bg-white overflow-y-auto">
                <div className="w-full max-w-lg mx-auto">
                    {/* Brand Anchor */}
                    <div className="flex items-center gap-2.5 mb-8">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm">
                            <Book size={20} />
                        </div>
                        <span className="font-bold text-2xl text-primary tracking-tight">eduSpace</span>
                    </div>

                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="font-bold text-3xl md:text-4xl text-neutral-dark mb-2 tracking-tight">Tạo tài khoản</h1>
                        <p className="text-sm text-neutral-medium leading-relaxed">
                            Tham gia eduSpace để bắt đầu hành trình luyện thi IELTS chuyên sâu của bạn.
                        </p>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Full Name Field */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="fullname">
                                    Họ và tên
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-light">
                                        <User size={16} />
                                    </div>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 bg-bg-base border border-border-light/40 rounded-xl text-sm text-neutral-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-neutral-light"
                                        id="fullname"
                                        name="fullname"
                                        placeholder="Nguyen Van A"
                                        required
                                        type="text"
                                        value={formData.fullname}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Phone Field */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="phone">
                                    Số điện thoại
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-light">
                                        <Phone size={16} />
                                    </div>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 bg-bg-base border border-border-light/40 rounded-xl text-sm text-neutral-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-neutral-light"
                                        id="phone"
                                        name="phone"
                                        placeholder="0123456789"
                                        required
                                        type="text"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Username Field */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="username">
                                    Tên đăng nhập
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-light">
                                        <User size={16} />
                                    </div>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 bg-bg-base border border-border-light/40 rounded-xl text-sm text-neutral-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-neutral-light"
                                        id="username"
                                        name="username"
                                        placeholder="username"
                                        required
                                        type="text"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="email">
                                    Địa chỉ Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-light">
                                        <Mail size={16} />
                                    </div>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 bg-bg-base border border-border-light/40 rounded-xl text-sm text-neutral-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-neutral-light"
                                        id="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        placeholder="Nhập mật khẩu"
                                        required
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="confirmPassword">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-light">
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 bg-bg-base border border-border-light/40 rounded-xl text-sm text-neutral-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-neutral-light"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Nhập lại mật khẩu"
                                        required
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-2.5 pt-2">
                            <input
                                className="h-4 w-4 rounded border-border-light/40 text-primary focus:ring-primary bg-bg-base cursor-pointer mt-0.5"
                                id="terms"
                                name="terms"
                                required
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                            />
                            <label className="text-xs text-neutral-medium cursor-pointer" htmlFor="terms">
                                Tôi đồng ý với{" "}
                                <Link className="font-bold text-primary hover:underline transition-all" to="#">
                                    Điều khoản
                                </Link>{" "}
                                và{" "}
                                <Link className="font-bold text-primary hover:underline transition-all" to="#">
                                    Điều kiện
                                </Link>{" "}
                                của nền tảng.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md font-semibold text-sm text-white bg-secondary hover:bg-[#ea580c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer shadow-sm shadow-orange-500/20"
                                type="submit"
                            >
                                Tạo Tài Khoản
                            </button>
                        </div>
                    </form>

                    {/* Login Link */}
                    <p className="mt-8 text-center text-xs text-neutral-medium">
                        Đã có tài khoản?{" "}
                        <Link className="font-bold text-primary hover:opacity-95 transition-opacity" to="/login">
                            Đăng nhập
                        </Link>
                    </p>

                    {/* Return to Home link */}
                    <p className="mt-4 text-center text-xs">
                        <Link className="font-semibold text-neutral-light hover:text-neutral-medium transition-colors" to="/">
                            Quay về trang chủ
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Panel: Feature Image & Glassmorphism Card */}
            <div className="hidden lg:block lg:w-[52%] relative bg-bg-sidebar overflow-hidden">
                {/* Background Image */}
                <img
                    alt="Students collaborating"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    src="https://daihoc.fpt.edu.vn/wp-content/uploads/2022/09/trai-nghiem-song-ao-chay-may-truoc-khuon-vien-dep-ngat-ngay-cua-dai-hoc-fpt-3-mien-anh-2.jpeg"
                />
            </div>
        </div>
    );
};

export default RegisterForm;
