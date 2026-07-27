import React, { useState } from "react";
import { FileText, ExternalLink, Download, Maximize2, Minimize2, RefreshCw } from "lucide-react";

const PdfViewer = ({ pdfUrl, title = "Tài liệu PDF bài học", className = "" }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const activeUrl = pdfUrl || "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf";

    // Helper for direct Google Docs preview fallback if url is external non-direct pdf
    const isGoogleDriveOrExternal = activeUrl.includes("drive.google.com") || activeUrl.includes("docs.google.com");
    const iframeSrc = isGoogleDriveOrExternal
        ? activeUrl
        : activeUrl.endsWith(".pdf") || activeUrl.includes("raw.githubusercontent") || activeUrl.includes("blob:")
            ? activeUrl
            : `https://docs.google.com/gview?url=${encodeURIComponent(activeUrl)}&embedded=true`;

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = activeUrl;
        link.target = "_blank";
        link.download = `${title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleOpenNewTab = () => {
        window.open(activeUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <div
            className={`flex flex-col bg-neutral-dark rounded-xl border border-border-light overflow-hidden shadow-md transition-all duration-300 ${
                isFullscreen
                    ? "fixed inset-4 z-50 h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] bg-neutral-dark/95 backdrop-blur-md"
                    : `w-full h-[550px] sm:h-[650px] ${className}`
            }`}
        >
            {/* Header Control Bar */}
            <div className="bg-neutral-800 text-white px-4 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                    <div className="p-1.5 bg-red-500/20 text-red-400 rounded-lg shrink-0">
                        <FileText size={18} />
                    </div>
                    <div className="truncate">
                        <h3 className="text-xs sm:text-sm font-bold truncate text-neutral-100">{title}</h3>
                        <p className="text-[10px] text-neutral-400 truncate hidden sm:block">
                            Tài liệu học tập dạng PDF
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={handleOpenNewTab}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        title="Mở trong tab mới"
                    >
                        <ExternalLink size={14} />
                        <span className="hidden md:inline">Mở cửa sổ mới</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleDownload}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                        title="Tải về máy"
                    >
                        <Download size={14} />
                        <span className="hidden sm:inline">Tải về</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-1.5 bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white rounded-lg transition-colors cursor-pointer"
                        title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
                    >
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                </div>
            </div>

            {/* Embedded PDF Viewer Frame */}
            <div className="relative grow bg-neutral-900 overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 text-white gap-2 z-10">
                        <RefreshCw size={24} className="animate-spin text-primary" />
                        <span className="text-xs text-neutral-400">Đang tải file PDF...</span>
                    </div>
                )}
                <iframe
                    src={iframeSrc}
                    title={title}
                    className="w-full h-full border-0"
                    onLoad={() => setIsLoading(false)}
                />
            </div>
        </div>
    );
};

export default PdfViewer;
