import { Link } from 'react-router'
import {
  Plus,
  BookOpen,
  Users,
  Search,
  Pencil,
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Star,
  Archive,
  RotateCcw,
  FileText,
  Sparkles
} from 'lucide-react'
import useCourseManagement from '../hooks/useCourseManagement'
import CourseDeleteModal from '../components/CourseDeleteModal'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'

export default function CourseManagement() {
  const {
    courses,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    filteredCourses,
    rejectedCourses,
    pendingCourses,
    activeCourses,
    draftCourses,
    archivedCourses,
    statsTotal,
    statsActiveStudents,
    statsDrafts,
    formatDate,
    handleDelete,
    handleConfirmDelete,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteCourseTitle,
    handleArchive,
    handleRestore
  } = useCourseManagement()

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      {/* Header section */}
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <CardHeader className="p-0 flex-1">
            <CardTitle className="text-2xl font-bold text-secondary">
              Quản lý Khóa học
            </CardTitle>
            <CardDescription className="text-sm text-neutral-medium mt-1">
              Hệ thống quản lý học liệu, trạng thái phê duyệt và tiến độ khóa
              học.
            </CardDescription>
          </CardHeader>
          <Link
            to="/creator/create-course"
            className="flex items-center gap-2 bg-primary hover:bg-[#0785b1] text-white px-5 py-3 rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all transform cursor-pointer hover:scale-95 shrink-0"
          >
            <Plus className="text-base" /> Tạo khóa học mới
          </Link>
        </div>
      </Card>

      {/* KPI Stats Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-border-light/30 hover:shadow-[0px_10px_30px_rgba(8,151,200,0.03)] transition-all">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <BookOpen className="text-xl" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-medium font-bold uppercase tracking-wider block">
                Tổng số khóa học
              </span>
              <span className="text-2xl font-black text-neutral-dark">
                {statsTotal}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border-light/30 hover:shadow-[0px_10px_30px_rgba(117,187,71,0.03)] transition-all">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary">
              <Users className="text-xl" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-medium font-bold uppercase tracking-wider block">
                Học viên đang học
              </span>
              <span className="text-2xl font-black text-neutral-dark">
                {statsActiveStudents}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border-light/30 hover:shadow-[0px_10px_30px_rgba(242,128,32,0.03)] transition-all">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
              <Sparkles className="text-xl" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-medium font-bold uppercase tracking-wider block">
                Bản nháp lưu trữ
              </span>
              <span className="text-2xl font-black text-neutral-dark">
                {statsDrafts}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs & Search Bar Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white p-4 rounded-2xl border border-border-light/30 shadow-sm w-full">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full lg:w-auto"
        >
          <TabsList className="flex flex-row flex-wrap h-auto !h-auto gap-2 bg-transparent p-0 w-full justify-start py-1">
            {[
              { label: 'Tất cả', value: 'ALL', count: courses.length },
              {
                label: 'Cần xử lý',
                value: 'REJECTED',
                count: courses.filter(
                  (c) => c.status?.toUpperCase() === 'REJECTED'
                ).length
              },
              {
                label: 'Chờ duyệt',
                value: 'PENDING',
                count: courses.filter(
                  (c) => c.status?.toUpperCase() === 'PENDING'
                ).length
              },
              {
                label: 'Hoạt động',
                value: 'ACTIVE',
                count: courses.filter(
                  (c) =>
                    c.status?.toUpperCase() === 'ACTIVE' ||
                    c.status?.toUpperCase() === 'PUBLISHED'
                ).length
              },
              {
                label: 'Bản nháp',
                value: 'DRAFT',
                count: courses.filter(
                  (c) => c.status?.toUpperCase() === 'DRAFT'
                ).length
              },
              {
                label: 'Đã lưu trữ',
                value: 'ARCHIVED',
                count: courses.filter(
                  (c) => c.status?.toUpperCase() === 'ARCHIVED'
                ).length
              }
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-transparent shrink-0 ${
                  activeTab === tab.value
                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                    : 'text-neutral-medium hover:bg-slate-50'
                }`}
              >
                <span className="whitespace-nowrap">{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold transition-colors ${
                    activeTab === tab.value
                      ? 'bg-primary text-white'
                      : 'bg-neutral-dark/10 text-neutral-dark'
                  }`}
                >
                  {tab.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Search Bar Container */}
        <div className="relative w-full lg:w-80 flex items-center shrink-0">
          <span className="absolute left-3.5 flex items-center text-neutral-light z-10 pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Tìm tên khóa học hoặc chủ đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-bg-base border border-border-light/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl text-xs outline-none transition-all placeholder:text-neutral-light font-semibold"
          />
        </div>
      </div>

      {/* MAIN WORKFLOW AREA */}
      <div className="space-y-10">
        {/* Section 1: CRITICAL ALERTS */}
        {rejectedCourses.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
            <h2 className="text-xs font-bold text-danger tracking-wider uppercase mb-4 flex items-center gap-2">
              <AlertTriangle size={16} /> Cần xử lý ngay (Critical Alerts)
            </h2>
            <div className="space-y-4">
              {rejectedCourses.map((course) => (
                <Alert
                  key={course.id}
                  variant="destructive"
                  className="bg-red-50/50 border border-red-200/60 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-[0px_10px_30px_rgba(239,68,68,0.03)] transition-all duration-300"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-500 animate-pulse">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <AlertTitle className="font-extrabold text-sm text-red-700 leading-tight">
                        {course.title}
                      </AlertTitle>
                      <AlertDescription className="text-xs text-red-600 mt-1.5 font-medium leading-relaxed">
                        <span className="font-bold text-red-700">
                          Lý do từ chối:
                        </span>{' '}
                        {course.reason}
                      </AlertDescription>
                      <span className="text-[10px] text-red-500 block mt-2 font-semibold">
                        Cập nhật: {formatDate(course.createdAt)}
                      </span>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="destructive"
                    className="bg-danger hover:bg-red-600 text-white px-5 py-2.5 h-auto rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm border border-transparent"
                  >
                    <Link to={`/creator/courses/${course.id}/edit`}>
                      Sửa lỗi ngay <Pencil size={14} />
                    </Link>
                  </Button>
                </Alert>
              ))}
            </div>
          </section>
        )}

        {/* Section 2: PENDING APPROVAL */}
        {pendingCourses.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-xs font-bold text-secondary tracking-wider uppercase mb-4 flex items-center gap-2">
              <Clock size={16} /> Đang chờ phê duyệt (Pending)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingCourses.map((course) => (
                <Card
                  key={course.id}
                  className="bg-white border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0px_10px_30px_rgba(242,128,32,0.04)] transition-all duration-300 flex flex-col justify-between"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 text-secondary mb-3">
                      <Clock size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Đang chờ duyệt
                      </span>
                    </div>
                    <h3 className="font-bold text-neutral-dark text-sm line-clamp-2 min-h-[40px] mb-2 leading-relaxed">
                      {course.title}
                    </h3>
                    <span className="text-[10px] text-neutral-light bg-bg-base border border-slate-100 px-2.5 py-1 rounded-md font-semibold">
                      {course.subject || 'Chưa phân loại'}
                    </span>
                  </CardContent>
                  <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-[10px] text-neutral-medium font-medium">
                      {formatDate(course.createdAt)}
                    </span>
                    <Link
                      to={`/creator/courses/${course.id}/view`}
                      className="text-primary hover:text-[#0785b1] font-bold cursor-pointer"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Section 3: ACTIVE COURSES */}
        {activeCourses.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-xs font-bold text-tertiary tracking-wider uppercase mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} /> Khóa học đang hoạt động (Active
              Courses)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCourses.map((course) => (
                <Card
                  key={course.id}
                  className="bg-white border border-border-light/30 hover:shadow-[0px_10px_30px_rgba(117,187,71,0.06)] transition-all duration-300 group flex flex-col justify-between"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 text-tertiary">
                        <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Active
                        </span>
                      </div>
                      <span className="text-[9px] text-neutral-light font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        {course.subject || 'Chưa phân loại'}
                      </span>
                    </div>

                    <h3 className="font-bold text-neutral-dark text-sm mb-4 leading-relaxed group-hover:text-primary transition-colors line-clamp-2 min-h-[40px]">
                      {course.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-4 py-3 px-4 bg-bg-base border border-slate-100/60 rounded-xl mb-4 text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <Users
                          className="text-primary"
                          size={16}
                        />
                        <div>
                          <span className="text-[9px] text-neutral-light block uppercase">
                            Học viên
                          </span>
                          <span className="text-xs font-bold text-neutral-dark">
                            {course.enrolledCount || 0} HV
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star
                          className="text-secondary"
                          size={16}
                        />
                        <div>
                          <span className="text-[9px] text-neutral-light block uppercase">
                            Đánh giá
                          </span>
                          <span className="text-xs font-bold text-neutral-dark">
                            {course.rating || '0.0'} / 5.0
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <div className="px-5 pb-5 pt-0 flex gap-3">
                    <Button
                      variant="outline"
                      asChild
                      className="flex-1 border border-primary/20 hover:border-primary text-primary hover:bg-primary/5 font-bold py-2.5 h-auto rounded-xl transition-all duration-200 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Link to={`/creator/courses/${course.id}/view`}>
                        Xem chi tiết
                      </Link>
                    </Button>
                    {/* <Button
                      asChild
                      className="flex-1 bg-primary text-white hover:bg-primary/90 font-bold py-2.5 h-auto rounded-xl transition-all duration-200 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Link to={`/creator/courses/${course.id}`}>
                        Quản lý lớp học
                      </Link>
                    </Button> */}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Section 4: DRAFTS */}
        {draftCourses.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-xs font-bold text-neutral-medium tracking-wider uppercase mb-4 flex items-center gap-2">
              <FileText size={16} /> Bản nháp chưa gửi (Drafts)
            </h2>
            <Card className="bg-white border border-border-light/30 shadow-xs overflow-hidden">
              <CardContent className="divide-y divide-slate-100 p-0">
                {draftCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-neutral-light shrink-0">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-dark text-sm">
                          [📝 Draft] {course.title}
                        </h4>
                        <p className="text-[10px] text-neutral-light mt-1 font-semibold">
                          {course.subject || 'Chưa phân loại'} •{' '}
                          {formatDate(course.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Link
                        to={`/creator/courses/${course.id}/edit`}
                        className="p-2 text-primary hover:bg-primary/5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold border border-transparent hover:border-primary/10"
                        title="Chỉnh sửa bản nháp"
                      >
                        <Pencil size={14} /> <span>Sửa bản nháp</span>
                      </Link>
                      <button
                        onClick={() => handleArchive(course.id, course.title)}
                        className="p-2 text-neutral-medium hover:bg-slate-100 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold border border-transparent"
                        title="Lưu trữ khóa học"
                      >
                        <Archive size={14} /> <span>Lưu trữ</span>
                      </button>
                      <button
                        onClick={() => handleDelete(course.id, course.title)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                        title="Xóa bản nháp"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Section 5: ARCHIVED COURSES (ARCHIVE BOX STYLE) */}
        {archivedCourses.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-xs font-bold text-neutral-light tracking-wider uppercase mb-4 flex items-center gap-2">
              <Archive size={16} /> Khóa học đã lưu trữ (Archived Box)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archivedCourses.map((course) => (
                <Card
                  key={course.id}
                  className="bg-[#fcfbfb] border border-dashed border-border-light/70 rounded-2xl p-5 flex flex-col justify-between opacity-75 hover:opacity-100 hover:border-border-light transition-all duration-200 hover:shadow-sm"
                >
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between text-neutral-light mb-3">
                      <span className="flex items-center gap-1.5 bg-slate-200/50 text-neutral-medium px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider">
                        <Archive size={11} /> Archived
                      </span>
                      <span className="text-[9px] font-bold">
                        {formatDate(course.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-bold text-neutral-medium text-xs mb-1 line-clamp-2 min-h-[32px] leading-relaxed">
                      {course.title}
                    </h3>
                    <p className="text-[10px] text-neutral-light font-semibold mb-4">
                      {course.subject || 'Chưa phân loại'}
                    </p>
                  </CardContent>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <Button
                      onClick={() => handleRestore(course.id, course.title)}
                      className="flex-1 bg-white hover:bg-primary/5 border border-border-light/50 hover:border-primary text-neutral-medium hover:text-primary py-2 h-auto rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RotateCcw size={12} /> Khôi phục
                    </Button>
                    <button
                      onClick={() => handleDelete(course.id, course.title)}
                      className="p-2 text-neutral-light hover:text-red-500 rounded-xl hover:bg-red-50 transition-all cursor-pointer border border-transparent hover:border-red-100"
                      title="Xóa vĩnh viễn"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* EMPTY STATE */}
        {filteredCourses.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title={
              searchTerm
                ? 'Không tìm thấy khóa học nào'
                : activeTab === 'ALL'
                  ? 'Chưa có khóa học nào được tạo'
                  : activeTab === 'REJECTED'
                    ? 'Chưa có khóa học nào cần xử lý'
                    : activeTab === 'PENDING'
                      ? 'Chưa có khóa học nào chờ duyệt'
                      : activeTab === 'ACTIVE'
                        ? 'Chưa có khóa học nào đang hoạt động'
                        : activeTab === 'DRAFT'
                          ? 'Chưa có bản nháp nào'
                          : activeTab === 'ARCHIVED'
                            ? 'Chưa có khóa học nào được lưu trữ'
                            : 'Chưa có khóa học thuộc trạng thái này'
            }
            description={
              searchTerm
                ? 'Không tìm thấy khóa học nào khớp với từ khóa tìm kiếm của bạn.'
                : activeTab === 'ALL'
                  ? 'Bạn chưa tạo khóa học nào trên hệ thống. Hãy bắt đầu bằng cách tạo khóa học mới.'
                  : activeTab === 'REJECTED'
                    ? 'Hiện tại không có khóa học nào bị từ chối hoặc cần chỉnh sửa lại.'
                    : activeTab === 'PENDING'
                      ? 'Hiện tại không có khóa học nào đang chờ phê duyệt.'
                      : activeTab === 'ACTIVE'
                        ? 'Hiện tại không có khóa học nào đang hoạt động hoặc được xuất bản.'
                        : activeTab === 'DRAFT'
                          ? 'Hiện tại không có bản nháp khóa học nào.'
                          : activeTab === 'ARCHIVED'
                            ? 'Hiện tại không có khóa học nào trong kho lưu trữ.'
                            : 'Không có khóa học nào thuộc bộ lọc này.'
            }
          />
        )}

        <CourseDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          courseTitle={deleteCourseTitle}
        />
      </div>
    </div>
  )
}
