import { User, Mail, Check, X } from "lucide-react";
import { statusMapping } from "@/lib/data";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const getDownloadUrl = (url) => {
    if (!url) return "";
    // If it's a Cloudinary URL, inject fl_attachment flag to force download
    if (url.includes("/upload/")) {
        return url.replace("/upload/", "/upload/fl_attachment/");
    }
    return url;
};

const RequestTable = ({
    requests,
    isHistory = false,
    onApprovedClick,
    onRejectClick,
}) => {
    return (
        <>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table className="w-full text-left border-collapse">
                        <TableHeader>
                            <TableRow className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {!isHistory && (
                                    <TableHead className="py-4 px-6 w-24 font-bold text-gray-500">
                                        ID Đơn
                                    </TableHead>
                                )}
                                <TableHead className="py-4 px-6 w-72 font-bold text-gray-500">
                                    Ứng viên
                                </TableHead>
                                <TableHead className="py-4 px-6 w-64 font-bold text-gray-500">
                                    Minh chứng
                                </TableHead>
                                {isHistory && (
                                    <TableHead className="py-4 px-6 w-36 font-bold text-gray-500">
                                        Ngày xử lý
                                    </TableHead>
                                )}
                                <TableHead className="py-4 px-5 w-32 text-center font-bold text-gray-500">
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
                            {requests.map((request) => {
                                const isApproved =
                                    request.status === "APPROVED";
                                return (
                                    <TableRow
                                        key={
                                            !isHistory
                                                ? request.requestId
                                                : request.id
                                        }
                                        className={`transition-colors ${
                                            isHistory
                                                ? isApproved
                                                    ? "bg-emerald-50/20 hover:bg-emerald-50/40"
                                                    : "bg-red-50/10 hover:bg-red-50/20"
                                                : "hover:bg-gray-50/40"
                                        }`}
                                    >
                                        {!isHistory && (
                                            <TableCell className="py-5 px-6 font-bold text-gray-900">
                                                #{request.requestId}
                                            </TableCell>
                                        )}
                                        <TableCell className="py-5 px-6 space-y-1">
                                            <div className="flex items-center gap-1.5 text-gray-900 font-semibold">
                                                <User
                                                    size={14}
                                                    className="text-secondary"
                                                />{" "}
                                                {request.learnerName}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <Mail
                                                    size={14}
                                                    className="text-secondary"
                                                />{" "}
                                                {request.learnerEmail}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5 px-6">
                                            {request.documentUrl ? (
                                                <a
                                                    href={getDownloadUrl(request.documentUrl)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    download
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-primary hover:bg-primary/95 transition-all shadow-sm active:scale-[0.98]"
                                                >
                                                    📥 Tải tài liệu
                                                </a>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Không có tài liệu</span>
                                            )}
                                        </TableCell>
                                        {isHistory && (
                                            <TableCell className="py-4 px-6 w-36 font-bold text-gray-500">
                                                {new Date(
                                                    request.processedAt,
                                                ).toLocaleDateString("vi-VN")}
                                            </TableCell>
                                        )}
                                        <TableCell className="py-5 px-6 text-center">
                                            <Badge
                                                variant={
                                                    isHistory
                                                        ? isApproved
                                                            ? "approved"
                                                            : "destructive"
                                                        : "pending"
                                                }
                                            >
                                                {statusMapping[
                                                    request.status
                                                ] || request.status}
                                            </Badge>
                                        </TableCell>
                                        {!isHistory && (
                                            <TableCell className="py-5 px-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        onClick={() =>
                                                            onApprovedClick(
                                                                request.requestId,
                                                            )
                                                        }
                                                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-auto py-2 px-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer border border-transparent"
                                                    >
                                                        <Check size={14} />{" "}
                                                        Duyệt
                                                    </Button>
                                                    <Button
                                                        onClick={() =>
                                                            onRejectClick(
                                                                request.requestId,
                                                            )
                                                        }
                                                        variant="outline"
                                                        className="flex items-center gap-1 bg-white hover:bg-red-50 text-red-600 border border-gray-200 hover:border-red-200 font-semibold h-auto py-2 px-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
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
        </>
    );
};

export default RequestTable;
