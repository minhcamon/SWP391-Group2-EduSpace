import React from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import ModuleCard from './ModuleCard';

export default function CourseCurriculum({
  modules,
  setModules,
  mode,
  activeConfig,
  setActiveConfig,
  inlineData,
  setInlineData,
  handlePriorityChange,
  handleAddModule,
  handleDeleteModule,
  handleSaveInlineLesson,
  handleDeleteLesson,
  handleDragEnd
}) {
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.02)] border border-border-light/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-neutral-dark">Cấu trúc chương trình học</h3>
            <p className="text-xs text-neutral-medium mt-0.5">Sắp xếp khung bài học lý thuyết và bài tập thực hành theo tuần.</p>
          </div>
          {mode !== 'VIEW' && (
            <button onClick={handleAddModule} className="flex items-center gap-1.5 bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all cursor-pointer">
              <Plus size={14} /> Thêm tuần học mới
            </button>
          )}
        </div>

        {/* DRAGGABLE TẦNG 1: QUẢN LÝ DANH SÁCH CÁC MODULE TUẦN */}
        <Droppable droppableId="all-modules-root" type="MODULE">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-6">
              {modules.length === 0 ? (
                <div className="py-10 text-center text-gray-400 font-medium italic border border-dashed border-gray-200 rounded-2xl">
                  Chưa có module nào trong chương trình học.
                </div>
              ) : (
                modules.map((mod, index) => (
                  <ModuleCard
                    key={mod.id}
                    mod={mod}
                    index={index}
                    modules={modules}
                    setModules={setModules}
                    mode={mode}
                    activeConfig={activeConfig}
                    setActiveConfig={setActiveConfig}
                    inlineData={inlineData}
                    setInlineData={setInlineData}
                    handlePriorityChange={handlePriorityChange}
                    handleDeleteModule={handleDeleteModule}
                    handleSaveInlineLesson={handleSaveInlineLesson}
                    handleDeleteLesson={handleDeleteLesson}
                  />
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}
