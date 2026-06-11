package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.entity.*;
import org.eduspace.backend.enums.WaitlistStatus;
import org.eduspace.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.eduspace.backend.entity.Class;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final WaitlistRepository waitlistRepository;
    private final WaitlistEntryRepository waitlistEntryRepository;
    private final ClassRepository classRepository;
    private final ClassMemberRepository classMemberRepository;

    @Transactional
    public void createClassFromWaitlist(Long waitlistId) {
        
        Waitlist waitlist = waitlistRepository.findById(waitlistId)
                .orElseThrow(() -> new RuntimeException("Error: Waitlist not found."));
        
        waitlist.setStatus(WaitlistStatus.CLOSED);
        waitlistRepository.save(waitlist);

        
        // Tạo mã định danh lớp tự động: Tên khóa học + Năm + Timestamp chạy ngầm
        String generatedClassName = waitlist.getCourse().getTitle().replaceAll("\\s+", "_").toUpperCase() 
                + "_B" + System.currentTimeMillis() % 1000;

        Class newClass = Class.builder()
                .course(waitlist.getCourse())
                .name(generatedClassName)
                .activatedAt(LocalDateTime.now())
                .status("RUNNING")
                .build();
        Class savedClass = classRepository.save(newClass);

        // 3. LẤY DANH SÁCH 10 HỌC VIÊN ĐANG CHỜ RA
        List<WaitlistEntry> entries = waitlistEntryRepository.findByWaitlistId(waitlistId);

        // 4. ĐẨY 10 HỌC VIÊN SANG LỚP MỚI (Table 10: ClassMembers)
        for (WaitlistEntry entry : entries) {
            ClassMember member = ClassMember.builder()
                    .clazz(savedClass)
                    .user(entry.getUser())
                    .contextRole("LEARNER")       // Vai trò mặc định: Học viên
                    .learnerStatus("ACTIVE")      // Trạng thái học tập: Đang hoạt động
                    .rescueStartedAt(null)        // Mới vào lớp nên chưa kích hoạt cứu trợ trễ hạn
                    .joinedAt(LocalDateTime.now()) // Thời gian chính thức vào lớp
                    .build();
            classMemberRepository.save(member);
        }
    }
}