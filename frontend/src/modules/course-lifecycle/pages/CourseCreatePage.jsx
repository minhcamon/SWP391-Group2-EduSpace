import React from 'react';
import { Link } from 'react-router';
import CreatorFooter from '@/components/layouts/CreatorFooter';
import CourseGeneralInfo from '../components/CourseGeneralInfo';
import CourseCurriculum from '../components/CourseCurriculum';
import CourseSubmitModal from '../components/CourseSubmitModal';
import useCourseCreate from '../hooks/useCourseCreate';

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
                      onClick={() => handleSaveCourse()}
                      className="px-5 py-2.5 border border-primary text-primary rounded-xl text-sm font-semibold hover:bg-bg-card transition-colors cursor-pointer duration-200 transform hover:scale-95"
                    >
                      Lưu bản nháp
                    </button>
                    {resolvedMode === 'EDIT' ? (
                      <button
                        onClick={handleOpenConfirmModal}
                        className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-sm hover:opacity-95 transition-all active:scale-95 cursor-pointer duration-200 transform hover:scale-95"
                      >
                        Cập nhật Khóa Học
                      </button>
                    ) : (
                      <button
                        onClick={handleOpenConfirmModal}
                        className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-sm hover:opacity-95 transition-all active:scale-95 cursor-pointer duration-200 transform hover:scale-95"
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