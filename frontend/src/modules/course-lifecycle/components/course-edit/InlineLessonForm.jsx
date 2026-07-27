import React from 'react';
import { X } from 'lucide-react';
import InputFile from '@/components/ui/InputFile';

// Loại file chấp nhận theo từng content type
const ACCEPT_MAP = {
  VIDEO: 'video/*',
  DOCUMENT: '.pdf,.doc,.docx,.ppt,.pptx',
};

export default function InlineLessonForm({
  modId,
  activeConfig,
  setActiveConfig,
  inlineData,
  setInlineData,
  handleSaveInlineLesson
}) {
  const isText = activeConfig.type === 'TEXT';

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

      <div className={isText ? "block" : "grid grid-cols-[4fr_6fr] gap-3"}>
        <input
          type="text"
          placeholder={isText ? "Tên Chủ đề nhỏ..." : "Tiêu đề bài học..."}
          value={inlineData.title}
          onChange={(e) => setInlineData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full p-2 text-xs bg-white border border-border-light/40 rounded-lg outline-none focus:border-primary"
        />
        {!isText && (
          <div className="space-y-1">
            <InputFile
              value={inlineData.url}
              accept={ACCEPT_MAP[activeConfig.type] || "*"}
              maxSize={50 * 1024 * 1024} // 50MB limit
              multiple={false}
              autoUpload={true}
              onChange={(data) => {
                setInlineData(prev => ({ ...prev, url: data?.url || '' }));
              }}
              variant="default"
              split="3-7"
              size="sm"
              placeholder={`Dán URL hoặc tải học liệu...`}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setActiveConfig(null)}
          className="px-3 py-1 bg-white border border-gray-200 rounded-md text-[10px] font-bold text-gray-500 hover:bg-gray-50 cursor-pointer"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={() => handleSaveInlineLesson(modId)}
          className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-md text-xs font-bold cursor-pointer shadow-xs transition-all active:scale-95"
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
}
