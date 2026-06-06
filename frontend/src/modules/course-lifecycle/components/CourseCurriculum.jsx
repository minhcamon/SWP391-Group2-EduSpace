import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  GripVertical,
  PlayCircle,
  FileText,
  X,
  Plus,
  Trash2,
  FolderPlus,
  Sparkles,
  FolderLock
} from 'lucide-react';

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
                  <Draggable key={mod.id} draggableId={mod.id} index={index} isDragDisabled={mode === 'VIEW'}>
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
                                <select
                                  className="text-xs font-bold text-gray-700 p-0 border-none focus:ring-0 bg-transparent pr-6 cursor-pointer disabled:cursor-not-allowed"
                                  value={mod.priority}
                                  onChange={(e) => handlePriorityChange(mod.id, e.target.value)}
                                  disabled={mode === 'VIEW'}
                                >
                                  <option value="LOW">LOW (Dễ)</option>
                                  <option value="MEDIUM">MEDIUM (Vừa)</option>
                                  <option value="HIGH">HIGH (Khó)</option>
                                </select>
                              </div>

                              <div className="text-[10px] font-bold text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                                <Sparkles size={12} /> +{mod.baseExp} Base EXP | Max Bonus: +{mod.speedBonusExp} EXP
                              </div>
                            </div>
                          </div>

                          {/* DRAGGABLE TẦNG 2: VÙNG CHỨA DANH SÁCH BÀI GIẢNG PHẲNG */}
                          <Droppable droppableId={mod.id} type="LESSON">
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="p-4 bg-white min-h-10 flex flex-col gap-3"
                              >
                                {mod.lessons.map((lesson, lIndex) => (
                                  <Draggable key={lesson.id} draggableId={lesson.id} index={lIndex} isDragDisabled={mode === 'VIEW'}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...(mode !== 'VIEW' ? provided.dragHandleProps : {})}
                                        className="outline-none"
                                      >
                                        <div
                                          className={`${lesson.content_type === 'TEXT'
                                            ? 'ml-0 font-bold bg-bg-card/60 border-border-light/40'
                                            : mode === 'VIEW' ? 'ml-0 bg-white' : 'ml-6 bg-white shadow-2xs hover:border-primary/30'
                                            } flex items-center gap-4 p-3.5 border rounded-xl group ${snapshot.isDragging
                                              ? 'border-primary shadow-md bg-primary/5'
                                              : 'border-border-light/20 transition-colors'
                                            }`}
                                        >
                                          {lesson.content_type === 'TEXT' ? (
                                            <>
                                              <span className="w-1.5 h-3.5 bg-primary rounded-sm shrink-0"></span>
                                              <input
                                                className="bg-transparent border-none focus:ring-0 p-0 text-[11px] font-bold text-neutral-medium uppercase tracking-wider outline-none w-full disabled:cursor-not-allowed"
                                                type="text"
                                                value={lesson.title}
                                                onChange={(e) => {
                                                  setModules(modules.map(m => {
                                                    if (m.id === mod.id) {
                                                      return {
                                                        ...m,
                                                        lessons: m.lessons.map(l => l.id === lesson.id ? { ...l, title: e.target.value } : l)
                                                      };
                                                    }
                                                    return m;
                                                  }));
                                                }}
                                                disabled={mode === 'VIEW'}
                                              />
                                              {mode !== 'VIEW' && (
                                                <button onClick={() => handleDeleteLesson(mod.id, lesson.id)} className="ml-auto text-gray-300 hover:text-red-500 transition-colors cursor-pointer">
                                                  <X size={14} />
                                                </button>
                                              )}
                                            </>
                                          ) : (
                                            <>
                                              {lesson.content_type === 'VIDEO' ? (
                                                <PlayCircle className="text-blue-500 text-lg shrink-0" size={18} />
                                              ) : (
                                                <FileText className="text-amber-500 text-lg shrink-0" size={18} />
                                              )}
                                              <div className="flex-1 min-w-0">
                                                <input
                                                  className="bg-transparent border-none focus:ring-0 p-0 text-sm font-medium text-neutral-dark outline-none w-full disabled:cursor-not-allowed"
                                                  type="text"
                                                  value={lesson.title}
                                                  onChange={(e) => {
                                                    setModules(modules.map(m => {
                                                      if (m.id === mod.id) {
                                                        return {
                                                          ...m,
                                                          lessons: m.lessons.map(l => l.id === lesson.id ? { ...l, title: e.target.value } : l)
                                                        };
                                                      }
                                                      return m;
                                                    }));
                                                  }}
                                                  disabled={mode === 'VIEW'}
                                                />
                                                <span className="text-[10px] text-gray-400 font-bold uppercase block">{lesson.content_type} • Bài học lý thuyết</span>
                                              </div>
                                              {mode !== 'VIEW' && (
                                                <button onClick={() => handleDeleteLesson(mod.id, lesson.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                                                  <Trash2 size={16} />
                                                </button>
                                              )}
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}

                                {/* inline lesson configurations */}
                                {mode !== 'VIEW' && (
                                  activeConfig?.moduleId === mod.id ? (
                                    <div className="ml-6 p-4 border border-primary/30 bg-primary/5 rounded-xl space-y-3 animate-in fade-in duration-200">
                                      <div className="flex items-center justify-between border-b border-hover-light/40 pb-1.5">
                                        <span className="text-xs font-bold text-primary">
                                          Thêm mới: <span className="italic opacity-80">{activeConfig.type}</span>
                                        </span>
                                        <button onClick={() => setActiveConfig(null)}><X size={14} className="text-gray-400" /></button>
                                      </div>

                                      <div className={activeConfig.type === 'TEXT' ? "block" : "grid grid-cols-2 gap-3"}>
                                        <input
                                          type="text"
                                          placeholder={activeConfig.type === 'TEXT' ? "Tên Chủ đề nhỏ..." : "Tiêu đề bài học..."}
                                          value={inlineData.title}
                                          onChange={(e) => setInlineData({ ...inlineData, title: e.target.value })}
                                          className="w-full p-2 text-xs bg-white border border-border-light/40 rounded-lg outline-none"
                                        />
                                        {activeConfig.type !== 'TEXT' && (
                                          <input
                                            type="text"
                                            placeholder="Link URL học liệu..."
                                            value={inlineData.url}
                                            onChange={(e) => setInlineData({ ...inlineData, url: e.target.value })}
                                            className="p-2 text-xs bg-white border border-border-light/40 rounded-lg outline-none"
                                          />
                                        )}
                                      </div>

                                      <div className="flex justify-end gap-2">
                                        <button onClick={() => setActiveConfig(null)} className="px-3 py-1 bg-white border border-gray-200 rounded-md text-[10px] font-bold text-gray-500 cursor-pointer">Hủy</button>
                                        <button onClick={() => handleSaveInlineLesson(mod.id)} className="px-3 py-1 bg-primary text-white rounded-md text-[10px] font-bold cursor-pointer">Xác nhận</button>
                                      </div>
                                    </div>
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
                          <div className="mx-4 mb-4 p-4 bg-tertiary/5 border border-tertiary/10 rounded-xl space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-tertiary font-bold text-xs">
                                <FolderLock size={16} /> Bài tập tự luận chặng cuối tuần (Peer Review)
                              </div>
                              <span className="text-[9px] bg-tertiary/20 border border-tertiary/20 text-tertiary font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Kích hoạt Peer Review</span>
                            </div>

                            <div className="grid grid-cols-12 gap-3">
                              <input
                                type="text"
                                className="col-span-4 p-2.5 bg-white border border-border-light/50 rounded-lg text-xs font-bold outline-none focus:border-primary disabled:opacity-75 disabled:cursor-not-allowed"
                                placeholder="Tên bài tập..."
                                value={mod.assignments.title}
                                onChange={(e) => setModules(modules.map(m => m.id === mod.id ? { ...m, assignments: { ...m.assignments, title: e.target.value } } : m))}
                                disabled={mode === 'VIEW'}
                              />
                              <input
                                type="text"
                                className="col-span-8 p-2.5 bg-white border border-border-light/50 rounded-lg text-xs outline-none focus:border-primary disabled:opacity-75 disabled:cursor-not-allowed"
                                placeholder="Yêu cầu hoặc link tài liệu bài tập..."
                                value={mod.assignments.description}
                                onChange={(e) => setModules(modules.map(m => m.id === mod.id ? { ...m, assignments: { ...m.assignments, description: e.target.value } } : m))}
                                disabled={mode === 'VIEW'}
                              />
                            </div>

                            <div className="bg-white/85 p-3 rounded-lg border border-tertiary/10 space-y-3">
                              <span className="text-[10px] font-bold text-gray-400 block">Tiêu chí chấm điểm chéo (Rubric):</span>
                              <div className="flex flex-col gap-2">
                                {mod.assignments.rubricCriteria.map((rub, rIdx) => (
                                  <div key={rIdx} className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-gray-600 font-bold w-full">
                                    <input
                                      type="text"
                                      className="bg-transparent border-none focus:ring-0 p-0 text-xs font-semibold text-gray-600 outline-none flex-1 placeholder:text-gray-300 disabled:cursor-not-allowed"
                                      placeholder="Tên tiêu chí chấm bài..."
                                      value={rub.criterion}
                                      onChange={(e) => {
                                        setModules(modules.map(m => {
                                          if (m.id === mod.id) {
                                            const updatedRubrics = [...m.assignments.rubricCriteria];
                                            updatedRubrics[rIdx] = { ...updatedRubrics[rIdx], criterion: e.target.value };
                                            return {
                                              ...m,
                                              assignments: { ...m.assignments, rubricCriteria: updatedRubrics }
                                            };
                                          }
                                          return m;
                                        }));
                                      }}
                                      disabled={mode === 'VIEW'}
                                    />
                                    <div className="flex items-center gap-1.5 shrink-0 bg-white border border-border-light/40 px-2 py-0.5 rounded-md">
                                      <span className="text-[10px] text-gray-400 font-bold">Thang:</span>
                                      <input
                                        type="number"
                                        min="1"
                                        className="bg-transparent border-none focus:ring-0 p-0 text-xs font-bold text-primary outline-none w-8 text-center disabled:cursor-not-allowed"
                                        value={rub.maxPoint}
                                        onChange={(e) => {
                                          setModules(modules.map(m => {
                                            if (m.id === mod.id) {
                                              const updatedRubrics = [...m.assignments.rubricCriteria];
                                              updatedRubrics[rIdx] = { ...updatedRubrics[rIdx], maxPoint: parseInt(e.target.value) || 5 };
                                              return {
                                                ...m,
                                                assignments: { ...m.assignments, rubricCriteria: updatedRubrics }
                                              };
                                            }
                                            return m;
                                          }));
                                        }}
                                        disabled={mode === 'VIEW'}
                                      />
                                      <span className="text-[10px] font-bold text-gray-500">đ</span>
                                    </div>
                                    {mode !== 'VIEW' && (
                                      <button
                                        onClick={() => {
                                          setModules(modules.map(m => m.id === mod.id ? {
                                            ...m, assignments: { ...m.assignments, rubricCriteria: m.assignments.rubricCriteria.filter((_, i) => i !== rIdx) }
                                          } : m));
                                        }}
                                        className="text-gray-400 hover:text-red-500 shrink-0 cursor-pointer p-1"
                                      >
                                        <X size={14} />
                                      </button>
                                    )}
                                  </div>
                                ))}
                                {mode !== 'VIEW' && (
                                  <button
                                    onClick={() => {
                                      setModules(modules.map(m => m.id === mod.id ? {
                                        ...m,
                                        assignments: {
                                          ...m.assignments,
                                          rubricCriteria: [...m.assignments.rubricCriteria, { criterion: '', maxPoint: 5 }]
                                        }
                                      } : m));
                                    }}
                                    className="self-start px-3 py-1.5 border border-dashed border-primary/40 text-primary rounded-md text-[10px] font-bold hover:bg-primary/10 cursor-pointer flex items-center gap-1"
                                  >
                                    + Thêm tiêu chí chấm chéo
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
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
