import { useState, useEffect } from "react";
import { toast } from "sonner";
import courseService from "@/services/courseService";

export default function useCourseManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('ALL');
    const [courses, setCourses] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteCourseId, setDeleteCourseId] = useState(null);
    const [deleteCourseTitle, setDeleteCourseTitle] = useState(null);

    const fetchCourses = async () => {
        try {
            const courseData = await courseService.getCourseByCreator();
            setCourses(courseData || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Lỗi khi tải danh sách khóa học!');
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Format creation dates into localized date strings
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Vừa xong';
        try {
            return new Date(dateStr).toLocaleDateString("vi-VN");
        } catch (e) {
            return dateStr;
        }
    };

    const handleDelete = (id, title) => {
        setDeleteCourseId(id);
        setDeleteCourseTitle(title);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteCourseId) return;
        try {
            await courseService.deleteCourse(deleteCourseId);
            setCourses(prev => prev.filter(c => c.id !== deleteCourseId));
            toast.success(`Đã xóa vĩnh viễn khóa học: ${deleteCourseTitle}`);
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Lỗi khi xóa khóa học!');
        } finally {
            setIsDeleteModalOpen(false);
            setDeleteCourseId(null);
            setDeleteCourseTitle(null);
        }
    };

    const handleArchive = async (id, title) => {
        try {
            const fullCourse = await courseService.getCourseById(id);
            
            const mappedModules = (fullCourse.modules || []).map(mod => ({
                title: mod.title,
                priority: mod.priority || 'LOW',
                days: mod.days || 7,
                baseExp: mod.baseExp || 50,
                speedBonusExp: mod.speedBonusExp || 10,
                sortOrder: mod.sortOrder,
                assignments: (mod.assignments && mod.assignments.title?.trim()) ? {
                    title: mod.assignments.title,
                    description: mod.assignments.description,
                    rubricCriteria: mod.assignments.rubricCriteria
                } : null,
                lessons: (mod.lessons || []).map(les => ({
                    title: les.title,
                    contentType: les.contentType,
                    contentUrl: les.contentUrl || 'N/A',
                    sortOrder: les.sortOrder
                }))
            }));

            const payload = {
                title: fullCourse.title,
                description: fullCourse.description,
                status: 'ARCHIVED',
                modules: mappedModules
            };

            await courseService.updateCourse(id, payload);
            setCourses(prev => prev.map(c => c.id === id ? { ...c, status: 'ARCHIVED' } : c));
            toast.success(`Đã chuyển khóa học vào Kho lưu trữ: ${title}`);
        } catch (error) {
            console.error('Archive course error:', error);
            toast.error(error.message || 'Lỗi khi lưu trữ khóa học!');
        }
    };

    const handleRestore = async (id, title) => {
        try {
            const fullCourse = await courseService.getCourseById(id);
            
            const mappedModules = (fullCourse.modules || []).map(mod => ({
                title: mod.title,
                priority: mod.priority || 'LOW',
                days: mod.days || 7,
                baseExp: mod.baseExp || 50,
                speedBonusExp: mod.speedBonusExp || 10,
                sortOrder: mod.sortOrder,
                assignments: (mod.assignments && mod.assignments.title?.trim()) ? {
                    title: mod.assignments.title,
                    description: mod.assignments.description,
                    rubricCriteria: mod.assignments.rubricCriteria
                } : null,
                lessons: (mod.lessons || []).map(les => ({
                    title: les.title,
                    contentType: les.contentType,
                    contentUrl: les.contentUrl || 'N/A',
                    sortOrder: les.sortOrder
                }))
            }));

            const payload = {
                title: fullCourse.title,
                description: fullCourse.description,
                status: 'DRAFT',
                modules: mappedModules
            };

            await courseService.updateCourse(id, payload);
            setCourses(prev => prev.map(c => c.id === id ? { ...c, status: 'DRAFT' } : c));
            toast.success(`Đã khôi phục khóa học thành bản nháp: ${title}`);
        } catch (error) {
            console.error('Restore course error:', error);
            toast.error(error.message || 'Lỗi khi khôi phục khóa học!');
        }
    };

    const handleFixAlert = (title) => {
        toast.error(`Đang mở giao diện sửa lỗi khóa học: ${title}`);
    };

    const handleViewDetails = (title) => {
        toast.info(`Đang tải chi tiết cho: ${title}`);
    };

    const handleManageClass = (title) => {
        toast.success(`Đang mở bảng quản lý học viên khóa học: ${title}`);
    };

    // Filter computation
    const filteredCourses = courses.filter(course => {
        const matchesSearch = 
            (course.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (course.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        if (activeTab === 'ALL') return matchesSearch;
        const status = course.status?.toUpperCase();
        const mappedStatus = status === 'PUBLISHED' ? 'ACTIVE' : status;
        return matchesSearch && mappedStatus === activeTab;
    });

    // Split courses by status categories for section rendering
    const rejectedCourses = filteredCourses.filter(c => c.status?.toUpperCase() === 'REJECTED');
    const pendingCourses = filteredCourses.filter(c => c.status?.toUpperCase() === 'PENDING');
    const activeCourses = filteredCourses.filter(c => c.status?.toUpperCase() === 'ACTIVE' || c.status?.toUpperCase() === 'PUBLISHED');
    const draftCourses = filteredCourses.filter(c => c.status?.toUpperCase() === 'DRAFT');
    const archivedCourses = filteredCourses.filter(c => c.status?.toUpperCase() === 'ARCHIVED');

    // Dynamic KPI Stats Computations
    const statsTotal = courses.length;
    const statsActiveStudents = courses.filter(c => c.status?.toUpperCase() === 'ACTIVE' || c.status?.toUpperCase() === 'PUBLISHED').reduce((sum, c) => sum + (c.enrolledCount || 0), 0);
    const statsDrafts = courses.filter(c => c.status?.toUpperCase() === 'DRAFT').length;

    return {
        courses,
        searchTerm,
        setSearchTerm,
        activeTab,
        setActiveTab,
        filteredCourses,
        rejectedCourses,
        pendingCourses,
        activeCourses,
        draftCourses,
        archivedCourses,
        statsTotal,
        statsActiveStudents,
        statsDrafts,
        formatDate,
        handleDelete,
        handleConfirmDelete,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        deleteCourseTitle,
        handleArchive,
        handleRestore,
        handleFixAlert,
        handleViewDetails,
        handleManageClass,
        fetchCourses
    };
}
