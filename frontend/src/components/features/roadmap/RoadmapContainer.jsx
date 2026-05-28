import { MoveRight } from "lucide-react";
import { Link } from "react-router";
import RoadmapItem from "./RoadmapItem";

const RoadmapContainer = () => {
    return (
        <div className="container mx-auto px-4 my-4">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">Lộ trình đề xuất</h1>
                <Link to="/roadmaps">
                    <div className="flex hover:opacity-80">
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
            <div className="flex grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4 gap-6 pb-2">
                <RoadmapItem actionText="Bắt đầu ngay" />
                <RoadmapItem actionText="Bắt đầu ngay" />
                <RoadmapItem actionText="Bắt đầu ngay" />
                <RoadmapItem actionText="Bắt đầu ngay" />
            </div>
        </div>
    );
};

export default RoadmapContainer;
