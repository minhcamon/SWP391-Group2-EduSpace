import React, { useRef, useState } from "react";
import Avatar from "@/components/common/Avatar";
import { Card, CardContent } from "@/components/ui/Card";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AuthService from "@/services/authService";

const UserBioCard = ({ user, profileForm, onAvatarUpdated }) => {
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Vui lòng chọn file ảnh!");
            return;
        }

        // Validate file size (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error("Kích thước ảnh không được vượt quá 5MB!");
            return;
        }

        setIsUploading(true);
        try {
            const updatedUser = await AuthService.uploadAvatar(file);
            toast.success("Cập nhật avatar thành công!");
            
            // Call parent callback to refresh user data
            if (onAvatarUpdated) {
                onAvatarUpdated(updatedUser);
            }
        } catch (error) {
            console.error("Upload avatar error:", error);
            toast.error(error.message || "Không thể tải ảnh lên!");
        } finally {
            setIsUploading(false);
            // Reset input để có thể chọn lại cùng file
            e.target.value = '';
        }
    };

    return (
        <Card className="lg:col-span-2 bg-white border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0px_10px_30px_rgba(79,70,229,0.04)] transition-all duration-300">
            <CardContent className="p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar Wrapper with Upload Button */}
                <div className="relative shrink-0 group">
                    <Avatar
                        alt="User Avatar"
                        className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-bg-card shadow-sm"
                        src={profileForm.avatarUrl}
                    />
                    
                    {/* Upload button overlay */}
                    <button
                        type="button"
                        onClick={handleAvatarClick}
                        disabled={isUploading}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer disabled:cursor-not-allowed"
                        title="Thay đổi avatar"
                    >
                        {isUploading ? (
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        ) : (
                            <Camera className="w-8 h-8 text-white" />
                        )}
                    </button>

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
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
            </CardContent>
        </Card>
    );
};

export default UserBioCard;
