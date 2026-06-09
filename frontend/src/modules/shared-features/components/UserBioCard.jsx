import React from "react";
import Avatar from "@/components/common/Avatar";
import { Card, CardContent } from "@/components/ui/Card";

const UserBioCard = ({ user, profileForm }) => {
    return (
        <Card className="lg:col-span-2 bg-white border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0px_10px_30px_rgba(79,70,229,0.04)] transition-all duration-300">
            <CardContent className="p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar Wrapper (Read-only) */}
                <div className="relative shrink-0">
                    <Avatar
                        alt="User Avatar"
                        className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-bg-card shadow-sm"
                        src={profileForm.avatarUrl}
                    />
                </div>

                {/* User basic info */}
                <div className="text-center sm:text-left flex-1 space-y-3">
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-dark">{profileForm.fullName || user.username}</h2>
                        <p className="text-sm text-neutral-medium font-medium mt-0.5">@{user.username}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-medium leading-relaxed italic">
                        "{profileForm.bio}"
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                        <span className="bg-primary/10 text-primary border border-primary/20 px-3.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                            {user.role === "CREATOR" ? "Content Creator" : user.role === "ADMIN" ? "Quản trị viên" : "Học viên"}
                        </span>
                        <span className="bg-tertiary/10 text-tertiary border border-tertiary/20 px-3.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                            Thành viên EduSpace
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserBioCard;
