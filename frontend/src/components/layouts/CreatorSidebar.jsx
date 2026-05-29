import React from 'react';
import {
  LuLayoutDashboard,
  LuBookOpen,
  LuMessagesSquare,
  LuUsers,
  LuCircleHelp,
  LuLogOut
} from 'react-icons/lu';

export default function CreatorSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 pt-20 flex flex-col bg-[#f0eded]/60 border-r border-[#c7c4d8]/40 z-30 transition-all duration-300">
      <div className="px-6 mb-6">
        <h2 className="text-xl font-bold text-[#1b1c1c] tracking-tight">Creator Hub</h2>
        <p className="text-xs text-[#464555] font-medium">Academic Management</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#464555] text-sm font-semibold hover:bg-[#e4e2e1] transition-all" href="#stats">
          <LuLayoutDashboard className="text-lg" /> Thống kê phân tích
        </a>
        <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#3525cd] font-bold border-r-4 border-[#3525cd] bg-[#eae8e7] text-sm transition-all" href="#courses">
          <LuBookOpen className="text-lg" /> Quản lý khóa học
        </a>
        <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#464555] text-sm font-semibold hover:bg-[#e4e2e1] transition-all" href="#forums">
          <LuMessagesSquare className="text-lg" /> Quản lý thảo luận
        </a>
        <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#464555] text-sm font-semibold hover:bg-[#e4e2e1] transition-all" href="#students">
          <LuUsers className="text-lg" /> Học viên & Cặp đôi
        </a>
      </nav>
      <div className="mt-auto p-3 border-t border-[#c7c4d8]/40 space-y-1">
        <a className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#464555] text-xs font-semibold hover:bg-[#e4e2e1] transition-all" href="#help">
          <LuCircleHelp className="text-base" /> Trung tâm trợ giúp
        </a>
        <a className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 text-xs font-bold hover:bg-red-50 transition-all" href="#logout">
          <LuLogOut className="text-base" /> Đăng xuất
        </a>
      </div>
    </aside>
  );
}
