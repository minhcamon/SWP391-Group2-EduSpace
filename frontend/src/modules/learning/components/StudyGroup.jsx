import React, { useState } from "react";
import { Target, Mail, User, Clock, X } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";

const StudyGroup = ({
  studyGroup,
  onOpenChat,
  selectedPartner: propSelectedPartner,
  setSelectedPartner: propSetSelectedPartner,
  isGroupListOpen: propIsGroupListOpen,
  setIsGroupListOpen: propSetIsGroupListOpen
}) => {
  const [localGroupListOpen, setLocalGroupListOpen] = useState(false);
  const [localSelectedPartner, setLocalSelectedPartner] = useState(null);

  const isGroupListOpen = propIsGroupListOpen !== undefined ? propIsGroupListOpen : localGroupListOpen;
  const setIsGroupListOpen = propSetIsGroupListOpen !== undefined ? propSetIsGroupListOpen : setLocalGroupListOpen;

  const selectedPartner = propSelectedPartner !== undefined ? propSelectedPartner : localSelectedPartner;
  const setSelectedPartner = propSetSelectedPartner !== undefined ? propSetSelectedPartner : setLocalSelectedPartner;

  if (!studyGroup || studyGroup.length === 0) return null;

  return (
    <>
      {/* Header Trigger: Overlapped Avatars Stack Pill */}
      <div
        onClick={() => setIsGroupListOpen(true)}
        className="hidden lg:flex items-center gap-3 px-4 py-1.5 bg-sky-50 hover:bg-sky-100/80 rounded-full border border-sky-100 cursor-pointer shadow-xs transition-all active:scale-[0.98] group"
        title="Xem danh sách nhóm học"
      >
        <span className="text-xs font-bold text-primary uppercase tracking-wider group-hover:text-[#067fa7] transition-colors">
          Nhóm Học
        </span>
        <div className="flex -space-x-2">
          {studyGroup.map((member) => (
            <div
              key={member.id}
              className="relative shrink-0"
            >
              {member.avatar ? (
                <img
                  alt={member.name}
                  className="w-7 h-7 rounded-full ring-2 ring-white object-cover shadow-sm group-hover:ring-primary/20 transition-all"
                  src={member.avatar}
                />
              ) : (
                <div className={`w-7 h-7 rounded-full ${member.bgColor || "bg-slate-100"} ${member.textColor || "text-neutral-medium"} flex items-center justify-center ring-2 ring-white text-[10px] font-bold shadow-sm group-hover:ring-primary/20 transition-all`}>
                  {member.initials}
                </div>
              )}
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${member.status === "online"
                  ? "bg-green-500"
                  : member.status === "idle"
                    ? "bg-yellow-400"
                    : "bg-slate-400"
                }`}></span>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog 1: Group Members List (Vertical List format) */}
      <Dialog open={isGroupListOpen} onOpenChange={(open) => !open && setIsGroupListOpen(false)}>
        <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-md bg-white border border-border-light rounded-2xl shadow-xl p-5 overflow-hidden">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-bold text-neutral-dark flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
              Thành viên nhóm học
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-medium">
              Danh sách các bạn học viên cùng tham gia thảo luận trong buổi học này. Click vào từng người để xem hồ sơ cá nhân.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {studyGroup.map((member) => (
              <div
                key={member.id}
                onClick={() => {
                  setSelectedPartner(member);
                  setIsGroupListOpen(false);
                }}
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-border-light/45 rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.99] group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    {member.avatar ? (
                      <img
                        alt={member.name}
                        className="w-9 h-9 rounded-full object-cover border border-white shadow-sm"
                        src={member.avatar}
                      />
                    ) : (
                      <div className={`w-9 h-9 rounded-full ${member.bgColor || "bg-slate-100"} ${member.textColor || "text-neutral-medium"} flex items-center justify-center text-xs font-bold border border-white shadow-sm`}>
                        {member.initials}
                      </div>
                    )}
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${member.status === "online"
                        ? "bg-green-500"
                        : member.status === "idle"
                          ? "bg-yellow-400"
                          : "bg-slate-400"
                      }`}></span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-neutral-dark group-hover:text-primary transition-colors truncate">{member.name}</p>
                    <p className="text-[10px] text-neutral-medium truncate">{member.email}</p>
                  </div>
                </div>
                <span className="shrink-0 text-[10px] font-bold text-primary bg-primary/15 px-2.5 py-1 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                  Xem hồ sơ
                </span>
              </div>
            ))}
          </div>

          <DialogFooter className="bg-slate-50/50 -mx-5 -mb-5 p-4 border-t border-slate-100 flex justify-end mt-4">
            <button
              onClick={() => setIsGroupListOpen(false)}
              className="border border-border-light bg-white text-neutral-medium hover:bg-slate-50 hover:text-neutral-dark text-xs font-semibold py-2 px-5 rounded-xl transition-all cursor-pointer active:scale-[0.98]"
            >
              Đóng
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog 2: Partner Profile Detail (Preventing layout overflows) */}
      <Dialog open={!!selectedPartner} onOpenChange={(open) => !open && setSelectedPartner(null)}>
        <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-md bg-white border border-border-light rounded-2xl shadow-xl p-0 overflow-hidden">
          {/* Header Banner */}
          <div className="h-24 bg-linear-to-r from-primary/10 to-sky-50 relative shrink-0"></div>

          {/* Content Body */}
          <div className="px-6 pb-6 relative">
            {/* Floating Avatar */}
            <div className="absolute -top-12 left-6">
              {selectedPartner?.avatar ? (
                <img
                  alt={selectedPartner.name}
                  className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
                  src={selectedPartner.avatar}
                />
              ) : (
                <div className={`w-24 h-24 rounded-full ${selectedPartner?.bgColor || "bg-slate-100"} ${selectedPartner?.textColor || "text-neutral-medium"} flex items-center justify-center border-4 border-white text-2xl font-bold shadow-md`}>
                  {selectedPartner?.initials}
                </div>
              )}
            </div>

            {/* Name and Basic Goals */}
            <div className="pt-14">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-neutral-dark wrap-break-word max-w-full">{selectedPartner?.name}</h3>
                <span className={`w-3 h-3 rounded-full border-2 border-white shrink-0 ${selectedPartner?.status === "online"
                    ? "bg-green-500"
                    : selectedPartner?.status === "idle"
                      ? "bg-yellow-400"
                      : "bg-slate-400"
                  }`}></span>
              </div>
              <p className="text-xs text-neutral-medium font-semibold flex items-center gap-1.5 mb-4 wrap-break-word">
                <Target size={14} className="text-primary shrink-0" />
                <span>Mục tiêu: {selectedPartner?.goal}</span>
              </p>

              {/* Extra Bio & Fields (Styled defensively to wrap content) */}
              <div className="space-y-4 border-t border-slate-100 pt-4 text-xs leading-relaxed text-neutral-medium">
                <div className="flex items-start gap-2.5">
                  <Mail size={14} className="text-neutral-light shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="font-semibold text-neutral-dark block mb-0.5">Email</span>
                    <span className="break-all select-all">{selectedPartner?.email || "N/A"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <User size={14} className="text-neutral-light shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="font-semibold text-neutral-dark block mb-0.5">Giới thiệu bản thân</span>
                    <p className="wrap-break-word whitespace-normal leading-normal">{selectedPartner?.bio || "Chưa cập nhật giới thiệu."}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock size={14} className="text-neutral-light shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="font-semibold text-neutral-dark block mb-0.5">Bài học hiện tại</span>
                    <span className="text-primary font-bold wrap-break-word">{selectedPartner?.currentLesson || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudyGroup;
