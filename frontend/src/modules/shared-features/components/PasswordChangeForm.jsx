import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Button from "@/components/ui/Button";
import { Lock, KeyRound } from "lucide-react";

const PasswordChangeForm = ({ passwordForm, onChange, onSubmit, isLoading }) => {
    return (
        <Card className="bg-white border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
            <CardHeader className="p-6 md:p-8 pb-0">
                <CardTitle className="text-lg font-bold text-neutral-dark flex items-center gap-2 border-b border-slate-100 pb-4">
                    <KeyRound size={20} className="text-primary" /> Đổi mật khẩu bảo mật
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 pt-0">
                <form onSubmit={onSubmit} className="space-y-5">
                    <div className="space-y-4">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="currentPassword">
                                Mật khẩu hiện tại
                            </Label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-light z-10">
                                    <Lock size={16} />
                                </span>
                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={onChange}
                                    placeholder="••••••••"
                                    className="w-full md:w-2/3 pl-10 pr-4 py-3 h-auto bg-bg-card border-border-light/40 rounded-xl"
                                />
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="newPassword">
                                Mật khẩu mới
                            </Label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-light z-10">
                                    <Lock size={16} />
                                </span>
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={onChange}
                                    placeholder="Nhập mật khẩu mới"
                                    className="w-full md:w-2/3 pl-10 pr-4 py-3 h-auto bg-bg-card border-border-light/40 rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-neutral-medium uppercase tracking-wider" htmlFor="confirmPassword">
                                Xác nhận mật khẩu mới
                            </Label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-light z-10">
                                    <Lock size={16} />
                                </span>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={onChange}
                                    placeholder="Nhập lại mật khẩu mới"
                                    className="w-full md:w-2/3 pl-10 pr-4 py-3 h-auto bg-bg-card border-border-light/40 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit button */}
                    <div className="flex justify-end pt-2 border-t border-slate-100">
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="bg-primary hover:opacity-95 text-white font-semibold py-3 px-6 h-auto rounded-xl text-sm transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2"
                        >
                            Đổi mật khẩu
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default PasswordChangeForm;
