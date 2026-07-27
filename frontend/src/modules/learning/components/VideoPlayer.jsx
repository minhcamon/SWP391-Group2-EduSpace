import React from 'react'
import { RefreshCw } from 'lucide-react'
import useVideoPlayer from '@/modules/learning/hooks/useVideoPlayer'

const VideoPlayer = ({
  isPlaying,
  onTogglePlay,
  isSynced,
  onToggleSync,
  lesson
}) => {
  const videoUrl =
    lesson?.videoUrl ||
    lesson?.contentUrl ||
    'https://www.youtube.com/embed/dQw4w9WgXcQ'

  const {
    iframeRef,
    videoRef,
    youtubeId,
    isDirectVideo,
    handleHtml5Play,
    handleHtml5Pause
  } = useVideoPlayer({
    videoUrl,
    isPlaying,
    onTogglePlay
  })

  const renderPlayerContent = () => {
    if (youtubeId) {
      return (
        <div className="w-full h-full aspect-video bg-neutral-dark rounded-xl overflow-hidden shadow-md">
          <div
            ref={iframeRef}
            className="w-full h-full"
          />
        </div>
      )
    }

    if (isDirectVideo) {
      return (
        <div className="w-full h-full aspect-video bg-neutral-dark rounded-xl overflow-hidden shadow-md">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            controls
            onPlay={handleHtml5Play}
            onPause={handleHtml5Pause}
          />
        </div>
      )
    }

    // Generic iframe embed for embeddable video links
    return (
      <div className="w-full aspect-video bg-neutral-dark rounded-xl overflow-hidden shadow-md">
        <iframe
          src={videoUrl}
          title={lesson?.title || 'Video bài giảng'}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {renderPlayerContent()}

      {/* Co-watching details */}
      {/* <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-border-light">
                <div className="flex items-center gap-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isSynced}
                            onChange={onToggleSync}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-border-light/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-light/40 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        <span className="ml-3 text-sm font-semibold text-neutral-medium">
                            Học cùng {lesson?.partnerName || "bạn đồng hành"}
                        </span>
                    </label>
                    {isSynced && (
                        <div className="flex items-center gap-1.5 text-primary bg-primary/10 px-2.5 py-0.5 rounded-full text-xs font-bold border border-primary/20">
                            <RefreshCw size={12} className="animate-spin" />
                            Đồng bộ phát video
                        </div>
                    )}
                </div>
            </div> */}
    </div>
  )
}

export default VideoPlayer
