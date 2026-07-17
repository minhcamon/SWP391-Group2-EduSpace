import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import AuthService from '@/services/authService';

/**
 * Standalone page for resending verification email
 * Can be accessed at /resend-verification
 */
const ResendVerificationPage = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !email.includes('@')) {
            toast.error('Vui lòng nhập email hợp lệ');
            return;
        }

        setIsSubmitting(true);
        try {
            await AuthService.resendVerificationEmail(email);
            setShowSuccess(true);
            toast.success('Email xác thực đã được gửi! Vui lòng kiểm tra hộp thư.', {
                duration: 6000
            });
        } catch (error) {
            const errorMessage = error.message || 'Không thể gửi email. Vui lòng thử lại.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center">
                        {/* Success Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Email đã được gửi!
                        </h1>

                        {/* Message */}
                        <p className="text-gray-600 mb-2">
                            Chúng tôi đã gửi email xác thực mới đến:
                        </p>
                        <p className="text-lg font-semibold text-gray-900 mb-6">
                            {email}
                        </p>

                        {/* Instructions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                            <p className="text-sm text-blue-900 font-medium mb-2">
                                📧 Hướng dẫn:
                            </p>
                            <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
                                <li>Kiểm tra hộp thư đến của bạn</li>
                                <li>Mở email từ EduSpace</li>
                                <li>Click vào link xác thực trong vòng 1 phút</li>
                                <li>Đăng nhập sau khi xác thực thành công</li>
                            </ol>
                        </div>

                        {/* Warning */}
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
                            <p className="text-xs text-orange-800">
                                ⚠️ Link xác thực chỉ có hiệu lực trong <strong>1 phút</strong>. 
                                Nếu quá thời gian, hãy quay lại trang này để gửi lại.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <Link
                                to="/login"
                                className="inline-block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                Đến trang đăng nhập
                            </Link>
                            <button
                                onClick={() => {
                                    setShowSuccess(false);
                                    setEmail('');
                                }}
                                className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                            >
                                Gửi lại cho email khác
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                {/* Back Link */}
                <Link 
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Quay lại đăng nhập
                </Link>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                            <Mail className="w-8 h-8 text-orange-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Gửi lại email xác thực
                    </h1>
                    <p className="text-gray-600">
                        Nhập email đăng ký của bạn để nhận link xác thực mới
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            disabled={isSubmitting}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Email bạn đã sử dụng khi đăng ký tài khoản
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !email}
                        className="w-full py-3 px-6 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Đang gửi...
                            </>
                        ) : (
                            <>
                                <Mail className="w-5 h-5" />
                                Gửi email xác thực
                            </>
                        )}
                    </button>
                </form>

                {/* Info Box */}
                <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                        ℹ️ Lưu ý:
                    </h3>
                    <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Email xác thực chỉ có thể gửi cho tài khoản chưa được kích hoạt</li>
                        <li>• Link xác thực có hiệu lực trong 1 phút</li>
                        <li>• Kiểm tra cả thư mục Spam/Junk nếu không thấy email</li>
                        <li>• Bạn có thể gửi lại nhiều lần nếu cần</li>
                    </ul>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-600">
                        Đã xác thực tài khoản?{' '}
                        <Link to="/login" className="text-orange-600 hover:text-orange-700 font-semibold">
                            Đăng nhập ngay
                        </Link>
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                        Chưa có tài khoản?{' '}
                        <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                            Đăng ký tại đây
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResendVerificationPage;
