import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthService from "@/services/authService";
import courseService from "@/services/courseService";
import CreatorUpgradeCard from "@/modules/shared-features/components/CreatorUpgradeCard";
import { toast } from "sonner";
import { runWithLoading } from "@/utils/utils";
import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Shield } from "lucide-react";

// Subcomponents
import UserBioCard from "../components/UserBioCard";
import UserStats from "../components/UserStats";
import ProfileEditForm from "../components/ProfileEditForm";
import PasswordChangeForm from "../components/PasswordChangeForm";
import StudyMotivationCard from "../components/StudyMotivationCard";

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
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="text-center bg-white border border-border-light/30 max-w-sm w-full">
          <CardContent className="p-8 flex flex-col items-center">
            <Shield className="text-primary mb-4" size={48} />
            <h2 className="text-xl font-bold text-neutral-dark mb-2">Vui lòng đăng nhập</h2>
            <p className="text-neutral-medium text-sm mb-6">Bạn cần đăng nhập để xem và quản lý thông tin hồ sơ cá nhân.</p>
            <Link to="/login" className="w-full">
              <Button className="w-full py-3 h-auto rounded-xl text-sm font-semibold">
                Đăng nhập ngay
              </Button>
            </Link>
          </CardContent>
        </Card>
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

  return (
    <div className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Bento Grid Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: User Bio Card */}
        <UserBioCard user={user} profileForm={profileForm} />

        {/* Right: Quick Stats Column */}
        <UserStats coursesCount={coursesCount} />
      </div>

      {/* Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Panel: Inputs and Password Change */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile edit card */}
          <ProfileEditForm
            profileForm={profileForm}
            onChange={handleProfileChange}
            onSubmit={handleSaveProfile}
            isLoading={isUpdatingProfile}
          />

          {/* Password change card */}
          <PasswordChangeForm
            passwordForm={passwordForm}
            onChange={handlePasswordChange}
            onSubmit={handleSavePassword}
            isLoading={isUpdatingPassword}
          />
        </div>

        {/* Right Panel: Creator Upgrade Card */}
        <div className="space-y-6">
          {/* Content Creator Upgrade card */}
          <CreatorUpgradeCard user={user} />

          {/* Studying motivation card */}
          <StudyMotivationCard />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
