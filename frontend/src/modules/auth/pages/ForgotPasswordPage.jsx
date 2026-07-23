import React, { useState, useEffect } from "react";
import { Mail, Lock, Key, CheckCircle2, ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import authService from "@/services/authService";
import { runWithLoading } from "@/utils/utils";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Button from "@/components/ui/Button";

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    // Handle OTP countdown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Handle Step 1: Send OTP request
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email || !email.includes("@")) {
            return toast.error("Vui lòng nhập địa chỉ email hợp lệ!");
        }

        await runWithLoading(setIsSubmitting, async () => {
            try {
                await authService.forgotPassword(email);
                toast.success("Mã OTP đã được gửi về email của bạn. Vui lòng kiểm tra!");
                setStep(2);
                setResendCooldown(60); // 60s cooldown for resending
            } catch (error) {
                console.error("Forgot password error:", error);
                toast.error(error.message || "Gửi yêu cầu thất bại. Vui lòng thử lại!");
            }
        });
    };

    // Handle Resend OTP
    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;
        
        await runWithLoading(setIsSubmitting, async () => {
            try {
                await authService.forgotPassword(email);
                toast.success("Mã OTP mới đã được gửi lại!");
                setResendCooldown(60);
            } catch (error) {
                console.error("Resend OTP error:", error);
                toast.error(error.message || "Gửi lại OTP thất bại. Vui lòng thử lại!");
            }
        });
    };

    // Handle Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp || otp.length !== 6 || isNaN(otp)) {
            return toast.error("Mã OTP phải gồm 6 chữ số!");
        }

        await runWithLoading(setIsSubmitting, async () => {
            try {
                const token = await authService.verifyOtp(email, otp);
                toast.success("Xác thực OTP thành công!");
                setResetToken(token);
                setStep(3);
            } catch (error) {
                console.error("Verify OTP error:", error);
                toast.error(error.message || "Mã OTP không chính xác hoặc đã hết hạn!");
            }
        });
    };

    // Handle Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            return toast.error("Mật khẩu mới phải chứa ít nhất 6 ký tự!");
        }
        if (newPassword !== confirmPassword) {
            return toast.error("Mật khẩu xác nhận không trùng khớp!");
        }

        await runWithLoading(setIsSubmitting, async () => {
            try {
                await authService.resetPassword(resetToken, newPassword);
                toast.success("Đặt lại mật khẩu thành công!");
                setStep(4);
            } catch (error) {
                console.error("Reset password error:", error);
                toast.error(error.message || "Đặt lại mật khẩu thất bại. Vui lòng thử lại!");
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 transition-all duration-300">
                
                {/* Back Link (Only for Step 1 & 2) */}
                {step < 3 && (
                    <button
                        onClick={() => {
                            if (step === 2) {
                                setStep(1);
                                setOtp("");
                            } else {
                                window.location.href = "/login";
                            }
                        }}
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors cursor-pointer bg-transparent border-0"
                    >
                        <ArrowLeft size={16} />
                        {step === 2 ? "Quay lại nhập Email" : "Quay lại đăng nhập"}
                    </button>
                )}

                {/* Step 1: Input Email */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div className="text-center space-y-2 mb-4">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                                <Mail size={28} />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Quên mật khẩu?</h1>
                            <p className="text-sm text-neutral-medium px-4">
                                Nhập địa chỉ email của bạn để nhận mã OTP xác thực đặt lại mật khẩu.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="forgot_email">
                                Email của bạn
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-light z-10">
                                    <Mail size={16} />
                                </div>
                                <Input
                                    id="forgot_email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    className="pl-10 pr-4 py-3 h-auto bg-bg-base border-border-light/40 rounded-xl"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            className="w-full py-3.5 h-auto bg-secondary hover:opacity-95 text-white rounded-xl text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-sm shadow-orange-500/20"
                        >
                            Gửi mã OTP
                        </Button>
                    </form>
                )}

                {/* Step 2: Verification OTP */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div className="text-center space-y-2 mb-4">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                                <Key size={28} />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Xác thực OTP</h1>
                            <p className="text-sm text-neutral-medium px-4">
                                Mã OTP 6 chữ số đã được gửi đến: <span className="font-semibold text-gray-900">{email}</span>
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="forgot_otp">
                                Mã xác thực OTP
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-light z-10">
                                    <Key size={16} />
                                </div>
                                <Input
                                    id="forgot_otp"
                                    type="text"
                                    maxLength={6}
                                    placeholder="Nhập 6 chữ số"
                                    required
                                    className="pl-10 pr-4 py-3 h-auto bg-bg-base border-border-light/40 rounded-xl tracking-[0.25em] text-center font-bold text-lg"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="text-center text-xs text-neutral-medium">
                            Chưa nhận được mã?{" "}
                            {resendCooldown > 0 ? (
                                <span className="font-bold text-primary">Gửi lại sau {resendCooldown}s</span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={isSubmitting}
                                    className="font-bold text-primary hover:underline cursor-pointer bg-transparent border-0"
                                >
                                    Gửi lại mã
                                </button>
                            )}
                        </div>

                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            className="w-full py-3.5 h-auto bg-secondary hover:opacity-95 text-white rounded-xl text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-sm shadow-orange-500/20"
                        >
                            Xác thực
                        </Button>
                    </form>
                )}

                {/* Step 3: Input New Password */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div className="text-center space-y-2 mb-4">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                                <Lock size={28} />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Thiết lập mật khẩu mới</h1>
                            <p className="text-sm text-neutral-medium px-4">
                                Vui lòng nhập mật khẩu mới bảo mật cao cho tài khoản của bạn.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="new_password">
                                    Mật khẩu mới *
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-light z-10">
                                        <Lock size={16} />
                                    </div>
                                    <Input
                                        id="new_password"
                                        type="password"
                                        placeholder="Tối thiểu 6 ký tự"
                                        required
                                        className="pl-10 pr-4 py-3 h-auto bg-bg-base border-border-light/40 rounded-xl"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="confirm_password">
                                    Xác nhận mật khẩu mới *
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-light z-10">
                                        <Lock size={16} />
                                    </div>
                                    <Input
                                        id="confirm_password"
                                        type="password"
                                        placeholder="Nhập lại mật khẩu mới"
                                        required
                                        className="pl-10 pr-4 py-3 h-auto bg-bg-base border-border-light/40 rounded-xl"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            className="w-full py-3.5 h-auto bg-secondary hover:opacity-95 text-white rounded-xl text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-sm shadow-orange-500/20"
                        >
                            Đổi mật khẩu
                        </Button>
                    </form>
                )}

                {/* Step 4: Success */}
                {step === 4 && (
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                            <CheckCircle2 size={36} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu thành công!</h1>
                            <p className="text-sm text-neutral-medium px-4">
                                Mật khẩu của bạn đã được thay đổi thành công. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.
                            </p>
                        </div>
                        <Link
                            to="/login"
                            className="inline-block w-full py-3.5 bg-primary hover:opacity-95 text-white rounded-xl text-sm font-semibold transition-all active:scale-[0.98] text-center shadow-sm"
                        >
                            Đăng nhập ngay
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ForgotPasswordPage;
