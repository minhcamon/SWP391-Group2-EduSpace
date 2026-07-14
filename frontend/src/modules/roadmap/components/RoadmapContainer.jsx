import { MoveRight } from "lucide-react";
import { Link } from "react-router";
import RoadmapItem from "./RoadmapItem";

const RoadmapContainer = () => {
    return (
        <div className="mt-12">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">Lộ trình đề xuất</h1>
                <Link to="/roadmaps">
                    <div className="flex hover:opacity-80 transform transition-all duration-300 hover:-translate-y-1.5">
                        <span className="text-primary font-semibold">
                            Xem tất cả
                        </span>
                        <MoveRight
                            className="flex my-auto ml-2 mt-1.5 text-primary"
                            size={16}
                        ></MoveRight>
                    </div>
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                <RoadmapItem actionText="Bắt đầu ngay" />
                <RoadmapItem actionText="Bắt đầu ngay" />
                <RoadmapItem actionText="Bắt đầu ngay" />
            </div>
        </div>
    );
};

export default RoadmapContainer;
