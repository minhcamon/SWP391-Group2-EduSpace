import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { User, Mail, Phone } from "lucide-react";

const ProfileEditForm = ({ profileForm, onChange, onSubmit, isLoading }) => {
    return (
        <Card className="bg-white border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
            <CardHeader className="p-6 md:p-8 pb-0">
                <CardTitle className="text-lg font-bold text-neutral-dark flex items-center gap-2 border-b border-slate-100 pb-4">
                    <User size={20} className="text-primary" /> Cập nhật thông tin cá nhân
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 pt-0">
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="fullName">
                                Họ và Tên
                            </Label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-light z-10">
                                    <User size={16} />
                                </span>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={profileForm.fullName}
                                    onChange={onChange}
                                    placeholder="Nguyen Van A"
                                    className="pl-10 pr-4 py-3 h-auto bg-bg-card border-border-light/40 rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="username">
                                Tên đăng nhập
                            </Label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-light z-10">
                                    <User size={16} />
                                </span>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={profileForm.username}
                                    disabled
                                    placeholder="username"
                                    className="pl-10 pr-4 py-3 h-auto bg-slate-50 border-border-light/20 text-neutral-medium rounded-xl cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="email">
                                Địa chỉ Email
                            </Label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-light z-10">
                                    <Mail size={16} />
                                </span>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={profileForm.email}
                                    onChange={onChange}
                                    placeholder="nguyen.van.a@example.com"
                                    className="pl-10 pr-4 py-3 h-auto bg-bg-card border-border-light/40 rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="phone">
                                Số điện thoại
                            </Label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-light z-10">
                                    <Phone size={16} />
                                </span>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    value={profileForm.phone}
                                    onChange={onChange}
                                    placeholder="0123456789"
                                    className="pl-10 pr-4 py-3 h-auto bg-bg-card border-border-light/40 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="bio">
                            Giới thiệu ngắn
                        </Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            rows={3}
                            value={profileForm.bio}
                            onChange={onChange}
                            placeholder="Một vài dòng tự giới thiệu về bản thân..."
                            className="bg-bg-card border border-border-light/40 rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all placeholder:text-neutral-light"
                        />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-2 border-t border-slate-100">
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="bg-primary hover:opacity-95 text-white font-semibold py-3 px-6 h-auto rounded-xl text-sm transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2"
                        >
                            Lưu thay đổi
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ProfileEditForm;
