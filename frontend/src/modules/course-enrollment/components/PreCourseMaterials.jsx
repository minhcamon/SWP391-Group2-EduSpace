import { BookOpen, FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
    Card,
    CardDescription,
    CardHeader,
} from "@/components/ui/Card";

export const PreCourseMaterials = ({ materials = [] }) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-neutral-dark flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-secondary" />
                    Tài liệu chuẩn bị trước (Pre-course Materials)
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {materials.map((doc) => (
                    <article
                        key={doc.id}
                        className="bg-white p-6 rounded-2xl border border-border-light/30 shadow-sm hover:shadow-md flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-1.5"
                    >
                        <div>
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                                    doc.type === "pdf"
                                        ? "bg-red-50 text-red-500"
                                        : "bg-orange-50 text-orange-500"
                                }`}
                            >
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-neutral-dark mb-2">
                                {doc.title}
                            </h3>
                            <p className="text-sm text-neutral-medium mb-6">
                                {doc.description}
                            </p>
                        </div>

                        {doc.type === "pdf" ? (
                            <Button
                                variant="outline"
                                className="w-full py-5 text-primary border-primary hover:bg-primary/5 font-semibold flex items-center justify-center gap-1.5"
                            >
                                <Download className="w-4 h-4" />
                                Tải xuống
                            </Button>
                        ) : (
                            <Button
                                variant="default"
                                className="w-full py-5 font-semibold flex items-center justify-center gap-1.5"
                            >
                                <Eye className="w-4 h-4" />
                                Xem trước
                            </Button>
                        )}
                    </article>
                ))}
            </div>

            {/* Quote card */}
            {/* <div className="pt-6 border-t border-border-light/25">
                <div className="bg-bg-card p-6 rounded-2xl text-center border border-border-light/25">
                    <p className="text-sm text-neutral-medium italic leading-relaxed">
                        "Success is where preparation and opportunity meet."
                    </p>
                </div>
            </div> */}

            <div className="pt-6 border-t border-border-light/25">
                <Card className="p-6 border border-gray-200 shadow-sm text-center">
                    <CardHeader>
                        <CardDescription className="text-sm text-neutral-medium italic leading-relaxed">
                            "Success is where preparation and opportunity meet."
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
};

export default PreCourseMaterials;
