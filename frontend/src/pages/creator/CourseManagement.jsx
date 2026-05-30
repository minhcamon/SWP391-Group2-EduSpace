import { useState } from 'react';
import { Link } from 'react-router';
import { LuPlus, LuBookOpen, LuUsers, LuSparkles, LuSearch, LuPencil, LuTrash2 } from 'react-icons/lu';
import { toast } from 'sonner';
import Sidebar from '@/components/layouts/Sidebar';

export default function CourseManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock course data matching state from CourseCreate
  const [courses, setCourses] = useState([
    {
      id: 'c-1',
      title: 'Lập trình Spring Boot nâng cao',
      subject: 'Java Software Engineering',
      targetBand: 'Trung cấp (Intermediate)',
      modulesCount: 5,
      enrolledCount: 142,
      status: 'PUBLISHED'
    },
    {
      id: 'c-2',
      title: 'ReactJS Fundamentals & Architecture',
      subject: 'Frontend ReactJS',
      targetBand: 'Cơ bản (Beginner)',
      modulesCount: 8,
      enrolledCount: 310,
      status: 'PUBLISHED'
    },
    {
      id: 'c-3',
      title: 'Thiết kế Game Unity 3D C#',
      subject: 'Unity C# Game Development',
      targetBand: 'Nâng cao (Advanced)',
      modulesCount: 6,
      enrolledCount: 48,
      status: 'DRAFT'
    }
  ]);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-bg-base text-neutral-dark min-h-screen font-sans antialiased">

      <div className="flex min-h-screen">
        <Sidebar />

        {/* MAIN BODY */}
        <main className="flex-1 p-8 bg-bg-base overflow-y-auto">
          <div className="max-w-250 mx-auto">

            {/* Header section */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-dark">Quản lý khóa học</h1>
                <p className="text-sm text-neutral-medium mt-1">Quản lý danh sách các khóa học đã tạo và chỉnh sửa chương trình học.</p>
              </div>
              <Link
                to="/creator/create-course"
                className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:opacity-95 transition-all active:scale-95 cursor-pointer"
              >
                <LuPlus className="text-lg" /> Tạo khóa học mới
              </Link>
            </div>

            {/* Stats Dashboard section */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-5 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-border-light/30 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <LuBookOpen className="text-2xl" />
                </div>
                <div>
                  <span className="text-xs text-neutral-medium font-semibold block">Tổng khóa học</span>
                  <span className="text-2xl font-bold text-neutral-dark">{courses.length}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-border-light/30 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                  <LuUsers className="text-2xl" />
                </div>
                <div>
                  <span className="text-xs text-neutral-medium font-semibold block">Tổng học viên</span>
                  <span className="text-2xl font-bold text-neutral-dark">
                    {courses.reduce((sum, c) => sum + c.enrolledCount, 0)}
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-border-light/30 flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                  <LuSparkles className="text-2xl" />
                </div>
                <div>
                  <span className="text-xs text-neutral-medium font-semibold block">Khóa học Đang nháp</span>
                  <span className="text-2xl font-bold text-neutral-dark">
                    {courses.filter(c => c.status === 'DRAFT').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Filter and Table area */}
            <div className="bg-white rounded-2xl border border-border-light/40 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-hover-light/60 flex items-center justify-between bg-white">
                <div className="relative flex-1 max-w-sm">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <LuSearch className="text-base" />
                  </span>
                  <input
                    type="text"
                    placeholder="Tìm kiếm khóa học..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-bg-card border-none rounded-lg text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="p-6">
                {filteredCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course, idx) => {
                      // Generate gradient backgrounds based on index or subject
                      const gradients = [
                        'from-primary/90 to-[#6366f1]/90',
                        'from-secondary/90 to-[#f97316]/70',
                        'from-tertiary/90 to-[#0d9488]/80'
                      ];
                      const gradient = gradients[idx % gradients.length];

                      return (
                        <Link
                          key={course.id}
                          to={`/creator/courses/${course.id}`}
                          className="group bg-white rounded-2xl border border-border-light/40 overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0px_10px_30px_rgba(79,70,229,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
                        >
                          {/* Card Image Placeholder / Gradient Header */}
                          <div className={`h-32 bg-linear-to-br ${gradient} p-4 flex flex-col justify-between relative overflow-hidden`}>
                            {/* Decorative background circle */}
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-all duration-700" />

                            {/* Status badge */}
                            <div className="flex justify-between items-start z-10">
                              <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                {course.subject}
                              </span>
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold text-white shadow-sm ${course.status === 'PUBLISHED'
                                ? 'bg-emerald-500/90 backdrop-blur-xs'
                                : 'bg-secondary/90 backdrop-blur-xs'
                                }`}>
                                {course.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}
                              </span>
                            </div>

                            <div className="z-10">
                              <span className="text-[10px] text-white/80 font-medium block uppercase tracking-wider">Cấp độ mục tiêu</span>
                              <span className="text-white text-xs font-semibold">{course.targetBand}</span>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-bold text-neutral-dark text-sm group-hover:text-primary transition-colors line-clamp-2 min-h-10 mb-4">
                                {course.title}
                              </h3>

                              {/* Stats Row */}
                              <div className="grid grid-cols-2 gap-4 py-3 px-4 bg-[#f8fafc] rounded-xl border border-slate-100 mb-4">
                                <div className="flex items-center gap-2">
                                  <LuBookOpen className="text-primary text-sm shrink-0" />
                                  <div>
                                    <span className="text-[10px] text-gray-400 block">Số Module</span>
                                    <span className="text-xs font-bold text-neutral-dark">{course.modulesCount} tuần</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <LuUsers className="text-tertiary text-sm shrink-0" />
                                  <div>
                                    <span className="text-[10px] text-gray-400 block">Học viên</span>
                                    <span className="text-xs font-bold text-neutral-dark">{course.enrolledCount} học viên</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toast.info(`Chỉnh sửa khóa học: ${course.title}`);
                                }}
                                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary font-semibold transition-colors cursor-pointer"
                              >
                                <LuPencil className="text-xs" />
                                <span>Chỉnh sửa</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toast.info(`Xóa khóa học: ${course.title}`);
                                }}
                                className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all cursor-pointer inline-flex items-center"
                                title="Xóa khóa học"
                              >
                                <LuTrash2 className="text-xs" />
                              </button>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-16 text-center text-gray-400 font-medium italic">
                    Không tìm thấy khóa học nào khớp với tìm kiếm.
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
