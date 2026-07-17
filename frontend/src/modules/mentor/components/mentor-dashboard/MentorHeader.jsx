import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, Search, ArrowLeftRight, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import AvatarDropDown from "@/components/common/AvatarDropDown";
import Avatar from "@/components/common/Avatar";
import Logo from "@/components/common/Logo";
import NotificationDropdown from "@/components/common/NotificationDropdown";

const MentorHeader = () => {
    const { user, setMode } = useAuth();
    const navigate = useNavigate();
    const [showDropDown, setShowDropDown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <header className="sticky top-0 z-40 w-full bg-primary text-white shadow-md transition-all duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo & Role Badge */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="bg-white px-3 py-1.5 rounded-xl max-w-[120px] flex items-center justify-center shadow-sm">
                            <Logo />
                        </div>
                        <span className="bg-white/20 text-white text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase border border-white/10 shadow-inner">
                            Mentor Mode
                        </span>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                        <NavLink
                            to="/mentor"
                            end
                            className={({ isActive }) =>
                                `text-sm font-semibold transition-all duration-200 py-1.5 border-b-2 ${isActive
                                    ? "text-white border-white"
                                    : "text-white/75 border-transparent hover:text-white hover:border-white/50"
                                }`
                            }
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/mentor/incidents"
                            className={({ isActive }) =>
                                `text-sm font-semibold transition-all duration-200 py-1.5 border-b-2 ${isActive
                                    ? "text-white border-white"
                                    : "text-white/75 border-transparent hover:text-white hover:border-white/50"
                                }`
                            }
                        >
                            Trung tâm Sự cố
                        </NavLink>



                        <NavLink
                            to="/mentor/classes"
                            className={({ isActive }) =>
                                `text-sm font-semibold transition-all duration-200 py-1.5 border-b-2 ${isActive
                                    ? "text-white border-white"
                                    : "text-white/75 border-transparent hover:text-white hover:border-white/50"
                                }`
                            }
                        >
                            Quản lý Lớp học
                        </NavLink>
                    </nav>

                    {/* Right Action Section */}
                    <div className="flex items-center gap-4">
                        {/* Switch to Learner Mode Button (Desktop) */}
                        <button
                            onClick={() => {
                                setMode("LEARNER");
                                navigate("/my-learning");
                            }}
                            className="hidden lg:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2 rounded-full border border-white/10 transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer"
                        >
                            <ArrowLeftRight size={13} />
                            <span>Vào trang học viên</span>
                        </button>

                        {/* Notification Bell */}
                        {user && (
                            <NotificationDropdown triggerClass="text-white/90 hover:text-white hover:bg-white/10" />
                        )}

                        {/* User Profile Dropdown */}
                        {user && (
                            <div className="relative inline-block text-left">
                                <button
                                    onClick={() => setShowDropDown(!showDropDown)}
                                    className="hover:cursor-pointer flex items-center justify-center rounded-full p-0.5 border border-white/20 hover:border-white focus:outline-none focus:ring-4 focus:ring-white/10 transition-all duration-200"
                                >
                                    <Avatar
                                        src={user.avatarUrl}
                                        alt="User Avatar"
                                        className="w-8 h-8"
                                    />
                                </button>
                                {showDropDown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowDropDown(false)}
                                        ></div>
                                        {/* Position dropdown nicely under header */}
                                        <div className="absolute right-0 mt-2 z-50">
                                            <AvatarDropDown />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Hamburger Menu Toggle Button (Mobile Only) */}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden text-white hover:text-white/80 focus:outline-none p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer Menu */}
            {showMobileMenu && (
                <div className="md:hidden border-t border-white/10 bg-primary shadow-lg animate-in slide-in-from-top duration-200 px-4 py-4 space-y-4 absolute top-16 left-0 w-full z-30">
                    <div className="flex flex-col gap-2">
                        <NavLink
                            to="/mentor"
                            end
                            onClick={() => setShowMobileMenu(false)}
                            className={({ isActive }) =>
                                `px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${isActive
                                    ? "bg-white/25 text-white"
                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                                }`
                            }
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/mentor/incidents"
                            onClick={() => setShowMobileMenu(false)}
                            className={({ isActive }) =>
                                `px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${isActive
                                    ? "bg-white/25 text-white"
                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                                }`
                            }
                        >
                            Trung tâm Sự cố
                        </NavLink>

                        <NavLink
                            to="/mentor/classes"
                            onClick={() => setShowMobileMenu(false)}
                            className={({ isActive }) =>
                                `px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${isActive
                                    ? "bg-white/25 text-white"
                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                                }`
                            }
                        >
                            Quản lý Lớp học
                        </NavLink>

                        {/* Switch to Learner Mode Button (Mobile) */}
                        <button
                            onClick={() => {
                                setShowMobileMenu(false);
                                setMode("LEARNER");
                                navigate("/my-learning");
                            }}
                            className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-2.5 rounded-xl border border-white/10 transition-all duration-200 mt-2 cursor-pointer w-full"
                        >
                            <ArrowLeftRight size={14} />
                            <span>Vào trang học viên</span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default MentorHeader;
