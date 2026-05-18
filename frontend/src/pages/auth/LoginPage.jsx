import React, { useState } from "react";
import InputField from "../../components/common/InputField";
import { Mail, Lock, Book } from "lucide-react";
import PrimaryButton from "../../components/common/PrimaryButton";
import { Link } from "react-router";
import api from "../../lib/axios.js";
import AuthService from "../../context/AuthContext.jsx"

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        const result = await AuthService.login(formData);

        if (result.success) {
            console.log("Login successful:", result);
            alert("Đăng nhập thành công!");
            // toast("success", "Đăng nhập thành công!");
        } else {
            console.error("Login failed at LoginForm:", result);
            alert(result.message);
            // toast("error", result.message);
        }

    };

    return (
        <div className="flex items-center min-h-screen justify-center">
            <div className="p-8 border border-blue-500 rounded-2xl shadow shadow-gray-700">
                <div>
                    <div className="flex">
                        <Book className=" text-primary" size={70} />
                        <h1 className="ml-2 font-bold text-6xl text-primary">
                            EduSpace
                        </h1>
                    </div>
                    <h1 className="my-4 text-black font-bold text-6xl">
                        Chào mừng trở lại
                    </h1>
                    <p className="text-gray-500 font-m">
                        Đăng nhập vào tài khoản của bạn để tiếp tục các bài học
                    </p>
                </div>
                <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="mb-2 font-bold">Địa chỉ Email</div>
                    <InputField
                        icon={Mail}
                        inputType="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="nguyenVanA@gmail.com"
                    />

                    <div className="mt-4 mb-2 font-bold">Mật khẩu</div>
                    <InputField
                        icon={Lock}
                        inputType="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu"
                    />

                    <div className="mt-8">
                        <PrimaryButton type="submit" buttonText="Đăng nhập" />
                    </div>

                    <div className="mt-8 font-semibold text-center">
                        <div className="flex justify-around">
                            <div className="text-primary">
                                <Link to="/">Quay về trang chủ</Link>
                            </div>
                            <div>
                                Chưa có tài khoản?{" "}
                                <Link to="/signup" className="text-primary">
                                    Đăng ký ngay
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
