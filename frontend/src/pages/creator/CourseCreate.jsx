import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router';
import Sidebar from '@/components/layouts/Sidebar';
import CreatorFooter from '@/components/layouts/CreatorFooter';
import { toast } from 'sonner';
import courseService from '@/services/courseService';

// Import newly extracted modular sub-components
import CourseGeneralInfo from './components/CourseGeneralInfo';
import CourseCurriculum from './components/CourseCurriculum';

// Unified mock database matching CourseManagement courses list
const mockCoursesDb = {
  'c-1': {
    title: 'Lập trình Spring Boot nâng cao',
    description: 'Khóa học Java Spring Boot nâng cao tập trung vào thiết kế hệ thống, tối ưu hóa database, và bảo mật phân quyền OAuth2/JWT.',
    modules: [
      {
        id: 'mod-1',
        title: 'Giới thiệu về lập trình Java nâng cao',
        priority: 'MEDIUM',
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
        lessons: [
          { id: 'les-1', title: 'Kiến thức nền tảng', content_type: 'TOPIC_HEADER' },
          { id: 'les-2', title: '1.1 Tổng quan về cấu trúc Spring Framework', content_type: 'VIDEO', content_url: 'https://youtube.com/...' },
          { id: 'les-3', title: '1.2 Các annotation phổ biến (@Component, @Service)', content_type: 'ARTICLE', content_url: 'https://drive.google.com/...' }
        ]
      }
    ]
  },
  'c-2': {
    title: 'Cấu trúc dữ liệu và Giải thuật',
    description: 'Lộ trình nghiên cứu các cấu trúc dữ liệu cơ bản và giải thuật tìm kiếm, sắp xếp tối ưu cho lập trình viên.',
    modules: [
      {
        id: 'mod-1',
        title: 'Các cấu trúc dữ liệu tuyến tính',
        priority: 'HIGH',
        days: 10,
        baseExp: 150,
        speedBonusExp: 30,
        sortOrder: 1,
        assignment: {
          title: 'Bài tập cài đặt Stack và Queue',
          description: 'Triển khai danh sách liên kết kép để xây dựng hàng đợi...',
          rubricCriteria: [
            { criterion: 'Khả năng chạy thử đúng testcase', maxPoint: 10 }
          ]
        },
        lessons: [
          { id: 'les-1', title: 'Danh sách liên kết', content_type: 'TOPIC_HEADER' },
          { id: 'les-2', title: '1.1 Danh sách liên kết đơn và kép', content_type: 'VIDEO', content_url: 'https://youtube.com/...' }
        ]
      }
    ]
  },
  'c-3': {
    title: 'JS Base: Lập trình cơ bản',
    description: 'Nhập môn lập trình Javascript cho người mới bắt đầu.',
    modules: [
      {
        id: 'mod-1',
        title: 'Cú pháp Javascript cơ bản',
        priority: 'LOW',
        days: 5,
        baseExp: 50,
        speedBonusExp: 10,
        sortOrder: 1,
        assignment: {
          title: 'Bài tập biến và hàm',
          description: 'Viết các chương trình tính toán số học cơ bản...',
          rubricCriteria: [
            { criterion: 'Đúng logic đầu ra', maxPoint: 5 }
          ]
        },
        lessons: [
          { id: 'les-1', title: 'Khai báo biến', content_type: 'TOPIC_HEADER' },
          { id: 'les-2', title: '1.1 Sử dụng let, const và var', content_type: 'VIDEO', content_url: 'https://youtube.com/...' }
        ]
      }
    ]
  },
  'c-4': {
    title: 'NextJS - Fullstack Mastery',
    description: 'Trở thành fullstack developer với Next.js App Router.',
    modules: []
  },
  'c-5': {
    title: 'Python cho Khoa học dữ liệu',
    description: 'Sử dụng Python, Pandas, Numpy để phân tích dữ liệu lớn.',
    modules: []
  },
  'c-6': {
    title: 'UI/UX Design Fundamentals',
    description: 'Các nguyên lý thiết kế trải nghiệm người dùng cơ bản.',
    modules: []
  },
  'c-7': {
    title: 'Lập trình C cơ bản (Khóa học cũ)',
    description: 'Khóa học C cơ bản đã lỗi thời được chuyển vào kho lưu trữ.',
    modules: []
  }
};

