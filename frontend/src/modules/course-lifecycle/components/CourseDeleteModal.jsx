import React from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';

export default function CourseDeleteModal({ isOpen, onClose, onConfirm, courseTitle }) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full p-0 overflow-hidden gap-0 border border-border-light/35" showCloseButton={false}>
        {/* Modal Header */}
        <div className="p-6 bg-red-50 text-red-700 border-b border-red-100 relative shrink-0 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
            <AlertTriangle size={20} />
          </div>
          <div>
            <DialogTitle className="text-base font-bold text-red-700">Xác nhận xóa khóa học</DialogTitle>
            <DialogDescription className="text-xs text-red-600/80 mt-0.5">Hành động này không thể hoàn tác.</DialogDescription>
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
        <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0 -mx-0 -mb-0 rounded-t-none sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-4 py-2 h-auto bg-white border border-border-light text-neutral-medium rounded-xl text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            className="px-4 py-2 h-auto bg-danger hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shadow-red-500/10"
          >
            Xác nhận xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
