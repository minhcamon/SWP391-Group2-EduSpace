import { useEffect } from "react";
import { Link } from "react-router";
import { MoveRight } from "lucide-react";
import useMyLearning from "@/modules/learning/hooks/useMyLearning";
import EnrolledCourseCard from "@/modules/learning/components/EnrolledCourseCard";
import { useAuth } from "@/contexts/AuthContext";

const MyLearningContainer = () => {
  const { user } = useAuth();
  const {
    isLoading,
    myLearningCourses = [],
    handleContinueLearning,
    fetchMyLearningCourses,
  } = useMyLearning("Home Page");

  useEffect(() => {
    if (user) {
      fetchMyLearningCourses();
    }
  }, [user, fetchMyLearningCourses]);

  if (!user || isLoading || myLearningCourses.length === 0) {
    return null;
  }

  // Slice first 3 courses to match the popular courses grid layout
  const coursesToShow = myLearningCourses.slice(0, 3);

  return (
    <div className="mb-10">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Học tập của tôi</h1>
        <Link to="/my-learning">
          <div className="flex hover:opacity-80 transform transition-all duration-300 hover:-translate-y-1.5 cursor-pointer">
            <span className="text-primary font-semibold">Xem tất cả</span>
            <MoveRight className="flex my-auto ml-2 mt-1.5 text-primary" size={16} />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursesToShow.map((course) => (
          <EnrolledCourseCard
            key={course.courseId}
            course={course}
            onContinue={handleContinueLearning}
          />
        ))}
      </div>
    </div>
  );
};

export default MyLearningContainer;
