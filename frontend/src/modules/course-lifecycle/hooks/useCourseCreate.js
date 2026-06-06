import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import courseService from "@/services/courseService";

// Helper function to build course payload to avoid duplicate mapping logic
const buildCoursePayload = (formData, modules, status) => {
    return {
        title: formData.title,
        description: formData.description,
        status: status,
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
};

export default function useCourseCreate(propMode) {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Resolve current mode
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

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'PENDING'
    });

    const [modules, setModules] = useState([]);
    const [activeConfig, setActiveConfig] = useState(null);
    const [inlineData, setInlineData] = useState({ title: '', url: '' });

    // Load course details
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
            const payload = buildCoursePayload(formData, modules, 'PENDING');
            console.log("Create Course Payload:", JSON.stringify(payload, null, 2));

            await courseService.createCourse(payload);
            toast.success("Tạo khóa học thành công!");
            navigate('/creator/courses');
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Đã xảy ra lỗi khi tạo khóa học!");
        }
    };

    const handleSaveCourse = async () => {
        if (!formData.title.trim()) {
            toast.error("Vui lòng nhập tên khóa học!");
            return;
        }
        try {
            const payload = buildCoursePayload(formData, modules, 'DRAFT');
            console.log("Save Course Payload:", JSON.stringify(payload, null, 2));

            await courseService.createCourse(payload);
            toast.success("Lưu bản nháp khóa học thành công!");
            navigate('/creator/courses');
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Đã xảy ra lỗi khi lưu bản nháp khóa học!");
        }
    };

    const handleUpdateCourse = async () => {
        if (!formData.title.trim()) {
            toast.error("Vui lòng nhập tên khóa học!");
            return;
        }

        try {
            const payload = buildCoursePayload(formData, modules, formData.status || 'DRAFT');
            console.log("Update Course Payload:", JSON.stringify(payload, null, 2));

            await courseService.updateCourse(id, payload);
            toast.success("Cập nhật khóa học thành công!");
            navigate('/creator/courses');
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Đã xảy ra lỗi khi cập nhật khóa học!");
        }
    };

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

    return {
        id,
        resolvedMode,
        formData,
        setFormData,
        modules,
        setModules,
        activeConfig,
        setActiveConfig,
        inlineData,
        setInlineData,
        handleCreateCourse,
        handleSaveCourse,
        handleUpdateCourse,
        handlePriorityChange,
        handleAddModule,
        handleSaveInlineLesson,
        handleDeleteLesson,
        handleDragEnd,
        breadcrumbText,
        headerTitleText,
        headerDescText,
        navigate
    };
}
