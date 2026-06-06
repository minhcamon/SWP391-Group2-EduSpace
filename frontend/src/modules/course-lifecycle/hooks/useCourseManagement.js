import { useState, useEffect } from "react";
import { toast } from "sonner";
import courseService from "@/services/courseService";

export default function useCourseManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('ALL');
    const [courses, setCourses] = useState([]);

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
        setCourses(prev => prev.filter(c => c.id !== id));
        toast.success(`Đã xóa vĩnh viễn khóa học: ${title}`);
    };

    const handleArchive = (id, title) => {
        setCourses(prev => prev.map(c => c.id === id ? { ...c, status: 'ARCHIVED', lastUpdated: 'Lưu trữ vừa xong' } : c));
        toast.info(`Đã chuyển khóa học vào Kho lưu trữ: ${title}`);
    };

    const handleRestore = (id, title) => {
        setCourses(prev => prev.map(c => c.id === id ? { ...c, status: 'DRAFT', lastUpdated: 'Khôi phục vừa xong' } : c));
        toast.success(`Đã khôi phục khóa học thành bản nháp: ${title}`);
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
        handleArchive,
        handleRestore,
        handleFixAlert,
        handleViewDetails,
        handleManageClass,
        fetchCourses
    };
}
