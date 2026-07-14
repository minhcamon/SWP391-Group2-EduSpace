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
  const [videoMode, setVideoMode] = useState('upload'); // 'upload' or 'paste'

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

  const handleSave = () => {
    if (!inlineData.title.trim()) {
      toast.error('Tiêu đề bài học không được để trống!');
      return;
    }
    if (!isText && (!inlineData.url || !inlineData.url.trim())) {
      toast.error('Đường dẫn học liệu không được để trống!');
      return;
    }
    if (!isText && inlineData.url !== 'N/A' && !inlineData.url.startsWith('http://') && !inlineData.url.startsWith('https://')) {
      toast.error('Đường dẫn học liệu phải bắt đầu bằng http:// hoặc https://!');
      return;
    }
    handleSaveInlineLesson(modId);
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
          <div className="space-y-1.5">
            {activeConfig.type === 'VIDEO' && (
              <div className="flex gap-2 mb-1">
                <button
                  type="button"
                  onClick={() => setVideoMode('upload')}
                  className={`flex-1 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-all ${
                    videoMode === 'upload'
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Tải file lên
                </button>
                <button
                  type="button"
                  onClick={() => setVideoMode('paste')}
                  className={`flex-1 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-all ${
                    videoMode === 'paste'
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Dán link video
                </button>
              </div>
            )}

            {activeConfig.type === 'DOCUMENT' || videoMode === 'upload' ? (
              <label className={`flex items-center gap-2 p-2 text-xs bg-white border border-border-light/40 rounded-lg cursor-pointer hover:border-primary/50 ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
                {uploading ? (
                  <Loader2 size={14} className="text-primary animate-spin" />
                ) : inlineData.url ? (
                  <CheckCircle2 size={14} className="text-green-500" />
                ) : (
                  <UploadCloud size={14} className="text-gray-400" />
                )}
                <span className="truncate text-gray-500">
                  {uploading ? 'Đang tải lên...' : fileName || (activeConfig.type === 'VIDEO' ? 'Chọn file video...' : 'Chọn file tài liệu...')}
                </span>
                <input
                  type="file"
                  accept={ACCEPT_MAP[activeConfig.type] || undefined}
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            ) : (
              <input
                type="text"
                placeholder="Dán link video (YouTube, MP4, v.v.)..."
                value={inlineData.url || ''}
                onChange={(e) => setInlineData({ ...inlineData, url: e.target.value })}
                className="w-full p-2 text-xs bg-white border border-border-light/40 rounded-lg outline-none focus:border-primary/50"
              />
            )}
            
            {inlineData.url && !uploading && (
              <a
                href={inlineData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-[10px] text-primary underline px-1"
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
          onClick={handleSave}
          disabled={uploading || (!isText && !inlineData.url)}
          className="px-3 py-1 bg-primary text-white rounded-md text-[10px] font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
}
