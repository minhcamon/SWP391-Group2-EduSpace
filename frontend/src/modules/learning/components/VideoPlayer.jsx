import React from "react";
import { Play, Pause, Volume2, Settings, Maximize, RefreshCw } from "lucide-react";

const VideoPlayer = ({ isPlaying, onTogglePlay, isSynced, onToggleSync, lesson }) => {
    return (
        <div className="flex flex-col gap-6">
            {/* Video Player Mock */}
            <div className="aspect-video bg-neutral-dark rounded-xl relative group overflow-hidden shadow-md">
                <img
                    alt="Lesson Video Thumbnail"
                    className="w-full h-full object-cover opacity-70 group-hover:scale-[1.02] transition-transform duration-700"
                    src={lesson?.videoUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"}
                />
                {/* Overlay Play/Pause Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <button
                        onClick={onTogglePlay}
                        className="w-16 h-16 bg-primary/95 text-white rounded-full flex items-center justify-center hover:scale-115 hover:bg-primary transition-all duration-300 shadow-lg cursor-pointer"
                    >
                        {isPlaying ? (
                            <Pause size={32} className="fill-white" />
                        ) : (
                            <Play size={32} className="fill-white translate-x-0.5" />
                        )}
                    </button>
                </div>
                {/* Bottom Control Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent flex items-center gap-4 text-white opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onTogglePlay}
                        className="hover:text-primary transition-colors cursor-pointer"
                    >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <div className="text-xs font-semibold">
                        {lesson?.videoCurrentTime || "00:00"} / {lesson?.videoDuration || "00:00"}
                    </div>
                    <div className="grow h-1.5 bg-white/20 rounded-full cursor-pointer relative">
                        <div
                            className="absolute top-0 left-0 h-full bg-primary rounded-full"
                            style={{ width: `${lesson?.videoProgressPercent || 0}%` }}
                        ></div>
                    </div>
                    <button className="hover:text-primary transition-colors cursor-pointer">
                        <Volume2 size={18} />
                    </button>
                    <button className="hover:text-primary transition-colors cursor-pointer">
                        <Settings size={18} />
                    </button>
                    <button className="hover:text-primary transition-colors cursor-pointer">
                        <Maximize size={18} />
                    </button>
                </div>
            </div>

            {/* Co-watching details */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-border-light">
                <div className="flex items-center gap-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isSynced}
                            onChange={onToggleSync}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        <span className="ml-3 text-sm font-semibold text-neutral-medium">
                            Học cùng {lesson?.partnerName || "bạn đồng hành"}
                        </span>
                    </label>
                    {isSynced && (
                        <div className="flex items-center gap-1.5 text-primary bg-sky-50 px-2.5 py-0.5 rounded-full text-xs font-bold border border-sky-100">
                            <RefreshCw size={12} className="animate-spin" />
                            Đồng bộ phát video
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
