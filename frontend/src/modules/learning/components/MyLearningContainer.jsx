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

  const activeCourses = myLearningCourses.filter((c) => !c.isCompleted && c.classId);
  const waitingCourses = myLearningCourses.filter((c) => !c.isCompleted && !c.classId);

  if (activeCourses.length === 0 && waitingCourses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-10 mb-10">
      {/* Active Courses */}
      {activeCourses.length > 0 && (
        <div>
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold text-neutral-dark">Học tập của tôi</h1>
            <Link to="/my-learning">
              <div className="flex hover:opacity-80 transform transition-all duration-300 hover:-translate-y-1.5 cursor-pointer">
                <span className="text-primary font-semibold">Xem tất cả</span>
                <MoveRight className="flex my-auto ml-2 mt-1.5 text-primary" size={16} />
              </div>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCourses.slice(0, 3).map((course) => (
              <EnrolledCourseCard
                key={course.courseId}
                course={course}
                onContinue={handleContinueLearning}
              />
            ))}
          </div>
        </div>
      )}

      {/* Waiting Courses */}
      {waitingCourses.length > 0 && (
        <div>
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold text-neutral-dark">Khóa học đang trong hàng chờ</h1>
            <Link to="/my-learning">
              <div className="flex hover:opacity-80 transform transition-all duration-300 hover:-translate-y-1.5 cursor-pointer">
                <span className="text-primary font-semibold">Xem tất cả</span>
                <MoveRight className="flex my-auto ml-2 mt-1.5 text-primary" size={16} />
              </div>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {waitingCourses.slice(0, 3).map((course) => (
              <EnrolledCourseCard
                key={course.courseId}
                course={course}
                onContinue={handleContinueLearning}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLearningContainer;
