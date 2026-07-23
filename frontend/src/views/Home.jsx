import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import useMyLearning from "@/modules/learning/hooks/useMyLearning";
import courseService from "@/services/courseService";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import CourseItem from "@/modules/course-lifecycle/components/CourseItem";
import { 
  Sparkles, 
  BookOpen, 
  Volume2, 
  FileText, 
  Users, 
  Award, 
  CheckCircle2, 
  Compass,
  ArrowRight,
  Play,
  Star,
  Inbox,
  TrendingUp,
  Bookmark,
  GraduationCap
} from "lucide-react";
import { toast } from "sonner";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  // Hook for my learning (if user is authenticated)
  const {
    isLoading: learningLoading,
    myLearningCourses = [],
    handleContinueLearning,
    fetchMyLearningCourses,
  } = useMyLearning("Home Page");

  useEffect(() => {
    if (user) {
      fetchMyLearningCourses();
    }
  }, [user, fetchMyLearningCourses]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        const data = await courseService.getPublishedCourses(0, 4);
        setCourses(data.content || []);
      } catch (error) {
        console.error("Lỗi fetch khóa học tại Home: ", error);
        toast.error("Lỗi khi tải khóa học phổ biến");
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter courses for authenticated user dashboard
  const activeCourses = myLearningCourses.filter((c) => !c.isCompleted && c.classId);
  const waitingCourses = myLearningCourses.filter((c) => !c.isCompleted && !c.classId);
  const completedCourses = myLearningCourses.filter((c) => c.isCompleted || c.progressPercentage >= 100);

  // Get current primary learning target (most progressed active course)
  const primaryLearningCourse = activeCourses.length > 0 
    ? [...activeCourses].sort((a, b) => b.progressPercentage - a.progressPercentage)[0]
    : null;

  const scrollToCourses = (e) => {
    e.preventDefault();
    const element = document.getElementById("popular-courses");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50/50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Header />

      <main className="flex-1 w-full pb-20">
        
        {/* ================= HERO SECTION ================= */}
        {user ? (
          /* AUTHENTICATED USER HERO / DASHBOARD */
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-10 md:py-14 transition-all duration-300">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -ml-20 -mb-20"></div>

            <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
              <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-between">
                
                {/* Left side: Personalized greeting & Primary active course */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                        Không gian học tập
                      </span>
                      <span className="text-slate-400 text-xs font-medium">•</span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                        Chào mừng quay lại!
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-dark dark:text-white tracking-tight mb-4">
                      Chào mừng, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">{user.fullName}</span>! 👋
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-lg mb-6 leading-relaxed">
                      Tiếp tục hoàn thành mục tiêu học tập và nhận đánh giá từ các Mentor của bạn trong hôm nay.
                    </p>
                  </div>

                  {primaryLearningCourse ? (
                    /* Render active course quick progress banner */
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-slate-200">
                      <div className="flex-1 w-full space-y-2.5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-600 dark:text-slate-300">Đang học: {primaryLearningCourse.courseName}</span>
                          <span className="text-primary">{primaryLearningCourse.progressPercentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${primaryLearningCourse.progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleContinueLearning(primaryLearningCourse.courseId)}
                        className="bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl flex items-center gap-2 px-5 py-3 h-auto w-full sm:w-auto shrink-0 justify-center transition-all duration-200 active:scale-95"
                      >
                        <Play size={16} fill="currentColor" />
                        Học tiếp
                      </Button>
                    </div>
                  ) : (
                    /* Fallback when no active learning course exists */
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Compass className="text-primary animate-pulse" size={20} />
                        <span className="font-bold text-sm text-neutral-dark dark:text-white">Bắt đầu khóa học đầu tiên của bạn</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                        Khám phá danh sách các Cohort khóa học chất lượng để đăng ký và ghép cặp cùng bạn học phù hợp.
                      </p>
                      <Button
                        onClick={scrollToCourses}
                        className="bg-primary/10 hover:bg-primary/15 text-primary text-xs font-bold rounded-lg px-4 py-2 h-auto"
                      >
                        Tìm khóa học ngay
                      </Button>
                    </div>
                  )}
                </div>

                {/* Right side: Learning Dashboard Stats Card */}
                <div className="w-full lg:w-80 shrink-0 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 p-6 rounded-3xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-250/20">
                    <span className="font-bold text-sm text-neutral-dark dark:text-white flex items-center gap-2">
                      <TrendingUp size={16} className="text-primary" />
                      Thống kê học tập
                    </span>
                    <Badge variant="roletag">{user.role}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center my-auto">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850">
                      <span className="block text-2xl font-black text-primary">{myLearningCourses.length}</span>
                      <span className="text-[10px] font-bold text-slate-400 block mt-1 uppercase tracking-wider">Đăng ký</span>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850">
                      <span className="block text-2xl font-black text-amber-500">{activeCourses.length}</span>
                      <span className="text-[10px] font-bold text-slate-400 block mt-1 uppercase tracking-wider">Đang học</span>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850">
                      <span className="block text-2xl font-black text-green-500">{completedCourses.length}</span>
                      <span className="text-[10px] font-bold text-slate-400 block mt-1 uppercase tracking-wider">Xong</span>
                    </div>
                  </div>

                  <Link 
                    to="/my-learning" 
                    className="mt-5 w-full text-center py-2.5 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-350 block transition-all"
                  >
                    Quản lý học tập
                  </Link>
                </div>

              </div>
            </div>
          </div>
        ) : (
          /* GUEST LANDING HERO SECTION */
          <div className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 py-16 md:py-24 transition-all duration-300">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>

            <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-12 justify-between">
                
                {/* Hero text */}
                <div className="flex-1 text-center lg:text-left space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-full">
                    <Sparkles size={12} className="animate-spin-slow" />
                    <span>Nền tảng học Công nghệ Cohort-based Learning</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-dark dark:text-white leading-[1.15] tracking-tight">
                    Lập Trình Thực Chiến<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">
                      Cùng Đồng Đội & Mentor
                    </span>
                  </h1>

                  <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    Học lập trình đột phá gấp 3 lần với mô hình Cohort & Pair Programming. Lộ trình tự động cá nhân hóa từ AI, ghép đôi code trực tiếp và nhận feedback chi tiết từ Mentor.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <Button
                      onClick={() => navigate("/signup")}
                      className="bg-primary hover:bg-primary/95 text-white font-bold rounded-full px-8 py-3.5 text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 active:scale-97 w-full sm:w-auto h-auto"
                    >
                      Bắt đầu miễn phí
                    </Button>
                    <a
                      href="#popular-courses"
                      onClick={scrollToCourses}
                      className="inline-flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-200 font-bold rounded-full px-8 py-3.5 text-sm transition-all duration-200 w-full sm:w-auto"
                    >
                      Khám phá khóa học
                      <ArrowRight size={16} />
                    </a>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 text-xs font-bold text-slate-400 uppercase tracking-wide">
                    <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> Senior & Tech Lead Mentor</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> Pair Programming 1-1</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> Code Review Chéo</span>
                  </div>
                </div>

                {/* Hero illustration card stack */}
                <div className="w-full lg:w-[420px] max-w-[460px] relative shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary to-indigo-500 rounded-3xl rotate-3 opacity-10 blur-sm scale-102"></div>
                  
                  {/* Main graphic card */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xl relative z-10 transition-transform duration-300 hover:rotate-0 hover:scale-101">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                        <GraduationCap size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-neutral-dark dark:text-white">Lớp học Cohort #12</h4>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cấu trúc dữ liệu & Giải thuật</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Subcard 1 */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-850 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-secondary/15 rounded-lg flex items-center justify-center text-secondary">
                            <Volume2 size={16} />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-neutral-dark dark:text-white">Phòng Code-pairing 1-1</span>
                            <span className="text-[9px] text-slate-400 font-medium">Đang kết nối: Minh & An</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold rounded-md">Live</span>
                      </div>

                      {/* Subcard 2 */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-850 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-teal-500/15 rounded-lg flex items-center justify-center text-teal-600">
                            <FileText size={16} />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-neutral-dark dark:text-white">Bài tập Luyện thuật toán</span>
                            <span className="text-[9px] text-slate-400 font-medium">Đã hoàn thành Code Review chéo</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md">95/100đ</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
                      <div className="flex -space-x-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-600">ML</div>
                        <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-700">AN</div>
                        <div className="w-7 h-7 rounded-full bg-primary text-white border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold">+5</div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">7 học viên trực tuyến</span>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: AI TOOLS RECOMMENDATIONS ================= */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 mt-16 md:mt-24">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-dark dark:text-white tracking-tight">
              Tối Ưu Hiệu Quả Lập Trình Với AI & Mentor
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-xl mx-auto">
              Học tập thực chiến qua dự án thực tế. Nhận đánh giá chuyên sâu và tối ưu hóa code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: AI Reading */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles size={22} className="animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-neutral-dark dark:text-white mb-2">Học Lập Trình Với AI</h3>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  Trợ lý AI phân tích code, phát hiện bug logic, giải thích chi tiết thuật toán và đề xuất bài tập thực hành tối ưu theo trình độ.
                </p>
              </div>
              <Link 
                to="/courses"
                className="text-primary hover:text-primary/80 font-bold text-xs flex items-center gap-1.5 group/link"
              >
                Trải nghiệm ngay 
                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Card 2: Peer-to-peer speaking */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Volume2 size={22} />
                </div>
                <h3 className="text-lg font-bold text-neutral-dark dark:text-white mb-2">Pair Programming 1-1</h3>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  Hệ thống tự động ghép cặp học viên cùng trình độ để cùng thảo luận, viết code chung trên editor trực tuyến và giải thuật toán.
                </p>
              </div>
              <Link 
                to="/my-learning"
                className="text-secondary hover:text-secondary/80 font-bold text-xs flex items-center gap-1.5 group/link"
              >
                Vào phòng Code chung 
                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Card 3: Mentor writing */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText size={22} />
                </div>
                <h3 className="text-lg font-bold text-neutral-dark dark:text-white mb-2">Mentor Review Code</h3>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  Gửi project hoặc bài thực hành lớn của bạn. Đội ngũ Mentor giàu kinh nghiệm trực tiếp đánh giá chất lượng code và sửa đổi.
                </p>
              </div>
              <Link 
                to="/my-learning"
                className="text-teal-600 hover:text-teal-600/80 font-bold text-xs flex items-center gap-1.5 group/link"
              >
                Gửi code ngay 
                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </section>

        {/* ================= SECTION: POPULAR COURSES ================= */}
        <section id="popular-courses" className="max-w-6xl mx-auto px-4 md:px-8 mt-16 md:mt-24 scroll-mt-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-neutral-dark dark:text-white tracking-tight">
                Khóa học phổ biến
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-1">
                Các khóa học theo lộ trình Cohort chuẩn đầu ra được nhiều người đăng ký nhất.
              </p>
            </div>
            <Link 
              to="/courses"
              className="text-primary hover:opacity-85 font-bold text-xs md:text-sm flex items-center gap-1 transform transition-all hover:translate-x-1"
            >
              Xem tất cả
              <ArrowRight size={14} />
            </Link>
          </div>

          {coursesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl h-60 animate-pulse"></div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="mt-4">
              <EmptyState icon={Inbox}>
                Hiện tại chưa có khóa học nào trên hệ thống.
              </EmptyState>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course) => (
                <CourseItem key={course.id} course={course} />
              ))}
            </div>
          )}
        </section>

        {/* ================= SECTION: PLATFORM BENEFITS ================= */}
        <section className="bg-slate-100/50 dark:bg-slate-900/40 py-16 mt-20 border-y border-slate-150/40 dark:border-slate-850/50">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="text-center space-y-2.5 mb-12">
              <h2 className="text-2xl font-extrabold text-neutral-dark dark:text-white tracking-tight">
                Tại sao bạn nên chọn eduSpace?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                Một phương pháp học tập hiện đại giải quyết triệt để sự thiếu cam kết khi tự học online.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Users size={20} />
                </div>
                <h4 className="font-bold text-sm text-neutral-dark dark:text-white">Lớp học Cohort thực chiến</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Học cùng lớp, có thời gian biểu đồng hành rõ ràng. Cùng thực hành dự án thực tế, tạo áp lực tích cực để hoàn thành khóa học.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                  <Award size={20} />
                </div>
                <h4 className="font-bold text-sm text-neutral-dark dark:text-white">Code Review Chéo</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Nhận xét và đánh giá mã nguồn của nhau dựa trên rubrics chuẩn ngành, giúp phát triển kỹ năng đọc hiểu và tối ưu code.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-600">
                  <GraduationCap size={20} />
                </div>
                <h4 className="font-bold text-sm text-neutral-dark dark:text-white">Mentor Công Nghệ Xịn</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Đội ngũ Mentor là các Senior Developer, Tech Lead giàu kinh nghiệm thực tế hướng dẫn, chia sẻ kiến thức chuẩn ngành.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600">
                  <Sparkles size={20} />
                </div>
                <h4 className="font-bold text-sm text-neutral-dark dark:text-white">AI Hỗ Trợ Đắc Lực</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Công cụ AI thông minh phân tích cấu trúc code, gợi ý phát hiện lỗ hổng bảo mật và cách tối ưu hóa thuật toán hiệu quả.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION: FEATURED MENTORS ================= */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 mt-16 md:mt-24">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-dark dark:text-white tracking-tight">
              Đội Ngũ Mentor Nổi Bật
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
              Những chuyên gia công nghệ và Tech Lead nhiều năm kinh nghiệm thực chiến.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Mentor 1 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-6 text-center hover:shadow-md transition-shadow relative">
              <div className="absolute top-4 right-4 flex items-center gap-1 text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-full text-xs font-bold">
                <Star size={12} fill="currentColor" />
                <span>4.9</span>
              </div>
              
              <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-slate-100 border-2 border-primary/20 p-0.5 overflow-hidden">
                <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xl">MN</div>
              </div>
              
              <h4 className="font-bold text-base text-neutral-dark dark:text-white">Trần Minh Nam</h4>
              <p className="text-xs text-slate-450 dark:text-slate-400 mb-4">Tech Lead @ Google / System Architect</p>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-5 leading-relaxed">
                Hơn 10 năm kinh nghiệm thiết kế kiến trúc phần mềm và hệ thống phân tán chịu tải cao. Chuyên gia huấn luyện thuật toán nâng cao.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <Badge variant="secondary" className="text-[10px] py-1">System Design</Badge>
                <Badge variant="secondary" className="text-[10px] py-1">Algorithms</Badge>
              </div>
            </div>

            {/* Mentor 2 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-6 text-center hover:shadow-md transition-shadow relative">
              <div className="absolute top-4 right-4 flex items-center gap-1 text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-full text-xs font-bold">
                <Star size={12} fill="currentColor" />
                <span>4.8</span>
              </div>
              
              <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-slate-100 border-2 border-secondary/20 p-0.5 overflow-hidden">
                <div className="w-full h-full rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-black text-xl">HA</div>
              </div>
              
              <h4 className="font-bold text-base text-neutral-dark dark:text-white">Nguyễn Hoàng Anh</h4>
              <p className="text-xs text-slate-450 dark:text-slate-400 mb-4">Senior Fullstack Developer (Ex-Microsoft)</p>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-5 leading-relaxed">
                Cựu kỹ sư phần mềm tại Microsoft. Nhiều năm kinh nghiệm xây dựng ứng dụng với Spring Boot, Node.js, React và tối ưu SQL.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <Badge variant="secondary" className="text-[10px] py-1">Backend Master</Badge>
                <Badge variant="secondary" className="text-[10px] py-1">Spring Boot</Badge>
              </div>
            </div>

            {/* Mentor 3 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-6 text-center hover:shadow-md transition-shadow relative">
              <div className="absolute top-4 right-4 flex items-center gap-1 text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-full text-xs font-bold">
                <Star size={12} fill="currentColor" />
                <span>5.0</span>
              </div>
              
              <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-slate-100 border-2 border-teal-500/20 p-0.5 overflow-hidden">
                <div className="w-full h-full rounded-full bg-teal-550/10 flex items-center justify-center text-teal-650 font-black text-xl">TV</div>
              </div>
              
              <h4 className="font-bold text-base text-neutral-dark dark:text-white">Phạm Thảo Vy</h4>
              <p className="text-xs text-slate-450 dark:text-slate-400 mb-4">Frontend Architect & UI/UX Expert</p>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-5 leading-relaxed">
                Đam mê thiết kế các giao diện người dùng mượt mà và tối ưu hiệu năng web. Chuyên gia xây dựng Design System và React internals.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <Badge variant="secondary" className="text-[10px] py-1">React/Vue</Badge>
                <Badge variant="secondary" className="text-[10px] py-1">UI/UX Architect</Badge>
              </div>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Home;
