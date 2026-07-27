import React from "react";
import { Paperclip, Loader2, X } from "lucide-react";
import { useInputFile } from "./useInputFile";
import { cn } from "@/lib/utils";

export function InputFile({
    value,
    onChange,
    accept = "*",
    maxSize = 10 * 1024 * 1024,
    placeholder = "Dán URL hoặc nhấn Ctrl+V để dán tệp...",
    className,
    disabled = false,
    variant = "learner", // "learner" (primary blue) or "creator" (secondary orange)
    split = "3-7", // "3-7" (30/70 split) or "4-6" (40/60 split)
    size = "default" // "default" (44px) or "sm" (32px to match standard input)
}) {
    const hook = useInputFile({ value, accept, maxSize, onChange });

    const isCreator = variant === "creator";
    const isSm = size === "sm";

    // Dynamic sizes based on size prop
    const heightClass = isSm ? "h-8" : "h-11";
    const roundedClass = isSm ? "rounded-lg" : "rounded-xl";
    const fontClass = isSm ? "text-[11px]" : "text-xs";
    const iconSizeClass = isSm ? "w-3.5 h-3.5" : "w-4 h-4";
    const clearBtnClass = isSm ? "right-2" : "right-3";
    const clearIconSizeClass = isSm ? "w-3 h-3" : "w-3.5 h-3.5";

    // Determine width percentages
    const buttonWidthClass = split === "4-6" ? "w-[40%]" : "w-[30%]";
    const inputWidthClass = split === "4-6" ? "w-[60%]" : "w-[70%]";

    return (
        <div className={cn("w-full relative flex flex-col gap-1", className)}>
            {/* Hidden native input file */}
            <input
                ref={hook.fileInputRef}
                type="file"
                accept={accept}
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        hook.uploadAndSetUrl(e.target.files[0]);
                    }
                }}
                className="hidden"
                disabled={disabled || hook.isUploading}
            />

            {/* Unified Input Group Container */}
            <div
                className={cn(
                    "relative flex items-center w-full border border-border-light bg-bg-card transition-all overflow-hidden",
                    heightClass,
                    roundedClass,
                    isCreator
                        ? "hover:border-secondary/50 focus-within:border-secondary focus-within:ring-3 focus-within:ring-secondary/20"
                        : "hover:border-primary/50 focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20",
                    hook.isUploading && "opacity-75 pointer-events-none select-none"
                )}
            >
                {/* Left Side: Upload Button (Integrated into group) */}
                <button
                    type="button"
                    onClick={() => hook.fileInputRef.current.click()}
                    disabled={disabled || hook.isUploading}
                    className={cn(
                        "h-full flex items-center justify-center gap-1.5 border-r border-border-light transition-all cursor-pointer select-none font-semibold px-2.5 shrink-0",
                        buttonWidthClass,
                        fontClass,
                        isCreator
                            ? "bg-secondary/5 text-secondary hover:bg-secondary/15 hover:text-secondary-foreground"
                            : "bg-primary/5 text-primary hover:bg-primary/15 hover:text-primary-foreground"
                    )}
                >
                    {hook.isUploading ? (
                        <Loader2 className={cn("animate-spin", iconSizeClass)} />
                    ) : (
                        <Paperclip className={iconSizeClass} />
                    )}
                    <span className="truncate">
                        {hook.isUploading ? "Tải lên..." : "Tải tệp"}
                    </span>
                </button>

                {/* Right Side: Seamless Input Field */}
                <div className={cn("relative h-full flex items-center", inputWidthClass)}>
                    <input
                        id="input-file-url"
                        type="text"
                        value={hook.value}
                        onPaste={hook.handlePaste}
                        onChange={(e) => hook.handleTextChange(e.target.value)}
                        placeholder={placeholder}
                        disabled={disabled || hook.isUploading}
                        className={cn(
                            "w-full h-full bg-transparent border-0 outline-none px-3 focus:ring-0 focus-visible:ring-0 text-neutral-dark",
                            fontClass
                        )}
                    />

                    {/* Clear Button */}
                    {hook.value && !hook.isUploading && (
                        <button
                            type="button"
                            onClick={hook.handleClear}
                            disabled={disabled}
                            className={cn(
                                "absolute flex items-center justify-center rounded-full text-neutral-light hover:text-danger hover:bg-danger/10 transition-all cursor-pointer",
                                clearBtnClass
                            )}
                            title="Xóa dữ liệu"
                        >
                            <X className={clearIconSizeClass} />
                        </button>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {hook.error && (
                <p className="text-[10px] text-danger font-medium text-left px-1 animate-fadeIn">
                    {hook.error}
                </p>
            )}
        </div>
    );
}

export default InputFile;
