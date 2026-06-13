import React from 'react';
import { X } from 'lucide-react';

export default function InlineLessonForm({
  modId,
  activeConfig,
  setActiveConfig,
  inlineData,
  setInlineData,
  handleSaveInlineLesson
}) {
  return (
    <div className="ml-6 p-4 border border-primary/30 bg-primary/5 rounded-xl space-y-3 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-hover-light/40 pb-1.5">
        <span className="text-xs font-bold text-primary">
          Thêm mới: <span className="italic opacity-80">{activeConfig.type}</span>
        </span>
        <button onClick={() => setActiveConfig(null)} className="cursor-pointer">
          <X size={14} className="text-gray-400" />
        </button>
      </div>

      <div className={activeConfig.type === 'TEXT' ? "block" : "grid grid-cols-2 gap-3"}>
        <input
          type="text"
          placeholder={activeConfig.type === 'TEXT' ? "Tên Chủ đề nhỏ..." : "Tiêu đề bài học..."}
          value={inlineData.title}
          onChange={(e) => setInlineData({ ...inlineData, title: e.target.value })}
          className="w-full p-2 text-xs bg-white border border-border-light/40 rounded-lg outline-none"
        />
        {activeConfig.type !== 'TEXT' && (
          <input
            type="text"
            placeholder="Link URL học liệu..."
            value={inlineData.url}
            onChange={(e) => setInlineData({ ...inlineData, url: e.target.value })}
            className="p-2 text-xs bg-white border border-border-light/40 rounded-lg outline-none"
          />
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={() => setActiveConfig(null)} className="px-3 py-1 bg-white border border-gray-200 rounded-md text-[10px] font-bold text-gray-500 cursor-pointer">Hủy</button>
        <button onClick={() => handleSaveInlineLesson(modId)} className="px-3 py-1 bg-primary text-white rounded-md text-[10px] font-bold cursor-pointer">Xác nhận</button>
      </div>
    </div>
  );
}
