import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router';
import Sidebar from '@/components/layouts/Sidebar';
import CreatorFooter from '@/components/layouts/CreatorFooter';
import { toast } from 'sonner';
import courseService from '@/services/courseService';

// Import newly extracted modular sub-components
import CourseGeneralInfo from './components/CourseGeneralInfo';
import CourseCurriculum from './components/CourseCurriculum';

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
    status: 'PENDING'
  });

  // 2. Modules and lessons state
  const [modules, setModules] = useState([]);

  // Load course details from API if in EDIT or VIEW mode
  useEffect(() => {
    const loadCourseDetails = async () => {
      if ((resolvedMode === 'EDIT' || resolvedMode === 'VIEW') && id) {
        try {
          const courseData = await courseService.getCourseById(id);
          setFormData({
            title: courseData.title || '',
            description: courseData.description || '',
            status: courseData.status || 'DRAFT'
          });

          if (courseData.modules && courseData.modules.length > 0) {
            const mappedModules = courseData.modules.map(mod => ({
              id: mod.id?.toString() || `mod-${Date.now()}-${Math.random()}`,
              title: mod.title,
              priority: mod.priority || 'LOW',
              days: mod.days || 7,
              baseExp: mod.baseExp || 50,
              speedBonusExp: mod.speedBonusExp || 10,
              sortOrder: mod.sortOrder,
              assignments: mod.assignments ? {
                id: mod.assignments.id,
                title: mod.assignments.title || '',
                description: mod.assignments.description || '',
                rubricCriteria: mod.assignments.rubricCriteria || []
              } : { title: '', description: '', rubricCriteria: [] },
              lessons: (mod.lessons || []).map(lesson => ({
                id: lesson.id?.toString() || `les-${Date.now()}-${Math.random()}`,
                title: lesson.title,
                content_type: lesson.contentType,
                content_url: lesson.contentUrl,
                sortOrder: lesson.sortOrder
              }))
            }));
            setModules(mappedModules);
          } else {
            setModules([]);
          }
        } catch (error) {
          console.error('Error loading course details:', error);
          toast.error('Lỗi khi tải chi tiết khóa học!');
        }
      } else {
        setModules([]);
      }
    };

    loadCourseDetails();
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
        status: 'PENDING',
        modules: modules.map((mod, modIdx) => ({
          title: mod.title,
          priority: mod.priority,
          days: mod.days,
          baseExp: mod.baseExp,
          speedBonusExp: mod.speedBonusExp,
          sortOrder: modIdx + 1,
          assignments: (mod.assignments && mod.assignments.title?.trim()) ? {
            title: mod.assignments.title,
            description: mod.assignments.description,
            rubricCriteria: mod.assignments.rubricCriteria
          } : null,
          lessons: (mod.lessons || []).map((les, lesIdx) => ({
            title: les.title,
            contentType: les.content_type,
            contentUrl: les.content_type === 'TEXT' ? 'N/A' : (les.content_url || 'N/A'),
            sortOrder: lesIdx + 1
          }))
        }))
      };

      console.log("Create Course Payload:", JSON.stringify(payload, null, 2));

      await courseService.createCourse(payload);
      toast.success("Tạo khóa học thành công!");
      navigate('/creator/courses');
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Đã xảy ra lỗi khi tạo khóa học!");
    }
  };

  const handleUpdateCourse = async () => {
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tên khóa học!");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status || 'DRAFT',
        modules: modules.map((mod, modIdx) => ({
          title: mod.title,
          priority: mod.priority,
          days: mod.days,
          baseExp: mod.baseExp,
          speedBonusExp: mod.speedBonusExp,
          sortOrder: modIdx + 1,
          assignments: (mod.assignments && mod.assignments.title?.trim()) ? {
            title: mod.assignments.title,
            description: mod.assignments.description,
            rubricCriteria: mod.assignments.rubricCriteria
          } : null,
          lessons: (mod.lessons || []).map((les, lesIdx) => ({
            title: les.title,
            contentType: les.content_type,
            contentUrl: les.content_type === 'TEXT' ? 'N/A' : (les.content_url || 'N/A'),
            sortOrder: lesIdx + 1
          }))
        }))
      };

      console.log("Update Course Payload:", JSON.stringify(payload, null, 2));

      await courseService.updateCourse(id, payload);
      toast.success("Cập nhật khóa học thành công!");
      navigate('/creator/courses');
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Đã xảy ra lỗi khi cập nhật khóa học!");
    }
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
      assignments: { title: 'Bài tập thực hành tổng kết tuần', description: '', rubricCriteria: [] },
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