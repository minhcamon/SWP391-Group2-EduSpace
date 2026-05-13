import React from "react";
import { Book, Lock, Mail } from "lucide-react";
import InputField from "../common/InputField";
import PrimaryButton from "../common/PrimaryButton";
import { Link } from "react-router";

const RegisterForm = () => {
    return (
        <div className="p-8">
            <div>
                <div className="flex">
                    <Book className=" text-indigo-700" size={70} />
                    <h1 className="ml-2 font-bold text-6xl text-indigo-700">
                        EduSpace
                    </h1>
                </div>
                <h1 className="my-4 text-black font-bold text-6xl">
                    Tạo tài khoản
                </h1>
                <p className="text-gray-500 font-m">
                    Tham gia <strong>EduSpace</strong> để bắt đầu hành trình học
                    tập chuyên sâu của bạn
                </p>
            </div>
            <form className="mt-4">
                <div className="mb-2 font-bold">Họ Và Tên</div>
                <InputField
                    icon={Mail}
                    inputType="text"
                    placeholder="Nguyen Van A"
                />

                <div className="mt-4 mb-2 font-bold">Địa chỉ Email</div>
                <InputField
                    icon={Mail}
                    inputType="email"
                    placeholder="nguyenVanA@gmail.com"
                />

                <div className="mt-4 mb-2 font-bold">Mật khẩu</div>
                <InputField
                    icon={Lock}
                    inputType="password"
                    placeholder="Nhập mật khẩu"
                />

                <div className="mt-4 mb-2 font-bold">Xác nhận mật khẩu</div>
                <InputField
                    icon={Lock}
                    inputType="password"
                    placeholder="Nhập lại mật khẩu"
                />
                <div className="mt-8">
                    <PrimaryButton buttonText="Tạo tài khoản" />
                </div>
            </form>

            <div className="mt-8 font-semibold text-center">
                Đã có tài khoản?{" "}
                <Link to="/login" className="text-indigo-700">
                    Đăng nhập
                </Link>
            </div>
        </div>
    );
};

export default RegisterForm;
