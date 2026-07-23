import React from "react";
import { FileText, MessageSquare, ClipboardCheck } from "lucide-react";

export const MentorToolCard = ({ tool }) => {
  const { id, title, description, type } = tool;

  const getIcon = () => {
    switch (id) {
      case "reports":
        return <FileText className="w-5 h-5" />;
      case "community":
        return <MessageSquare className="w-5 h-5" />;
      case "grading":
        return <ClipboardCheck className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "navy":
      case "primary":
        return "bg-primary";
      case "secondary":
        return "bg-secondary";
      case "tertiary":
        return "bg-tertiary";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className="bg-bg-card hover:bg-hover-light hover:shadow-sm border border-border-light/25 rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 cursor-pointer active:scale-[0.98]">
      <div className={`w-12 h-12 ${getBgColor()} text-white rounded-xl flex items-center justify-center shrink-0`}>
        {getIcon()}
      </div>
      <div>
        <h4 className="font-bold text-neutral-dark text-sm leading-tight mb-1">{title}</h4>
        <p className="text-xs text-neutral-medium">{description}</p>
      </div>
    </div>
  );
};

export default MentorToolCard;
