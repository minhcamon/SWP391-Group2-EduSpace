import React from "react";
import InputField from "./InputField";
import { Search, Bell } from "lucide-react";
import PrimaryButton from "./PrimaryButton";
import { Link } from "react-router";
const Header = () => {
    return (
        <div className="flex min-w-screen justify-around">
            <div className="w-96">
                <InputField
                    icon={Search}
                    inputType="text"
                    placeholder="Tìm kiếm khóa học"
                />
            </div>
            <div className="flex">
                {/* {
                    <Bell
                        className="mt-auto mr-4 text-gray-400 hover:cursor-pointer"
                        size={24}
                    />
                } */}
                <div className="flex gap-4">
                    <div className="bg-secondary text-white font-semibold text-md rounded-xl p-4 hover:cursor-pointer hover:opacity-90"><Link to="/login">Đăng nhập</Link></div>
                    <div className="bg-gray-200 text-black font-semibold text-md rounded-xl p-4 hover:cursor-pointer hover:opacity-90"><Link to="/signup">Đăng ký</Link></div>
                </div>
            </div>
        </div>
    );
};

export default Header;
