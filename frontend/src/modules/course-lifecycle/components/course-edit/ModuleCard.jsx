import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { GripVertical, Sparkles, PlayCircle, FileText, FolderPlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import LessonItem from './LessonItem';
import InlineLessonForm from './InlineLessonForm';
import RubricManager from './RubricManager';

export default function ModuleCard({
  mod,
  index,
  modules,
  setModules,
  mode,
  activeConfig,
  setActiveConfig,
  inlineData,
  setInlineData,
  handlePriorityChange,
  handleSaveInlineLesson,
  handleDeleteLesson
}) {
  return (
    <Draggable key={mod.id} draggableId={`module-${mod.id}`} index={index} isDragDisabled={mode === 'VIEW'}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="outline-none"
        >
          <div
            className={`border rounded-2xl overflow-hidden bg-white ${snapshot.isDragging
              ? 'border-primary shadow-lg ring-2 ring-primary/10'
              : 'border-border-light/50 shadow-xs'
              }`}
          >
            {/* Thanh Header của Module */}
            <div className="p-4 bg-bg-card border-b border-border-light/30 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {mode !== 'VIEW' && (
                  <div {...provided.dragHandleProps} className="text-gray-400 cursor-move p-1.5 hover:text-primary transition-colors shrink-0">
                    <GripVertical size={16} />
                  </div>
                )}
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Module {index + 1}</span>
                  <input
                    className="block w-full bg-transparent border-none focus:ring-0 p-0 text-base font-bold text-neutral-dark outline-none disabled:cursor-not-allowed"
                    type="text"
                    value={mod.title}
                    onChange={(e) => setModules(modules.map(m => m.id === mod.id ? { ...m, title: e.target.value } : m))}
                    disabled={mode === 'VIEW'}
                  />
                </div>
              </div>

              <div className={`flex flex-wrap items-center gap-3 ${mode === 'VIEW' ? 'pl-0' : 'pl-8'}`}>
                <div className="flex items-center gap-1.5 bg-white border border-border-light/40 px-2 py-1 rounded-lg">
                  <span className="text-[11px] font-bold text-gray-400">Thời lượng:</span>
                  <input
                    type="number"
                    min="1"
                    className="w-10 text-center font-bold text-xs p-0 border-none focus:ring-0 text-gray-700 disabled:cursor-not-allowed"
                    value={mod.days}
                    onChange={(e) => setModules(modules.map(m => m.id === mod.id ? { ...m, days: parseInt(e.target.value) || 7 } : m))}
                    disabled={mode === 'VIEW'}
                  />
                  <span className="text-[11px] font-semibold text-gray-500">ngày</span>
                </div>

                <div className="flex items-center gap-1.5 bg-white border border-border-light/40 px-2 py-1 rounded-lg">
                  <span className="text-[11px] font-bold text-gray-400">Độ khó:</span>
                  <Select
                    value={mod.priority}
                    onValueChange={(val) => handlePriorityChange(mod.id, val)}
                    disabled={mode === 'VIEW'}
                  >
                    <SelectTrigger className="h-6 border-none bg-transparent p-0 text-xs font-bold text-gray-700 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 gap-1 select-none cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">LOW (Dễ)</SelectItem>
                      <SelectItem value="MEDIUM">MEDIUM (Vừa)</SelectItem>
                      <SelectItem value="HIGH">HIGH (Khó)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-[10px] font-bold text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                  <Sparkles size={12} /> +{mod.baseExp} Base EXP | Max Bonus: +{mod.speedBonusExp} EXP
                </div>
              </div>
            </div>

            {/* DRAGGABLE TẦNG 2: VÙNG CHỨA DANH SÁCH BÀI GIẢNG PHẲNG */}
            <Droppable droppableId={mod.id.toString()} type="LESSON">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="p-4 bg-white min-h-10 flex flex-col gap-3"
                >
                  {mod.lessons.map((lesson, lIndex) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      index={lIndex}
                      modId={mod.id}
                      mode={mode}
                      modules={modules}
                      setModules={setModules}
                      handleDeleteLesson={handleDeleteLesson}
                    />
                  ))}
                  {provided.placeholder}

                  {/* inline lesson configurations */}
                  {mode !== 'VIEW' && (
                    activeConfig?.moduleId?.toString() === mod.id?.toString() ? (
                      <InlineLessonForm
                        modId={mod.id}
                        activeConfig={activeConfig}
                        setActiveConfig={setActiveConfig}
                        inlineData={inlineData}
                        setInlineData={setInlineData}
                        handleSaveInlineLesson={handleSaveInlineLesson}
                      />
                    ) : (
                      <div className="ml-6 flex gap-3 pt-2 border-t border-border-light/20">
                        <button onClick={() => setActiveConfig({ moduleId: mod.id, type: 'VIDEO' })} className="flex-1 flex items-center justify-center gap-1.5 py-2 border-2 border-dashed border-border-light rounded-xl text-gray-400 text-xs font-bold hover:border-primary hover:text-primary transition-all cursor-pointer">
                          <PlayCircle className="text-blue-500 text-sm" size={14} /> + Thêm Video
                        </button>
                        <button onClick={() => setActiveConfig({ moduleId: mod.id, type: 'DOCUMENT' })} className="flex-1 flex items-center justify-center gap-1.5 py-2 border-2 border-dashed border-border-light rounded-xl text-gray-400 text-xs font-bold hover:border-primary hover:text-primary transition-all cursor-pointer">
                          <FileText className="text-secondary text-sm" size={14} /> + Thêm Bài Viết
                        </button>
                        <button onClick={() => setActiveConfig({ moduleId: mod.id, type: 'TEXT' })} className="flex-1 flex items-center justify-center gap-1.5 py-2 border-2 border-dashed border-border-light rounded-xl text-gray-400 text-xs font-bold hover:border-primary hover:text-primary transition-all cursor-pointer">
                          <FolderPlus className="text-primary text-sm" size={14} /> + Thêm Chủ Đề
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </Droppable>

            {/* BÀI TẬP TỰ LUẬN CUỐI MODULE CHẤM CHÉO PEER REVIEW */}
            <RubricManager
              mod={mod}
              modules={modules}
              setModules={setModules}
              mode={mode}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
}
