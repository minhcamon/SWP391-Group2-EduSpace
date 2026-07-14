import { Link, useNavigate } from "react-router";
import { Home, AlertCircle, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

const Error = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="text-primary" size={44} />
                </div>

                <h1 className="text-7xl font-extrabold text-primary tracking-tight mb-2">
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

                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                    <Button onClick={() => navigate(-1)} variant="outline" className="py-6 px-4">
                        <ArrowLeft size={18} />
                        Quay lại trang trước
                    </Button>
                    <Link to="/">
                        <Button variant="secondary" className="py-6 px-4  w-full">
                            <Home size={18} />
                            Quay lại trang chủ
                        </Button>
                    </Link>
                </div>
            </div>

            <p className="text-xs text-gray-400 mt-6 font-medium">
                &copy; {new Date().getFullYear()} EduSpace. All rights reserved.
            </p>
        </div>
    );
};

export default Error;
