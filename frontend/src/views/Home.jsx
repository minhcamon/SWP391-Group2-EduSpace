import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '@/contexts/AuthContext'
import useMyLearning from '@/modules/learning/hooks/useMyLearning'
import courseService from '@/services/courseService'
import Header from '@/components/layouts/Header'
import Footer from '@/components/layouts/Footer'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import CourseItem from '@/modules/course-lifecycle/components/CourseItem'
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
  GraduationCap,
  User
} from 'lucide-react'
import { toast } from 'sonner'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [coursesLoading, setCoursesLoading] = useState(true)

  // Hook for my learning (if user is authenticated)
  const {
    isLoading: learningLoading,
    myLearningCourses = [],
    handleContinueLearning,
    fetchMyLearningCourses
  } = useMyLearning('Home Page')

  useEffect(() => {
    if (user) {
      fetchMyLearningCourses()
    }
  }, [user, fetchMyLearningCourses])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true)
        const data = await courseService.getPublishedCourses(0, 4)
        setCourses(data.content || [])
      } catch (error) {
        console.error('Lỗi fetch khóa học tại Home: ', error)
        toast.error('Lỗi khi tải khóa học phổ biến')
      } finally {
        setCoursesLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // Filter courses for authenticated user dashboard
  const activeCourses = myLearningCourses.filter(
    (c) => !c.isCompleted && c.classId
  )
  const waitingCourses = myLearningCourses.filter(
    (c) => !c.isCompleted && !c.classId
  )
  const completedCourses = myLearningCourses.filter(
    (c) => c.isCompleted || c.progressPercentage >= 100
  )

  // Get current primary learning target (most progressed active course)
  const primaryLearningCourse =
    activeCourses.length > 0
      ? [...activeCourses].sort(
          (a, b) => b.progressPercentage - a.progressPercentage
        )[0]
      : null

  const scrollToCourses = (e) => {
    e.preventDefault()
    const element = document.getElementById('popular-courses')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

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
                      <span className="text-slate-400 text-xs font-medium">
                        •
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                        Chào mừng quay lại!
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-dark dark:text-white tracking-tight mb-4">
                      Chào mừng,{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">
                        {user.fullName}
                      </span>
                      ! 👋
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-lg mb-6 leading-relaxed">
                      Tiếp tục hoàn thành mục tiêu học tập và nhận đánh giá từ
                      các Mentor của bạn trong hôm nay.
                    </p>
                  </div>

                  {primaryLearningCourse ? (
                    /* Render active course quick progress banner */
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-slate-200">
                      <div className="flex-1 w-full space-y-2.5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-600 dark:text-slate-300">
                            Đang học: {primaryLearningCourse.courseName}
                          </span>
                          <span className="text-primary">
                            {primaryLearningCourse.progressPercentage}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{
                              width: `${primaryLearningCourse.progressPercentage}%`
                            }}
                          ></div>
                        </div>
                      </div>
                      <Button
                        onClick={() =>
                          handleContinueLearning(primaryLearningCourse.courseId)
                        }
                        className="bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl flex items-center gap-2 px-5 py-3 h-auto w-full sm:w-auto shrink-0 justify-center transition-all duration-200 active:scale-95"
                      >
                        <Play
                          size={16}
                          fill="currentColor"
                        />
                        Học tiếp
                      </Button>
                    </div>
                  ) : (
                    /* Fallback when no active learning course exists */
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Compass
                          className="text-primary animate-pulse"
                          size={20}
                        />
                        <span className="font-bold text-sm text-neutral-dark dark:text-white">
                          Bắt đầu khóa học đầu tiên của bạn
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                        Khám phá danh sách các Cohort khóa học chất lượng để
                        đăng ký và ghép cặp cùng bạn học phù hợp.
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
                      <TrendingUp
                        size={16}
                        className="text-primary"
                      />
                      Thống kê học tập
                    </span>
                    <Badge variant="roletag">{user.role}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center my-auto">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850">
                      <span className="block text-2xl font-black text-primary">
                        {myLearningCourses.length}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 block mt-1 uppercase tracking-wider">
                        Đăng ký
                      </span>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850">
                      <span className="block text-2xl font-black text-amber-500">
                        {activeCourses.length}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 block mt-1 uppercase tracking-wider">
                        Đang học
                      </span>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850">
                      <span className="block text-2xl font-black text-green-500">
                        {completedCourses.length}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 block mt-1 uppercase tracking-wider">
                        Xong
                      </span>
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
                    <User
                      size={12}
                      className="animate-spin-slow"
                    />
                    <span>Nền tảng học Pair Learning with Mentor</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-dark dark:text-white leading-[1.15] tracking-tight">
                    Thực Chiến
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">
                      Cùng Đồng Đội & Mentor
                    </span>
                  </h1>

                  <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    Học đột phá gấp 3 lần với mô hình Pair Programming. Lộ trình
                    tự động cá nhân hóa, ghép đôi code trực tiếp và nhận
                    feedback chi tiết từ Mentor.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <Button
                      onClick={() => navigate('/signup')}
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
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2
                        size={14}
                        className="text-green-500"
                      />{' '}
                      Senior & Tech Lead Mentor
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2
                        size={14}
                        className="text-green-500"
                      />{' '}
                      Pair Programming 1-1
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2
                        size={14}
                        className="text-green-500"
                      />{' '}
                      Code Review Chéo
                    </span>
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
                        <h4 className="font-bold text-sm text-neutral-dark dark:text-white">
                          Lớp học EduSpace
                        </h4>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Java & Java Spring Boot
                        </span>
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
                            <span className="block text-xs font-bold text-neutral-dark dark:text-white">
                              Học cùng nhau
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium">
                              Đang kết nối: Minh & An
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold rounded-md">
                          Live
                        </span>
                      </div>

                      {/* Subcard 2 */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-850 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-teal-500/15 rounded-lg flex items-center justify-center text-teal-600">
                            <FileText size={16} />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-neutral-dark dark:text-white">
                              Bài tập Luyện thuật toán
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium">
                              Đã hoàn thành Code Review chéo
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md">
                          95/100đ
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
                      <div className="flex -space-x-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          ML
                        </div>
                        <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-700">
                          AN
                        </div>
                        <div className="w-7 h-7 rounded-full bg-primary text-white border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold">
                          +99
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Nhiều học viên trực tuyến
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: POPULAR COURSES ================= */}
        <section
          id="popular-courses"
          className="max-w-6xl mx-auto px-4 md:px-8 mt-16 md:mt-24 scroll-mt-20"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-neutral-dark dark:text-white tracking-tight">
                Khóa học phổ biến
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-1">
                Các khóa học theo lộ trình Cohort chuẩn đầu ra được nhiều người
                đăng ký nhất.
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
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl h-60 animate-pulse"
                ></div>
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
                <CourseItem
                  key={course.id}
                  course={course}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
