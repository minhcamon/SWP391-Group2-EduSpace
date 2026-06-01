import React, { useState } from 'react';
import {
  LuInfo, LuGripVertical, LuCirclePlay, LuFileText,
  LuX, LuPlus, LuTrash2, LuFolderPlus, LuSparkles, LuFolderLock
} from 'react-icons/lu';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate, Link } from 'react-router';
import Sidebar from '@/components/layouts/Sidebar';
import CreatorFooter from '@/components/layouts/CreatorFooter';
import { toast } from 'sonner';
import courseService from '@/services/courseService';

export default function CreateCourse() {
  const navigate = useNavigate();
  // 1. Using formData to collect input data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          thumbnailPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCourse = async () => {
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tên khóa học!");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        modules: modules
      };

      console.log("Create Course Payload:", JSON.stringify(payload, null, 2));

      await courseService.createCourse(payload);
      toast.success("Tạo khóa học thành công!");
      navigate('/courses');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi tạo khóa học!");
    }
  };

  // 2. Module State
  const [modules, setModules] = useState([
    {
      id: 'mod-1',
      title: 'Giới thiệu về lập trình Java nâng cao',
      priority: 'MEDIUM', // LOW, MEDIUM, HIGH
      days: 7,
      baseExp: 100,
      speedBonusExp: 20,
      sortOrder: 1,
      assignment: {
        title: 'Bài tập thực hành OOP chặng 1',
        description: 'Yêu cầu sinh viên triển khai các lớp kế thừa và đóng gói...',
        rubricCriteria: [
          { criterion: 'Độ chính xác thuật toán', maxPoint: 5 },
          { criterion: 'Tối ưu hóa Code và Đặt tên biến clean', maxPoint: 5 }
        ]
      },
      // Mảng bài học phẳng chứa cả Header ảo, Video, Article
      lessons: [
        { id: 'les-1', title: 'Kiến thức nền tảng', content_type: 'TOPIC_HEADER' },
        { id: 'les-2', title: '1.1 Tổng quan về cấu trúc Spring Framework', content_type: 'VIDEO', content_url: 'https://youtube.com/...' },
        { id: 'les-3', title: '1.2 Các annotation phổ biến (@Component, @Service)', content_type: 'ARTICLE', content_url: 'https://drive.google.com/...' }
      ]
    }
  ]);

  const [activeConfig, setActiveConfig] = useState(null); // { moduleId, type: 'VIDEO' | 'ARTICLE' }
  const [inlineData, setInlineData] = useState({ title: '', url: '' });

  const handlePriorityChange = (moduleId, priority) => {
    const expMap = {
      LOW: { base: 50, bonus: 10 },
      MEDIUM: { base: 100, bonus: 20 },
      HIGH: { base: 150, bonus: 30 }
    };

    setModules(modules.map(mod => {
      if (mod.id === moduleId) {
        return {
          ...mod,
          priority,
          baseExp: expMap[priority].base,
          speedBonusExp: expMap[priority].bonus
        };
      }
      return mod;
    }));
  };

  const handleAddModule = () => {
    setModules([...modules, {
      id: `mod-${Date.now()}`,
      title: `Module ${modules.length + 1}: Tên chặng học mới`,
      priority: 'LOW',
      days: 7,
      baseExp: 50,
      speedBonusExp: 10,
      assignment: { title: 'Bài tập thực hành tổng kết tuần', description: '', rubricCriteria: [] },
      lessons: [],
      sortOrder: modules.length + 1,
    }]);
  };

  const handleSaveInlineLesson = (moduleId) => {
    if (!inlineData.title.trim()) return;

    setModules(modules.map(mod => {
      if (mod.id === moduleId) {
        return {
          ...mod,
          lessons: [
            ...mod.lessons,
            {
              id: `les-${Date.now()}`,
              title: inlineData.title,
              content_type: activeConfig.type, // 'TOPIC_HEADER', 'VIDEO', 'ARTICLE'
              // Header = N/A
              content_url: activeConfig.type === 'TOPIC_HEADER' ? 'N/A' : inlineData.url,
              sortOrder: mod.lessons.length + 1
            }
          ]
        };
      }
      return mod;
    }));

    setInlineData({ title: '', url: '' });
    setActiveConfig(null);
  };

  const handleDeleteLesson = (moduleId, lessonId) => {
    const updated = modules.map(mod => {
      if (mod.id === moduleId) {
        const filteredLessons = mod.lessons.filter(l => l.id !== lessonId);
        // Cập nhật lại sortOrder cho các bài học còn lại
        const updatedLessons = filteredLessons.map((l, index) => ({
          ...l,
          sortOrder: index + 1
        }));
        return { ...mod, lessons: updatedLessons };
      }
      return mod;
    });

    console.log("Modules after deleting lesson:", updated);
    setModules(updated);
  };

  const handleDragEnd = (result) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // =================================================================
    // TRƯỜNG HỢP A: KÉO THẢ ĐỔI THỨ TỰ MODULE LỚN (CÁC TUẦN HỌC CHẶNG)
    // =================================================================
    if (type === 'MODULE') {
      const reorderedModules = Array.from(modules);

      const [removedModule] = reorderedModules.splice(source.index, 1);
      reorderedModules.splice(destination.index, 0, removedModule);

      // Cập nhật lại sortOrder cho toàn bộ module sau khi kéo thả
      const updatedModules = reorderedModules.map((mod, index) => ({
        ...mod,
        sortOrder: index + 1
      }));

      console.log("Modules after dragging module:", updatedModules);
      setModules(updatedModules);
      return;
    }

    // =================================================================
    // TRƯỜNG HỢP B: KÉO THẢ LESSON / TOPIC_HEADER ẢO
    // =================================================================
    if (type === 'LESSON') {
      const sourceModuleId = source.droppableId;
      const destModuleId = destination.droppableId;

      // Nhánh 1: Kéo thả bài học nội bộ bên trong cùng 1 Module (cùng 1 tuần)
      if (sourceModuleId === destModuleId) {
        const updated = modules.map(mod => {
          if (mod.id === sourceModuleId) {
            const reorderedLessons = Array.from(mod.lessons);

            const [removedLesson] = reorderedLessons.splice(source.index, 1);
            reorderedLessons.splice(destination.index, 0, removedLesson);

            // Cập nhật lại sortOrder cho toàn bộ bài học trong module
            const updatedLessons = reorderedLessons.map((l, index) => ({
              ...l,
              sortOrder: index + 1
            }));

            return { ...mod, lessons: updatedLessons };
          }
          return mod;
        });

        console.log("Modules after internal lesson drag:", updated);
        setModules(updated);
      }
      // Nhánh 2: Kéo thả xuyên biên giới (Bốc bài học từ Tuần này thả sang Tuần khác)
      else {
        // Tìm module nguồn và module đích
        const sourceModule = modules.find(m => m.id === sourceModuleId);
        const destModule = modules.find(m => m.id === destModuleId);

        if (!sourceModule || !destModule) return;

        // Bốc bài học ra
        const sourceLessons = Array.from(sourceModule.lessons);
        const [movedLesson] = sourceLessons.splice(source.index, 1);

        if (!movedLesson) return;

        // Cập nhật sortOrder cho module nguồn
        const updatedSourceLessons = sourceLessons.map((l, index) => ({
          ...l,
          sortOrder: index + 1
        }));

        // Chèn vào module đích
        const destLessons = Array.from(destModule.lessons);
        destLessons.splice(destination.index, 0, movedLesson);

        // Cập nhật sortOrder cho module đích
        const updatedDestLessons = destLessons.map((l, index) => ({
          ...l,
          sortOrder: index + 1
        }));

        // Tạo mảng modules mới
        const updatedModules = modules.map(mod => {
          if (mod.id === sourceModuleId) {
            return { ...mod, lessons: updatedSourceLessons };
          }
          if (mod.id === destModuleId) {
            return { ...mod, lessons: updatedDestLessons };
          }
          return mod;
        });

        console.log("Modules after cross-module lesson drag:", updatedModules);
        setModules(updatedModules);
      }
    }
  };

  return (
    <div className="bg-bg-base text-neutral-dark min-h-screen font-sans antialiased">
      <div className="flex min-h-screen">
        <Sidebar />

        {/* MAIN STUDIO BUILDER */}
        <main className="flex-1 p-8 bg-bg-base overflow-y-auto">
          <div className="max-w-237.5 mx-auto">

            {/* Breadcrumb Navigation */}
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-gray-500">
              <Link to="/creator/courses" className="hover:text-primary transition-colors">Quản lý khóa học</Link>
              <span>/</span>
              <span className="text-primary font-bold">Tạo khóa học mới</span>
            </div>

            {/* Header Action Section */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-dark">Tạo Khóa Học Mới</h1>
                <p className="text-sm text-neutral-medium mt-1">Thiết kế lộ trình học cặp đôi động đồng bộ theo mô hình tuần tự.</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => toast.info("Đã lưu bản nháp thành công!")}
                  className="px-5 py-2.5 border border-primary text-primary rounded-xl text-sm font-semibold hover:bg-bg-card transition-colors cursor-pointer"
                >
                  Lưu bản nháp
                </button>
                <button
                  onClick={handleCreateCourse}
                  className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-sm hover:opacity-95 transition-all active:scale-95 cursor-pointer"
                >
                  Tạo Khóa Học
                </button>
              </div>
            </div>

            <div className="space-y-8">

              {/* BENTO ROW 1: TỔNG QUAN KHÓA HỌC */}
              <div className="grid grid-cols-12 gap-6 items-stretch">

                {/* Khối Thông tin chung */}
                <div className="col-span-12 bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-border-light/30 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                      <LuInfo className="text-lg" /> Thông tin tổng quan
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-medium mb-2">Tên khóa học</label>
                        <input
                          className="w-full px-4 py-3 bg-bg-card border border-border-light/40 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                          placeholder="Nhập tên lộ trình khóa học..."
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-medium mb-2">Mô tả chi tiết</label>
                        <textarea
                          rows="3"
                          className="w-full px-4 py-3 bg-bg-card border border-border-light/40 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                          placeholder="Nhập mục tiêu và kết quả đầu ra mong đợi..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CURRICULUM SECTION: KÍCH HOẠT DRAG & DROP CONTEXT TỔNG */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-border-light/30">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-dark">Cấu trúc chương trình học</h3>
                      <p className="text-xs text-neutral-medium mt-0.5">Sắp xếp khung bài học lý thuyết và bài tập thực hành theo tuần.</p>
                    </div>
                    <button onClick={handleAddModule} className="flex items-center gap-1.5 bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all cursor-pointer">
                      <LuPlus className="text-sm" /> Thêm tuần học mới
                    </button>
                  </div>

                  {/* DRAGGABLE TẦNG 1: QUẢN LÝ DANH SÁCH CÁC MODULE TUẦN */}
                  <Droppable droppableId="all-modules-root" type="MODULE">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-6">
                        {modules.map((mod, index) => (
                          <Draggable key={mod.id} draggableId={mod.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="outline-none"
                              >
                                <div
                                  className={`border rounded-2xl overflow-hidden bg-white ${snapshot.isDragging
                                    ? 'border-primary shadow-lg ring-2 ring-primary/10'
                                    : 'border-border-light/50 shadow-xs'
                                    }`}
                                >

                                  {/* Thanh Header của Module */}
                                  <div className="p-4 bg-bg-card border-b border-border-light/30 flex flex-col gap-3">
                                    {/* Hàng 1: Grip Handle + Tên Module */}
                                    <div className="flex items-center gap-3">
                                      <div {...provided.dragHandleProps} className="text-gray-400 cursor-move p-1.5 hover:text-primary transition-colors shrink-0">
                                        <LuGripVertical />
                                      </div>
                                      <div className="flex-1">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Module {index + 1}</span>
                                        <input
                                          className="block w-full bg-transparent border-none focus:ring-0 p-0 text-base font-bold text-neutral-dark outline-none"
                                          type="text"
                                          value={mod.title}
                                          onChange={(e) => setModules(modules.map(m => m.id === mod.id ? { ...m, title: e.target.value } : m))}
                                        />
                                      </div>
                                    </div>

                                    {/* Hàng 2: Các cấu hình thời gian, độ khó, EXP */}
                                    <div className="flex flex-wrap items-center gap-3 pl-8">
                                      {/* INPUT THỜI GIAN THEO LÝ THUYẾT COURSERA ĐỘC LẬP */}
                                      <div className="flex items-center gap-1.5 bg-white border border-border-light/40 px-2 py-1 rounded-lg">
                                        <span className="text-[11px] font-bold text-gray-400">Thời lượng:</span>
                                        <input
                                          type="number"
                                          min="1"
                                          className="w-10 text-center font-bold text-xs p-0 border-none focus:ring-0 text-gray-700"
                                          value={mod.days}
                                          onChange={(e) => setModules(modules.map(m => m.id === mod.id ? { ...m, days: parseInt(e.target.value) || 7 } : m))}
                                        />
                                        <span className="text-[11px] font-semibold text-gray-500">ngày</span>
                                      </div>

                                      {/* DROP DOWN ĐỘ KHÓ QUYẾT ĐỊNG NGẦM TRẦN ĐIỂM EXP */}
                                      <div className="flex items-center gap-1.5 bg-white border border-border-light/40 px-2 py-1 rounded-lg">
                                        <span className="text-[11px] font-bold text-gray-400">Độ khó:</span>
                                        <select
                                          className="text-xs font-bold text-gray-700 p-0 border-none focus:ring-0 bg-transparent pr-6 cursor-pointer"
                                          value={mod.priority}
                                          onChange={(e) => handlePriorityChange(mod.id, e.target.value)}
                                        >
                                          <option value="LOW">LOW (Dễ)</option>
                                          <option value="MEDIUM">MEDIUM (Vừa)</option>
                                          <option value="HIGH">HIGH (Khó)</option>
                                        </select>
                                      </div>

                                      {/* TAG HIỂN THỊ EXP TỰ ĐỘNG ÁNH XẠ BAO BỌC CHO PAIR LEARNING OPTIMIZATION */}
                                      <div className="text-[10px] font-bold text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                                        <LuSparkles className="text-xs" /> +{mod.baseExp} Base EXP | Max Bonus: +{mod.speedBonusExp} EXP
                                      </div>
                                    </div>
                                  </div>

                                  {/* DRAGGABLE TẦNG 2: VÙNG CHỨA DANH SÁCH BÀI GIẢNG PHẲNG CỦA TUẦN */}
                                  <Droppable droppableId={mod.id} type="LESSON">
                                    {(provided) => (
                                      <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="p-4 bg-white min-h-15 flex flex-col gap-3"
                                      >
                                        {mod.lessons.map((lesson, lIndex) => (
                                          <Draggable key={lesson.id} draggableId={lesson.id} index={lIndex}>
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps} /* Gắn handle toàn bộ dòng giúp bốc thả dễ dàng */
                                                className="outline-none"
                                              >
                                                <div
                                                  className={`${lesson.content_type === 'TOPIC_HEADER'
                                                    ? 'ml-0 font-bold bg-bg-card/60 border-border-light/40'
                                                    : 'ml-6 bg-white shadow-2xs hover:border-primary/30'
                                                    } flex items-center gap-4 p-3.5 border rounded-xl group ${snapshot.isDragging
                                                      ? 'border-primary shadow-md bg-primary/5'
                                                      : 'border-border-light/20 transition-colors'
                                                    }`}
                                                >
                                                  {/* Định dạng 1: Nếu là thanh phân cách Topic Header ảo */}
                                                  {lesson.content_type === 'TOPIC_HEADER' ? (
                                                    <>
                                                      <span className="w-1.5 h-3.5 bg-primary rounded-sm shrink-0"></span>
                                                      <input
                                                        className="bg-transparent border-none focus:ring-0 p-0 text-[11px] font-bold text-neutral-medium uppercase tracking-wider outline-none w-full"
                                                        type="text"
                                                        value={lesson.title}
                                                        onChange={(e) => {
                                                          setModules(modules.map(m => {
                                                            if (m.id === mod.id) {
                                                              return {
                                                                ...m,
                                                                lessons: m.lessons.map(l => l.id === lesson.id ? { ...l, title: e.target.value } : l)
                                                              };
                                                            }
                                                            return m;
                                                          }));
                                                        }}
                                                      />
                                                      <button onClick={() => handleDeleteLesson(mod.id, lesson.id)} className="ml-auto text-gray-300 hover:text-red-500 transition-colors cursor-pointer"><LuX className="text-xs" /></button>
                                                    </>
                                                  ) : (
                                                    <>
                                                      {/* Định dạng 2: Nếu là bài Video hoặc Article lý thuyết */}
                                                      {lesson.content_type === 'VIDEO' ? (
                                                        <LuCirclePlay className="text-blue-500 text-lg shrink-0" />
                                                      ) : (
                                                        <LuFileText className="text-amber-500 text-lg shrink-0" />
                                                      )}
                                                      <div className="flex-1 min-w-0">
                                                        <input
                                                          className="bg-transparent border-none focus:ring-0 p-0 text-sm font-medium text-neutral-dark outline-none w-full"
                                                          type="text"
                                                          value={lesson.title}
                                                          onChange={(e) => {
                                                            setModules(modules.map(m => {
                                                              if (m.id === mod.id) {
                                                                return {
                                                                  ...m,
                                                                  lessons: m.lessons.map(l => l.id === lesson.id ? { ...l, title: e.target.value } : l)
                                                                };
                                                              }
                                                              return m;
                                                            }));
                                                          }}
                                                        />
                                                        <span className="text-[11px] text-gray-400 font-semibold uppercase">{lesson.content_type} • Tiến trình lý thuyết</span>
                                                      </div>
                                                      <button onClick={() => handleDeleteLesson(mod.id, lesson.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"><LuTrash2 className="text-sm" /></button>
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}

                                        {/* THANH ĐIỀU KHIỂN THÊM NHANH INLINE (Hỗ trợ nhét bài và nhét Divider) */}
                                        {activeConfig?.moduleId === mod.id ? (
                                          <div className="ml-6 p-4 border border-primary/30 bg-primary/5 rounded-xl space-y-3 animate-in fade-in duration-200">
                                            <div className="flex items-center justify-between border-b border-hover-light/40 pb-1.5">
                                              <span className="text-xs font-bold text-primary">
                                                Thêm phần tử mới: <span className="italic opacity-80">{activeConfig.type}</span>
                                              </span>
                                              <button onClick={() => setActiveConfig(null)}><LuX className="text-gray-400 text-xs" /></button>
                                            </div>

                                            <div className={activeConfig.type === 'TOPIC_HEADER' ? "block" : "grid grid-cols-2 gap-3"}>
                                              <input
                                                type="text"
                                                placeholder={activeConfig.type === 'TOPIC_HEADER' ? "Nhập tên Chủ đề / Nhóm bài học nhỏ..." : "Tiêu đề bài học..."}
                                                value={inlineData.title}
                                                onChange={(e) => setInlineData({ ...inlineData, title: e.target.value })}
                                                className="w-full p-2 text-xs bg-white border border-border-light/40 rounded-lg outline-none"
                                              />
                                              {activeConfig.type !== 'TOPIC_HEADER' && (
                                                <input
                                                  type="text"
                                                  placeholder="Đường dẫn link học liệu URL..."
                                                  value={inlineData.url}
                                                  onChange={(e) => setInlineData({ ...inlineData, url: e.target.value })}
                                                  className="p-2 text-xs bg-white border border-border-light/40 rounded-lg outline-none"
                                                />
                                              )}
                                            </div>

                                            <div className="flex justify-end gap-2">
                                              <button onClick={() => setActiveConfig(null)} className="px-3 py-1 bg-white border border-gray-200 rounded-md text-[10px] font-bold text-gray-500">Hủy</button>
                                              <button onClick={() => handleSaveInlineLesson(mod.id)} className="px-3 py-1 bg-primary text-white rounded-md text-[10px] font-bold">Xác nhận</button>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="ml-6 flex gap-3 pt-2 border-t border-border-light/20">
                                            <button onClick={() => setActiveConfig({ moduleId: mod.id, type: 'VIDEO' })} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-2 border-dashed border-border-light rounded-xl text-gray-400 text-xs font-bold hover:border-primary hover:text-primary transition-all cursor-pointer">
                                              <LuCirclePlay className="text-blue-500 text-sm" /> + Thêm Video Lecture
                                            </button>
                                            <button onClick={() => setActiveConfig({ moduleId: mod.id, type: 'ARTICLE' })} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-2 border-dashed border-border-light rounded-xl text-gray-400 text-xs font-bold hover:border-primary hover:text-primary transition-all cursor-pointer">
                                              <LuFileText className="text-secondary text-sm" /> + Thêm Bài Viết / Văn Bản
                                            </button>
                                            <button onClick={() => setActiveConfig({ moduleId: mod.id, type: 'TOPIC_HEADER' })} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-2 border-dashed border-border-light rounded-xl text-gray-400 text-xs font-bold hover:border-primary hover:text-primary transition-all cursor-pointer">
                                              <LuFolderPlus className="text-primary text-sm" /> + Thêm Nhóm Chủ Đề
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </Droppable>

                                  {/* KHỐI KHÓA ĐUÔI BẮT BUỘC: DUY NHẤT 1 BÀI ASSIGNMENT ĐỂ KÍCH HOẠT MÔ HÌNH PAIR LEARNING */}
                                  <div className="mx-4 mb-4 p-4 bg-tertiary/5 border border-tertiary/10 rounded-xl space-y-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2 text-tertiary font-bold text-xs">
                                        <LuFolderLock className="text-base" /> Bài tập tự luận tổng kết tuần (Cốt lõi chặng học cặp đôi)
                                      </div>
                                      <span className="text-[9px] bg-tertiary/20 border border-tertiary/20 text-tertiary font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Kích hoạt Peer Review</span>
                                    </div>

                                    <div className="grid grid-cols-12 gap-3">
                                      <input
                                        type="text"
                                        className="col-span-4 p-2.5 bg-white border border-border-light/50 rounded-lg text-xs font-bold outline-none focus:border-primary"
                                        placeholder="Tên bài tập lớn tổng kết..."
                                        value={mod.assignment.title}
                                        onChange={(e) => setModules(modules.map(m => m.id === mod.id ? { ...m, assignment: { ...m.assignment, title: e.target.value } } : m))}
                                      />
                                      <input
                                        type="text"
                                        className="col-span-8 p-2.5 bg-white border border-border-light/50 rounded-lg text-xs outline-none focus:border-primary"
                                        placeholder="Mô tả tóm tắt yêu cầu đề bài hoặc link file tài liệu đề chi tiết..."
                                        value={mod.assignment.description}
                                        onChange={(e) => setModules(modules.map(m => m.id === mod.id ? { ...m, assignment: { ...m.assignment, description: e.target.value } } : m))}
                                      />
                                    </div>

                                    {/* Bộ cấu hình Rubric JSON Criteria thu nhỏ nằm ngay trong khối Assignment */}
                                    <div className="bg-white/80 p-3 rounded-lg border border-tertiary/10 space-y-3">
                                      <span className="text-[10px] font-bold text-gray-400 block">Tiêu chí và Thang điểm chấm chéo giữa các cặp đôi (Rubric JSON Criteria):</span>
                                      <div className="flex flex-col gap-2">
                                        {mod.assignment.rubricCriteria.map((rub, rIdx) => (
                                          <div key={rIdx} className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-gray-600 font-bold w-full">
                                            <input
                                              type="text"
                                              className="bg-transparent border-none focus:ring-0 p-0 text-xs font-semibold text-gray-600 outline-none flex-1 placeholder:text-gray-300"
                                              placeholder="Nhập tên tiêu chí kiểm thử / chấm bài..."
                                              value={rub.criterion}
                                              onChange={(e) => {
                                                setModules(modules.map(m => {
                                                  if (m.id === mod.id) {
                                                    const updatedRubrics = [...m.assignment.rubricCriteria];
                                                    updatedRubrics[rIdx] = { ...updatedRubrics[rIdx], criterion: e.target.value };
                                                    return {
                                                      ...m,
                                                      assignment: { ...m.assignment, rubricCriteria: updatedRubrics }
                                                    };
                                                  }
                                                  return m;
                                                }));
                                              }}
                                            />
                                            <div className="flex items-center gap-1.5 shrink-0 bg-white border border-border-light/40 px-2 py-0.5 rounded-md">
                                              <span className="text-[10px] text-gray-400 font-bold">Thang điểm:</span>
                                              <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                className="bg-transparent border-none focus:ring-0 p-0 text-xs font-bold text-primary outline-none w-8 text-center"
                                                value={rub.maxPoint}
                                                onChange={(e) => {
                                                  setModules(modules.map(m => {
                                                    if (m.id === mod.id) {
                                                      const updatedRubrics = [...m.assignment.rubricCriteria];
                                                      updatedRubrics[rIdx] = { ...updatedRubrics[rIdx], maxPoint: parseInt(e.target.value) || 5 };
                                                      return {
                                                        ...m,
                                                        assignment: { ...m.assignment, rubricCriteria: updatedRubrics }
                                                      };
                                                    }
                                                    return m;
                                                  }));
                                                }}
                                              />
                                              <span className="text-[10px] font-bold text-gray-500">đ</span>
                                            </div>
                                            <button
                                              onClick={() => {
                                                setModules(modules.map(m => m.id === mod.id ? {
                                                  ...m, assignment: { ...m.assignment, rubricCriteria: m.assignment.rubricCriteria.filter((_, i) => i !== rIdx) }
                                                } : m));
                                              }}
                                              className="text-gray-400 hover:text-red-500 shrink-0 cursor-pointer p-1"
                                            >
                                              <LuX className="text-sm" />
                                            </button>
                                          </div>
                                        ))}
                                        <button
                                          onClick={() => {
                                            setModules(modules.map(m => m.id === mod.id ? {
                                              ...m,
                                              assignment: {
                                                ...m.assignment,
                                                rubricCriteria: [...m.assignment.rubricCriteria, { criterion: '', maxPoint: 5 }]
                                              }
                                            } : m));
                                          }}
                                          className="self-start px-3 py-1.5 border border-dashed border-primary/40 text-primary rounded-md text-[10px] font-bold hover:bg-primary/10 cursor-pointer flex items-center gap-1"
                                        >
                                          + Thêm tiêu chí chấm chéo
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                </div>
              </DragDropContext>

            </div>

            {/* FOOTER NAVIGATION */}
            <CreatorFooter onBack={() => navigate(-1)} />

          </div>
        </main>
      </div>
    </div>
  );
}