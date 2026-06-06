import { Link } from 'react-router';
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
} from 'lucide-react';
import useCourseManagement from '../hooks/useCourseManagement';

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
    handleArchive,
    handleRestore,
    handleManageClass
  } = useCourseManagement();

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">

            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-dark">Quản lý Khóa học</h1>
                <p className="text-sm text-neutral-medium mt-1">Hệ thống quản lý học liệu, trạng thái phê duyệt và tiến độ khóa học.</p>
              </div>
              <Link
                to="/creator/create-course"
                className="flex items-center gap-2 bg-primary hover:bg-[#0785b1] text-white px-5 py-3 rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="text-base" /> Tạo khóa học mới
              </Link>
            </div>

            {/* KPI Stats Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-border-light/30 flex items-center gap-4 hover:shadow-[0px_10px_30px_rgba(8,151,200,0.03)] transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <BookOpen className="text-xl" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-medium font-bold uppercase tracking-wider block">Tổng số khóa học</span>
                  <span className="text-2xl font-black text-neutral-dark">{statsTotal}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-border-light/30 flex items-center gap-4 hover:shadow-[0px_10px_30px_rgba(117,187,71,0.03)] transition-all">
                <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary">
                  <Users className="text-xl" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-medium font-bold uppercase tracking-wider block">Học viên đang học</span>
                  <span className="text-2xl font-black text-neutral-dark">{statsActiveStudents}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-border-light/30 flex items-center gap-4 hover:shadow-[0px_10px_30px_rgba(242,128,32,0.03)] transition-all">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                  <Sparkles className="text-xl" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-medium font-bold uppercase tracking-wider block">Bản nháp lưu trữ</span>
                  <span className="text-2xl font-black text-neutral-dark">{statsDrafts}</span>
                </div>
              </div>
            </div>

            {/* Filter Tabs & Search Bar Row */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-border-light/30 shadow-sm">
              <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                {[
                  { label: 'Tất cả', value: 'ALL', count: courses.length },
                  { label: 'Cần xử lý', value: 'REJECTED', count: courses.filter(c => c.status?.toUpperCase() === 'REJECTED').length },
                  { label: 'Chờ duyệt', value: 'PENDING', count: courses.filter(c => c.status?.toUpperCase() === 'PENDING').length },
                  { label: 'Hoạt động', value: 'ACTIVE', count: courses.filter(c => c.status?.toUpperCase() === 'ACTIVE' || c.status?.toUpperCase() === 'PUBLISHED').length },
                  { label: 'Bản nháp', value: 'DRAFT', count: courses.filter(c => c.status?.toUpperCase() === 'DRAFT').length },
                  { label: 'Đã lưu trữ', value: 'ARCHIVED', count: courses.filter(c => c.status?.toUpperCase() === 'ARCHIVED').length }
                ].map(tab => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab === tab.value
                      ? 'bg-primary text-white shadow-sm shadow-primary/20'
                      : 'text-neutral-medium hover:bg-slate-50 border border-transparent'
                      }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${activeTab === tab.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-neutral-medium'
                      }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:w-80">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-light">
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
                    <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <h2 className="text-xs font-bold text-danger tracking-wider uppercase mb-4 flex items-center gap-2">
                        <AlertTriangle size={16} /> Cần xử lý ngay (Critical Alerts)
                      </h2>
                      <div className="space-y-4">
                        {rejectedCourses.map(course => (
                          <div
                            key={course.id}
                            className="bg-red-50/50 border border-red-200/60 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-[0px_10px_30px_rgba(239,68,68,0.03)] transition-all duration-300"
                          >
                            <div className="flex gap-4">
                              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-500 animate-pulse">
                                <AlertTriangle size={20} />
                              </div>
                              <div>
                                <h3 className="font-extrabold text-sm text-red-700 leading-tight">
                                  {course.title}
                                </h3>
                                <p className="text-xs text-red-600 mt-1.5 font-medium leading-relaxed">
                                  <span className="font-bold">Lý do từ chối:</span> {course.reason}
                                </p>
                                <span className="text-[10px] text-red-500 block mt-2 font-semibold">
                                  Cập nhật: {formatDate(course.createdAt)}
                                </span>
                              </div>
                            </div>
                            <Link
                              to={`/creator/courses/${course.id}/edit`}
                              className="bg-danger hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
                            >
                              Sửa lỗi ngay <Pencil size={14} />
                            </Link>
                          </div>
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
                        {pendingCourses.map(course => (
                          <div
                            key={course.id}
                            className="bg-white border border-border-light/30 rounded-2xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0px_10px_30px_rgba(242,128,32,0.04)] transition-all duration-300 flex flex-col justify-between"
                          >
                            <div className="p-5">
                              <div className="flex items-center gap-2 text-secondary mb-3">
                                <Clock size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Đang chờ duyệt</span>
                              </div>
                              <h3 className="font-bold text-neutral-dark text-sm line-clamp-2 min-h-[40px] mb-2 leading-relaxed">
                                {course.title}
                              </h3>
                              <span className="text-[10px] text-neutral-light bg-bg-base border border-slate-100 px-2.5 py-1 rounded-md font-semibold">
                                {course.subject || 'Chưa phân loại'}
                              </span>
                            </div>
                            <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-xs">
                              <span className="text-[10px] text-neutral-medium font-medium">{formatDate(course.createdAt)}</span>
                              <Link
                                to={`/creator/courses/${course.id}/view`}
                                className="text-primary hover:text-[#0785b1] font-bold cursor-pointer"
                              >
                                Chi tiết
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Section 3: ACTIVE COURSES */}
                  {activeCourses.length > 0 && (
                    <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <h2 className="text-xs font-bold text-tertiary tracking-wider uppercase mb-4 flex items-center gap-2">
                        <CheckCircle2 size={16} /> Khóa học đang hoạt động (Active Courses)
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeCourses.map(course => (
                          <div
                            key={course.id}
                            className="bg-white border border-border-light/30 rounded-2xl overflow-hidden hover:shadow-[0px_10px_30px_rgba(117,187,71,0.06)] transition-all duration-300 group flex flex-col justify-between"
                          >
                            <div className="p-5">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-1.5 text-tertiary">
                                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
                                  <span className="text-[10px] font-bold uppercase tracking-wider">Active</span>
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
                                  <Users className="text-primary" size={16} />
                                  <div>
                                    <span className="text-[9px] text-neutral-light block uppercase">Học viên</span>
                                    <span className="text-xs font-bold text-neutral-dark">{course.enrolledCount || 0} HV</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Star className="text-secondary" size={16} />
                                  <div>
                                    <span className="text-[9px] text-neutral-light block uppercase">Đánh giá</span>
                                    <span className="text-xs font-bold text-neutral-dark">{course.rating || '0.0'} / 5.0</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="p-5 pt-0">
                              <button
                                onClick={() => handleManageClass(course.title)}
                                className="w-full border-2 border-primary/20 hover:border-primary text-primary hover:bg-primary hover:text-white font-bold py-2.5 rounded-xl transition-all duration-200 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                              >
                                Quản lý lớp học
                              </button>
                            </div>
                          </div>
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
                      <div className="bg-white rounded-2xl border border-border-light/30 shadow-xs overflow-hidden">
                        <div className="divide-y divide-slate-100">
                          {draftCourses.map(course => (
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
                                    {course.subject || 'Chưa phân loại'} • {formatDate(course.createdAt)}
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
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Section 5: ARCHIVED COURSES (ARCHIVE BOX STYLE) */}
                  {archivedCourses.length > 0 && (
                    <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <h2 className="text-xs font-bold text-neutral-light tracking-wider uppercase mb-4 flex items-center gap-2">
                        <Archive size={16} /> Khóa học đã lưu trữ (Archived Box)
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {archivedCourses.map(course => (
                          <div
                            key={course.id}
                            className="bg-[#fcfbfb] border border-dashed border-border-light/70 rounded-2xl p-5 flex flex-col justify-between opacity-75 hover:opacity-100 hover:border-border-light transition-all duration-200 hover:shadow-sm"
                          >
                            <div>
                              <div className="flex items-center justify-between text-neutral-light mb-3">
                                <span className="flex items-center gap-1.5 bg-slate-200/50 text-neutral-medium px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider">
                                  <Archive size={11} /> Archived
                                </span>
                                <span className="text-[9px] font-bold">{formatDate(course.createdAt)}</span>
                              </div>
                              <h3 className="font-bold text-neutral-medium text-xs mb-1 line-clamp-2 min-h-[32px] leading-relaxed">
                                {course.title}
                              </h3>
                              <p className="text-[10px] text-neutral-light font-semibold mb-4">{course.subject || 'Chưa phân loại'}</p>
                            </div>

                            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                              <button
                                onClick={() => handleRestore(course.id, course.title)}
                                className="flex-1 bg-white hover:bg-primary/5 border border-border-light/50 hover:border-primary text-neutral-medium hover:text-primary py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                              >
                                <RotateCcw size={12} /> Khôi phục
                              </button>
                              <button
                                onClick={() => handleDelete(course.id, course.title)}
                                className="p-2 text-neutral-light hover:text-red-500 rounded-xl hover:bg-red-50 transition-all cursor-pointer border border-transparent hover:border-red-100"
                                title="Xóa vĩnh viễn"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* EMPTY STATE */}
                  {filteredCourses.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-border-light/60 p-8">
                      <div className="w-16 h-16 bg-slate-50 text-neutral-light rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <BookOpen size={24} />
                      </div>
                      <h3 className="font-bold text-neutral-dark text-sm mb-1">
                        {searchTerm ? "Không tìm thấy khóa học nào" : (
                          activeTab === 'ALL' ? 'Chưa có khóa học nào được tạo' :
                          activeTab === 'REJECTED' ? 'Chưa có khóa học nào cần xử lý' :
                          activeTab === 'PENDING' ? 'Chưa có khóa học nào chờ duyệt' :
                          activeTab === 'ACTIVE' ? 'Chưa có khóa học nào đang hoạt động' :
                          activeTab === 'DRAFT' ? 'Chưa có bản nháp nào' :
                          activeTab === 'ARCHIVED' ? 'Chưa có khóa học nào được lưu trữ' : 'Chưa có khóa học thuộc trạng thái này'
                        )}
                      </h3>
                      <p className="text-xs text-neutral-medium max-w-sm mx-auto leading-relaxed mt-1">
                        {searchTerm ? "Không tìm thấy khóa học nào khớp với từ khóa tìm kiếm của bạn." : (
                          activeTab === 'ALL' ? 'Bạn chưa tạo khóa học nào trên hệ thống. Hãy bắt đầu bằng cách tạo khóa học mới.' :
                          activeTab === 'REJECTED' ? 'Hiện tại không có khóa học nào bị từ chối hoặc cần chỉnh sửa lại.' :
                          activeTab === 'PENDING' ? 'Hiện tại không có khóa học nào đang chờ phê duyệt.' :
                          activeTab === 'ACTIVE' ? 'Hiện tại không có khóa học nào đang hoạt động hoặc được xuất bản.' :
                          activeTab === 'DRAFT' ? 'Hiện tại không có bản nháp khóa học nào.' :
                          activeTab === 'ARCHIVED' ? 'Hiện tại không có khóa học nào trong kho lưu trữ.' : 'Không có khóa học nào thuộc bộ lọc này.'
                        )}
                      </p>
                    </div>
                  )}

            </div>
    </div>
  );
}
