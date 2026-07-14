import React from "react";

const MyLearningHero = () => {
    return (
        <section className="relative bg-bg-card rounded-2xl overflow-hidden border border-border-light/40 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between shadow-sm">
            {/* Left Content Column */}
            <div className="z-10 max-w-xl text-center md:text-left">
                <span className="inline-block px-3 py-1.5 bg-primary/10 text-primary font-bold text-xs rounded-full mb-4 uppercase tracking-wider">
                    Pair Learning Cohort
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-dark tracking-tight leading-tight mb-4">
                    Chào mừng bạn trở lại với eduSpace!
                </h2>
                <p className="text-base md:text-lg text-neutral-medium leading-relaxed">
                    Hành trình học tập hợp tác của bạn vẫn đang tiếp diễn. Hãy cùng các học viên khác trong cohort chinh phục kiến thức lập trình nhanh hơn bao giờ hết.
                </p>
            </div>

            {/* Backdrops & Gradients */}
            <div className="absolute inset-0 bg-linear-to-r from-bg-card via-bg-card to-primary/5 pointer-events-none"></div>
            <div className="hidden md:block w-72 h-72 rounded-full bg-linear-to-br from-primary to-tertiary opacity-10 blur-3xl absolute -right-10 -top-10"></div>

            {/* Right Media Graphic */}
            <div className="relative z-10 w-full md:w-1/3 aspect-video md:aspect-square max-w-[280px]">
                <img
                    alt="Collaborative learning"
                    className="w-full h-full object-cover rounded-2xl shadow-md border border-border-light/20"
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
                />
            </div>
        </section>
    );
};

export default MyLearningHero;
