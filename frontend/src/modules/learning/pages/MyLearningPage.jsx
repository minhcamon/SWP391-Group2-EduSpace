import { useEffect } from "react";
import useMyLearning from "../hooks/useMyLearning";
import MyLearningHero from "../components/MyLearningHero";
import EnrolledCourseCard from "../components/EnrolledCourseCard";

const MyLearningPage = () => {
  const {
    isLoading,
    myLearningCourses = [],
    handleContinueLearning,
    fetchMyLearningCourses,
  } = useMyLearning("My Learning Page");

  useEffect(() => {
    fetchMyLearningCourses();
  }, [fetchMyLearningCourses]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center bg-bg-base">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-neutral-medium">
            Đang tải thông tin học tập của bạn...
          </p>
        </div>
      </div>
    );
  }

  const activeCourses = myLearningCourses.filter((c) => c.progressPercentage > 0 && c.progressPercentage < 100);
  const waitingCourses = myLearningCourses.filter((c) => c.progressPercentage === 0);
  const completedCourses = myLearningCourses.filter((c) => c.progressPercentage === 100);

  return (
    <main className="flex-1 p-6 md:p-10 mx-auto w-full space-y-10">
      {/* Hero Section */}
      <MyLearningHero />

      {/* Courses / Cohorts Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl md:text-2xl font-bold text-neutral-dark">
            Khóa học của bạn
          </h3>
        </div>

        <div className="mt-5 px-2">
          Hiện tại bạn đang học{" "}
          <strong className="text-secondary">{activeCourses.length}</strong>{" "}
          khóa học
        </div>

        {/* Courses Bento Grid */}
        {activeCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeCourses.map((course) => (
              <EnrolledCourseCard
                key={course.courseId}
                course={course}
                onContinue={handleContinueLearning}
              />
            ))}
          </div>
        ) : (
          <div className="px-4 py-6 text-sm text-neutral-light bg-bg-card border border-border-light/20 rounded-xl">
            Bạn chưa bắt đầu học khóa học nào.
          </div>
        )}
      </section>

      {/* Courses / Cohorts Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl md:text-2xl font-bold text-neutral-dark">
            Khóa học đang trong hàng chờ
          </h3>
        </div>

        <div className="mt-5 px-2">
          Hiện tại bạn có{" "}
          <strong className="text-secondary">{waitingCourses.length}</strong>{" "}
          khóa học trong danh sách chờ
        </div>

        {/* Courses Bento Grid */}
        {waitingCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {waitingCourses.map((course) => (
              <EnrolledCourseCard
                key={course.courseId}
                course={course}
                onContinue={handleContinueLearning}
              />
            ))}
          </div>
        ) : (
          <div className="px-4 py-6 text-sm text-neutral-light bg-bg-card border border-border-light/20 rounded-xl">
            Không có khóa học nào trong danh sách chờ.
          </div>
        )}
      </section>

      {/* Courses / Cohorts Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl md:text-2xl font-bold text-neutral-dark">
            Khóa học đã hoàn thành
          </h3>
        </div>

        <div className="mt-5 px-2">
          Hiện tại bạn đã hoàn thành{" "}
          <strong className="text-secondary">{completedCourses.length}</strong>{" "}
          khóa học
        </div>

        {/* Courses Bento Grid */}
        {completedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {completedCourses.map((course) => (
              <EnrolledCourseCard
                key={course.courseId}
                course={course}
                onContinue={handleContinueLearning}
              />
            ))}
          </div>
        ) : (
          <div className="px-4 py-6 text-sm text-neutral-light bg-bg-card border border-border-light/20 rounded-xl">
            Bạn chưa hoàn thành khóa học nào.
          </div>
        )}
      </section>
    </main>
  );
};

export default MyLearningPage;
