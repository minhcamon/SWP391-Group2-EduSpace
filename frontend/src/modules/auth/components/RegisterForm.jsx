import { useState } from "react";
import { Lock, Mail, User, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router";
import AuthService from "@/services/authService";
import { toast } from "sonner";
import { runWithLoading } from "@/utils/utils";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Button from "@/components/ui/Button";

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

        await runWithLoading(setIsSubmitting, async () => {
            try {
                const successMessage = await AuthService.register(formData);
                toast.success(successMessage || "Đăng ký tài khoản thành công! Vui lòng kiểm tra email để xác thực tài khoản.", {
                    duration: 6000,
                });
            } catch (error) {
                console.error("Registration failed: ", error);
                toast.error(error.message || "Đăng ký thất bại. Vui lòng thử lại!");
            }
        });
    };

    return (
        <>
            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name Field */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="fullname">
                            Họ và tên
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-light">
                                <User size={16} />
                            </div>
                            <Input
                                className="pl-10 pr-4 py-3 h-auto bg-bg-base border-border-light/40 rounded-xl"
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
                        <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="phone">
                            Số điện thoại
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-light">
                                <Phone size={16} />
                            </div>
                            <Input
                                className="pl-10 pr-4 py-3 h-auto bg-bg-base border-border-light/40 rounded-xl"
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
                        <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="username">
                            Tên đăng nhập
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-light">
                                <User size={16} />
                            </div>
                            <Input
                                className="pl-10 pr-4 py-3 h-auto bg-bg-base border-border-light/40 rounded-xl"
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
                        <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="email">
                            Địa chỉ Email
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-light">
                                <Mail size={16} />
                            </div>
                            <Input
                                className="pl-10 pr-4 py-3 h-auto bg-bg-base border-border-light/40 rounded-xl"
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
                        <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="password">
                            Mật khẩu
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-light">
                                <Lock size={16} />
                            </div>
                            <Input
                                className="pl-10 pr-4 py-3 h-auto bg-bg-base border-border-light/40 rounded-xl"
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
                        <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="confirmPassword">
                            Xác nhận mật khẩu
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-light">
                                <Lock size={16} />
                            </div>
                            <Input
                                className="pl-10 pr-4 py-3 h-auto bg-bg-base border-border-light/40 rounded-xl"
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
                    <Label className="text-xs text-neutral-medium cursor-pointer" htmlFor="terms">
                        Tôi đồng ý với{" "}
                        <Link className="font-bold text-primary hover:underline transition-all" to="#">
                            Điều khoản
                        </Link>{" "}
                        và{" "}
                        <Link className="font-bold text-primary hover:underline transition-all" to="#">
                            Điều kiện
                        </Link>{" "}
                        của nền tảng.
                    </Label>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        className="w-full py-3.5 h-auto border border-transparent rounded-xl font-semibold text-sm text-white bg-secondary hover:bg-[#ea580c] transition-all cursor-pointer shadow-sm shadow-orange-500/20"
                    >
                        Tạo Tài Khoản
                    </Button>
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
        </>
    );
};

export default RegisterForm;

