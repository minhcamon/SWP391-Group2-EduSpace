import React from "react";
import { cn } from "@/lib/utils";

const EmptyState = ({
    icon: Icon,
    title,
    description,
    children,
    className,
    ...props
}) => {
    return (
        <div
            className={cn(
                "py-16 px-6 text-center bg-white rounded-2xl border border-dashed border-border-light/60 shadow-xs flex flex-col items-center justify-center",
                className
            )}
            {...props}
        >
            {Icon && (
                <div className="w-14 h-14 bg-slate-50 text-neutral-light rounded-full flex items-center justify-center mb-4 border border-slate-100/60 shrink-0">
                    <Icon size={24} />
                </div>
            )}
            {title && (
                <h3 className="font-bold text-neutral-dark text-sm mb-1">
                    {title}
                </h3>
            )}
            {description && (
                <p className="text-xs text-neutral-medium max-w-sm mx-auto leading-relaxed mt-1">
                    {description}
                </p>
            )}
            {children}
        </div>
    );
};

export default EmptyState;
