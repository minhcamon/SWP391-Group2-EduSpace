import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    GraduationCap,
    Settings,
    BarChart3,
    Form,
    Menu,
    X,
} from "lucide-react";
import Logo from "../common/Logo";
import Avatar from "../common/Avatar";
import LogoutButton from "../ui/LogoutButton";
import { useAuth } from "@/contexts/AuthContext";
import { roleMapping } from "../../lib/data.js";
import Badge from "../ui/Badge";

const Sidebar = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const currentPath = location.pathname;

    // Close the sidebar when navigation occurs
    useEffect(() => {
        setIsOpen(false);
    }, [currentPath]);

    if (user === null) {
        return null;
    }

    const displayMapping = {
        ADMIN: "Trang quản trị viên",
        CREATOR: "Creator Hub",
    };

    const menuAdminGroups = [
        {
            groupName: "Tổng quan",
            items: [
                {
                    text: "Tổng quan",
                    icon: LayoutDashboard,
                    path: "/admin",
                },
            ],
        },
        {
            groupName: "Quản lý hệ thống",
            items: [
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
                {
                    text: "Quản lý đơn mentor",
                    icon: Users,
                    path: "/creator/mentor-applications",
                },
                {
                    text: "Yêu cầu rút lui",
                    icon: Form,
                    path: "/creator/withdraw-requests",
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
        <>
            {/* Mobile Header Bar */}
            <div className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-40 w-full shadow-xs">
                <div className="flex items-center gap-2">
                    <Logo />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary ml-2">
                        {displayMapping[user.role]}
                    </span>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-xl cursor-pointer"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Backdrop overlay for mobile drawer */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-50 md:hidden animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Panel */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between transition-transform duration-300 md:sticky md:top-0 md:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Close Button for mobile drawer */}
                <div className="absolute top-4 right-4 md:hidden">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

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
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${isActive
                                                    ? "bg-indigo-50 text-primary"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                                                    }`}
                                            >
                                                <Icon
                                                    size={18}
                                                    className={`transition-colors duration-200 ${isActive
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
                            <Badge variant="roletag">{roleMapping[user.role]}</Badge>
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
        </>
    );
};

export default Sidebar;

