import React from 'react';

export default function CreatorHeader() {
  return (
    <header className="fixed top-0 w-full z-40 bg-white shadow-xs flex items-center justify-between px-8 h-16 border-b border-[#e4e2e1]/40">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold text-[#3525cd] tracking-tight">eduSpace</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <input
            className="pl-4 pr-4 py-2 bg-[#f6f3f2] border-none rounded-lg text-sm focus:ring-2 focus:ring-[#3525cd]/20 w-64 outline-none transition-all placeholder:text-gray-400"
            placeholder="Tìm kiếm tài liệu học..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#e2dfff] cursor-pointer">
            <img
              alt="Avatar"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
