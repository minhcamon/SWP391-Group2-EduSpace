import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router';
import AuthService from '@/services/authService';
import { Loader2, CheckCircle2, XCircle, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, error, expired
    const [message, setMessage] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [isResending, setIsResending] = useState(false);
    const token = searchParams.get('token');

    useEffect(() => {
        const verifyEmailToken = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Token xác thực không hợp lệ. Vui lòng kiểm tra lại email của bạn.');
                return;
            }

            try {
                const response = await AuthService.verifyEmail(token);
                setStatus('success');
                setMessage(response);

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login', {
                        state: { message: 'Tài khoản đã được xác thực. Vui lòng đăng nhập!' }
                    });
                }, 3000);
            } catch (error) {
                const errorMessage = error.message || 'Xác thực email thất bại. Vui lòng thử lại.';
                
                // Check if account is already verified
                if (errorMessage.includes('already verified') || errorMessage.includes('đã được xác thực')) {
                    setStatus('success');
                    setMessage('Tài khoản của bạn đã được xác thực trước đó. Bạn có thể đăng nhập ngay!');
                    
                    setTimeout(() => {
                        navigate('/login', {
                            state: { message: 'Tài khoản đã được xác thực. Vui lòng đăng nhập!' }
                        });
                    }, 3000);
                } 
                // Check if token expired
                else if (errorMessage.includes('expired') || errorMessage.includes('hết hạn')) {
                    setStatus('expired');
                    setMessage('Link xác thực đã hết hạn (1 phút). Vui lòng nhập email để nhận link mới.');
                } 
                else {
                    setStatus('error');
                    setMessage(errorMessage);
                }
            }
        };

        verifyEmailToken();
    }, [token, navigate]);

    const handleResendEmail = async () => {
        if (!userEmail || !userEmail.includes('@')) {
            toast.error('Vui lòng nhập email hợp lệ');
            return;
        }

        setIsResending(true);
        try {
            await AuthService.resendVerificationEmail(userEmail);
            toast.success('Email xác thực mới đã được gửi! Vui lòng kiểm tra hộp thư.');
            setStatus('success');
            setMessage('Email xác thực mới đã được gửi. Vui lòng kiểm tra hộp thư và click vào link trong vòng 1 phút.');
        } catch (error) {
            toast.error(error.message || 'Không thể gửi email. Vui lòng thử lại.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        {status === 'loading' && (
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                            </div>
                        )}
                        {status === 'success' && (
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                        )}
                        {status === 'expired' && (
                            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                                <Clock className="w-10 h-10 text-orange-600" />
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="w-10 h-10 text-red-600" />
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {status === 'loading' && 'Đang xác thực email...'}
                        {status === 'success' && 'Xác thực thành công!'}
                        {status === 'expired' && 'Link đã hết hạn'}
                        {status === 'error' && 'Xác thực thất bại'}
                    </h1>

                    {/* Message */}
                    <p className="text-gray-600 mb-8">
                        {message}
                    </p>

                    {/* Actions */}
                    {status === 'success' && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500">
                                Bạn sẽ được chuyển đến trang đăng nhập trong giây lát...
                            </p>
                            <Link
                                to="/login"
                                className="inline-block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                Đăng nhập ngay
                            </Link>
                        </div>
                    )}

                    {status === 'expired' && (
                        <div className="space-y-4">
                            <div className="text-left">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email của bạn
                                </label>
                                <input
                                    type="email"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={handleResendEmail}
                                disabled={isResending}
                                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {isResending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Đang gửi...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="w-4 h-4" />
                                        Gửi lại email xác thực
                                    </>
                                )}
                            </button>
                            <Link
                                to="/login"
                                className="inline-block w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                            >
                                Về trang đăng nhập
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-4">
                            <Link
                                to="/signup"
                                className="inline-block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                Đăng ký lại
                            </Link>
                            <Link
                                to="/login"
                                className="inline-block w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                            >
                                Về trang đăng nhập
                            </Link>
                        </div>
                    )}

                    {status === 'loading' && (
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <Mail className="w-4 h-4" />
                            <span>Vui lòng đợi trong giây lát...</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-500">
                        Cần hỗ trợ?{' '}
                        <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                            Liên hệ với chúng tôi
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
