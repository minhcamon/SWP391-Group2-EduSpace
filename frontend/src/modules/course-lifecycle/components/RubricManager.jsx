import React from 'react';
import { FolderLock, X } from 'lucide-react';

export default function RubricManager({
  mod,
  modules,
  setModules,
  mode
}) {
  return (
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
  );
}
