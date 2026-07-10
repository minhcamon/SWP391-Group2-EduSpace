import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, BookOpen, Users, Award, ShieldAlert } from "lucide-react";
import mentorService from "@/services/mentorService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { runWithLoading } from "@/utils/utils";
import { toast } from "sonner";

const ClassDetailPage = () => {
  const { classId } = useParams();
  const [classDetail, setClassDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClassDetail = async () => {
      try {
        await runWithLoading(setIsLoading, async () => {
          const data = await mentorService.getClassById(classId);
          setClassDetail(data);
        });
      } catch (err) {
        toast.error(err.message || "Không thể tải thông tin chi tiết lớp học!");
      }
    };
    fetchClassDetail();
  }, [classId]);

  if (isLoading) {
    return (
      <div className="grow flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!classDetail) {
    return (
      <div className="grow max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold text-neutral-dark mb-2">Không tìm thấy lớp học</h2>
        <Link to="/mentor/classes" className="text-primary hover:underline text-sm font-semibold">
          Quay lại danh sách lớp học
        </Link>
      </div>
    );
  }

  const slowPairsCount = classDetail.pairs.filter((p) => p.status === "SLOW").length;

  return (
    <div className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Back button & Header */}
      <div className="mb-6">
        <Link
          to="/mentor/classes"
          className="inline-flex items-center gap-1.5 text-neutral-medium hover:text-primary text-sm font-semibold mb-4 transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          <span>Quay lại Quản lý Lớp học</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark tracking-tight">
                {classDetail.cohortName}
              </h1>
              <Badge variant="roletag" className="text-[11px] font-bold">
                {classDetail.semester}
              </Badge>
            </div>
            <p className="text-sm text-neutral-medium mt-1">
              Khóa học: <span className="font-semibold text-neutral-dark">{classDetail.courseTitle}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Class Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border border-border-light/40 shadow-sm">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-neutral-dark">{classDetail.studentCount}</p>
              <p className="text-xs text-neutral-medium font-semibold">Sĩ số lớp học</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border-light/40 shadow-sm">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
              <Award size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-neutral-dark">{classDetail.averageProgress}%</p>
              <p className="text-xs text-neutral-medium font-semibold">Tiến độ trung bình</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border-light/40 shadow-sm">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-xl text-red-600">
              <ShieldAlert size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-neutral-dark">{slowPairsCount}</p>
              <p className="text-xs text-neutral-medium font-semibold">Cặp học chậm (Slow)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border-light/40 shadow-sm">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-neutral-dark">{classDetail.unansweredQuestions}</p>
              <p className="text-xs text-neutral-medium font-semibold">Câu hỏi chưa trả lời</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pairs List Section */}
      <h3 className="text-lg font-bold text-neutral-dark mb-4">Danh sách các Cặp đôi học tập (Learning Pairs)</h3>
      <div className="grid grid-cols-1 gap-4">
        {classDetail.pairs.map((pair) => (
          <Card key={pair.id} className="border border-border-light/35 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Partner Profiles */}
              <div className="flex items-center gap-6 flex-1 min-w-0">
                <div className="flex -space-x-4 items-center shrink-0">
                  <img
                    src={pair.student1.avatar}
                    alt={pair.student1.name}
                    className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm bg-slate-100"
                  />
                  <img
                    src={pair.student2.avatar}
                    alt={pair.student2.name}
                    className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm bg-slate-100"
                  />
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-neutral-dark text-base truncate">
                    {pair.student1.name} & {pair.student2.name}
                  </p>
                  <p className="text-xs text-neutral-medium font-semibold mt-0.5">
                    Mã cặp đôi: <span className="font-bold text-primary">#PAIR-0{pair.id}</span>
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-medium mb-1.5">
                  <span>Tiến độ học tập</span>
                  <span className="text-neutral-dark font-bold">{pair.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      pair.status === "SLOW" ? "bg-red-500" : "bg-primary"
                    }`}
                    style={{ width: `${pair.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Status Badge & Action */}
              <div className="flex items-center gap-4 justify-between md:justify-end shrink-0">
                <Badge
                  variant={pair.status === "SLOW" ? "destructive" : "approved"}
                  className="font-bold uppercase tracking-wider text-[10px] px-2.5 py-0.5"
                >
                  {pair.status === "SLOW" ? "Cảnh báo (Slow)" : "Hoạt động tốt"}
                </Badge>
                <Link
                  to={`/mentor/pairs/${pair.id}`}
                  className="px-4 py-2 border border-primary hover:bg-primary/5 text-primary text-xs font-bold rounded-xl transition-all duration-150 active:scale-98"
                >
                  Xem chi tiết
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClassDetailPage;
