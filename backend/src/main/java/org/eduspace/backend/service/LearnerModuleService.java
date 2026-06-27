package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.entity.Submission;
import org.eduspace.backend.enums.LearnerModuleStatus;
import org.eduspace.backend.enums.SubmissionStatus;
import org.eduspace.backend.repository.SubmissionRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LearnerModuleService {

    private final SubmissionRepository submissionRepository;

    public LearnerModuleStatus getModuleStatusForLearner(Long learnerId, Long moduleId) {
        List<Submission> submissions = submissionRepository.findByLearnerIdAndModuleId(learnerId, moduleId);

        // 1. Nếu chưa có bài nộp nào -> Trạng thái là đang học (ACTIVE)
        if (submissions.isEmpty()) {
            return LearnerModuleStatus.ACTIVE;
        }

        // 2. Nếu có bài nộp ở trạng thái PENDING (Chờ chấm) -> Module cần duyệt (NEED_REVIEW)
        boolean hasPending = submissions.stream()
        .anyMatch(s -> s.getStatus() == SubmissionStatus.PENDING);

        if (hasPending) {
            return LearnerModuleStatus.NEED_REVIEW;
        }

        // 3. Các trường hợp còn lại (Ví dụ đã chấm xong xuôi GRADED/FAILED) -> Coi như đã hoàn thành nộp bài (SUBMITTED)
        return LearnerModuleStatus.SUBMITTED;
    }
}