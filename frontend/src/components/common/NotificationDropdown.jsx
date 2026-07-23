import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Bell, Info, Award, UserPlus, BookOpen } from "lucide-react";
import useNotifications from "@/modules/shared-features/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";

export const NotificationDropdown = ({ triggerClass = "text-neutral-medium hover:text-primary hover:bg-slate-50" }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "PEER_REVIEW":
        return <Award className="w-4 h-4 text-secondary" />;
      case "CREATOR_REQUEST":
        return <UserPlus className="w-4 h-4 text-primary" />;
      case "COURSE_APPROVAL":
        return <BookOpen className="w-4 h-4 text-success" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const getNotificationIconBg = (type) => {
    switch (type) {
      case "PEER_REVIEW":
        return "bg-secondary/10";
      case "CREATOR_REQUEST":
        return "bg-primary/10";
      case "COURSE_APPROVAL":
        return "bg-success/10";
      default:
        return "bg-slate-100";
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await markAsRead(notif.id);
    }
    setShowNotifications(false);

    if (notif.type === "CREATOR_REQUEST") {
      if (user?.role === "ADMIN") {
        navigate("/admin/creator-requests");
      }
    } else if (notif.type === "COURSE_APPROVAL") {
      if (user?.role === "ADMIN") {
        navigate("/admin/courses-management");
      } else if (user?.role === "CREATOR") {
        navigate("/creator/courses");
      }
    } else if (notif.type === "PEER_REVIEW") {
      navigate("/my-learning");
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!user) return null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className={`relative p-1.5 rounded-full transition-all duration-200 cursor-pointer focus:outline-none ${triggerClass}`}
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm animate-pulse-slow">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-border-light/45 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
            {/* Dropdown Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-sm font-bold text-neutral-dark">Thông báo</span>
              {unreadCount > 0 && (
                <button
                  onClick={async () => {
                    await markAllAsRead();
                  }}
                  className="text-xs font-bold text-primary hover:text-[#3f38c9] cursor-pointer transition-colors"
                >
                  Đọc tất cả
                </button>
              )}
            </div>

            {/* Dropdown Body */}
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
              {loading ? (
                <div className="p-8 text-center text-xs text-neutral-medium flex flex-col items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Đang tải thông báo...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-light">
                  Không có thông báo nào.
                </div>
              ) : (
                notifications.map((notif) => {
                  const icon = getNotificationIcon(notif.type);
                  const iconBg = getNotificationIconBg(notif.type);
                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-4 flex items-start gap-3 hover:bg-slate-50/70 transition-colors cursor-pointer text-left ${
                        !notif.isRead ? "bg-primary/3" : ""
                      }`}
                    >
                      {/* Notification Icon */}
                      <div className={`p-2 rounded-xl shrink-0 ${iconBg}`}>
                        {icon}
                      </div>

                      {/* Notification Content */}
                      <div className="grow min-w-0 space-y-1">
                        <p className={`text-xs leading-relaxed text-neutral-dark wrap-break-word ${
                          !notif.isRead ? "font-bold" : "font-medium"
                        }`}>
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-neutral-light block font-semibold">
                          {formatTime(notif.createdAt)}
                        </span>
                      </div>

                      {/* Unread Dot Indicator */}
                      {!notif.isRead && (
                        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-2"></span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
