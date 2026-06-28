import { useEffect, useRef, useState } from "react";

const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const isDirectVideoUrl = (url) => {
    if (!url) return false;
    const cleanUrl = url.split("?")[0].split("#")[0];
    return /\.(mp4|webm|ogg)$/i.test(cleanUrl) || url.startsWith("blob:") || url.includes("/video/upload/");
};

const useVideoPlayer = ({ videoUrl, isPlaying, onTogglePlay }) => {
    const iframeRef = useRef(null);
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const [isYTReady, setIsYTReady] = useState(false);

    const youtubeId = getYouTubeId(videoUrl);
    const isDirectVideo = isDirectVideoUrl(videoUrl);

    useEffect(() => {
        if (window.YT && window.YT.Player) {
            setIsYTReady(true);
            return;
        }

        const previousOnReady = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            if (previousOnReady) previousOnReady();
            setIsYTReady(true);
        };

        if (!document.getElementById("youtube-iframe-api-script")) {
            const tag = document.createElement("script");
            tag.id = "youtube-iframe-api-script";
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }, []);

    useEffect(() => {
        if (!isYTReady || !youtubeId || !iframeRef.current) {
            if (playerRef.current) {
                try {
                    playerRef.current.destroy();
                } catch (e) {
                    console.error("Lỗi khi hủy player:", e);
                }
                playerRef.current = null;
            }
            return;
        }

        const playerEl = document.createElement("div");
        playerEl.className = "w-full h-full";
        iframeRef.current.innerHTML = ""; 
        iframeRef.current.appendChild(playerEl);

        playerRef.current = new window.YT.Player(playerEl, {
            width: "100%",
            height: "100%",
            videoId: youtubeId,
            playerVars: {
                autoplay: isPlaying ? 1 : 0,
                controls: 1,
                rel: 0,
                showinfo: 0,
                enablejsapi: 1,
            },
            events: {
                onStateChange: (event) => {
                    const playerState = event.data;
                    // window.YT.PlayerState.PLAYING = 1, PAUSED = 2
                    if (playerState === 1) {
                        if (!isPlaying) {
                            onTogglePlay();
                        }
                    } else if (playerState === 2) {
                        if (isPlaying) {
                            onTogglePlay();
                        }
                    }
                },
                onReady: (event) => {
                    if (isPlaying) {
                        event.target.playVideo();
                    }
                }
            }
        });

        return () => {
            if (playerRef.current) {
                try {
                    playerRef.current.destroy();
                } catch (e) {
                    // Bỏ qua lỗi khi destroy
                }
                playerRef.current = null;
            }
            if (iframeRef.current) {
                iframeRef.current.innerHTML = ""; // Dọn sạch DOM khi unmount/change
            }
        };
    }, [youtubeId, isYTReady]);

    // 3. Đồng bộ hóa trạng thái isPlaying từ React -> YouTube Player
    useEffect(() => {
        if (playerRef.current && typeof playerRef.current.getPlayerState === "function") {
            try {
                const state = playerRef.current.getPlayerState();
                if (isPlaying && state !== 1) {
                    playerRef.current.playVideo();
                } else if (!isPlaying && state === 1) {
                    playerRef.current.pauseVideo();
                }
            } catch (e) {
                console.error("Lỗi đồng bộ Youtube Player:", e);
            }
        }
    }, [isPlaying]);

    // 4. Đồng bộ hóa trạng thái isPlaying từ React -> HTML5 Video
    useEffect(() => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.play().catch((err) => {
                console.warn("HTML5 video play failed/blocked:", err);
            });
        } else {
            videoRef.current.pause();
        }
    }, [isPlaying]);

    // Trình lắng nghe sự kiện phát/tạm dừng cho HTML5 Video
    const handleHtml5Play = () => {
        if (!isPlaying) onTogglePlay();
    };

    const handleHtml5Pause = () => {
        if (isPlaying) onTogglePlay();
    };

    return {
        iframeRef,
        videoRef,
        youtubeId,
        isDirectVideo,
        handleHtml5Play,
        handleHtml5Pause
    };
};

export default useVideoPlayer;
