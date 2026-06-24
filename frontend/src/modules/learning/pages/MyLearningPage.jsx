import { useEffect } from "react";
import useMyLearning from "../hooks/useMyLearning";
import MyLearningHero from "../components/MyLearningHero";
import EnrolledCourseCard from "../components/EnrolledCourseCard";
// import AvailableCourseCard from "../components/AvailableCourseCard";
// import { toast } from "sonner";

const myLearningCourses = [
  {
    courseId: 0,
    courseName: "string",
    courseDescription: "string",
    progressPercentage: 0.1,
    classId: 0,
    currentLessonId: 0,
    currentLessonTitle: "string",
    currentModuleTitle: "string",
  },
  {
    courseId: 1,
    courseName: "string",
    courseDescription: "string",
    progressPercentage: 0.1,
    classId: 0,
    currentLessonId: 0,
    currentLessonTitle: "string",
    currentModuleTitle: "string",
  },
  {
    courseId: 2,
    courseName: "string",
    courseDescription: "string",
    progressPercentage: 0.1,
    classId: 0,
    currentLessonId: 0,
    currentLessonTitle: "string",
    currentModuleTitle: "string",
  },
];

const MyLearningPage = () => {
  const {
    isLoading,
    // activeCourses,
    // availableCourses,
    // myLearningCourses,
    handleContinueLearning,
    // handleJoinCohort,
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
          Hiện tại bạn đang có{" "}
          <strong className="text-secondary">{myLearningCourses.length}</strong>{" "}
          khóa học
        </div>

        {/* Courses Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Enrolled Courses */}
          {myLearningCourses.map((course) => (
            <EnrolledCourseCard
              key={course.courseId}
              course={course}
              onContinue={handleContinueLearning}
            />
          ))}
        </div>
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
          <strong className="text-secondary">{myLearningCourses.length}</strong>{" "}
          khóa học trong danh sách chờ
        </div>

        {/* Courses Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Enrolled Courses */}
          {myLearningCourses.map((course) => (
            <EnrolledCourseCard
              key={course.courseId}
              course={course}
              onContinue={handleContinueLearning}
            />
          ))}
        </div>
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
          <strong className="text-secondary">{myLearningCourses.length}</strong>{" "}
          khóa học
        </div>

        {/* Courses Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Enrolled Courses */}
          {myLearningCourses.map((course) => (
            <EnrolledCourseCard
              key={course.courseId}
              course={course}
              onContinue={handleContinueLearning}
            />
          ))}
        </div>
      </section>

      {/* Courses / Cohorts Section */}
      {/* <section className="space-y-6"> */}
      {/* <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl md:text-2xl font-bold text-neutral-dark">
                        Khóa học mới
                    </h3>
                </div> */}
      {/* Available/Recommended Courses */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {availableCourses.map((course) => (
                        <AvailableCourseCard
                            key={course.id}
                            course={course}
                            onJoin={handleJoinCohort}
                        />
                    ))}
                </div> */}
      {/* </section> */}
    </main>
  );
};

export default MyLearningPage;
