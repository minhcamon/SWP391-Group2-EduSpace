import React from 'react';
import { LuArrowLeft, LuHistory } from 'react-icons/lu';

export default function CreatorFooter({ onBack }) {
  return (
    <div className="mt-8 flex items-center justify-between pt-6 border-t border-[#e4e2e1]">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs font-bold text-[#464555] hover:text-[#3525cd] transition-colors cursor-pointer"
      >
        <LuArrowLeft className="text-sm" /> Quay lại không gian quản trị
      </button>
      <p className="text-[11px] font-medium text-gray-400 italic flex items-center gap-1 select-none">
        <LuHistory className="text-sm" /> Chu trình đồng bộ toán học tuyến tính bảo toàn tự động
      </p>
    </div>
  );
}
