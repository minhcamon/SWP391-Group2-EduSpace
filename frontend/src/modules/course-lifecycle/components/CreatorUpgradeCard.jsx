import React, { useState } from "react";
import { Award, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import CreatorRegisterModal from "./CreatorRegisterModal";

const CreatorUpgradeCard = ({ user }) => {
    const [showCreatorModal, setShowCreatorModal] = useState(false);
    const [isLocallyPending, setIsLocallyPending] = useState(false);

    if (!user || user.role === "ADMIN") return null;

    // Check if user is already a Creator
    const isCreator = user.role === "CREATOR";

    // Check if request is pending
    const isPending =
        isLocallyPending ||
        user.creatorStatus === "PENDING" ||
        user.creatorRequestStatus === "PENDING" ||
        user.isCreatorPending === true ||
        user.role === "PENDING_CREATOR";

    if (isCreator) {
        return (
            <div className="bg-white rounded-2xl border border-emerald-500/20 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                {/* Decorative background circle */}
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-110 transition-all duration-500"></div>

                {/* Success Icon */}
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5 border border-emerald-100">
                    <CheckCircle2 size={32} />
                </div>

                <h4 className="text-lg font-bold text-neutral-dark mb-2">Bạn đã là Content Creator</h4>
                <p className="text-xs text-neutral-medium leading-relaxed mb-6">
                    Tài khoản của bạn đã được nâng cấp. Bạn có đầy đủ quyền hạn để đăng tải tài liệu, tạo khóa học và xây dựng lộ trình học tập cho học viên!
                </p>

                <a
                    href="/creator"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-6 rounded-xl text-sm transition-all active:scale-[0.98] flex justify-center items-center gap-2 shadow-sm shadow-emerald-500/20"
                >
                    Đi tới Creator Dashboard
                    <ExternalLink size={16} />
                </a>
            </div>
        );
    }

    if (isPending) {
        return (
            <div className="bg-white rounded-2xl border border-amber-500/20 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                {/* Decorative background circle */}
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-110 transition-all duration-500"></div>

                {/* Pending Icon */}
                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-5 border border-amber-100">
                    <Clock size={32} />
                </div>

                <h4 className="text-lg font-bold text-neutral-dark mb-2">Yêu cầu đang chờ duyệt</h4>
                <p className="text-xs text-neutral-medium leading-relaxed mb-6">
                    Đơn đăng ký Content Creator của bạn đã được gửi lên hệ thống và đang chờ Admin phê duyệt. Kết quả sẽ được cập nhật sớm nhất!
                </p>

                <button
                    disabled
                    className="w-full bg-amber-50 text-amber-600 font-semibold py-3.5 px-6 rounded-xl text-sm cursor-not-allowed border border-amber-200/50 flex justify-center items-center gap-2"
                >
                    <Clock size={16} className="animate-spin" />
                    Đang kiểm duyệt...
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-2xl border border-secondary/20 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                {/* Decorative background circle */}
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-secondary/10 rounded-full blur-2xl group-hover:scale-110 transition-all duration-500"></div>

                {/* Award Icon */}
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-5 border border-secondary/20">
                    <Award size={32} />
                </div>

                <h4 className="text-lg font-bold text-neutral-dark mb-2">Nâng cấp làm Creator</h4>
                <p className="text-xs text-neutral-medium leading-relaxed mb-6">
                    Chia sẻ kiến thức của bạn tới cộng đồng học viên EduSpace. Trở thành Content Creator để tự xây dựng lộ trình học và thiết kế khóa học của riêng bạn!
                </p>

                <button
                    onClick={() => setShowCreatorModal(true)}
                    className="w-full bg-secondary hover:bg-[#ea580c] text-white font-semibold py-3.5 px-6 rounded-xl text-sm transition-all active:scale-[0.98] cursor-pointer flex justify-center items-center gap-2 shadow-sm shadow-orange-500/20"
                >
                    Đăng ký làm Content Creator
                </button>
            </div>

            {/* Modal Popup */}
            <CreatorRegisterModal
                isOpen={showCreatorModal}
                onClose={() => setShowCreatorModal(false)}
                onSuccess={() => setIsLocallyPending(true)}
            />
        </>
    );
};

export default CreatorUpgradeCard;
