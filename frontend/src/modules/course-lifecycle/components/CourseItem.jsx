import Badge from "@/components/ui/Badge";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

const CourseItem = ({ course }) => {
  const getDestinationUrl = () => {
    if (course?.enrollmentStatus === "ENROLLED" && course?.targetClassId) {
      return `/courses/${course.id}/dashboard`;
    }
    return `/courses/${course.id}`;
  };

  return (
    <Link to={getDestinationUrl()} className="block h-full">
      <Card className="bg-white shadow-sm hover:shadow-md transform transition-all duration-300 hover:-translate-y-1.5 cursor-pointer h-full">
        <CardHeader>
          <CardTitle className="font-bold text-xl min-h-12 text-neutral-dark">
            {course.title}
          </CardTitle>
          <CardDescription>{course.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="py-2.5">
            <span>Tác giả: {course.creatorFullName}</span>
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseItem;
