import { Check, X, BookOpen } from "lucide-react";
import { statusMapping } from "@/lib/data";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const CourseTable = ({
    courses,
    isHistory = false,
    onApproveClick,
    onRejectClick,
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider hover:bg-gray-50">
                            {!isHistory && (
                                <TableHead className="py-4 px-6 w-24 font-bold text-gray-500">
                                    ID Khóa Học
                                </TableHead>
                            )}
                            <TableHead className="py-4 px-6 w-64 font-bold text-gray-500">
                                Tên Khóa học
                            </TableHead>
                            {!isHistory ? (
                                <TableHead className="py-4 px-6 w-48 text-center font-bold text-gray-500">
                                    Ngày gửi yêu cầu
                                </TableHead>
                            ) : (
                                <TableHead className="py-4 px-6 w-48 text-center font-bold text-gray-500">
                                    Người tạo
                                </TableHead>
                            )}
                            {isHistory && (
                                <TableHead className="py-4 px-6 w-48 text-center font-bold text-gray-500">
                                    Ngày xử lý yêu cầu
                                </TableHead>
                            )}
                            <TableHead className="py-4 px-6 w-32 text-center font-bold text-gray-500">
                                Trạng thái
                            </TableHead>
                            {!isHistory && (
                                <TableHead className="py-4 px-6 w-52 text-right font-bold text-gray-500">
                                    Tác vụ
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-200 text-sm text-gray-600">
                        {courses.map((course) => {
                            const isPublished = course.status === "APPROVED";
                            return (
                                <TableRow
                                    key={
                                        !isHistory
                                            ? course.id
                                            : course.courseRequestId
                                    }
                                    className={`transition-colors border-b border-gray-200 ${
                                        isHistory
                                            ? isPublished
                                                ? "bg-emerald-50/20 hover:bg-emerald-50/40"
                                                : "bg-red-50/10 hover:bg-red-50/20"
                                            : "hover:bg-gray-50/40"
                                    }`}
                                >
                                    {!isHistory && (
                                        <TableCell className="py-5 px-6 font-bold text-gray-900">
                                            #{course.id}
                                        </TableCell>
                                    )}
                                    {!isHistory ? (
                                        <TableCell className="py-5 px-6">
                                            <div className="flex items-center gap-2">
                                                <BookOpen
                                                    size={16}
                                                    className="text-secondary opacity-80"
                                                />
                                                <div>
                                                    <div className="font-semibold text-gray-900">
                                                        {!isHistory &&
                                                            course.title}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Giảng viên:{" "}
                                                        {!isHistory &&
                                                            course.creatorFullName}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                    ) : (
                                        <TableCell className="py-5 px-6">
                                            <div className="flex items-center gap-2">
                                                <BookOpen
                                                    size={16}
                                                    className="text-secondary opacity-80"
                                                />
                                                <div className="font-semibold text-gray-900">
                                                    {isHistory &&
                                                        course.courseName}
                                                </div>
                                            </div>
                                        </TableCell>
                                    )}
                                    {isHistory && (
                                        <TableCell className="py-5 px-6">
                                            <div className="flex gap-2 justify-center">
                                                <div className="text-gray-500">
                                                    {course.creatorName}
                                                </div>
                                            </div>
                                        </TableCell>
                                    )}
                                    <TableCell className="py-5 px-6 text-gray-500 text-center">
                                        {!isHistory
                                            ? new Date(
                                                  course.createdAt,
                                              ).toLocaleDateString("vi-VN")
                                            : new Date(
                                                  course.processedAt,
                                              ).toLocaleDateString("vi-VN")}
                                    </TableCell>
                                    <TableCell className="py-5 px-6 text-center">
                                        <Badge
                                            variant={
                                                isHistory
                                                    ? isPublished
                                                        ? "approved"
                                                        : "destructive"
                                                    : "pending"
                                            }
                                        >
                                            {statusMapping[course.status] ||
                                                course.status}
                                        </Badge>
                                    </TableCell>
                                    {!isHistory && (
                                        <TableCell className="py-5 px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    onClick={() =>
                                                        onApproveClick(
                                                            course.id,
                                                        )
                                                    }
                                                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer h-8"
                                                >
                                                    <Check size={14} /> Duyệt
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        onRejectClick(course.id)
                                                    }
                                                    variant="outline"
                                                    className="flex items-center gap-1 bg-white hover:bg-red-50 text-red-600 border border-gray-200 hover:border-red-200 font-semibold py-2 px-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer h-8"
                                                >
                                                    <X size={14} /> Từ chối
                                                </Button>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default CourseTable;
