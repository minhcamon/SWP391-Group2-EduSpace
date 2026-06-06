import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { setTokens } from "@/utils/utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const OAuth2RedirectHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { checkAuth } = useAuth();

    const isProcessedRef = useRef(false);

    useEffect(() => {
        const token = searchParams.get("token");

        const handleOAuthRedirect = async () => {
            if (!token) {
                if (isProcessedRef.current) return;
                isProcessedRef.current = true;
                toast.error("Không tìm thấy mã xác thực từ Google!");
                navigate("/login", { replace: true });
                return;
            }

            if (isProcessedRef.current) return;

            isProcessedRef.current = true;

            try {
                setTokens(token);
                await checkAuth();

                toast.success("Đăng nhập thành công bằng Google!");
                navigate("/", { replace: true });
            } catch (error) {
                console.error("Lỗi xác thực OAuth2:", error);
                toast.error("Không thể lấy thông tin tài khoản Google.");
                navigate("/login", { replace: true });
            }
        };

        handleOAuthRedirect();
    }, [searchParams, navigate, checkAuth]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="p-8 bg-white border border-slate-100 rounded-2xl shadow-xl flex flex-col items-center max-w-sm w-full mx-4">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                    Đang xử lý đăng nhập
                </h2>
                <p className="text-slate-500 text-center text-sm">
                    Vui lòng đợi trong giây lát khi chúng tôi xác thực tài khoản Google của bạn...
                </p>
            </div>
        </div>
    );
};

export default OAuth2RedirectHandler;
