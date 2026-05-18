const RoadmapItem = ({ title, description, actionText }) => {
    return (
        <div className="flex flex-col justify-between p-6 min-w-280px border bg-white border-gray-200 rounded-2xl shadow-sm transition-all hover:shadow-sm">
            <div>
                <h3 className="text-xl font-bold text-neutral mb-2 leading-snug">
                    {title}
                    Tăng tốc Reading
                </h3>
                <p className="text-gray-500 text-md leading-relaxed mb-6">
                    {description}
                    Tập trung cải thiện tốc độ đọc hiểu và từ vựng học thuật 
                </p>
            </div>
            <button className="w-fit font-bold text-sm text-primary hover:opacity-80 transition-opacity cursor-pointer">
                {actionText}
            </button>
        </div>
    );
};

export default RoadmapItem;
