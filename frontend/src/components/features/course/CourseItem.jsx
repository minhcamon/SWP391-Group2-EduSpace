const CourseItem = ({ course }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug hover:text-primary transition-colors cursor-pointer line-clamp-2 min-h-12">
                    {course.title}
                </h3>

                <p className="text-xs font-semibold text-secondary bg-indigo-50 px-2.5 py-1 rounded-md w-fit mb-4">
                    Tác giả: {course.creatorFullName}
                </p>

                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {course.description}
                </p>
            </div>

            <div className="flex gap-3 mt-auto">
                <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl text-sm transition-colors border border-gray-200 cursor-pointer">
                    Chi tiết
                </button>
                <button className="flex-1 bg-secondary hover:bg-[#ea580c] text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors shadow-sm shadow-orange-500/10 cursor-pointer">
                    Đăng ký ngay
                </button>
            </div>
        </div>
    );
};

export default CourseItem;
