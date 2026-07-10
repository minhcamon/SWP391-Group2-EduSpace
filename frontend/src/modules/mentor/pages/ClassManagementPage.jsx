import React, { useState, useEffect } from "react";
import { GraduationCap, Search, Users, AlertCircle, Plus } from "lucide-react";
import mentorService from "@/services/mentorService";
import MentorClassCard from "../components/MentorClassCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { runWithLoading } from "@/utils/utils";
import { toast } from "sonner";

const ClassManagementPage = () => {
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        await runWithLoading(setIsLoading, async () => {
          const data = await mentorService.getMentorClasses();
          setClasses(data);
        });
      } catch (err) {
        toast.error("Không thể tải danh sách lớp học!");
      }
    };
    fetchClasses();
  }, []);

  const filteredClasses = classes.filter((c) =>
    c.cohortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark tracking-tight">
            Quản lý Lớp học
          </h1>
          <p className="text-sm text-neutral-medium mt-1">
            Danh sách lớp học và học viên bạn đang theo sát và hỗ trợ.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border border-border-light/40 shadow-sm">
          <CardContent className="pt-1 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-dark">{classes.length}</p>
              <p className="text-xs text-neutral-medium font-semibold">Lớp học Đang Mentor</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border-light/40 shadow-sm">
          <CardContent className="pt-1 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-dark">
                {classes.reduce((acc, c) => acc + c.pairs.length * 2, 0)}
              </p>
              <p className="text-xs text-neutral-medium font-semibold">Học viên Đang Phục vụ</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border-light/40 shadow-sm">
          <CardContent className="pt-1 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-dark">
                {classes.reduce((acc, c) => acc + c.pairs.filter(p => p.status === "SLOW").length, 0)}
              </p>
              <p className="text-xs text-neutral-medium font-semibold font-sans">Cặp đôi đang gặp khó khăn (Slow)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-border-light/35 rounded-2xl p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-neutral-light w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm lớp học, khóa học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border-light/65 rounded-xl text-sm focus:outline-none focus:border-primary transition-all duration-200"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="px-3 py-2 border border-border-light/65 rounded-xl text-sm text-neutral-medium focus:outline-none bg-white font-semibold">
            <option>Tất cả kỳ học</option>
            <option>Spring 2024</option>
          </select>
        </div>
      </div>

      {/* Classes Grid */}
      {isLoading ? (
        <div className="grow flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="bg-white border border-border-light/35 rounded-2xl p-12 text-center shadow-sm">
          <GraduationCap size={48} className="mx-auto text-neutral-light mb-4" />
          <h3 className="text-lg font-bold text-neutral-dark mb-1">Không tìm thấy lớp học</h3>
          <p className="text-sm text-neutral-medium">Thử nhập từ khóa tìm kiếm khác</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClasses.map((c) => (
            <MentorClassCard key={c.id} classItem={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassManagementPage;
