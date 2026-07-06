import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { AssignmentPage } from "@/modules/learning";

const Assignment = () => {
  return (
    <div className="min-h-screen w-full bg-bg-base flex flex-col">
      <Header />
      <AssignmentPage />
      <Footer />
    </div>
  );
};

export default Assignment;
