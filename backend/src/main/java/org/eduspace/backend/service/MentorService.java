package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.incident.response.MentorDashboardResponse;

import org.eduspace.backend.enums.IncidentStatus;
import org.eduspace.backend.repository.ActiveMentorRepository;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.IncidentRepository;
import org.eduspace.backend.repository.UserRepository;
import org.eduspace.backend.repository.CourseRepository;
import org.eduspace.backend.repository.CertificateRepository;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.entity.Course;
import org.eduspace.backend.entity.ActiveMentor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorService {

    private final IncidentRepository incidentRepository;
    private final ClassMemberRepository classMemberRepository;
    private final ActiveMentorRepository activeMentorRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CertificateRepository certificateRepository;

    @Transactional
    public void assignMentorToCourse(Long userId, Long courseId) {
        // Enforce the business rule: only users who completed the course can be mentors
        boolean hasCompleted = certificateRepository.existsByUserIdAndCourseId(userId, courseId);
        if (!hasCompleted) {
            throw new RuntimeException("Người dùng chưa hoàn thành khóa học này, không thể làm Mentor!");
        }

        // Fetch User and Course
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học"));

        // Save ActiveMentor
        ActiveMentor activeMentor = ActiveMentor.builder()
                .user(user)
                .course(course)
                .mentorStatus(org.eduspace.backend.enums.MentorStatus.AVAILABLE)
                .build();
        activeMentorRepository.save(activeMentor);
    }

    public MentorDashboardResponse getDashboardData(Long userId) {

        long inProgressIncidents = incidentRepository.countByResolvedByUserIdAndStatus(userId,
                IncidentStatus.IN_PROGRESS);

        List<IncidentStatus> resolvedStatuses = Arrays.asList(IncidentStatus.RESOLVED, IncidentStatus.REJECTED,
                IncidentStatus.CLOSED);
        long resolvedIncidents = incidentRepository.countByResolvedByUserIdAndStatusIn(userId,
                resolvedStatuses);

        long assignedClasses = classMemberRepository.countByUserIdAndContextRole(userId, "MENTOR");

        long assignedCourses = activeMentorRepository.countByUserId(userId);

        return MentorDashboardResponse.builder()
                .inProgressIncidents(inProgressIncidents)
                .resolvedIncidents(resolvedIncidents)
                .assignedClasses(assignedClasses)
                .assignedCourses(assignedCourses)
                .build();
    }
}
