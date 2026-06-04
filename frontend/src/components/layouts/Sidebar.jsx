import { Link, useLocation } from "react-router";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    GraduationCap,
    Settings,
    BarChart3,
    Form,
} from "lucide-react";
import Logo from "../common/Logo";
import Avatar from "./Avatar";
import LogoutButton from "./LogoutButton";
import { useAuth } from "@/contexts/AuthContext";
import { roleMapping } from "../../lib/data.js";

const Sidebar = () => {
    const { user } = useAuth();

    if (user === null) {
        return null;
    }

    const location = useLocation();
    const currentPath = location.pathname;

    const displayMapping = {
        ADMIN: "Trang quản trị viên",
        CREATOR: "Creator Hub",
    };

    const menuAdminGroups = [
        {
            groupName: "Tổng quan",
            items: [
                {
                    text: "Dashboard",
                    icon: LayoutDashboard,
                    path: "/admin/dashboard",
                },
            ],
        },
        {
            groupName: "Quản lý hệ thống",
            items: [
                {
                    text: "Quản lý học viên",
                    icon: Users,
                    path: "/admin/students",
                },
                {
                    text: "Quản lý giảng viên",
                    icon: GraduationCap,
                    path: "/admin/teachers",
                },
                {
                    text: "Kiểm duyệt khóa học",
                    icon: BookOpen,
                    path: "/admin/courses-management",
                },
                {
                    text: "Kiểm duyệt duyệt đơn",
                    icon: Form,
                    path: "/admin/creator-requests",
                },
            ],
        },
    ];

    const menuCreatorGroups = [
        {
            groupName: "Tổng quan",
            items: [
                {
                    text: "Dashboard",
                    icon: LayoutDashboard,
                    path: "/creator/analytics",
                },
            ],
        },
        {
            groupName: "Quản lý hệ thống",
            items: [
                {
                    text: "Quản lý khóa học",
                    icon: BookOpen,
                    path: "/creator/courses",
                },
            ],
        },
        {
            groupName: "Cấu hình",
            items: [
                {
                    text: "Cài đặt hệ thống",
                    icon: Settings,
                    path: "/creator/settings",
                },
            ],
        },
    ];

    const menuMapping = {
        ADMIN: menuAdminGroups,
        CREATOR: menuCreatorGroups,
    };

    const menuGroups = menuMapping[user.role];

    return (
        <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between sticky top-0 left-0 z-50">
            <div className="flex flex-col grow overflow-y-auto px-4 py-6">
                <div className="flex items-center gap-3 px-2 mb-8">
                    <div>
                        <Logo />
                        <p className="mt-4 text-[12px] font-bold uppercase tracking-wider text-center text-primary">
                            {displayMapping[user.role]}
                        </p>
                        <hr className="mt-4 text-secondary" />
                    </div>
                </div>

                <nav className="space-y-6">
                    {menuGroups.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-2">
                            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2">
                                {group.groupName}
                            </h2>

                            <div className="space-y-1">
                                {group.items.map((item, itemIdx) => {
                                    const Icon = item.icon;
                                    const isActive = currentPath === item.path;

                                    return (
                                        <Link
                                            key={itemIdx}
                                            to={item.path}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                                                isActive
                                                    ? "bg-indigo-50 text-primary"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                                            }`}
                                        >
                                            <Icon
                                                size={18}
                                                className={`transition-colors duration-200 ${
                                                    isActive
                                                        ? "text-primary"
                                                        : "text-gray-400 group-hover:text-primary"
                                                }`}
                                            />
                                            {item.text}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3 p-2 mb-3 rounded-xl">
                    <Link to="/profile">
                        <Avatar
                            src={user.avatarUrl}
                            alt="Avatar Admin"
                            className="w-12 h-12 p-0.5 hover:cursor-pointer flex items-center justify-center border-2 border-gray-100 hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                        />
                    </Link>
                    <div className="grow min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">
                            {user.fullName}
                        </p>
                        <p className="mt-2 text-xs text-gray-500 truncate">
                            {roleMapping[user.role]}
                        </p>
                    </div>
                </div>

                <hr className="mb-4 text-secondary" />

                <LogoutButton
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer group"
                    iconSize={18}
                    iconClassName="text-red-400 group-hover:text-red-600 transition-colors"
                    redirectPath="/"
                />
            </div>
        </aside>
    );
};

export default Sidebar;
