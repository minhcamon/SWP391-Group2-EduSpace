import { Link } from "react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import Logo from "@/components/common/Logo";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-gray-800">
                    <div className="lg:col-span-4 space-y-4">
                        <div className="w-72">
                            <Logo />
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed pr-4">
                            Nền tảng học lập trình trực tuyến tối ưu, giúp bạn
                            định hình lộ trình, bứt phá kỹ năng và chinh phục
                            đỉnh cao sự nghiệp Software Engineering.
                        </p>
                        <div className="space-y-2.5 pt-2 text-sm">
                            <div className="flex items-center space-x-3 text-gray-400">
                                <Phone
                                    size={16}
                                    className="text-secondary shrink-0"
                                />
                                <span>0123 456 789</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-400">
                                <Mail
                                    size={16}
                                    className="text-secondary shrink-0"
                                />
                                <span>support@eduspace.vn</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-400">
                                <MapPin
                                    size={16}
                                    className="text-secondary shrink-0"
                                />
                                <span>
                                    Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà
                                    Nội
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 lg:col-start-6 space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Khám phá
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link
                                    to="/roadmaps"
                                    className="hover:text-secondary transition-colors duration-200 block py-0.5"
                                >
                                    Lộ trình học tập
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/courses"
                                    className="hover:text-secondary transition-colors duration-200 block py-0.5"
                                >
                                    Khóa học hiện có
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/leaderboard"
                                    className="hover:text-secondary transition-colors duration-200 block py-0.5"
                                >
                                    Bảng xếp hạng
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="hover:text-secondary transition-colors duration-200 block py-0.5"
                                >
                                    Bài viết chia sẻ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:col-span-3 space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Hỗ trợ & Bảo mật
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link
                                    to="/"
                                    className="hover:text-secondary transition-colors duration-200 block py-0.5"
                                >
                                    Câu hỏi thường gặp (FAQ)
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="hover:text-secondary transition-colors duration-200 block py-0.5"
                                >
                                    Điều khoản dịch vụ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="hover:text-secondary transition-colors duration-200 block py-0.5"
                                >
                                    Chính sách bảo mật
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="hover:text-secondary transition-colors duration-200 block py-0.5"
                                >
                                    Liên hệ hợp tác
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Mạng xã hội
                        </h3>
                        <div className="flex space-x-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noreferrer"
                                className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-secondary hover:text-white text-gray-400 transition-all duration-200"
                            >
                                <i className="fa-brands fa-facebook"></i>
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noreferrer"
                                className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-secondary hover:text-white text-gray-400 transition-all duration-200"
                            >
                                <i className="fa-brands fa-youtube"></i>
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noreferrer"
                                className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-secondary hover:text-white text-gray-400 transition-all duration-200"
                            >
                                <i className="fa-brands fa-github"></i>
                            </a>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed pt-1">
                            Tham gia cùng hơn 10,000+ học viên khác trong cộng
                            đồng của chúng tôi.
                        </p>
                    </div>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                    <div>
                        <p>
                            © {new Date().getFullYear()} EduSpace. Toàn bộ bản
                            quyền được bảo lưu.
                        </p>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-gray-800/40 px-3 py-1.5 rounded-lg border border-gray-800/60">
                        <span>Sản phẩm phát triển bởi</span>
                        <span className="font-semibold text-gray-400">
                            Group 2 - SE2027JV - SWP391 FPT University
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
