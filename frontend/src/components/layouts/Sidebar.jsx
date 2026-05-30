import { Link, useLocation } from "react-router";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    GraduationCap,
    Settings,
    LogOut,
    BarChart3,
} from "lucide-react";
import Logo from "../common/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { roleMapping } from "@/lib/data";

const Sidebar = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href = "/"; 
    }

    const location = useLocation();
    const currentPath = location.pathname;

    const menuGroups = [
        {
            groupName: "Tổng quan",
            items: [
                {
                    text: "Dashboard",
                    icon: LayoutDashboard,
                    path: "/admin/dashboard",
                },
                {
                    text: "Thống kê thu nhập",
                    icon: BarChart3,
                    path: "/admin/analytics",
                },
            ],
        },
        {
            groupName: "Quản lý hệ thống",
            items: [
                {
                    text: "Quản lý khóa học",
                    icon: BookOpen,
                    path: "/admin/courses",
                },
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
            ],
        },
        {
            groupName: "Cấu hình",
            items: [
                {
                    text: "Cài đặt hệ thống",
                    icon: Settings,
                    path: "/admin/settings",
                },
            ],
        },
    ];

    return (
        <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between sticky top-0 left-0 z-50">
            <div className="flex flex-col grow overflow-y-auto px-4 py-6">
                <div className="flex items-center gap-3 px-2 mb-8">
                    <div>
                        <Logo />
                        <p className="mt-4 text-[12px] font-bold uppercase tracking-wider text-center">
                            {user.role === "ADMIN" ? "Trang quản trị viên" : "Trang quản trị"}
                        </p>
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
                                                    ? "bg-indigo-50 text-indigo-700"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                        >
                                            <Icon
                                                size={18}
                                                className={`transition-colors duration-200 ${
                                                    isActive
                                                        ? "text-indigo-700"
                                                        : "text-gray-400 group-hover:text-gray-600"
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
                    <img
                        src={
                            user.avatarUrl ||
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                        }
                        alt="Avatar Admin"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-50"
                    />
                    <div className="grow min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">
                            {user.fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {roleMapping[user.role]}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer group"
                >
                    <LogOut
                        size={18}
                        className="text-red-400 group-hover:text-red-600 transition-colors"
                    />
                    Đăng xuất
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
