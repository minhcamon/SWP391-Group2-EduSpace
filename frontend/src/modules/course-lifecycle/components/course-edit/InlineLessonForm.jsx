import React, { useState } from 'react';
import { X, UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import courseService from '@/services/courseService';

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
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  const isText = activeConfig.type === 'TEXT';

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);
    try {
      const url = await courseService.uploadMedia(file);
      setInlineData({ ...inlineData, url });
      toast.success('Tải file lên thành công!');
    } catch (error) {
      setFileName('');
      setInlineData({ ...inlineData, url: '' });
      toast.error(error.message || 'Tải file lên thất bại!');
    } finally {
      setUploading(false);
    }
  };

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

      <div className={isText ? "block" : "grid grid-cols-2 gap-3"}>
        <input
          type="text"
          placeholder={isText ? "Tên Chủ đề nhỏ..." : "Tiêu đề bài học..."}
          value={inlineData.title}
          onChange={(e) => setInlineData({ ...inlineData, title: e.target.value })}
          className="w-full p-2 text-xs bg-white border border-border-light/40 rounded-lg outline-none"
        />
        {!isText && (
          <div className="space-y-1">
            <label className={`flex items-center gap-2 p-2 text-xs bg-white border border-border-light/40 rounded-lg cursor-pointer hover:border-primary/50 ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
              {uploading ? (
                <Loader2 size={14} className="text-primary animate-spin" />
              ) : inlineData.url ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : (
                <UploadCloud size={14} className="text-gray-400" />
              )}
              <span className="truncate text-gray-500">
                {uploading ? 'Đang tải lên...' : fileName || 'Chọn file học liệu...'}
              </span>
              <input
                type="file"
                accept={ACCEPT_MAP[activeConfig.type] || undefined}
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
            {inlineData.url && !uploading && (
              <a
                href={inlineData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-[10px] text-primary underline"
              >
                {inlineData.url}
              </a>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={() => setActiveConfig(null)} className="px-3 py-1 bg-white border border-gray-200 rounded-md text-[10px] font-bold text-gray-500 cursor-pointer">Hủy</button>
        <button
          onClick={() => handleSaveInlineLesson(modId)}
          disabled={uploading || (!isText && !inlineData.url)}
          className="px-3 py-1 bg-primary text-white rounded-md text-[10px] font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
}
