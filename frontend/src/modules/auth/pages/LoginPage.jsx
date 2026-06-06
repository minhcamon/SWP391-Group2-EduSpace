import Logo from "@/components/common/Logo";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-bg-base text-neutral-dark font-sans flex w-full overflow-hidden">
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
                <div className="w-full h-full">
                    <img
                        alt="Selfhelp Man - FPT University Hoa Lac"
                        className="object-cover w-full h-full"
                        src="https://daihoc.fpt.edu.vn/wp-content/uploads/2025/12/Gioi-thieu-Truong-Dai-hoc-FPT-Campus-Ha-Noi.jpg"
                    />
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-[8%] py-12 bg-white">
                <div className="w-full max-w-md mx-auto">
                    <div className="w-72 mb-6">
                        <Logo />
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="font-bold text-3xl md:text-4xl text-neutral-dark mb-2 tracking-tight">Chào mừng trở lại</h1>
                        <p className="text-sm text-neutral-medium">Đăng nhập vào tài khoản của bạn để tiếp tục học tập.</p>
                    </div>

                    <LoginForm />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
