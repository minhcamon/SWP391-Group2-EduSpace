import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router";
import { roleMapping } from "@/lib/data";

const DropDown = () => {
    const { user, logout } = useAuth();

    return (
        <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-20 min-w-[220px]">
            <div className="flex">
                <img
                    src={
                        user?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                    }
                    alt="User Avatar"
                    className="ml-3 mt-1.5 w-9 h-9 rounded-full object-cover border border-gray-500"
                />
                <div className="ml-1.5">
                    <div>
                        <p className="font-bold">{user.username}</p>
                        <p className="font-semibold text-gray-500">
                            {user.email}
                        </p>
                    </div>
                    <div className="mt-2 border-t border-secondary text-shadow-gray-500"></div>
                    <p className="my-2 font-bold text-secondary">
                        {roleMapping[user?.role] || "Học viên"}
                    </p>
                    <div className="flex flex-col">
                        <Link
                            to="/profile"
                            className="mb-2 hover:text-primary font-semibold"
                        >
                            Hồ sơ cá nhân
                        </Link>
                        {user.role === "ADMIN" && (
                            <Link
                                to="/admin"
                                className="mb-2 hover:text-primary font-semibold"
                            >
                                Trang quản trị viên
                            </Link>
                        )}

                        {user.role === "CREATOR" && (
                            <Link
                                to="/creator"
                                className="mb-2 hover:text-primary font-semibold"
                            >
                                Trang quản lý bài học
                            </Link>
                        )}
                        <div className="pt-2 border-t border-secondary text-shadow-gray-500"></div>
                        <button
                            onClick={logout}
                            className="hover:cursor-pointer hover:text-primary font-semibold"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DropDown;
