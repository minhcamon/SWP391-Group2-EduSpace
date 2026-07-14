import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { PlayCircle, FileText, X, Trash2 } from 'lucide-react';

export default function LessonItem({
  lesson,
  index,
  modId,
  mode,
  modules,
  setModules,
  handleDeleteLesson
}) {
  return (
    <Draggable key={lesson.id} draggableId={`lesson-${lesson.id}`} index={index} isDragDisabled={mode === 'VIEW'}>
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
                      if (m.id === modId) {
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
                  <button onClick={() => handleDeleteLesson(modId, lesson.id)} className="ml-auto text-gray-300 hover:text-red-500 transition-colors cursor-pointer">
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
                        if (m.id === modId) {
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
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">
                      {lesson.content_type} • Bài học lý thuyết
                    </span>
                    {lesson.content_url && lesson.content_url !== 'N/A' && (
                      <a
                        href={lesson.content_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-primary underline truncate block max-w-xs hover:text-primary/80 transition-colors"
                      >
                        {lesson.content_url}
                      </a>
                    )}
                  </div>
                </div>
                {mode !== 'VIEW' && (
                  <button onClick={() => handleDeleteLesson(modId, lesson.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
