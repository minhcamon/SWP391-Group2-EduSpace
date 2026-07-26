import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import courseService from "@/services/courseService";

// Helper function to build course payload to avoid duplicate mapping logic
const buildCoursePayload = (formData, modules, status) => {
    const parseDbId = (id) => {
        return typeof id === 'number' ? id : null;
    };

    return {
        title: formData.title,
        description: formData.description,
        status: status,
        modules: modules.map((mod, modIdx) => {
            const moduleId = parseDbId(mod.id);
            const assignmentId = typeof mod.assignment?.id === 'number' ? mod.assignment.id : null;
            const assignmentPayload = (mod.assignment && mod.assignment.title?.trim()) ? {
                id: assignmentId,
                title: mod.assignment.title,
                description: mod.assignment.description,
                rubricCriteria: mod.assignment.rubricCriteria
            } : null;

            return {
                id: moduleId,
                title: mod.title,
                priority: mod.priority,
                days: mod.days,
                baseExp: mod.baseExp,
                speedBonusExp: mod.speedBonusExp,
                sortOrder: modIdx + 1,
                assignment: assignmentPayload,
                lessons: (mod.lessons || []).map((les, lesIdx) => ({
                    id: parseDbId(les.id),
                    title: les.title,
                    contentType: les.content_type,
                    contentUrl: les.content_type === 'TEXT' ? 'N/A' : (les.content_url || 'N/A'),
                    sortOrder: lesIdx + 1
                }))
            };
        })
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
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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
                            id: mod.id || `mod-${Date.now()}-${Math.random()}`,
                            title: mod.title,
                            priority: mod.priority || 'LOW',
                            days: mod.days || 7,
                            baseExp: mod.baseExp || 50,
                            speedBonusExp: mod.speedBonusExp || 10,
                            sortOrder: mod.sortOrder,
                            assignment: mod.assignment ? {
                                id: mod.assignment.id,
                                title: mod.assignment.title || '',
                                description: mod.assignment.description || '',
                                rubricCriteria: mod.assignment.rubricCriteria || []
                            } : { title: '', description: '', rubricCriteria: [] },
                            lessons: (mod.lessons || []).map(lesson => ({
                                id: lesson.id || `les-${Date.now()}-${Math.random()}`,
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

            if (resolvedMode === 'EDIT') {
                await courseService.updateCourse(id, payload);
                toast.success("Cập nhật bản nháp khóa học thành công!");
            } else {
                await courseService.createCourse(payload);
                toast.success("Lưu bản nháp khóa học thành công!");
            }
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

    const handleOpenConfirmModal = () => {
        if (!formData.title.trim()) {
            toast.error("Vui lòng nhập tên khóa học!");
            return;
        }
        setIsConfirmModalOpen(true);
    };

    const handleConfirmSubmit = async (status) => {
        try {
            const payload = buildCoursePayload(formData, modules, status);
            console.log(`${resolvedMode} Course Payload (${status}):`, JSON.stringify(payload, null, 2));

            if (resolvedMode === 'EDIT') {
                await courseService.updateCourse(id, payload);
                toast.success(status === 'PENDING' ? "Cập nhật và gửi duyệt khóa học thành công!" : "Cập nhật bản nháp khóa học thành công!");
            } else {
                await courseService.createCourse(payload);
                toast.success(status === 'PENDING' ? "Tạo và gửi duyệt khóa học thành công!" : "Lưu bản nháp khóa học thành công!");
            }
            setIsConfirmModalOpen(false);
            navigate('/creator/courses');
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Đã xảy ra lỗi khi xử lý khóa học!");
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
            assignment: { title: 'Bài tập thực hành tổng kết tuần', description: '', rubricCriteria: [] },
            lessons: [],
            sortOrder: modules.length + 1,
        }]);
    };

    const handleSaveInlineLesson = (moduleId) => {
        if (!inlineData.title || !inlineData.title.trim()) {
            toast.error("Vui lòng nhập tiêu đề bài học!");
            return;
        }

        const isText = activeConfig?.type === 'TEXT';
        if (!isText && (!inlineData.url || !inlineData.url.trim())) {
            toast.error("Vui lòng dán URL video/tài liệu hoặc tải tệp lên!");
            return;
        }

        setModules(modules.map(mod => {
            if (mod.id.toString() === moduleId.toString()) {
                return {
                    ...mod,
                    lessons: [
                        ...mod.lessons,
                        {
                            id: `les-${Date.now()}`,
                            title: inlineData.title.trim(),
                            content_type: activeConfig.type,
                            content_url: isText ? 'N/A' : inlineData.url.trim(),
                            sortOrder: mod.lessons.length + 1
                        }
                    ]
                };
            }
            return mod;
        }));

        toast.success("Thêm bài học mới thành công!");
        setInlineData({ title: '', url: '' });
        setActiveConfig(null);
    };

    const handleDeleteLesson = (moduleId, lessonId) => {
        const updated = modules.map(mod => {
            if (mod.id.toString() === moduleId.toString()) {
                const filteredLessons = mod.lessons.filter(l => l.id.toString() !== lessonId.toString());
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
                    if (mod.id.toString() === sourceModuleId.toString()) {
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
                const sourceModule = modules.find(m => m.id.toString() === sourceModuleId.toString());
                const destModule = modules.find(m => m.id.toString() === destModuleId.toString());

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
                    if (mod.id.toString() === sourceModuleId.toString()) {
                        return { ...mod, lessons: updatedSourceLessons };
                    }
                    if (mod.id.toString() === destModuleId.toString()) {
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
        handleOpenConfirmModal,
        handleConfirmSubmit,
        isConfirmModalOpen,
        setIsConfirmModalOpen,
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
