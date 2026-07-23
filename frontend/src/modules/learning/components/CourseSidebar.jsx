import React, { useState, useEffect } from "react"
import {
  X,
  CheckCircle,
  PlayCircle,
  Lock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  FileText,
  XCircle,
} from "lucide-react"
import Avatar from "@/components/common/Avatar"

const CourseSidebar = ({
  isSidebarOpen,
  onCloseSidebar,
  isCompleted,
  sidebarSections,
  onSelectLesson,
  onSelectAssignment,
}) => {
  const [expandedModules, setExpandedModules] = useState({})

  useEffect(() => {
    if (sidebarSections) {
      const initial = { ...expandedModules }
      let hasInProgress = false
      sidebarSections.forEach((section) => {
        if (section.status === "IN_PROGRESS" && initial[section.id] === undefined) {
          initial[section.id] = true
          hasInProgress = true
        }
      })
      if (hasInProgress) {
        setExpandedModules(initial)
      }
    }
  }, [sidebarSections])

  const toggleModule = (id) => {
    setExpandedModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <aside
      className={`absolute md:relative top-0 left-0 h-full w-[300px] sm:w-[380px] bg-bg-sidebar border-r border-border-light flex flex-col z-40 transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* Sidebar Header */}
      <div className='p-4 border-b border-border-light flex items-center justify-between bg-white/50 backdrop-blur-md'>
        <h3 className='font-bold text-base text-neutral-dark'>Nội dung khóa học</h3>
        <button
          onClick={onCloseSidebar}
          className='md:hidden p-1.5 rounded hover:bg-hover-light text-neutral-medium cursor-pointer'
        >
          <X size={18} />
        </button>
      </div>

      {/* Sidebar Content (Modules & Lessons) */}
      <div className='flex-1 overflow-y-auto'>
        {sidebarSections &&
          sidebarSections.map((section) => {
            const isModuleCompleted = section.status === "COMPLETED"
            const isModuleInProgress = section.status === "IN_PROGRESS"
            const isModuleNotStarted = section.status === "NOT_STARTED"
            const isExpanded = !!expandedModules[section.id]

            // Custom padding and styles for module headers based on completion/progress state
            const headerPadding = isModuleInProgress || isModuleCompleted
              ? "p-4"
              : "p-2 px-4"

            return (
              <div
                key={section.id}
                className='border-b border-border-light'
              >
                {/* Module Header Row */}
                <div
                  role='button'
                  tabIndex={0}
                  onClick={() => toggleModule(section.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      toggleModule(section.id)
                    }
                  }}
                  className={`w-full flex items-center gap-3 text-left border-l-4 transition-all duration-200 cursor-pointer select-none ${headerPadding} ${
                    isModuleInProgress
                      ? "bg-primary/5 hover:bg-primary/10 border-primary"
                      : isModuleCompleted
                        ? "bg-success/5 hover:bg-success/10 border-success/60"
                        : "bg-bg-sidebar/20 hover:bg-hover-light/40 border-transparent opacity-75"
                  }`}
                >
                  {/* Status Indicator */}
                  <div className='shrink-0'>
                    {isModuleCompleted && (
                      <div className='w-5 h-5 rounded-full bg-success/10 text-success flex items-center justify-center'>
                        <CheckCircle size={13} />
                      </div>
                    )}
                    {isModuleInProgress && (
                      <div className='w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center'>
                        <RefreshCw
                          size={14}
                          className='animate-spin-slow'
                        />
                      </div>
                    )}
                    {isModuleNotStarted && (
                      <div className='w-5 h-5 rounded-full bg-hover-light text-neutral-light flex items-center justify-center'>
                        <Lock size={11} />
                      </div>
                    )}
                  </div>

                  <div className='grow min-w-0'>
                    <span
                      className={`font-bold text-neutral-light block uppercase mb-0.5 ${
                        isModuleInProgress || isModuleCompleted ? "text-[10px]" : "text-[9px]"
                      }`}
                    >
                      {section.statusText}
                    </span>
                    <h4
                      className={`truncate font-bold ${
                        isModuleInProgress || isModuleCompleted
                          ? "text-sm text-neutral-dark"
                          : "text-xs text-neutral-light"
                      }`}
                    >
                      {section.title}
                    </h4>
                  </div>

                  {/* Chevron Collapse Icon */}
                  <div className='shrink-0 text-neutral-medium/70 ml-auto mr-1 hover:text-primary transition-colors'>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Lessons List + Assignment (Rendered for all modules with styled minification) */}
                {isExpanded && (
                  <div
                    className={`bg-white/40 divide-y divide-border-light/25 ${
                      isModuleNotStarted ? "pointer-events-none" : ""
                    }`}
                  >
                    {/* Lessons */}
                    {section.lessons &&
                      section.lessons.map((item) => {
                        const isThisCompleted =
                          item.isCompleted || (item.isActive && isCompleted) || isModuleCompleted

                        // Apply minification based on module state
                        let paddingClass = "p-3.5 pl-6 pr-3.5"
                        let textClass
                        let infoClass =
                          "text-[11px] text-neutral-light flex items-center gap-1 mt-1 font-medium"
                        let iconSize = 15
                        let itemOpacity = "opacity-100"

                        if (isModuleNotStarted) {
                          paddingClass = "p-1.5 pl-5.5 pr-3 select-none"
                          textClass = "text-xs font-normal text-neutral-light/70"
                          infoClass =
                            "text-[9px] text-neutral-light/60 flex items-center gap-1 mt-0.5"
                          iconSize = 11
                          itemOpacity = "opacity-55"
                        } else {
                          // IN_PROGRESS or COMPLETED module styling
                          if (item.isActive) {
                            textClass = "text-sm font-bold text-primary transition-colors"
                          } else if (isThisCompleted) {
                            textClass =
                              "text-sm font-semibold text-neutral-dark/85 transition-colors"
                          } else {
                            textClass =
                              "text-sm font-semibold text-neutral-medium transition-colors"
                          }
                        }

                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              if (!isModuleNotStarted && !item.isLocked && onSelectLesson) {
                                onSelectLesson(item.id, section.id)
                              }
                            }}
                            className={`flex items-start justify-between transition-all group ${paddingClass} ${itemOpacity} ${
                              item.isActive && isModuleInProgress ? "bg-primary/5" : ""
                            } ${!isModuleNotStarted && !item.isLocked ? "cursor-pointer hover:bg-white/60" : ""}`}
                          >
                            <div className='flex items-start gap-3 min-w-0'>
                              <div className='shrink-0 mt-0.5'>
                                {isThisCompleted ? (
                                  <CheckCircle
                                    size={iconSize}
                                    className='text-success'
                                  />
                                ) : item.isLocked || isModuleNotStarted ? (
                                  <Lock
                                    size={iconSize}
                                    className='text-neutral-light'
                                  />
                                ) : (
                                  <PlayCircle
                                    size={iconSize}
                                    className={
                                      item.isActive && isModuleInProgress
                                        ? "text-primary animate-pulse"
                                        : "text-neutral-light group-hover:text-primary"
                                    }
                                  />
                                )}
                              </div>
                              <div className='min-w-0'>
                                <p className={`${textClass} truncate group-hover:text-primary`}>
                                  {item.title}
                                </p>
                                <span className={infoClass}>Thời lượng: {item.duration}</span>
                              </div>
                            </div>

                            {/* Partner Indicators for current Lesson (Only show fully featured in active IN_PROGRESS module) */}
                            {isModuleInProgress &&
                              item.currentPartners &&
                              item.currentPartners.length > 0 && (
                                <div className='flex -space-x-1.5 mt-0.5 shrink-0 pl-2'>
                                  {item.currentPartners.map((partner, idx) => (
                                    <div
                                      key={idx}
                                      className='relative group/partner-tag'
                                    >
                                      <Avatar
                                        src={partner.avatar}
                                        alt={partner.name}
                                        title={`${partner.name} đang ở bài học này`}
                                        className='w-5 h-5 border border-white shadow-sm hover:ring-2 hover:ring-primary hover:z-10 transition-all'
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        )
                      })}

                    {/* Assignment Item — same format as lessons */}
                    {section.assignment &&
                      (() => {
                        const asgn = section.assignment
                        const isLocked = isModuleNotStarted || asgn.locked
                        const isThisCompleted =
                          asgn.completed || asgn.status === "GRADED" || isModuleCompleted

                        // Mirror lesson styling exactly
                        let paddingClass = "p-3.5 pl-6 pr-3.5"
                        let textClass
                        let iconSize = 15
                        let itemOpacity = "opacity-100"

                        if (isModuleNotStarted) {
                          paddingClass = "p-1.5 pl-5.5 pr-3 select-none"
                          textClass = "text-xs font-normal text-neutral-light/70"
                          iconSize = 11
                          itemOpacity = "opacity-55"
                        } else {
                          textClass = isThisCompleted
                            ? "text-sm font-semibold text-neutral-dark/85 transition-colors"
                            : "text-sm font-semibold text-neutral-medium transition-colors"
                        }

                        return (
                          <div
                            key={`assignment-${asgn.id}`}
                            onClick={() => {
                              if (!isLocked && onSelectAssignment) {
                                onSelectAssignment(asgn.id)
                              }
                            }}
                            className={`flex items-start justify-between transition-all group ${paddingClass} ${itemOpacity} ${
                              !isLocked ? "cursor-pointer hover:bg-white/60" : ""
                            }`}
                          >
                            <div className='flex items-start gap-3 min-w-0'>
                              <div className='shrink-0 mt-0.5'>
                                {asgn.status === "FAILED" ? (
                                  <XCircle
                                    size={iconSize}
                                    className='text-destructive'
                                  />
                                ) : isThisCompleted ? (
                                  <CheckCircle
                                    size={iconSize}
                                    className='text-success'
                                  />
                                ) : isLocked ? (
                                  <Lock
                                    size={iconSize}
                                    className='text-neutral-light'
                                  />
                                ) : (
                                  <FileText
                                    size={iconSize}
                                    className='text-neutral-light group-hover:text-primary'
                                  />
                                )}
                              </div>
                              <div className='min-w-0'>
                                <p className={`${textClass} truncate group-hover:text-primary`}>
                                  {asgn.title}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })()}
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </aside>
  )
}

export default CourseSidebar
