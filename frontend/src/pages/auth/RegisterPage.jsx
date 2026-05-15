import React, { useState } from "react";
import { Book, Lock, Mail } from "lucide-react";
import InputField from "../../components/common/InputField";
import PrimaryButton from "../../components/common/PrimaryButton";
import { Link } from "react-router";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Dữ liệu gửi lên Backend: ", formData);
        // Sau này bạn sẽ gọi API Axios ở đây:
        // axios.post("http://localhost:8080/api/v1/auth/login", formData)
        //     .then(res => console.log(res))
        //     .catch(err => console.error(err));
    };

    return (
        <div className="flex items-center min-h-screen justify-center">
            <div className="p-8 border border-blue-500 rounded-2xl shadow shadow-gray-700">
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
                        Tham gia <strong>EduSpace</strong> để bắt đầu hành trình
                        học tập chuyên sâu của bạn
                    </p>
                </div>
                <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="mb-2 font-bold">Họ Và Tên</div>
                    <InputField
                        icon={Mail}
                        inputType="text"
                        name="fullname"
                        onChange={handleChange}
                        placeholder="Nguyen Van A"
                    />

                    <div className="mt-4 mb-2 font-bold">Địa chỉ Email</div>
                    <InputField
                        icon={Mail}
                        inputType="email"
                        name="email"
                        onChange={handleChange}
                        placeholder="nguyenVanA@gmail.com"
                    />

                    <div className="mt-4 mb-2 font-bold">Mật khẩu</div>
                    <InputField
                        icon={Lock}
                        inputType="password"
                        name="password"
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu"
                    />

                    <div className="mt-4 mb-2 font-bold">Xác nhận mật khẩu</div>
                    <InputField
                        icon={Lock}
                        inputType="password"
                        name="confirmPassword"
                        onChange={handleChange}
                        placeholder="Nhập lại mật khẩu"
                    />
                    <div className="mt-8">
                        <PrimaryButton
                            buttonText="Tạo tài khoản"
                            type="submit"
                        />
                    </div>
                </form>

                <div className="mt-8 font-semibold text-center">
                    <div className="flex justify-around">
                        <div className="text-indigo-700">
                            <Link to="/">Quay về trang chủ</Link>
                        </div>
                        <div>
                            Đã có tài khoản?{" "}
                            <Link to="/login" className="text-indigo-700">
                                Đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
