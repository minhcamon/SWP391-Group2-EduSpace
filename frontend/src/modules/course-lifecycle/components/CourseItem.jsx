import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";

const CourseItem = ({ course }) => {
    return (
        <div>
            <Card className=" bg-white shadow-sm hover:shadow-md transform transition-all duration-300 hover:-translate-y-1.5">
                <CardHeader>
                    <CardTitle className="font-bold text-xl min-h-12">
                        {course.title}
                    </CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Badge variant="secondary" className="py-2.5">
                        <span>Tác giả: {course.creatorFullName}</span>
                    </Badge>
                    <div className="flex gap-4 mt-4 justify-end">
                        <Button variant="outline" className="">
                            Chi tiết
                        </Button>
                        <Button>Đăng ký ngay</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CourseItem;
