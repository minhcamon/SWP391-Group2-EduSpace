import { Megaphone, Award, BookOpen, Clock, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const ClassFeed = ({ feed = [], onReactionClick }) => {
  const getIcon = (type) => {
    switch (type) {
      case "achievement":
        return (
          <div className="w-12 h-12 bg-secondary/15 text-secondary rounded-full flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
        );
      case "material":
        return (
          <div className="w-12 h-12 bg-primary/15 text-primary rounded-full flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
        );
      case "reminder":
        return (
          <div className="w-12 h-12 bg-danger/15 text-danger rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-neutral-medium/15 text-neutral-medium rounded-full flex items-center justify-center shrink-0">
            <Megaphone className="w-6 h-6" />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-dark flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-secondary" />
          Bảng tin lớp học
        </h2>
        <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold tracking-wider">
          TỰ ĐỘNG
        </Badge>
      </div>

      <div className="flex flex-col gap-4">
        {feed.map((post) => (
          <article
            key={post.id}
            className="bg-white p-6 rounded-2xl border border-border-light/30 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              {getIcon(post.type)}
              <div className="grow">
                <div className="flex flex-wrap justify-between items-start mb-1 gap-2">
                  <h3 className="text-base font-bold text-neutral-dark">
                    {post.title}
                  </h3>
                  <span className="text-xs text-neutral-light">{post.timeAgo}</span>
                </div>
                
                {/* Safe html insertion for markup in feed */}
                <p
                  className="text-sm text-neutral-medium leading-relaxed mb-4"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Reactions */}
                <div className="flex items-center flex-wrap gap-2.5">
                  {post.reactions.map((react) => (
                    <button
                      key={react.emoji}
                      onClick={() => onReactionClick && onReactionClick(post.id, react.emoji)}
                      type="button"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 active:scale-95 ${
                        react.userReacted
                          ? "bg-primary/15 text-primary border border-primary/20"
                          : "bg-bg-card hover:bg-bg-sidebar border border-transparent text-neutral-medium"
                      }`}
                    >
                      <span>{react.emoji}</span>
                      <span>{react.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* End of Feed Banner */}
      <div className="relative h-24 rounded-2xl bg-bg-card/40 border border-dashed border-border-light/60 flex flex-col items-center justify-center p-6 text-center mt-2">
        <span className="text-xs text-neutral-light font-semibold mb-1">
          Hết thông tin gần đây
        </span>
        <button
          type="button"
          className="text-primary text-sm font-bold hover:underline flex items-center gap-1 focus:outline-none"
        >
          Xem thông báo cũ hơn
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ClassFeed;
