import React from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Label from '@/components/ui/Label';

export default function CourseGeneralInfo({ formData, setFormData, mode }) {
  return (
    <div className="grid grid-cols-12 gap-6 items-stretch">
      <Card className="col-span-12 bg-white border border-border-light/30 flex flex-col justify-between">
        <CardHeader className="p-6 pb-0">
          <CardTitle className="text-sm font-bold text-primary flex items-center gap-2">
            <Info size={18} /> Thông tin tổng quan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="block text-xs font-bold text-neutral-medium" htmlFor="course-title">Tên khóa học</Label>
              <Input
                id="course-title"
                className="w-full px-4 py-3 h-auto bg-bg-card border border-border-light/40 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                placeholder="Nhập tên lộ trình khóa học..."
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={mode === 'VIEW'}
              />
            </div>
            <div className="space-y-2">
              <Label className="block text-xs font-bold text-neutral-medium" htmlFor="course-desc">Mô tả chi tiết</Label>
              <Textarea
                id="course-desc"
                rows={3}
                className="w-full px-4 py-3 bg-bg-card border border-border-light/40 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                placeholder="Nhập mục tiêu và kết quả đầu ra mong đợi..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={mode === 'VIEW'}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
