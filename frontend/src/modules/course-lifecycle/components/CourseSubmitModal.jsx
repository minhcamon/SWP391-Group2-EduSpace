import React from 'react';

export default function CourseSubmitModal({ isOpen, onClose, onSubmit, mode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-border-light/30 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        {/* Modal Header */}
        <div className={`p-6 text-white relative shrink-0 bg-primary`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold cursor-pointer transition-colors"
            type="button"
          >
            &times;
          </button>
          <h3 className="text-lg font-bold">
            {mode === 'EDIT' ? 'Cập nhật khóa học' : 'Xác nhận tạo khóa học mới'}
          </h3>
          <p className="text-xs text-white/80 mt-1">
            {mode === 'EDIT'
              ? 'Chọn hình thức cập nhật cho các thay đổi của khóa học.'
              : 'Vui lòng chọn hình thức gửi khóa học của bạn để tiếp tục.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-neutral-medium leading-relaxed">
            {mode === 'EDIT'
              ? 'Bạn có thể gửi khóa học để chờ duyệt các chỉnh sửa mới, hoặc lưu tạm dưới dạng bản nháp để tiếp tục cập nhật sau.'
              : 'Khóa học của bạn có thể được gửi đi để Ban quản trị phê duyệt ngay, hoặc lưu tạm dưới dạng bản nháp để chỉnh sửa thêm.'}
          </p>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            <button
              onClick={() => onSubmit('PENDING')}
              className="flex items-center justify-between p-4 border-2 border-secondary/20 hover:border-secondary bg-secondary/5 hover:bg-secondary/10 rounded-xl transition-all cursor-pointer text-left group"
            >
              <div>
                <span className="block text-sm font-bold text-secondary">
                  {mode === 'EDIT' ? 'Cập nhật & Gửi duyệt' : 'Tạo & Gửi duyệt khóa học'}
                </span>
                <span className="block text-xs text-neutral-medium mt-0.5">
                  Gửi khóa học tới Ban quản trị để phê duyệt xuất bản.
                </span>
              </div>
              <span className="text-xs font-bold text-white bg-secondary px-2.5 py-1 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                Gửi duyệt
              </span>
            </button>

            <button
              onClick={() => onSubmit('DRAFT')}
              className="flex items-center justify-between p-4 border-2 border-tertiary/20 hover:border-tertiary bg-tertiary/5 hover:bg-tertiary/10 rounded-xl transition-all cursor-pointer text-left group"
            >
              <div>
                <span className="block text-sm font-bold text-tertiary">
                  {mode === 'EDIT' ? 'Cập nhật & Lưu nháp' : 'Tạo & Lưu bản nháp'}
                </span>
                <span className="block text-xs text-neutral-medium mt-0.5">
                  Lưu trữ thông tin tạm thời và có thể chỉnh sửa bất cứ lúc nào.
                </span>
              </div>
              <span className="text-xs font-bold text-white bg-tertiary px-2.5 py-1 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                Lưu nháp
              </span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-white border border-border-light text-neutral-dark rounded-xl text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
}
