import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router";
import { roleMapping } from "@/lib/data";
import { User, Shield, BookOpen } from "lucide-react";
import Avatar from "@/components/layouts/Avatar";
import LogoutButton from "@/components/layouts/LogoutButton";
import Badge from "../ui/Badge";

const AvatarDropDown = () => {
    const { user } = useAuth();

    return (
        <div
            className="absolute right-0 mt-
        2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-150"
        >
            {/* User Profile Summary Header */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                <Avatar
                    src={user?.avatarUrl}
                    alt="User Avatar"
                    className="w-10 h-10 border border-slate-200 shrink-0"
                />
                <div className="overflow-hidden">
                    <p className="font-bold text-neutral-dark text-sm truncate">
                        {user?.fullName}
                    </p>
                    <p className="text-xs text-neutral-medium truncate mb-1">
                        {user?.email}
                    </p>
                    <Badge title={roleMapping[user?.role] || "Học viên"} />
                </div>
            </div>

            {/* Navigation Menu Options */}
            <div className="py-1">
                <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-neutral-medium hover:bg-slate-50 hover:text-primary transition-all duration-150"
                >
                    <User size={16} />
                    Hồ sơ cá nhân
                </Link>

                {user?.role === "ADMIN" && (
                    <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-neutral-medium hover:bg-slate-50 hover:text-primary transition-all duration-150"
                    >
                        <Shield size={16} />
                        Trang quản trị viên
                    </Link>
                )}

                {user?.role === "CREATOR" && (
                    <Link
                        to="/creator"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-neutral-medium hover:bg-slate-50 hover:text-primary transition-all duration-150"
                    >
                        <BookOpen size={16} />
                        Trang quản lý bài học
                    </Link>
                )}
            </div>

            {/* Logout Option */}
            <div className="border-t border-slate-100 pt-1">
                <LogoutButton
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-150 text-left hover:cursor-pointer"
                    iconSize={16}
                    redirectPath="/"
                />
            </div>
        </div>
    );
};

export default AvatarDropDown;
