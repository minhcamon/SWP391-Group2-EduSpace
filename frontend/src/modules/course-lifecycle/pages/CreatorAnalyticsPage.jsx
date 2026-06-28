import { useState } from 'react';
import {
  LuUsers, LuGraduationCap, LuInfo, LuTrendingUp,
  LuSearch, LuFilter, LuBookOpen, LuChevronDown, LuActivity
} from 'react-icons/lu';
import Avatar from "@/components/common/Avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";

export default function CreatorAnalytics() {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [timeRange, setTimeRange] = useState('30days');
  const [searchStudent, setSearchStudent] = useState('');

  // Mock data for analytics
  const courseOptions = [
    { id: 'all', name: 'Tất cả khóa học' },
    { id: 'c-1', name: 'Lập trình Spring Boot nâng cao' },
    { id: 'c-2', name: 'ReactJS Fundamentals & Architecture' },
    { id: 'c-3', name: 'Thiết kế Game Unity 3D C#' }
  ];

  const stats = {
    totalEnrolled: 500,
    passedCount: 390,
    failedCount: 75,
    droppedCount: 35,
    passRate: 78,
    failRate: 15,
    dropRate: 7,
    avgScore: 8.2
  };

  const studentsAtRisk = [
    { id: 's-1', name: 'Nguyễn Văn Anh', course: 'Lập trình Spring Boot nâng cao', avgScore: 4.2, status: 'Nguy cơ trượt', progress: 35, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80' },
    { id: 's-2', name: 'Trần Thị Bình', course: 'ReactJS Fundamentals', avgScore: 3.8, status: 'Cảnh báo học tập', progress: 20, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80' },
    { id: 's-3', name: 'Lê Hoàng Nam', course: 'Thiết kế Game Unity 3D', avgScore: 5.0, status: 'Tiến độ quá chậm', progress: 45, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80' }
  ];

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">

            {/* Header section */}
            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                <CardHeader className="p-0 flex-1">
                  <CardTitle className="text-2xl font-bold text-secondary flex items-center gap-2">
                    <LuActivity className="text-primary" /> Thống kê phân tích
                  </CardTitle>
                  <CardDescription className="text-sm text-neutral-medium mt-1">
                    Đánh giá toàn diện lượng người học, tỷ lệ hoàn thành chương trình, và phân bổ điểm số.
                  </CardDescription>
                </CardHeader>

                {/* Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="bg-white border border-border-light/40 pl-4 pr-10 py-2.5 h-auto rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer transition-all shadow-xs select-none gap-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {courseOptions.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="bg-white border border-border-light/40 pl-4 pr-10 py-2.5 h-auto rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer transition-all shadow-xs select-none gap-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">7 ngày qua</SelectItem>
                      <SelectItem value="30days">30 ngày qua</SelectItem>
                      <SelectItem value="alltime">Tất cả thời gian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Card 1: Total Enrolled */}
              <Card className="bg-white hover:shadow-[0px_10px_30px_rgba(79,70,229,0.05)] border border-border-light/30 transition-all duration-300">
                <CardContent className="p-5 flex items-center gap-4 relative overflow-hidden group">
                  <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-primary/5 rounded-full group-hover:scale-150 transition-all duration-500" />
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 z-10">
                    <LuUsers className="text-2xl" />
                  </div>
                  <div className="z-10">
                    <span className="text-xs text-neutral-medium font-semibold block">Lượng người tham gia</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-neutral-dark">{stats.totalEnrolled}</span>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <LuTrendingUp className="text-[11px]" /> +12% tuần này
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Passed Count */}
              <Card className="bg-white hover:shadow-[0px_10px_30px_rgba(16,185,129,0.05)] border border-border-light/30 transition-all duration-300">
                <CardContent className="p-5 flex items-center gap-4 relative overflow-hidden group">
                  <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-success/5 rounded-full group-hover:scale-150 transition-all duration-500" />
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-success shrink-0 z-10">
                    <LuGraduationCap className="text-2xl" />
                  </div>
                  <div className="z-10">
                    <span className="text-xs text-neutral-medium font-semibold block">Lượng người qua môn</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-neutral-dark">{stats.passedCount}</span>
                      <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-md">
                        {stats.passRate}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Failed Count */}
              <Card className="bg-white hover:shadow-[0px_10px_30px_rgba(239,68,68,0.05)] border border-border-light/30 transition-all duration-300">
                <CardContent className="p-5 flex items-center gap-4 relative overflow-hidden group">
                  <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-danger/5 rounded-full group-hover:scale-150 transition-all duration-500" />
                  <div className="w-12 h-12 bg-danger/10 rounded-xl flex items-center justify-center text-danger shrink-0 z-10">
                    <LuInfo className="text-2xl" />
                  </div>
                  <div className="z-10">
                    <span className="text-xs text-neutral-medium font-semibold block">Lượng người trượt môn</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-neutral-dark">{stats.failedCount}</span>
                      <span className="text-xs font-bold text-danger bg-danger/10 px-2 py-0.5 rounded-md">
                        {stats.failRate}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4: Avg Score */}
              <Card className="bg-white hover:shadow-[0px_10px_30px_rgba(249,115,22,0.05)] border border-border-light/30 transition-all duration-300">
                <CardContent className="p-5 flex items-center gap-4 relative overflow-hidden group">
                  <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-secondary/5 rounded-full group-hover:scale-150 transition-all duration-500" />
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary shrink-0 z-10">
                    <LuBookOpen className="text-2xl" />
                  </div>
                  <div className="z-10">
                    <span className="text-xs text-neutral-medium font-semibold block">Điểm số trung bình</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-neutral-dark">{stats.avgScore}</span>
                      <span className="text-[10px] text-gray-400 font-bold">Thang 10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Visual Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Chart 1: Monthly registration (Bar Chart in SVG) */}
              <Card className="bg-white border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.01)] col-span-2">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-dark">Xu hướng tham gia khóa học</h3>
                      <p className="text-[11px] text-neutral-medium">Lượng người tham gia mới đăng ký theo tháng</p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-primary rounded-xs"></span> Đăng ký mới</span>
                    </div>
                  </div>

                  {/* SVG Bar Chart */}
                  <div className="w-full pt-4">
                    <svg className="w-full h-64 overflow-visible" viewBox="0 0 600 240">
                      {/* Grid lines */}
                      <line x1="40" y1="20" x2="580" y2="20" stroke="#f1f1f5" strokeWidth="1" />
                      <line x1="40" y1="65" x2="580" y2="65" stroke="#f1f1f5" strokeWidth="1" />
                      <line x1="40" y1="110" x2="580" y2="110" stroke="#f1f1f5" strokeWidth="1" />
                      <line x1="40" y1="155" x2="580" y2="155" stroke="#f1f1f5" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="40" y1="200" x2="580" y2="200" stroke="#c7c4d8" strokeWidth="1.5" />

                      {/* Y-axis Labels */}
                      <text x="30" y="24" className="text-[9px] fill-gray-400 font-semibold" textAnchor="end">150</text>
                      <text x="30" y="69" className="text-[9px] fill-gray-400 font-semibold" textAnchor="end">100</text>
                      <text x="30" y="114" className="text-[9px] fill-gray-400 font-semibold" textAnchor="end">50</text>
                      <text x="30" y="204" className="text-[9px] fill-gray-400 font-semibold" textAnchor="end">0</text>

                      {/* Bars */}
                      {/* T1 - 42 */}
                      <rect x="75" y="125" width="28" height="75" rx="4" className="fill-primary/20 hover:fill-primary transition-all duration-300 cursor-pointer" />
                      <text x="89" y="115" className="text-[9px] fill-primary font-bold opacity-0 hover:opacity-100 transition-opacity" textAnchor="middle">42</text>
                      <text x="89" y="215" className="text-[10px] fill-neutral-medium font-bold" textAnchor="middle">T1</text>

                      {/* T2 - 68 */}
                      <rect x="155" y="78" width="28" height="122" rx="4" className="fill-primary/30 hover:fill-primary transition-all duration-300 cursor-pointer" />
                      <text x="169" y="68" className="text-[9px] fill-primary font-bold opacity-0 hover:opacity-100 transition-opacity" textAnchor="middle">68</text>
                      <text x="169" y="215" className="text-[10px] fill-neutral-medium font-bold" textAnchor="middle">T2</text>

                      {/* T3 - 120 */}
                      <rect x="235" y="30" width="28" height="170" rx="4" className="fill-primary/40 hover:fill-primary transition-all duration-300 cursor-pointer" />
                      <text x="249" y="20" className="text-[9px] fill-primary font-bold opacity-0 hover:opacity-100 transition-opacity" textAnchor="middle">120</text>
                      <text x="249" y="215" className="text-[10px] fill-neutral-medium font-bold" textAnchor="middle">T3</text>

                      {/* T4 - 95 */}
                      <rect x="315" y="52" width="28" height="148" rx="4" className="fill-primary/50 hover:fill-primary transition-all duration-300 cursor-pointer" />
                      <text x="329" y="42" className="text-[9px] fill-primary font-bold opacity-0 hover:opacity-100 transition-opacity" textAnchor="middle">95</text>
                      <text x="329" y="215" className="text-[10px] fill-neutral-medium font-bold" textAnchor="middle">T4</text>

                      {/* T5 - 145 */}
                      <rect x="395" y="10" width="28" height="190" rx="4" className="fill-primary hover:fill-primary transition-all duration-300 cursor-pointer animate-pulse" />
                      <text x="409" y="5" className="text-[9px] fill-primary font-bold" textAnchor="middle">145</text>
                      <text x="409" y="215" className="text-[10px] fill-neutral-medium font-bold" textAnchor="middle">T5 (Hiện tại)</text>
                    </svg>
                  </div>
                </CardContent>
              </Card>

              {/* Chart 2: Donut Chart - Pass / Fail Ratio */}
              <Card className="bg-white border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.01)]">
                <CardContent className="p-6 space-y-6 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-dark">Phân bổ tỷ lệ đầu ra</h3>
                    <p className="text-[11px] text-neutral-medium">Thống kê trạng thái hoàn thành</p>
                  </div>

                  {/* SVG Donut */}
                  <div className="flex justify-center items-center relative py-2">
                    <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 42 42">
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f1f1f5" strokeWidth="4.5"></circle>
                      {/* Success segment: 78% (strokeDasharray="78 22") */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" strokeDasharray="78 22" strokeDashoffset="0" className="transition-all duration-1000"></circle>
                      {/* Failed segment: 15% (strokeDasharray="15 85") */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" strokeDasharray="15 85" strokeDashoffset="-78" className="transition-all duration-1000"></circle>
                      {/* Dropped segment: 7% (strokeDasharray="7 93") */}
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="4.5" strokeDasharray="7 93" strokeDashoffset="-93" className="transition-all duration-1000"></circle>
                    </svg>
                    {/* Inside Center Text */}
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-xl font-extrabold text-neutral-dark">{stats.passRate}%</span>
                      <span className="text-[9px] font-bold text-success uppercase tracking-wider">Tỷ lệ qua</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-2 text-xs font-semibold">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-success rounded-full"></span>
                        <span className="text-gray-600">Qua môn (Passed)</span>
                      </div>
                      <span className="text-neutral-dark font-bold">{stats.passedCount} ({stats.passRate}%)</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-danger rounded-full"></span>
                        <span className="text-gray-600">Trượt (Failed)</span>
                      </div>
                      <span className="text-neutral-dark font-bold">{stats.failedCount} ({stats.failRate}%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-secondary rounded-full"></span>
                        <span className="text-gray-600">Bỏ dở (Dropped)</span>
                      </div>
                      <span className="text-neutral-dark font-bold">{stats.droppedCount} ({stats.dropRate}%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Score Distribution & Students at Risk Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Score Distribution (5 cols) */}
              <Card className="bg-white border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.01)] lg:col-span-5">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-dark">Phân bổ điểm học viên</h3>
                    <p className="text-[11px] text-neutral-medium">Phân chia lượng học viên theo phổ điểm chữ</p>
                  </div>

                  {/* Custom bar list */}
                  <div className="space-y-3.5 pt-2">
                    {[
                      { label: 'A+ (9.0 - 10.0)', count: 48, percentage: 12, color: 'bg-emerald-500' },
                      { label: 'A (8.0 - 8.9)', count: 180, percentage: 46, color: 'bg-emerald-400' },
                      { label: 'B (7.0 - 7.9)', count: 112, percentage: 29, color: 'bg-blue-500' },
                      { label: 'C (5.0 - 6.9)', count: 50, percentage: 13, color: 'bg-amber-500' },
                      { label: 'D/F (Dưới 5.0)', count: 35, percentage: 9, color: 'bg-red-500' }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-gray-600">{item.label}</span>
                          <span className="text-neutral-dark">{item.count} HV ({item.percentage}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Students at Risk List (7 cols) */}
              <Card className="bg-white border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.01)] lg:col-span-7">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-dark">Học viên cần lưu ý bổ trợ</h3>
                      <p className="text-[11px] text-neutral-medium">Danh sách người học có điểm số hoặc tiến trình cảnh báo đỏ</p>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 z-10">
                        <LuSearch className="text-xs" />
                      </span>
                      <input
                        type="text"
                        placeholder="Tìm tên học viên..."
                        value={searchStudent}
                        onChange={(e) => setSearchStudent(e.target.value)}
                        className="pl-8 pr-3 py-1.5 bg-bg-card border border-border-light/20 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary/40 w-44 placeholder:text-gray-400 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table className="w-full text-left border-collapse">
                      <TableHeader>
                        <TableRow className="border-b border-border-light/30 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          <TableHead className="pb-3 pl-2">Học viên</TableHead>
                          <TableHead className="pb-3">Khóa học</TableHead>
                          <TableHead className="pb-3">Điểm TB</TableHead>
                          <TableHead className="pb-3">Tiến độ</TableHead>
                          <TableHead className="pb-3 pr-2 text-right">Trạng thái</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-slate-100 text-xs">
                        {studentsAtRisk
                          .filter(s => s.name.toLowerCase().includes(searchStudent.toLowerCase()))
                          .map((std) => (
                            <TableRow key={std.id} className="hover:bg-slate-50/50 transition-colors">
                              <TableCell className="py-3 pl-2 flex items-center gap-3">
                                <Avatar
                                  src={std.avatar}
                                  alt={std.name}
                                  className="w-8 h-8 border border-slate-100 shrink-0"
                                />
                                <span className="font-bold text-neutral-dark">{std.name}</span>
                              </TableCell>
                              <TableCell className="py-3 text-neutral-medium max-w-37.5 truncate">{std.course}</TableCell>
                              <TableCell className="py-3 font-extrabold text-red-500">{std.avgScore}</TableCell>
                              <TableCell className="py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden shrink-0">
                                    <div className="h-full bg-amber-500" style={{ width: `${std.progress}%` }} />
                                  </div>
                                  <span className="text-[10px] font-bold text-neutral-medium">{std.progress}%</span>
                                </div>
                              </TableCell>
                              <TableCell className="py-3 pr-2 text-right">
                                <Badge
                                  className="h-auto px-2 py-0.5 rounded-md text-[9px] font-bold bg-red-50 text-red-600 border border-red-100"
                                >
                                  {std.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

            </div>

    </div>
  );
}
