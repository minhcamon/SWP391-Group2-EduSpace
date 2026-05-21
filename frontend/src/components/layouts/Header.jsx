import { useAuth } from "@/contexts/AuthContext";
import { Bell, Book } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import DropDown from "../common/DropDown";
const Header = () => {
    const { user } = useAuth();

    const [showDropDown, setShowDropDown] = useState(false);
    return (
        <header className="bg-white p-3 shadow-sm border-b border-gray-100">
            <div className="flex justify-between mx-auto">
                <Link to="/">
                    <div className="flex">
                        <Book className=" text-primary" size={36} />
                        <h1 className="ml-2 font-bold text-3xl text-primary">
                            EduSpace
                        </h1>
                    </div>
                </Link>

                <div className="md:flex hidden gap-4 my-auto">
                    <Link to="/roadmaps">
                        <span className="hover:text-primary font-semibold">
                            Lộ trình
                        </span>
                    </Link>
                    <Link to="/courses">
                        <span className="hover:text-primary font-semibold">
                            Khóa học
                        </span>
                    </Link>
                    <Link to="/leaderboard">
                        <span className="hover:text-primary font-semibold">
                            Bảng xếp hạng
                        </span>
                    </Link>
                </div>

                <div>
                    {!user ? (
                        <div className="flex gap-4">
                            <div className="bg-secondary text-white font-semibold text-md rounded-xl px-4 py-2 hover:cursor-pointer hover:opacity-90">
                                <Link to="/login">Đăng nhập</Link>
                            </div>
                            <div className="bg-gray-200 text-black font-semibold text-md rounded-xl px-4 py-2 hover:cursor-pointer hover:opacity-90">
                                <Link to="/signup">Đăng ký</Link>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex">
                                <button className="mr-2">
                                    <Bell
                                        className="mt-1 text-gray-400 hover:cursor-pointer"
                                        size={24}
                                    />
                                </button>

                                <div className="relative inline-block text-left">
                                    <button
                                        onClick={() =>
                                            setShowDropDown(!showDropDown)
                                        }
                                        className="hover:cursor-pointer flex items-center justify-center rounded-full p-0.5 border-2 border-gray-100 hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                                    >
                                        <img
                                            src={
                                                user.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                            }
                                            alt="User Avatar"
                                            className="w-9 h-9 rounded-full object-cover border border-gray-500"
                                        />
                                    </button>
                                    <>
                                        {showDropDown && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() =>
                                                        setShowDropDown(false)
                                                    }
                                                ></div>
                                                <DropDown />
                                            </>
                                        )}
                                    </>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
