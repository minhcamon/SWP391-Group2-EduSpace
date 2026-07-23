import React from 'react';
import { Link } from 'react-router';
import CreatorFooter from '@/components/layouts/CreatorFooter';
import CourseGeneralInfo from '../components/course-edit/CourseGeneralInfo';
import CourseCurriculum from '../components/course-edit/CourseCurriculum';
import CourseSubmitModal from '../components/course-edit/CourseSubmitModal';
import useCourseCreate from '../hooks/useCourseCreate';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export default function CreateCourse({ mode: propMode }) {
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