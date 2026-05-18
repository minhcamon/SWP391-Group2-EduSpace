import React from "react";
import { Bell, Book } from "lucide-react";
import { Link } from "react-router";
const Header = () => {
    return (
        <div className="container flex justify-around mx-auto">
            <Link to="/">
                <div className="flex">
                    <Book className=" text-primary" size={36} />
                    <h1 className="ml-2 font-bold text-3xl text-primary">
                        EduSpace
                    </h1>
                </div>
            </Link>

            <div className="flex gap-4">
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
                {/* neu login roi thi dung */}
                {/* {
                    <Bell
                        className="mt-auto mr-4 text-gray-400 hover:cursor-pointer"
                        size={24}
                    />
                } */}
                {/* chua login */}
                <div className="flex gap-4">
                    <div className="bg-secondary text-white font-semibold text-md rounded-xl px-4 py-2 hover:cursor-pointer hover:opacity-90">
                        <Link to="/login">Đăng nhập</Link>
                    </div>
                    <div className="bg-gray-200 text-black font-semibold text-md rounded-xl px-4 py-2 hover:cursor-pointer hover:opacity-90">
                        <Link to="/signup">Đăng ký</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