export default function CreateCourse({ mode: propMode }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Resolve current mode (from prop or URL query/params)
  let resolvedMode = propMode;
  if (!resolvedMode) {
    if (location.pathname.includes('/edit')) {
      resolvedMode = 'EDIT';
    } else if (location.pathname.includes('/view')) {
      resolvedMode = 'VIEW';
    } else {
      resolvedMode = 'CREATE';
    }
  }

  // 1. Course overview state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  // 2. Modules and lessons state
  const [modules, setModules] = useState([
    {
      id: 'mod-1',
      title: 'Giới thiệu về lập trình Java nâng cao',
      priority: 'MEDIUM',
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
      lessons: [
        { id: 'les-1', title: 'Kiến thức nền tảng', content_type: 'TOPIC_HEADER' },
        { id: 'les-2', title: '1.1 Tổng quan về cấu trúc Spring Framework', content_type: 'VIDEO', content_url: 'https://youtube.com/...' },
        { id: 'les-3', title: '1.2 Các annotation phổ biến (@Component, @Service)', content_type: 'ARTICLE', content_url: 'https://drive.google.com/...' }
      ]
    }
  ]);

  // Load course details from mock database if in EDIT or VIEW mode
  useEffect(() => {
    if ((resolvedMode === 'EDIT' || resolvedMode === 'VIEW') && id && mockCoursesDb[id]) {
      const courseData = mockCoursesDb[id];
      setFormData({
        title: courseData.title || '',
        description: courseData.description || '',
      });
      if (courseData.modules && courseData.modules.length > 0) {
        setModules(courseData.modules);
      } else {
        setModules([]);
      }
    }
  }, [id, resolvedMode]);

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
      navigate('/creator/courses');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi tạo khóa học!");
    }
  };

  const handleUpdateCourse = () => {
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tên khóa học!");
      return;
    }
    toast.success(`Đã cập nhật khóa học "${formData.title}" thành công!`);
    navigate('/creator/courses');
  };

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
              content_type: activeConfig.type,
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
        const updatedLessons = filteredLessons.map((l, index) => ({
          ...l,
          sortOrder: index + 1
        }));
        return { ...mod, lessons: updatedLessons };
      }
      return mod;
    });
    setModules(updated);
  };

  const handleDragEnd = (result) => {
    if (resolvedMode === 'VIEW') return;
    const { source, destination, type } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === 'MODULE') {
      const reorderedModules = Array.from(modules);
      const [removedModule] = reorderedModules.splice(source.index, 1);
      reorderedModules.splice(destination.index, 0, removedModule);

      const updatedModules = reorderedModules.map((mod, index) => ({
        ...mod,
        sortOrder: index + 1
      }));
      setModules(updatedModules);
      return;
    }

    if (type === 'LESSON') {
      const sourceModuleId = source.droppableId;
      const destModuleId = destination.droppableId;

      if (sourceModuleId === destModuleId) {
        const updated = modules.map(mod => {
          if (mod.id === sourceModuleId) {
            const reorderedLessons = Array.from(mod.lessons);
            const [removedLesson] = reorderedLessons.splice(source.index, 1);
            reorderedLessons.splice(destination.index, 0, removedLesson);

            const updatedLessons = reorderedLessons.map((l, index) => ({
              ...l,
              sortOrder: index + 1
            }));
            return { ...mod, lessons: updatedLessons };
          }
          return mod;
        });
        setModules(updated);
      } else {
        const sourceModule = modules.find(m => m.id === sourceModuleId);
        const destModule = modules.find(m => m.id === destModuleId);

        if (!sourceModule || !destModule) return;

        const sourceLessons = Array.from(sourceModule.lessons);
        const [movedLesson] = sourceLessons.splice(source.index, 1);

        if (!movedLesson) return;

        const updatedSourceLessons = sourceLessons.map((l, index) => ({
          ...l,
          sortOrder: index + 1
        }));

        const destLessons = Array.from(destModule.lessons);
        destLessons.splice(destination.index, 0, movedLesson);

        const updatedDestLessons = destLessons.map((l, index) => ({
          ...l,
          sortOrder: index + 1
        }));

        const updatedModules = modules.map(mod => {
          if (mod.id === sourceModuleId) {
            return { ...mod, lessons: updatedSourceLessons };
          }
          if (mod.id === destModuleId) {
            return { ...mod, lessons: updatedDestLessons };
          }
          return mod;
        });
        setModules(updatedModules);
      }
    }
  };

  // Breadcrumb and Header strings based on operational mode
  const breadcrumbText = resolvedMode === 'CREATE' ? 'Tạo khóa học mới' : resolvedMode === 'EDIT' ? 'Chỉnh sửa khóa học' : 'Chi tiết khóa học';
  const headerTitleText = resolvedMode === 'CREATE' ? 'Tạo Khóa Học Mới' : resolvedMode === 'EDIT' ? 'Chỉnh Sửa Khóa Học' : 'Chi Tiết Khóa Học (Xem)';
  const headerDescText = resolvedMode === 'CREATE' 
    ? 'Thiết kế lộ trình học cặp đôi động đồng bộ theo mô hình tuần tự.' 
    : resolvedMode === 'EDIT' 
      ? 'Chỉnh sửa cấu trúc lộ trình bài học và tiêu chí rubric chấm chéo.' 
      : 'Thông tin học liệu lý thuyết và bài tập tự luận của khóa học.';

  return (
    <div className="bg-bg-base text-neutral-dark min-h-screen font-sans antialiased">
      <div className="flex min-h-screen">
        <Sidebar />

        {/* MAIN STUDIO BUILDER */}
        <main className="flex-1 p-8 bg-bg-base overflow-y-auto">
          <div className="max-w-5xl mx-auto">

            {/* Breadcrumb Navigation */}
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-gray-500">
              <Link to="/creator/courses" className="hover:text-primary transition-colors">Quản lý khóa học</Link>
              <span>/</span>
              <span className="text-primary font-bold">{breadcrumbText}</span>
            </div>

            {/* Header Action Section */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-dark">{headerTitleText}</h1>
                <p className="text-sm text-neutral-medium mt-1">{headerDescText}</p>
              </div>
              <div className="flex gap-4">
                {resolvedMode === 'VIEW' ? (
                  <Link
                    to="/creator/courses"
                    className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-95 transition-all shadow-sm flex items-center gap-1.5 animate-in fade-in"
                  >
                    Quay lại danh sách
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => toast.info("Đã lưu bản nháp thành công!")}
                      className="px-5 py-2.5 border border-primary text-primary rounded-xl text-sm font-semibold hover:bg-bg-card transition-colors cursor-pointer"
                    >
                      Lưu bản nháp
                    </button>
                    {resolvedMode === 'EDIT' ? (
                      <button
                        onClick={handleUpdateCourse}
                        className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-sm hover:opacity-95 transition-all active:scale-95 cursor-pointer"
                      >
                        Cập nhật Khóa Học
                      </button>
                    ) : (
                      <button
                        onClick={handleCreateCourse}
                        className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-sm hover:opacity-95 transition-all active:scale-95 cursor-pointer"
                      >
                        Tạo Khóa Học
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {/* Refactored General Info Component */}
              <CourseGeneralInfo
                formData={formData}
                setFormData={setFormData}
                mode={resolvedMode}
              />

              {/* Refactored Curriculum Component */}
              <CourseCurriculum
                modules={modules}
                setModules={setModules}
                mode={resolvedMode}
                activeConfig={activeConfig}
                setActiveConfig={setActiveConfig}
                inlineData={inlineData}
                setInlineData={setInlineData}
                handlePriorityChange={handlePriorityChange}
                handleAddModule={handleAddModule}
                handleSaveInlineLesson={handleSaveInlineLesson}
                handleDeleteLesson={handleDeleteLesson}
                handleDragEnd={handleDragEnd}
              />
            </div>

            {/* FOOTER NAVIGATION */}
            <CreatorFooter onBack={() => navigate(-1)} />

          </div>
        </main>
      </div>
    </div>
  );
}