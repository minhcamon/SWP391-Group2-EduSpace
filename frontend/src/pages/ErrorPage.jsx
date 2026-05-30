import { Link } from "react-router";
import { Home, AlertCircle } from "lucide-react";

const ErrorPage = () => {
    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="text-indigo-700" size={44} />
                </div>

                <h1 className="text-7xl font-extrabold text-indigo-700 tracking-tight mb-2">
                    404
                </h1>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Không tìm thấy trang
                </h2>

                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                    Xin lỗi, đường dẫn bạn đang truy cập không tồn tại hoặc đã
                    bị xóa bỏ. Hãy kiểm tra lại địa chỉ URL hoặc quay về trang
                    chủ.
                </p>

                <Link to="/" className="block">
                    <button className="w-full bg-secondary hover:bg-[#ea580c] text-white font-bold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20 transition-all active:scale-[0.98] cursor-pointer">
                        <Home size={18} />
                        Quay lại trang chủ
                    </button>
                </Link>
            </div>

            <p className="text-xs text-gray-400 mt-6 font-medium">
                &copy; {new Date().getFullYear()} EduSpace. All rights reserved.
            </p>
        </div>
    );
};

export default ErrorPage;
