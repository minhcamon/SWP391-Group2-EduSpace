import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import mediaService from "@/services/mediaService";

export function useInputFile({ value: propValue, accept = "*", maxSize = 10 * 1024 * 1024, onChange }) {
    const [value, setValue] = useState(propValue || "");
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (propValue !== undefined) {
            setValue(propValue);
        }
    }, [propValue]);

    // Validate a selected/pasted file
    const validateFile = (file) => {
        setError("");
        if (file.size > maxSize) {
            const err = `Tệp vượt quá ${(maxSize / (1024 * 1024)).toFixed(0)}MB.`;
            setError(err);
            toast.error(err);
            return false;
        }

        if (accept !== "*") {
            const fileType = file.type;
            const extension = "." + file.name.split(".").pop().toLowerCase();
            const acceptList = accept.split(",").map(i => i.trim());
            const isAccepted = acceptList.some(acc => {
                if (acc.endsWith("/*")) return fileType.startsWith(acc.replace("/*", ""));
                return acc === extension || acc === fileType;
            });

            if (!isAccepted) {
                const err = `Định dạng tệp không hợp lệ. Yêu cầu: ${accept}`;
                setError(err);
                toast.error(err);
                return false;
            }
        }
        return true;
    };

    // Upload file and auto-fill URL
    const uploadAndSetUrl = async (file) => {
        if (!validateFile(file)) return;

        setIsUploading(true);
        setError("");
        try {
            const uploadedUrl = await mediaService.upload(file);
            setValue(uploadedUrl);
            toast.success("Tải tệp lên thành công!");
            if (onChange) {
                onChange({
                    type: "file",
                    url: uploadedUrl,
                    fileName: file.name
                });
            }
        } catch (err) {
            console.error("Upload failed in InputFile hook:", err);
            const errMsg = err.message || "Tải tệp lên thất bại!";
            setError(errMsg);
            toast.error(errMsg);
        } finally {
            setIsUploading(false);
        }
    };

    // Handle standard URL typing/editing
    const handleTextChange = (text) => {
        setValue(text);
        setError("");
        if (onChange) {
            onChange({
                type: "link",
                url: text
            });
        }
    };

    // Handle clipboard paste
    const handlePaste = async (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        const pastedFiles = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === "file") {
                const file = items[i].getAsFile();
                if (file) pastedFiles.push(file);
            }
        }

        // If there are files in clipboard, upload them and prevent default text pasting
        if (pastedFiles.length > 0) {
            e.preventDefault();
            await uploadAndSetUrl(pastedFiles[0]);
        }
        // Otherwise, allow standard URL text paste to happen normally
    };

    const handleClear = () => {
        setValue("");
        setError("");
        if (onChange) {
            onChange({
                type: "clear",
                url: ""
            });
        }
    };

    return {
        value,
        setValue,
        isUploading,
        error,
        fileInputRef,
        uploadAndSetUrl,
        handleTextChange,
        handlePaste,
        handleClear
    };
}
export default useInputFile;
