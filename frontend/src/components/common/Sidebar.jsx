import React from "react";
import { Link } from "react-router";

export const Sidebar = () => {
    return (
        <div className="w-60">
            <div>
                <h1 className="text-4xl">EduSpace</h1>
                <p className="mt-2">Áp lực tạo nên kim cương</p>
            </div>
            <div className="mt-4">
                <div>
                    <div className="mb-4">
                        <Link to="/">Trang chủ</Link>
                    </div>
                    <div className="mb-4">
                        <Link to="/roadmaps">Lộ trình học tập</Link>
                    </div>
                    <div className="mb-4">
                        <Link to="/profile">Thông tin cá nhân</Link>
                    </div>
                </div>
                <div>
                    <Link to="/">Đăng xuất</Link>
                </div>
            </div>
        </div>
    );
};
