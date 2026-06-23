import { useAuth } from "@/contexts/AuthContext";
import { Bell, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router";
import AvatarDropDown from "../common/AvatarDropDown";
import Avatar from "../common/Avatar";
import Logo from "../common/Logo";

const Header = () => {
  const { user } = useAuth();
  const [showDropDown, setShowDropDown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-border-light/35 shadow-sm transition-all duration-200">
      <div className="max-w-screen mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {/* Logo Section */}
          <div className="max-w-40">
            <Logo />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">

            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `text-sm font-semibold transition-all duration-200 py-1.5 ${isActive
                  ? "text-primary border-b-2 border-primary"
                  : "text-neutral-medium hover:text-primary"
                }`
              }
            >
              Khóa học
            </NavLink>

            <NavLink
              to="/my-learning"
              className={({ isActive }) =>
                `text-sm font-semibold transition-all duration-200 py-1.5 ${isActive
                  ? "text-primary border-b-2 border-primary"
                  : "text-neutral-medium hover:text-primary"
                }`
              }
            >
              Học tập của tôi
            </NavLink>
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="relative hidden md:block">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary rounded-full py-1.5 pl-9 pr-4 text-xs w-40 transition-all duration-200 focus:w-56 outline-none"
            />
          </div>

          {/* Right Action Section */}
          <div className="flex items-center gap-3">
            {/* Notification Bell (Only if Logged In) */}
            {/* {user && (
                            <button className="relative p-1.5 text-neutral-medium hover:text-primary rounded-full hover:bg-slate-50 transition-all duration-200 cursor-pointer">
                                <Bell size={22} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full"></span>
                            </button>
                        )} */}

            {/* User Profile Dropdown or Authentication Buttons */}
            {user ? (
              <div className="relative inline-block text-left">
                <button
                  onClick={() =>
                    setShowDropDown(!showDropDown)
                  }
                  className="hover:cursor-pointer flex items-center justify-center rounded-full p-0.5 border border-slate-200 hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-200"
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
                      onClick={() =>
                        setShowDropDown(false)
                      }
                    ></div>
                    <AvatarDropDown />
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-neutral-medium hover:text-primary px-4 py-2 transition-colors duration-200"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary hover:bg-[#3f38c9] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:shadow-[0_4px_12px_rgba(79,70,229,0.2)] transition-all duration-200 active:scale-[0.98]"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Hamburger Menu Toggle Button (Mobile Only) */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-neutral-medium hover:text-primary focus:outline-none p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {showMobileMenu ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md shadow-lg animate-in slide-in-from-top duration-200 px-4 py-4 space-y-4 absolute top-16 left-0 w-full z-30">
          {/* Search Bar for Mobile */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary rounded-full py-2 pl-9 pr-4 text-xs outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            {/* <NavLink
                            to="/roadmaps"
                            onClick={() => setShowMobileMenu(false)}
                            className={({ isActive }) =>
                                `px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-neutral-medium hover:bg-slate-50 hover:text-primary"
                                }`
                            }
                        >
                            Lộ trình
                        </NavLink> */}
            <NavLink
              to="/courses"
              onClick={() => setShowMobileMenu(false)}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${isActive
                  ? "bg-primary/10 text-primary"
                  : "text-neutral-medium hover:bg-slate-50 hover:text-primary"
                }`
              }
            >
              Khóa học
            </NavLink>
            {/* {user && (
                            <NavLink
                                to="/my-learning"
                                onClick={() => setShowMobileMenu(false)}
                                className={({ isActive }) =>
                                    `px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-neutral-medium hover:bg-slate-50 hover:text-primary"
                                    }`
                                }
                            >
                                Học tập của tôi
                            </NavLink>
                        )}
                        {user && (
                            <NavLink
                                to="/my-learning"
                                onClick={() => setShowMobileMenu(false)}
                                className={({ isActive }) =>
                                    `px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-neutral-medium hover:bg-slate-50 hover:text-primary"
                                    }`
                                }
                            >
                                Học tập của tôi
                            </NavLink>
                        )}
                        {user && (
                            <NavLink
                                to="/leaderboard"
                                onClick={() => setShowMobileMenu(false)}
                                className={({ isActive }) =>
                                    `px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-neutral-medium hover:bg-slate-50 hover:text-primary"
                                    }`
                                }
                            >
                                Bảng xếp hạng
                            </NavLink>
                        )} */}
          </div>

          {!user && (
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
              <Link
                to="/login"
                onClick={() => setShowMobileMenu(false)}
                className="text-center text-sm font-semibold text-neutral-medium hover:text-primary py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/signup"
                onClick={() => setShowMobileMenu(false)}
                className="text-center bg-primary text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#3f38c9] transition-all hover:shadow-md"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
