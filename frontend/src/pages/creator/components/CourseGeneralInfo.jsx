import React from 'react';
import { Info } from 'lucide-react';

export default function CourseGeneralInfo({ formData, setFormData, mode }) {
  return (
    <div className="grid grid-cols-12 gap-6 items-stretch">
      <div className="col-span-12 bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-border-light/30 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
            <Info size={18} /> Thông tin tổng quan
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-medium mb-2">Tên khóa học</label>
              <input
                className="w-full px-4 py-3 bg-bg-card border border-border-light/40 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                placeholder="Nhập tên lộ trình khóa học..."
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={mode === 'VIEW'}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-medium mb-2">Mô tả chi tiết</label>
              <textarea
                rows="3"
                className="w-full px-4 py-3 bg-bg-card border border-border-light/40 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                placeholder="Nhập mục tiêu và kết quả đầu ra mong đợi..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={mode === 'VIEW'}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
