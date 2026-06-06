import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function CourseDeleteModal({ isOpen, onClose, onConfirm, courseTitle }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-border-light/30 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-red-50 text-red-700 border-b border-red-100 relative shrink-0 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold">Xác nhận xóa khóa học</h3>
            <p className="text-xs text-red-600/80 mt-0.5">Hành động này không thể hoàn tác.</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-red-400 hover:text-red-700 text-xl font-bold cursor-pointer transition-colors"
            type="button"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-3">
          <p className="text-sm text-neutral-medium leading-relaxed">
            Bạn có chắc chắn muốn xóa vĩnh viễn khóa học:
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
            <span className="font-extrabold text-neutral-dark text-sm block break-words">
              {courseTitle}
            </span>
          </div>
          <p className="text-xs text-gray-400 italic">
            Mọi bài giảng, tài liệu, và cấu trúc lộ trình của khóa học này sẽ bị xóa bỏ khỏi hệ thống.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-border-light text-neutral-medium rounded-xl text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-danger hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shadow-red-500/10"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
}
