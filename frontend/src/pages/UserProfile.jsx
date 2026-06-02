import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthService from "@/services/authService";
import courseService from "@/services/courseService";
import Header from "@/components/layouts/Header";
import CreatorUpgradeCard from "@/components/features/CreatorUpgradeCard";
import { toast } from "sonner";
import { runWithLoading } from "@/utils/utils";
import {
    User,
    Mail,
    Phone,
    Lock,
    BookOpen,
    CheckCircle2,
    KeyRound,
    Trophy,
    Shield,
} from "lucide-react";


const UserProfile = () => {
    const { user, checkAuth } = useAuth();
    const [coursesCount, setCoursesCount] = useState(0);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    // Profile Details Form State
    const [profileForm, setProfileForm] = useState({
        fullName: "",
        username: "",
        email: "",
        phone: "",
        bio: "",
        avatarUrl: "/images/default-avatar.png",
    });

    // Password Form State
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Initialize form states once user data is available
    useEffect(() => {
        if (user) {
            console.log(user);
            setProfileForm({
                fullName: user.fullName || "",
                username: user.username || "",
                email: user.email || "",
                phone: user.phone || "",
                bio: user.bio || "Thành viên tích cực học tập tại EduSpace. Rất vui được đồng hành cùng mọi người!",
                avatarUrl: user.avatarUrl || "/images/default-avatar.png",
            });
        }
    }, [user]);

    // Fetch user courses count
    useEffect(() => {
        const fetchCourses = async () => {
            if (user) {
                try {
                    const data = await courseService.getPublishedCourses();
                    if (data && Array.isArray(data)) {
                        setCoursesCount(data.length);
                    }
                } catch (error) {
                    console.error("Failed to load courses count:", error);
                }
            }
        };
        fetchCourses();
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-bg-base flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-border-light/30 max-w-sm w-full">
                        <Shield className="text-primary mx-auto mb-4" size={48} />
                        <h2 className="text-xl font-bold text-neutral-dark mb-2">Vui lòng đăng nhập</h2>
                        <p className="text-neutral-medium text-sm mb-6">Bạn cần đăng nhập để xem và quản lý thông tin hồ sơ cá nhân.</p>
                        <a
                            href="/login"
                            className="inline-block w-full bg-primary hover:bg-[#3f38c9] text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all active:scale-[0.98]"
                        >
                            Đăng nhập ngay
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!profileForm.fullName.trim()) {
            return toast.error("Họ và tên không được để trống!");
        }
        if (!profileForm.email.trim()) {
            return toast.error("Email không được để trống!");
        }

        await runWithLoading(setIsUpdatingProfile, async () => {
            try {
                await AuthService.updateProfile(profileForm);
                await checkAuth();
                toast.success("Cập nhật thông tin hồ sơ thành công!");
            } catch (error) {
                console.error("Update profile error:", error);
                toast.error(error.message || "Không thể cập nhật thông tin lên hệ thống!");
            }
        });
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();
        const { currentPassword, newPassword, confirmPassword } = passwordForm;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return toast.error("Vui lòng điền đầy đủ các thông tin mật khẩu!");
        }
        if (newPassword !== confirmPassword) {
            return toast.error("Mật khẩu mới và mật khẩu xác nhận không khớp!");
        }
        if (newPassword.length < 6) {
            return toast.error("Mật khẩu mới phải chứa ít nhất 6 ký tự!");
        }

        await runWithLoading(setIsUpdatingPassword, async () => {
            try {
                await AuthService.changePassword({ currentPassword, newPassword });
                toast.success("Thay đổi mật khẩu thành công!");
                setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } catch (error) {
                console.error("Change password error:", error);
                toast.error(error.message || "Thay đổi mật khẩu thất bại!");
            }
        });
    };

    if (!user) {
        return <div className="p-6">Đang tải thông tin hồ sơ...</div>;
    }

    return (
        <div className="min-h-screen bg-bg-base text-neutral-dark font-sans flex flex-col pb-12">
            <Header />

            <div className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-in fade-in duration-300">
                {/* Bento Grid Header */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: User Bio Card */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 hover:shadow-[0px_10px_30px_rgba(79,70,229,0.04)] transition-all duration-300">
                        {/* Avatar Wrapper (Read-only) */}
                        <div className="relative shrink-0">
                            <img
                                alt="User Avatar"
                                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-bg-card shadow-sm"
                                src={profileForm.avatarUrl}
                            />
                        </div>

                        {/* User basic info */}
                        <div className="text-center sm:text-left flex-1 space-y-3">
                            <div>
                                <h2 className="text-2xl font-bold text-neutral-dark">{profileForm.fullName || user.username}</h2>
                                <p className="text-sm text-neutral-medium font-medium mt-0.5">@{user.username}</p>
                            </div>
                            <p className="text-xs sm:text-sm text-neutral-medium leading-relaxed italic">
                                "{profileForm.bio}"
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                                <span className="bg-primary/10 text-primary border border-primary/20 px-3.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                                    {user.role === "CREATOR" ? "Content Creator" : user.role === "ADMIN" ? "Quản trị viên" : "Học viên"}
                                </span>
                                <span className="bg-tertiary/10 text-tertiary border border-tertiary/20 px-3.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                                    Thành viên EduSpace
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Quick Stats Column */}
                    <div className="flex flex-col gap-4">
                        {/* Completed Courses */}
                        <div className="bg-white rounded-xl border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] p-5 flex items-center gap-4 hover:shadow-[0px_10px_30px_rgba(79,70,229,0.04)] transition-all">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <BookOpen size={22} />
                            </div>
                            <div>
                                <span className="text-[10px] text-neutral-medium uppercase tracking-wider font-bold block">Khóa học đăng ký</span>
                                <span className="text-xl font-bold text-neutral-dark">{coursesCount} khóa học</span>
                            </div>
                        </div>

                        {/* Points */}
                        <div className="bg-white rounded-xl border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] p-5 flex items-center gap-4 hover:shadow-[0px_10px_30px_rgba(79,70,229,0.04)] transition-all">
                            <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0">
                                <Trophy size={22} />
                            </div>
                            <div>
                                <span className="text-[10px] text-neutral-medium uppercase tracking-wider font-bold block">Điểm cống hiến</span>
                                <span className="text-xl font-bold text-neutral-dark">580 Điểm</span>
                            </div>
                        </div>

                        {/* Status Check */}
                        <div className="bg-white rounded-xl border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] p-5 flex items-center gap-4 hover:shadow-[0px_10px_30px_rgba(79,70,229,0.04)] transition-all">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                                <CheckCircle2 size={22} />
                            </div>
                            <div>
                                <span className="text-[10px] text-neutral-medium uppercase tracking-wider font-bold block">Trạng thái tài khoản</span>
                                <span className="text-sm font-bold text-emerald-600">Đã xác minh</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Panel: Inputs and Password Change */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile edit card */}
                        <div className="bg-white rounded-2xl border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-8">
                            <h3 className="text-lg font-bold text-neutral-dark mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                                <User size={20} className="text-primary" /> Cập nhật thông tin cá nhân
                            </h3>

                            <form onSubmit={handleSaveProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="fullName">
                                            Họ và Tên
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-light">
                                                <User size={16} />
                                            </span>
                                            <input
                                                id="fullName"
                                                name="fullName"
                                                type="text"
                                                value={profileForm.fullName}
                                                onChange={handleProfileChange}
                                                placeholder="Nguyen Van A"
                                                className="w-full bg-bg-card border border-border-light/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-neutral-light"
                                            />
                                        </div>
                                    </div>

                                    {/* Username */}
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="username">
                                            Tên đăng nhập
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-light">
                                                <User size={16} />
                                            </span>
                                            <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                value={profileForm.username}
                                                disabled
                                                placeholder="username"
                                                className="w-full bg-slate-50 border border-border-light/20 text-neutral-medium rounded-xl pl-10 pr-4 py-3 text-sm outline-none cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="email">
                                            Địa chỉ Email
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-light">
                                                <Mail size={16} />
                                            </span>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={profileForm.email}
                                                onChange={handleProfileChange}
                                                placeholder="nguyen.van.a@example.com"
                                                className="w-full bg-bg-card border border-border-light/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-neutral-light"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="phone">
                                            Số điện thoại
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-light">
                                                <Phone size={16} />
                                            </span>
                                            <input
                                                id="phone"
                                                name="phone"
                                                type="text"
                                                value={profileForm.phone}
                                                onChange={handleProfileChange}
                                                placeholder="0123456789"
                                                className="w-full bg-bg-card border border-border-light/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-neutral-light"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="bio">
                                        Giới thiệu ngắn
                                    </label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        rows={3}
                                        value={profileForm.bio}
                                        onChange={handleProfileChange}
                                        placeholder="Một vài dòng tự giới thiệu về bản thân..."
                                        className="w-full bg-bg-card border border-border-light/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all placeholder:text-neutral-light"
                                    />
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end pt-2 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={isUpdatingProfile}
                                        className="bg-primary hover:opacity-95 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2"
                                    >
                                        {isUpdatingProfile ? "Đang lưu..." : "Lưu thay đổi"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Password change card */}
                        <div className="bg-white rounded-2xl border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-8">
                            <h3 className="text-lg font-bold text-neutral-dark mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                                <KeyRound size={20} className="text-primary" /> Đổi mật khẩu bảo mật
                            </h3>

                            <form onSubmit={handleSavePassword} className="space-y-5">
                                <div className="space-y-4">
                                    {/* Current Password */}
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="currentPassword">
                                            Mật khẩu hiện tại
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-light">
                                                <Lock size={16} />
                                            </span>
                                            <input
                                                id="currentPassword"
                                                name="currentPassword"
                                                type="password"
                                                value={passwordForm.currentPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="••••••••"
                                                className="w-full md:w-2/3 bg-bg-card border border-border-light/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-neutral-light"
                                            />
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="newPassword">
                                            Mật khẩu mới
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-light">
                                                <Lock size={16} />
                                            </span>
                                            <input
                                                id="newPassword"
                                                name="newPassword"
                                                type="password"
                                                value={passwordForm.newPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Nhập mật khẩu mới"
                                                className="w-full md:w-2/3 bg-bg-card border border-border-light/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-neutral-light"
                                            />
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="confirmPassword">
                                            Xác nhận mật khẩu mới
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-light">
                                                <Lock size={16} />
                                            </span>
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                value={passwordForm.confirmPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Nhập lại mật khẩu mới"
                                                className="w-full md:w-2/3 bg-bg-card border border-border-light/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-neutral-light"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit button */}
                                <div className="flex justify-end pt-2 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={isUpdatingPassword}
                                        className="bg-primary hover:opacity-95 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2"
                                    >
                                        {isUpdatingPassword ? "Đang thực hiện..." : "Đổi mật khẩu"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Panel: Creator Upgrade Card */}
                    <div className="space-y-6">
                        {/* Content Creator Upgrade card */}
                        <CreatorUpgradeCard user={user} />

                        {/* Studying motivation card */}
                        <div className="bg-white rounded-2xl border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] p-6 flex flex-col gap-4">
                            <h4 className="text-sm font-bold text-neutral-dark uppercase tracking-wider border-b border-slate-100 pb-2">Phương châm học tập</h4>
                            <div className="space-y-3">
                                <div className="flex gap-3 text-xs">
                                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                                    <span className="text-neutral-medium">Học hỏi liên tục mỗi ngày.</span>
                                </div>
                                <div className="flex gap-3 text-xs">
                                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                                    <span className="text-neutral-medium">Hoàn thành bài tập chấm từ Mentor.</span>
                                </div>
                                <div className="flex gap-3 text-xs">
                                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                                    <span className="text-neutral-medium">Tham gia cống hiến bài viết chất lượng trong cộng đồng học viên.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default UserProfile;
