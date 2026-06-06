import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  LuUsers, LuClock, LuLaptop,
  LuStar, LuCircleDot, LuUserCheck
} from 'react-icons/lu';
import CreatorFooter from '@/components/layouts/CreatorFooter';

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Mock courses database matching CourseManagement
  const coursesDB = {
    'c-1': { title: 'Lập trình Spring Boot nâng cao', subject: 'Java Software Engineering', targetBand: 'Trung cấp (Intermediate)' },
    'c-2': { title: 'ReactJS Fundamentals & Architecture', subject: 'Frontend ReactJS', targetBand: 'Cơ bản (Beginner)' },
    'c-3': { title: 'Thiết kế Game Unity 3D C#', subject: 'Unity C# Game Development', targetBand: 'Nâng cao (Advanced)' }
  };

  const course = coursesDB[courseId] || {
    title: 'Khóa học thiết kế chuẩn EduSpace',
    subject: 'Chuyên ngành phần mềm',
    targetBand: 'Tất cả cấp độ'
  };

  // Operational state for queue timer (counting up in seconds)
  const [queueTime, setQueueTime] = useState(272); // starts at 4m 32s (272 seconds)
  const [queueCount, setQueueCount] = useState(7);

  useEffect(() => {
    const interval = setInterval(() => {
      setQueueTime(prevTime => prevTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  // Mock queue students
  const queueStudents = [
    { name: 'Phạm Minh Cường', joinedAt: '4m 32s trước', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80' },
    { name: 'Hoàng Anh Tuấn', joinedAt: '3m 15s trước', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
    { name: 'Nguyễn Bích Thủy', joinedAt: '2m 50s trước', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80' },
    { name: 'Lê Thanh Bình', joinedAt: '1m 20s trước', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80' },
    { name: 'Đỗ Thùy Trang', joinedAt: '45s trước', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80' },
    { name: 'Trần Đại Nghĩa', joinedAt: '30s trước', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=80&q=80' },
    { name: 'Bùi Hồng Ngọc', joinedAt: '12s trước', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80' }
  ];

  // Mock active rooms list
  const activeRooms = [
    { id: 'ROOM-101', studentCount: 10, source: 'Từ Waitlist', mentor: 'Lê Hữu Đạt', progress: 80, module: 'Module 4/5', status: 'On-track' },
    { id: 'ROOM-102', studentCount: 9, source: 'Từ Waitlist', mentor: 'Hoàng Thùy Linh', progress: 40, module: 'Module 2/5', status: 'On-track' },
    { id: 'ROOM-103', studentCount: 10, source: 'Từ Waitlist', mentor: 'Trần Văn Kiên', progress: 20, module: 'Module 1/5', status: 'Delayed' },
    { id: 'ROOM-104', studentCount: 10, source: 'Từ Waitlist', mentor: 'Lê Hữu Đạt', progress: 95, module: 'Module 5/5', status: 'On-track' }
  ];

  // Mock course mentors
  const mentors = [
    { name: 'Lê Hữu Đạt', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&q=80', activeRooms: 2, status: 'ONLINE', rating: 4.9 },
    { name: 'Hoàng Thùy Linh', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80', activeRooms: 1, status: 'BUSY', rating: 4.8 },
    { name: 'Trần Văn Kiên', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80', activeRooms: 1, status: 'ONLINE', rating: 4.6 },
    { name: 'Vũ Minh Trí', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=80&q=80', activeRooms: 0, status: 'OFFLINE', rating: 4.5 }
  ];

  return (
    <div className="max-w-275 mx-auto space-y-8 animate-in fade-in duration-300">

            {/* Breadcrumb Navigation */}
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-gray-500">
              <Link to="/creator/courses" className="hover:text-primary transition-colors">Quản lý khóa học</Link>
              <span>/</span>
              <span className="text-primary font-bold">Chi tiết khóa học</span>
            </div>

            {/* Header Action Section */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-dark">{course.title}</h1>
                <p className="text-sm text-neutral-medium mt-1">Xem chi tiết thông tin lớp học active, đội ngũ mentor, và hàng chờ tạo lớp học mới.</p>
              </div>
            </div>

            {/* Banner Section Info */}
            <div className="p-6 bg-linear-to-r from-primary/90 to-[#6366f1]/90 rounded-3xl text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/10 rounded-full blur-xl" />
              <div className="space-y-2 z-10">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider">
                  {course.subject}
                </span>
                <p className="text-2xl font-bold pt-2">{course.title}</p>
                <p className="text-xs text-white/80 font-medium">Cấp độ mục tiêu: {course.targetBand}</p>
              </div>

              <div className="flex gap-4 z-10">
                <div className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-center min-w-20">
                  <span className="block text-2xl font-black">{activeRooms.length}</span>
                  <span className="text-[10px] font-bold text-white/80 uppercase">Lớp active</span>
                </div>
                <div className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-center min-w-20">
                  <span className="block text-2xl font-black">{mentors.filter(m => m.status !== 'OFFLINE').length}</span>
                  <span className="text-[10px] font-bold text-white/80 uppercase">Mentor online</span>
                </div>
              </div>
            </div>

            {/* Main Stats and Operational Queue Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              {/* Class Creation Queue Block (5 cols) */}
              <div className="bg-white p-6 rounded-2xl border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.01)] lg:col-span-5 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-dark flex items-center gap-1.5">
                      <LuCircleDot className="text-primary animate-pulse" /> Hàng chờ tạo lớp học mới
                    </h3>
                    <p className="text-[11px] text-neutral-medium">Người học đang xếp hàng đợi tạo lớp tự động</p>
                  </div>
                  <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-bold rounded-lg">
                    {queueCount} / 10 học viên
                  </span>
                </div>

                {/* Queue status details */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                  <div className="flex items-center gap-2">
                    <LuClock className="text-secondary text-base shrink-0" />
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase font-bold">Chờ lâu nhất</span>
                      <span className="text-xs font-extrabold text-neutral-dark">{formatTime(queueTime)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <LuUsers className="text-emerald-500 text-base shrink-0" />
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase font-bold">Đang tích lũy</span>
                      <span className="text-xs font-extrabold text-neutral-dark">Còn thiếu {10 - queueCount} học viên</span>
                    </div>
                  </div>
                </div>

                {/* List of students waiting */}
                <div className="space-y-3 max-h-55 overflow-y-auto pr-1">
                  {queueStudents.map((std, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <img src={std.avatar} alt={std.name} className="w-8 h-8 rounded-full object-cover border border-slate-100" />
                        <div>
                          <span className="text-xs font-bold text-neutral-dark block">{std.name}</span>
                          <span className="text-[9px] text-gray-400 font-semibold block flex items-center gap-0.5">
                            <LuClock className="text-[10px]" /> Đã đợi: {std.joinedAt}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] bg-slate-100 text-gray-500 font-bold px-2 py-0.5 rounded-md uppercase">
                        Đang xếp hàng
                      </span>
                    </div>
                  ))}
                </div>

                {/* Fake action button */}
                <button
                  onClick={() => {
                    setQueueCount(10);
                    setQueueTime(0);
                  }}
                  className="w-full py-2.5 bg-primary/10 text-primary text-xs font-bold rounded-xl hover:bg-primary hover:text-white active:scale-95 transition-all cursor-pointer border border-primary/20"
                >
                  Force Create Class (Mở lớp khẩn cấp)
                </button>
              </div>

              {/* Active Classes/Rooms List (7 cols) */}
              <div className="bg-white p-6 rounded-2xl border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.01)] lg:col-span-7 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-neutral-dark">Danh sách lớp active</h3>
                  <p className="text-[11px] text-neutral-medium">Các lớp học tự động tạo từ hàng chờ Waitlist (tối đa 10 học viên / lớp)</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border-light/30 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        <th className="pb-3 pl-2">Mã Lớp</th>
                        <th className="pb-3">Sĩ Số / Nguồn</th>
                        <th className="pb-3">Mentor Hỗ Trợ</th>
                        <th className="pb-3">Tiến Độ</th>
                        <th className="pb-3 pr-2 text-right">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {activeRooms.map((room, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 pl-2 font-bold text-primary">{room.id}</td>
                          <td className="py-3.5 text-neutral-dark font-semibold">
                            {room.studentCount}/10 <span className="text-[10px] text-gray-400 font-bold ml-1.5 bg-slate-100 px-1.5 py-0.5 rounded-md">{room.source}</span>
                          </td>
                          <td className="py-3.5 text-neutral-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            {room.mentor}
                          </td>
                          <td className="py-3.5">
                            <div>
                              <span className="text-[10px] font-bold text-gray-400 block mb-0.5">{room.module}</span>
                              <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${room.progress}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 pr-2 text-right">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${room.status === 'On-track'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-red-50 text-red-600 border border-red-100'
                              }`}>
                              {room.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Mentors Row */}
            <div className="bg-white p-6 rounded-2xl border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.01)] space-y-6">
              <div>
                <h3 className="text-sm font-bold text-neutral-dark">Đội ngũ mentor phụ trách khóa học</h3>
                <p className="text-[11px] text-neutral-medium">Danh sách các mentor hỗ trợ giải đáp thắc mắc và chấm bài cho các cặp học viên</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mentors.map((men, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-100/50 rounded-2xl flex flex-col justify-between items-center text-center space-y-4 hover:-translate-y-1 transition-all duration-300">
                    <div className="relative">
                      <img src={men.avatar} alt={men.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs" />
                      <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${men.status === 'ONLINE' ? 'bg-emerald-500' :
                        men.status === 'BUSY' ? 'bg-red-500' : 'bg-gray-400'
                        }`} />
                    </div>

                    <div>
                      <span className="font-bold text-neutral-dark block">{men.name}</span>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider mt-0.5">{men.status}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                      <LuStar className="fill-amber-500" /> {men.rating}
                    </div>

                    <div className="w-full pt-2.5 border-t border-slate-200/50 flex items-center justify-between text-xs font-semibold text-gray-500">
                      <span>Đang phụ trách:</span>
                      <span className="text-neutral-dark font-bold">{men.activeRooms} lớp active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back action */}
            <CreatorFooter onBack={() => navigate(-1)} />

    </div>
  );
}
