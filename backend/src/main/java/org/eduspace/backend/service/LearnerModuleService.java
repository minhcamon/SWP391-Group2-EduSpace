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

        if (submissions.isEmpty()) {
            return LearnerModuleStatus.ACTIVE;
        }

        boolean hasPending = submissions.stream()
                .anyMatch(s -> s.getStatus() == SubmissionStatus.PENDING);

        if (hasPending) {
            return LearnerModuleStatus.NEED_REVIEW;
        }

        return LearnerModuleStatus.SUBMITTED;
    }
}