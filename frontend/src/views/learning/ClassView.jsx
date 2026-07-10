import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { ClassPage } from "@/modules/course-class";
import { MentorHeader } from "@/modules/mentor";
import { useAuth } from "@/contexts/AuthContext";

const ClassView = () => {
  const { user } = useAuth();
  const isMentorMode = user?.role === "MENTOR" || user?.username?.startsWith("mentor");

  return (
    <div className="min-h-screen w-full bg-bg-base flex flex-col">
      {isMentorMode ? <MentorHeader /> : <Header />}
      <ClassPage />
      {!isMentorMode && <Footer />}
    </div>
  );
};

export default ClassView;
