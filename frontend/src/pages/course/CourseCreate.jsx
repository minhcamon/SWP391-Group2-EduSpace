import React, { useState } from 'react';
import {
  LuInfo, LuImage, LuSlidersHorizontal,
  LuCirclePlus, LuGripVertical, LuCirclePlay, LuFileText,
  LuX, LuPlus, LuTrash2, LuFolderPlus, LuSparkles, LuFolderLock
} from 'react-icons/lu';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router';
import Header from '@/components/layouts/Header';
import CreatorSidebar from '@/components/layouts/CreatorSidebar';
import CreatorFooter from '@/components/layouts/CreatorFooter';

export default function CreateCourse() {
  const navigate = useNavigate();
  // 1. Đồng bộ State thông tin chung theo trường nhập liệu của template mới
  const [courseInfo, setCourseInfo] = useState({
    title: '',
    subject: 'Reading',
    targetBand: '7.5 - 8.0',
    description: '',
    thumbnailUrl: '',
    isFree: false,
    price: ''
  });

  // 2. State quản lý cây học liệu ảo (Dữ liệu phẳng tương thích 100% 4 bảng gốc của bạn)
  const [modules, setModules] = useState([
    {
      id: 'mod-1',
      title: 'Giới thiệu về lập trình Java nâng cao',
      priority: 'MEDIUM', // LOW, MEDIUM, HIGH
      days: 7, // Trường thời lượng tùy biến cứng của Coursera
      baseExp: 100, // Tự động map ngầm phục vụ Pair Learning
      speedBonusExp: 20,
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

  // State quản lý việc thêm học liệu nhanh
  const [activeConfig, setActiveConfig] = useState(null); // { moduleId, type: 'VIDEO' | 'ARTICLE' }
  const [inlineData, setInlineData] = useState({ title: '', url: '' });

  // Thuật toán tự động ánh xạ định mức EXP theo mức độ khó (Priority) chặng
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
      lessons: []
    }]);
  };

  const handleAddTopicHeader = (moduleId) => {
    const headerTitle = prompt("Nhập tên Chủ đề / Nhóm bài học nhỏ (Topic Header):");
    if (!headerTitle) return;

    setModules(modules.map(mod => {
      if (mod.id === moduleId) {
        return {
          ...mod,
          lessons: [...mod.lessons, { id: `les-${Date.now()}`, title: headerTitle, content_type: 'TOPIC_HEADER' }]
        };
      }
      return mod;
    }));
  };

  // const handleSaveInlineLesson = (moduleId) => {
  //   if (!inlineData.title.trim()) return;

  //   setModules(modules.map(mod => {
  //     if (mod.id === moduleId) {
  //       return {
  //         ...mod,
  //         lessons: [...mod.lessons, {
  //           id: `les-${Date.now()}`,
  //           title: inlineData.title,
  //           content_type: activeConfig.type,
  //           content_url: inlineData.url
  //         }]
  //       };
  //     }
  //     return mod;
  //   }));

  //   setInlineData({ title: '', url: '' });
  //   setActiveConfig(null);
  // };

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
              content_type: activeConfig.type, // Sẽ mang giá trị 'TOPIC_HEADER', 'VIDEO', hoặc 'ARTICLE'
              // Nếu là Header thì lưu chuỗi 'N/A' ngầm xuống DB, ngược lại thì lưu link URL bình thường
              content_url: activeConfig.type === 'TOPIC_HEADER' ? 'N/A' : inlineData.url
            }
          ]
        };
      }
      return mod;
    }));

    // Reset trạng thái form về trống
    setInlineData({ title: '', url: '' });
    setActiveConfig(null);
  };

  const handleDeleteLesson = (moduleId, lessonId) => {
    setModules(modules.map(mod => {
      if (mod.id === moduleId) {
        return { ...mod, lessons: mod.lessons.filter(l => l.id !== lessonId) };
      }
      return mod;
    }));
  };

  const handleDragEnd = (result) => {
    const { source, destination, type } = result;

    // 1. Kiểm tra nếu người dùng thả chuột ngoài vùng Droppable hợp lệ thì dừng luồng xử lý
    if (!destination) return;

    // 2. Kiểm tra nếu vị trí thả trùng khít với vị trí kéo ban đầu (không có sự thay đổi) thì dừng luồng
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

      // Tráo đổi vị trí phần tử trong mảng tuần học
      const [removedModule] = reorderedModules.splice(source.index, 1);
      reorderedModules.splice(destination.index, 0, removedModule);

      setModules(reorderedModules);
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
        setModules(modules.map(mod => {
          if (mod.id === sourceModuleId) {
            const reorderedLessons = Array.from(mod.lessons);

            // Tráo đổi vị trí index nội bộ mảng bài học
            const [removedLesson] = reorderedLessons.splice(source.index, 1);
            reorderedLessons.splice(destination.index, 0, removedLesson);

            return { ...mod, lessons: reorderedLessons };
          }
          return mod;
        }));
      }
      // Nhánh 2: Kéo thả xuyên biên giới (Bốc bài học từ Tuần này thả sang Tuần khác)
      else {
        let movedLessonData = null;

        // Bước 2.1: Duyệt qua mảng để tìm và rút (remove) bài học ra khỏi Module gốc
        const updatedModulesWithRemoval = modules.map(mod => {
          if (mod.id === sourceModuleId) {
            const sourceLessons = Array.from(mod.lessons);
            const [removed] = sourceLessons.splice(source.index, 1);
            movedLessonData = removed; // Găm dữ liệu bài học vào biến tạm để đem đi chèn
            return { ...mod, lessons: sourceLessons };
          }
          return mod;
        });

        // Bước 2.2: Chèn (insert) bài học vừa bốc vào mảng lessons của Module đích tại chỉ số index mới
        const finalModules = updatedModulesWithRemoval.map(mod => {
          if (mod.id === destModuleId && movedLessonData) {
            const destLessons = Array.from(mod.lessons);
            destLessons.splice(destination.index, 0, movedLessonData);
            return { ...mod, lessons: destLessons };
          }
          return mod;
        });

        setModules(finalModules);
      }
    }
  };

  return (
    <div className="bg-[#fbf9f8] text-[#1b1c1c] min-h-screen font-sans antialiased">

      <Header />

      <div className="flex min-h-screen pt-16">

        <CreatorSidebar />

        {/* MAIN STUDIO BUILDER */}
        <main className="ml-64 flex-1 p-8 bg-[#fbf9f8] overflow-y-auto">
          <div className="max-w-[950px] mx-auto">

            {/* Header Action Section */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#1b1c1c]">Tạo Khóa Học Mới</h1>
                <p className="text-sm text-[#464555] mt-1">Thiết kế lộ trình học cặp đôi động đồng bộ theo mô hình tuần tự.</p>
              </div>
              <div className="flex gap-4">
                <button className="px-5 py-2.5 border border-[#3525cd] text-[#3525cd] rounded-xl text-sm font-semibold hover:bg-[#f6f3f2] transition-colors cursor-pointer">
                  Lưu bản nháp
                </button>
                <button className="px-5 py-2.5 bg-[#4f46e5] text-white rounded-xl text-sm font-semibold shadow-sm hover:opacity-95 transition-all active:scale-95 cursor-pointer">
                  Tạo Khóa Học
                </button>
              </div>
            </div>

            <div className="space-y-8">

              {/* BENTO ROW 1: TỔNG QUAN KHÓA HỌC KHỚP HOÀN TOÀN CẤU TRÚC MẪU */}
              <div className="grid grid-cols-12 gap-6 items-stretch">

                {/* Khối Thông tin chung */}
                <div className="col-span-8 bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-[#c7c4d8]/30 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#3525cd] mb-4 flex items-center gap-2">
                      <LuInfo className="text-lg" /> Thông tin tổng quan
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#464555] mb-2">Tên khóa học</label>
                        <input
                          className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c7c4d8]/40 rounded-lg focus:ring-2 focus:ring-[#3525cd]/20 outline-none text-sm transition-all"
                          placeholder="Nhập tên lộ trình khóa học..."
                          type="text"
                          value={courseInfo.title}
                          onChange={(e) => setCourseInfo({ ...courseInfo, title: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#464555] mb-2">Chủ đề đào tạo</label>
                          <select
                            className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c7c4d8]/40 rounded-lg outline-none text-sm text-gray-700 focus:ring-2 focus:ring-[#3525cd]/20"
                            value={courseInfo.subject}
                            onChange={(e) => setCourseInfo({ ...courseInfo, subject: e.target.value })}
                          >
                            <option value="Java Boot">Java Software Engineering</option>
                            <option value="Frontend">Frontend ReactJS</option>
                            <option value="IoT">IoT & Microcontroller</option>
                            <option value="GameDev">Unity C# Game Development</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#464555] mb-2">Cấp độ mục tiêu</label>
                          <select
                            className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c7c4d8]/40 rounded-lg outline-none text-sm text-gray-700 focus:ring-2 focus:ring-[#3525cd]/20"
                            value={courseInfo.targetBand}
                            onChange={(e) => setCourseInfo({ ...courseInfo, targetBand: e.target.value })}
                          >
                            <option>Cơ bản (Beginner)</option>
                            <option>Trung cấp (Intermediate)</option>
                            <option>Nâng cao (Advanced)</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#464555] mb-2">Mô tả chi tiết</label>
                        <textarea rows="3" className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c7c4d8]/40 rounded-lg focus:ring-2 focus:ring-[#3525cd]/20 outline-none text-sm transition-all" placeholder="Nhập mục tiêu và kết quả đầu ra mong đợi..."></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Khối Cấu hình Điểm số & Ảnh (Side Column Bento) */}
                <div className="col-span-4 space-y-6">
                  <div className="bg-white p-5 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-[#c7c4d8]/30">
                    <h3 className="text-sm font-bold text-[#3525cd] mb-3 flex items-center gap-2">
                      <LuImage className="text-lg" /> Hình ảnh hiển thị
                    </h3>
                    <div className="relative group cursor-pointer border-2 border-dashed border-[#c7c4d8] rounded-xl aspect-video flex flex-col items-center justify-center bg-[#f6f3f2] hover:bg-gray-100/70 hover:border-[#3525cd] transition-all overflow-hidden">
                      <div className="text-center p-4">
                        <LuCirclePlus className="text-2xl text-gray-400 mx-auto mb-1 group-hover:text-[#3525cd]" />
                        <p className="text-xs font-semibold text-[#464555]">Tải ảnh khóa học (16:9)</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-[#c7c4d8]/30">
                    <h3 className="text-sm font-bold text-[#3525cd] mb-3 flex items-center gap-2">
                      <LuSlidersHorizontal className="text-base" /> Chế độ vận hành
                    </h3>
                    <div className="flex items-center justify-between p-3 bg-[#f6f3f2] rounded-lg border border-[#3525cd]/10">
                      <span className="text-xs font-bold text-[#1b1c1c]">Bật kiểm duyệt Mentor</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-[#3525cd] rounded focus:ring-[#3525cd] cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>

              {/* CURRICULUM SECTION: KÍCH HOẠT DRAG & DROP CONTEXT TỔNG */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-[#c7c4d8]/30">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#1b1c1c]">Cấu trúc chương trình học</h3>
                      <p className="text-xs text-[#464555] mt-0.5">Sắp xếp khung bài học lý thuyết và bài tập thực hành theo tuần.</p>
                    </div>
                    <button onClick={handleAddModule} className="flex items-center gap-1.5 bg-[#3525cd]/10 text-[#3525cd] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#3525cd] hover:text-white transition-all cursor-pointer">
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
                                    ? 'border-[#3525cd] shadow-lg ring-2 ring-[#3525cd]/10'
                                    : 'border-[#c7c4d8]/50 shadow-xs'
                                    }`}
                                >

                                  {/* Thanh Header của Module - Chứa Handle kéo thả chuyên biệt */}
                                  <div className="p-4 bg-[#f6f3f2] border-b border-[#c7c4d8]/30 flex flex-wrap items-center gap-4">
                                    <div {...provided.dragHandleProps} className="text-gray-400 cursor-move p-1.5 hover:text-[#3525cd] transition-colors">
                                      <LuGripVertical />
                                    </div>
                                    <div className="flex-1 min-w-[200px]">
                                      <span className="text-[10px] font-bold text-[#3525cd] uppercase tracking-wider">Module {index + 1}</span>
                                      <input
                                        className="block w-full bg-transparent border-none focus:ring-0 p-0 text-base font-bold text-[#1b1c1c] outline-none"
                                        type="text"
                                        value={mod.title}
                                        onChange={(e) => setModules(modules.map(m => m.id === mod.id ? { ...m, title: e.target.value } : m))}
                                      />
                                    </div>

                                    {/* INPUT THỜI GIAN THEO LÝ THUYẾT COURSERA ĐỘC LẬP */}
                                    <div className="flex items-center gap-1.5 bg-white border border-[#c7c4d8]/40 px-2 py-1 rounded-lg">
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
                                    <div className="flex items-center gap-1.5 bg-white border border-[#c7c4d8]/40 px-2 py-1 rounded-lg">
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
                                    <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                                      <LuSparkles className="text-xs" /> +{mod.baseExp} Base EXP | Max Bonus: +{mod.speedBonusExp} EXP
                                    </div>
                                  </div>

                                  {/* DRAGGABLE TẦNG 2: VÙNG CHỨA DANH SÁCH BÀI GIẢNG PHẲNG CỦA TUẦN */}
                                  <Droppable droppableId={mod.id} type="LESSON">
                                    {(provided) => (
                                      <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="p-4 bg-white min-h-[60px] flex flex-col gap-3"
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
                                                    ? 'ml-0 font-bold bg-[#f6f3f2]/60 border-[#c7c4d8]/40'
                                                    : 'ml-6 bg-white shadow-2xs hover:border-[#3525cd]/30'
                                                    } flex items-center gap-4 p-3.5 border rounded-xl group ${snapshot.isDragging
                                                      ? 'border-[#3525cd] shadow-md bg-indigo-50/10'
                                                      : 'border-[#c7c4d8]/20 transition-colors'
                                                    }`}
                                                >
                                                  {/* Định dạng 1: Nếu là thanh phân cách Topic Header ảo */}
                                                  {lesson.content_type === 'TOPIC_HEADER' ? (
                                                    <>
                                                      <span className="w-1.5 h-3.5 bg-[#3525cd] rounded-sm"></span>
                                                      <span className="text-[11px] font-bold text-[#464555] uppercase tracking-wider">{lesson.title}</span>
                                                      <button onClick={() => handleDeleteLesson(mod.id, lesson.id)} className="ml-auto text-gray-300 hover:text-red-500 transition-colors cursor-pointer"><LuX className="text-xs" /></button>
                                                    </>
                                                  ) : (
                                                    <>
                                                      {/* Định dạng 2: Nếu là bài Video hoặc Article lý thuyết */}
                                                      {lesson.content_type === 'VIDEO' ? (
                                                        <LuCirclePlay className="text-blue-500 text-lg flex-shrink-0" />
                                                      ) : (
                                                        <LuFileText className="text-amber-500 text-lg flex-shrink-0" />
                                                      )}
                                                      <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-[#1b1c1c] truncate">{lesson.title}</p>
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
                                          <div className="ml-6 p-4 border border-[#3525cd]/30 bg-indigo-50/10 rounded-xl space-y-3 animate-in fade-in duration-200">
                                            <div className="flex items-center justify-between border-b border-[#e4e2e1]/40 pb-1.5">
                                              <span className="text-xs font-bold text-[#3525cd]">
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
                                                className="w-full p-2 text-xs bg-white border border-[#c7c4d8]/40 rounded-lg outline-none"
                                              />
                                              {activeConfig.type !== 'TOPIC_HEADER' && (
                                                <input
                                                  type="text"
                                                  placeholder="Đường dẫn link học liệu URL..."
                                                  value={inlineData.url}
                                                  onChange={(e) => setInlineData({ ...inlineData, url: e.target.value })}
                                                  className="p-2 text-xs bg-white border border-[#c7c4d8]/40 rounded-lg outline-none"
                                                />
                                              )}
                                            </div>

                                            <div className="flex justify-end gap-2">
                                              <button onClick={() => setActiveConfig(null)} className="px-3 py-1 bg-white border border-gray-200 rounded-md text-[10px] font-bold text-gray-500">Hủy</button>
                                              <button onClick={() => handleSaveInlineLesson(mod.id)} className="px-3 py-1 bg-[#3525cd] text-white rounded-md text-[10px] font-bold">Xác nhận</button>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="ml-6 flex gap-3 pt-2 border-t border-[#c7c4d8]/20">
                                            <button onClick={() => setActiveConfig({ moduleId: mod.id, type: 'VIDEO' })} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-2 border-dashed border-[#c7c4d8] rounded-xl text-gray-400 text-xs font-bold hover:border-[#3525cd] hover:text-[#3525cd] transition-all cursor-pointer">
                                              <LuCirclePlay className="text-blue-500 text-sm" /> + Thêm Video Lecture
                                            </button>
                                            <button onClick={() => setActiveConfig({ moduleId: mod.id, type: 'ARTICLE' })} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-2 border-dashed border-[#c7c4d8] rounded-xl text-gray-400 text-xs font-bold hover:border-[#3525cd] hover:text-[#3525cd] transition-all cursor-pointer">
                                              <LuFileText className="text-amber-500 text-sm" /> + Thêm Bài Viết / Văn Bản
                                            </button>
                                            <button onClick={() => setActiveConfig({ moduleId: mod.id, type: 'TOPIC_HEADER' })} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-2 border-dashed border-[#c7c4d8] rounded-xl text-gray-400 text-xs font-bold hover:border-[#3525cd] hover:text-[#3525cd] transition-all cursor-pointer">
                                              <LuFolderPlus className="text-[#3525cd] text-sm" /> + Thêm Nhóm Chủ Đề
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </Droppable>

                                  {/* KHỐI KHÓA ĐUÔI BẮT BUỘC: DUY NHẤT 1 BÀI ASSIGNMENT ĐỂ KÍCH HOẠT MÔ HÌNH PAIR LEARNING */}
                                  <div className="mx-4 mb-4 p-4 bg-[#00524a]/5 border border-[#00524a]/10 rounded-xl space-y-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2 text-[#00524a] font-bold text-xs">
                                        <LuFolderLock className="text-base" /> Bài tập tự luận tổng kết tuần (Cốt lõi chặng học cặp đôi)
                                      </div>
                                      <span className="text-[9px] bg-[#6ef8e7]/20 border border-[#00524a]/20 text-[#005049] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Kích hoạt Peer Review</span>
                                    </div>

                                    <div className="grid grid-cols-12 gap-3">
                                      <input
                                        type="text"
                                        className="col-span-4 p-2.5 bg-white border border-[#c7c4d8]/50 rounded-lg text-xs font-bold outline-none focus:border-[#3525cd]"
                                        placeholder="Tên bài tập lớn tổng kết..."
                                        value={mod.assignment.title}
                                        onChange={(e) => setModules(modules.map(m => m.id === mod.id ? { ...m, assignment: { ...m.assignment, title: e.target.value } } : m))}
                                      />
                                      <input
                                        type="text"
                                        className="col-span-8 p-2.5 bg-white border border-[#c7c4d8]/50 rounded-lg text-xs outline-none focus:border-[#3525cd]"
                                        placeholder="Mô tả tóm tắt yêu cầu đề bài hoặc link file tài liệu đề chi tiết..."
                                        value={mod.assignment.description}
                                        onChange={(e) => setModules(modules.map(m => m.id === mod.id ? { ...m, assignment: { ...m.assignment, description: e.target.value } } : m))}
                                      />
                                    </div>

                                    {/* Bộ cấu hình Rubric JSON Criteria thu nhỏ nằm ngay trong khối Assignment */}
                                    <div className="bg-white/80 p-3 rounded-lg border border-[#00524a]/10 space-y-2">
                                      <span className="text-[10px] font-bold text-gray-400 block">Tiêu chí và Thang điểm chấm chéo giữa các cặp đôi (Rubric JSON Criteria):</span>
                                      <div className="flex flex-wrap gap-2">
                                        {mod.assignment.rubricCriteria.map((rub, rIdx) => (
                                          <div key={rIdx} className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 border border-gray-200 rounded-md text-[10px] text-gray-600 font-bold">
                                            <span>{rub.criterion} ({rub.maxPoint}đ)</span>
                                            <button onClick={() => {
                                              setModules(modules.map(m => m.id === mod.id ? {
                                                ...m, assignment: { ...m.assignment, rubricCriteria: m.assignment.rubricCriteria.filter((_, i) => i !== rIdx) }
                                              } : m));
                                            }}><LuX className="text-gray-400 hover:text-red-500 cursor-pointer" /></button>
                                          </div>
                                        ))}
                                        <button
                                          onClick={() => {
                                            const crit = prompt("Nhập tiêu chí kiểm thử/chấm bài cặp đôi:");
                                            const pts = prompt("Thang điểm tối đa cho tiêu chí này (1-5):", "5");
                                            if (crit && pts) {
                                              setModules(modules.map(m => m.id === mod.id ? {
                                                ...m, assignment: { ...m.assignment, rubricCriteria: [...m.assignment.rubricCriteria, { criterion: crit, maxPoint: parseInt(pts) || 5 }] }
                                              } : m));
                                            }
                                          }}
                                          className="px-2 py-0.5 border border-dashed border-[#3525cd]/40 text-[#3525cd] rounded-md text-[10px] font-bold hover:bg-indigo-50/50 cursor-pointer"
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