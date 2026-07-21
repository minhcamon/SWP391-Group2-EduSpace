import Logo from "@/components/common/Logo";
import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
    return (
        <div className="min-h-screen bg-bg-base text-neutral-dark font-sans flex w-full overflow-hidden">
            {/* Left Panel: Sign Up Form */}
            <div className="w-full lg:w-[48%] flex flex-col justify-center px-6 sm:px-12 lg:px-[6%] py-12 bg-white overflow-y-auto">
                <div className="w-full max-w-lg mx-auto">
                    {/* Brand Anchor */}
                    <div className="flex items-center gap-2.5 mb-6 w-72">
                        <Logo className="w-full" />
                    </div>

                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="font-bold text-3xl md:text-4xl text-neutral-dark mb-2 tracking-tight">Tạo tài khoản</h1>
                        <p className="text-sm text-neutral-medium leading-relaxed">
                            Tham gia eduSpace để bắt đầu hành trình của bạn.
                        </p>
                    </div>

                    <RegisterForm />
                </div>
            </div>

            {/* Right Panel: Feature Image & Glassmorphism Card */}
            <div className="hidden lg:block lg:w-[52%] relative bg-bg-sidebar overflow-hidden">
                {/* Background Image */}
                <img
                    alt="Students collaborating"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    src="https://daihoc.fpt.edu.vn/wp-content/uploads/2022/09/trai-nghiem-song-ao-chay-may-truoc-khuon-vien-dep-ngat-ngay-cua-dai-hoc-fpt-3-mien-anh-2.jpeg"
                />
            </div>
        </div>
    );
};

export default RegisterPage;
