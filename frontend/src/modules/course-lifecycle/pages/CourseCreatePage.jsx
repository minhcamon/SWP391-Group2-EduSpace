import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import CreatorFooter from '@/components/layouts/CreatorFooter';
import CourseGeneralInfo from '../components/course-edit/CourseGeneralInfo';
import CourseCurriculum from '../components/course-edit/CourseCurriculum';
import CourseSubmitModal from '../components/course-edit/CourseSubmitModal';
import useCourseCreate from '../hooks/useCourseCreate';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import creatorService from '@/services/creatorService';
import { toast } from 'sonner';
import { Play, CheckCircle, Calendar, Users } from 'lucide-react';

export default function CreateCourse({ mode: propMode }) {
  const { id } = useParams();
  const {
    resolvedMode,
    formData,
    setFormData,
    modules,
    setModules,
    activeConfig,
    setActiveConfig,
    inlineData,
    setInlineData,
    handleSaveCourse,
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
  } = useCourseCreate(propMode);

  const [classesTimeline, setClassesTimeline] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [loadingTimeline, setLoadingTimeline] = useState(false);
  const [rematchingModuleId, setRematchingModuleId] = useState(null);

  const fetchTimelines = async () => {
    if (resolvedMode === 'VIEW' && id) {
      setLoadingTimeline(true);
      try {
        const data = await creatorService.getClassesTimeline(id);
        setClassesTimeline(data || []);
        if (data && data.length > 0) {
          setSelectedClassId(prevId => {
            if (prevId && data.some(c => c.classId === prevId)) {
              return prevId;
            }
            return data[0].classId;
          });
        }
      } catch (err) {
        console.error("Error fetching timelines:", err);
      } finally {
        setLoadingTimeline(false);
      }
    }
  };

  useEffect(() => {
    fetchTimelines();
  }, [resolvedMode, id]);

  const handleStartModule = async (classId, moduleId) => {
    setRematchingModuleId(moduleId);
    try {
      await creatorService.rematchGroup(classId, moduleId);
      toast.success("Ghép nhóm học viên cho module thành công!");
    } catch (err) {
      toast.error(err.message || "Lỗi khi kích hoạt module");
    } finally {
      setRematchingModuleId(null);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'RUNNING': 'Đang chạy',
      'UPCOMING': 'Sắp khai giảng',
      'COMPLETED': 'Đã hoàn thành',
      'CANCELLED': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "Quản lý khóa học", to: "/creator/courses" },
          { label: breadcrumbText }
        ]}
        className="text-gray-500"
      />

      {/* Header Action Section */}
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <CardHeader className="p-0 flex-1">
            <CardTitle className="text-2xl font-bold text-secondary">
              {headerTitleText}
            </CardTitle>
            <CardDescription className="text-sm text-neutral-medium mt-1">
              {headerDescText}
            </CardDescription>
          </CardHeader>
          <div className="flex gap-4 shrink-0">
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
                  onClick={() => handleSaveCourse()}
                  className="px-5 py-2.5 border border-primary text-primary rounded-xl text-sm font-semibold hover:bg-bg-card transition-colors cursor-pointer"
                >
                  Lưu bản nháp
                </button>
                {resolvedMode === 'EDIT' ? (
                  <button
                    onClick={handleOpenConfirmModal}
                    className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-sm hover:opacity-95 transition-all active:scale-95 cursor-pointer"
                  >
                    Cập nhật Khóa Học
                  </button>
                ) : (
                  <button
                    onClick={handleOpenConfirmModal}
                    className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-sm hover:opacity-95 transition-all active:scale-95 cursor-pointer"
                  >
                    Tạo Khóa Học
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </Card>

      {resolvedMode === 'VIEW' && (
        <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl animate-in fade-in duration-300">
          <CardHeader className="p-0 pb-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-neutral-dark flex items-center gap-2.5">
                <Users className="text-primary text-2xl shrink-0" /> Quản lý Lịch trình Lớp học & Kích hoạt Module
              </CardTitle>
              <CardDescription className="text-sm text-neutral-medium">
                Theo dõi thời hạn các module và kích hoạt chia nhóm (ghép cặp học tập) cho từng lớp học.
              </CardDescription>
            </div>
            {classesTimeline.length > 0 && (
              <div className="flex items-center gap-3 bg-neutral-light/20 p-1.5 rounded-2xl border border-gray-100">
                <span className="text-sm font-semibold text-neutral-medium pl-2.5">Chọn lớp học:</span>
                <select
                  value={selectedClassId || ''}
                  onChange={(e) => setSelectedClassId(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white cursor-pointer hover:border-gray-300 transition-colors"
                >
                  {classesTimeline.map((c) => (
                    <option key={c.classId} value={c.classId}>
                      {c.className} ({getStatusLabel(c.classStatus)})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-0 pt-5">
            {loadingTimeline ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-primary"></div>
              </div>
            ) : classesTimeline.length === 0 ? (
              <div className="text-center py-12 text-neutral-medium text-sm font-medium">
                Khóa học này hiện chưa có lớp học nào đang hoạt động.
              </div>
            ) : (
              (() => {
                const activeClass = classesTimeline.find(c => c.classId === selectedClassId);
                if (!activeClass) return null;

                return (
                  <div className="overflow-hidden border border-gray-100 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-light/30 border-b border-gray-100 text-neutral-medium text-xs uppercase font-bold tracking-wider font-sans">
                          <th className="py-4 px-6 text-center w-[12%]">Thứ tự</th>
                          <th className="py-4 px-6 w-[45%]">Tên Module</th>
                          <th className="py-4 px-6 w-[28%] font-sans">Hạn nộp bài (Timeline)</th>
                          <th className="py-4 px-6 w-[15%] text-center font-bold">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {activeClass.timeline.map((item, index) => {
                          const dateObj = new Date(item.dueDate);
                          const pad = (n) => n.toString().padStart(2, '0');
                          const formattedDate = `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())} - ${pad(dateObj.getDate())}/${pad(dateObj.getMonth() + 1)}/${dateObj.getFullYear()}`;

                          return (
                            <tr key={item.moduleId} className="hover:bg-neutral-light/10 transition-colors text-sm font-sans">
                              <td className="py-4 px-6 text-center font-bold text-neutral-medium bg-neutral-light/5">
                                #{index + 1}
                              </td>
                              <td className="py-4 px-6 font-semibold text-neutral-dark">
                                {item.moduleTitle}
                              </td>
                              <td className="py-4 px-6 text-neutral-medium">
                                <div className="flex items-center gap-2">
                                  <Calendar className="text-neutral-medium text-base shrink-0" />
                                  <span className="font-semibold text-neutral-medium">{formattedDate}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <button
                                  onClick={() => handleStartModule(activeClass.classId, item.moduleId)}
                                  disabled={rematchingModuleId !== null}
                                  className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all inline-flex items-center justify-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                                >
                                  {rematchingModuleId === item.moduleId ? (
                                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Play className="text-[10px] fill-current" />
                                  )}
                                  Kích hoạt
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()
            )}
          </CardContent>
        </Card>
      )}

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
 
             {/* Confirmation Submit Modal */}
             <CourseSubmitModal
               isOpen={isConfirmModalOpen}
               onClose={() => setIsConfirmModalOpen(false)}
               onSubmit={handleConfirmSubmit}
               mode={resolvedMode}
             />
     </div>
   );
}