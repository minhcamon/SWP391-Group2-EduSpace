import { useState } from "react";
import { Book, Lock, Mail } from "lucide-react";
import InputField from "../../components/common/InputField";
import { Link, useNavigate } from "react-router";
import AuthService from "../../services/AuthService";
import SecondaryButton from "../../components/common/SecondaryButton";
import { toast } from "sonner";

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

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validation tầng UI
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Mật khẩu xác nhận không khớp!");
        }

        try {
            // 2. Gọi Service
            const successMessage = await AuthService.register(formData);

            // 3. UI Flow khi thành công
            toast.success(successMessage);
            navigate("/login"); // Chuyển hướng sang trang đăng nhập
        } catch (error) {
            console.error("Transaction failed: ", error);
            // 4. UI Flow khi thất bại
            toast.error(error.message);
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
                        <SecondaryButton
                            buttonText="Tạo tài khoản"
                            type="submit"
                        />
                    </div>
                </form>

                <div className="mt-8 font-semibold text-center">
                    <div className="flex justify-around">
                        <div className="text-primary">
                            <Link to="/">Quay về trang chủ</Link>
                        </div>
                        <div>
                            Đã có tài khoản?{" "}
                            <Link to="/login" className="text-primary">
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
