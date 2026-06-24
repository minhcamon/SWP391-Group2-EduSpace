import { Target, Hand } from "lucide-react";

const PartnerCard = ({ partner, handleSayHi }) => {
    if (!partner) return null;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-light/35 flex flex-col items-center text-center space-y-4 hover:shadow-md transition-all">
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider">
                Bạn đồng hành của bạn
            </h2>
            
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 shadow-sm shrink-0">
                <img
                    alt="Partner avatar"
                    className="w-full h-full object-cover"
                    src={partner.avatarUrl || partner.avatar || "/images/default-avatar.png"}
                />
                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></span>
            </div>

            <div>
                <h3 className="text-lg font-bold text-neutral-dark">{partner.name}</h3>
                <p className="text-xs text-neutral-medium flex items-center justify-center gap-1 mt-1">
                    <Target size={14} className="text-primary" />
                    Mục tiêu: {partner.description || partner.goal || "Chưa đặt mục tiêu"}
                </p>
            </div>

            <button
                onClick={handleSayHi}
                className="w-full mt-2 bg-secondary/10 hover:bg-secondary/20 text-secondary font-bold text-sm py-3 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
            >
                <Hand size={16} />
                Say Hi
            </button>
        </div>
    );
};

export default PartnerCard;
