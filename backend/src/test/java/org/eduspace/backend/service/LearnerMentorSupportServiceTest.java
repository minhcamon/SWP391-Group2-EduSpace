package org.eduspace.backend.service;

import org.eduspace.backend.dto.incident.request.LearnerMentorSupportRequest;
import org.eduspace.backend.dto.incident.response.LearnerMentorSupportResponse;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.Course;
import org.eduspace.backend.entity.CourseClass;
import org.eduspace.backend.entity.GroupMember;
import org.eduspace.backend.entity.Incident;
import org.eduspace.backend.entity.RescueRequest;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.enums.IncidentStatus;
import org.eduspace.backend.enums.IncidentType;
import org.eduspace.backend.enums.LearnerStatus;
import org.eduspace.backend.enums.RescueStatus;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.GroupMemberRepository;
import org.eduspace.backend.repository.IncidentRepository;
import org.eduspace.backend.repository.RescueRequestRepository;
import org.eduspace.backend.repository.SubmissionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Duration;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LearnerMentorSupportServiceTest {

    private static final Long LEARNER_USER_ID = 10L;
    private static final Long REPORTED_USER_ID = 20L;
    private static final Long COURSE_ID = 30L;
    private static final Long CLASS_ID = 40L;
    private static final Long STUDY_GROUP_ID = 50L;

    @Mock
    private ClassMemberRepository classMemberRepository;

    @Mock
    private GroupMemberRepository groupMemberRepository;

    @Mock
    private IncidentRepository incidentRepository;

    @Mock
    private RescueRequestRepository rescueRequestRepository;

    @Mock
    private SubmissionRepository submissionRepository;

    private LearnerMentorSupportService service;

    @BeforeEach
    void setUp() {
        service = new LearnerMentorSupportService(
                classMemberRepository,
                groupMemberRepository,
                incidentRepository,
                rescueRequestRepository,
                submissionRepository);

    }

    @Test
    void createMentorSupportRequest_createsRescueRequestForUrgentSupport() {
        ClassMember learnerMember = learnerMember(LEARNER_USER_ID);
        LearnerMentorSupportRequest request = new LearnerMentorSupportRequest(
                IncidentType.RESCUE_SUPPORT_REQUEST,
                COURSE_ID,
                null,
                null,
                null,
                "Laptop broke before the final submission",
                "https://evidence.example/rescue.png");

        when(classMemberRepository.findActiveEnrollment(LEARNER_USER_ID, COURSE_ID, LearnerStatus.ACTIVE))
                .thenReturn(Optional.of(learnerMember));
        stubSavedIncidentId();

        LearnerMentorSupportResponse response = service.createMentorSupportRequest(LEARNER_USER_ID, request);

        ArgumentCaptor<Incident> incidentCaptor = ArgumentCaptor.forClass(Incident.class);
        ArgumentCaptor<RescueRequest> rescueCaptor = ArgumentCaptor.forClass(RescueRequest.class);
        verify(incidentRepository).save(incidentCaptor.capture());
        verify(rescueRequestRepository).save(rescueCaptor.capture());

        Incident incident = incidentCaptor.getValue();
        RescueRequest rescueRequest = rescueCaptor.getValue();

        assertEquals(IncidentType.RESCUE_SUPPORT_REQUEST, incident.getIncidentType());
        assertEquals(learnerMember, incident.getReporter());
        assertEquals("Laptop broke before the final submission", incident.getReason());
        assertEquals("https://evidence.example/rescue.png", incident.getEvidenceUrl());
        assertEquals(IncidentStatus.PENDING, incident.getStatus());

        assertEquals(incident, rescueRequest.getIncident());
        assertEquals(learnerMember, rescueRequest.getLearner());
        assertEquals(RescueStatus.PENDING, rescueRequest.getStatus());
        assertNotNull(rescueRequest.getRescueStartedAt());
        assertNotNull(rescueRequest.getRescueDeadline());
        assertTrue(Duration.between(rescueRequest.getRescueStartedAt(), rescueRequest.getRescueDeadline())
                        .minusHours(48)
                        .abs()
                        .toSeconds() <= 1,
                "Rescue deadline should be 48 hours after the support window starts");

        assertEquals(99L, response.getIncidentId());
        assertEquals(IncidentType.RESCUE_SUPPORT_REQUEST, response.getIncidentType());
        assertEquals(IncidentStatus.PENDING, response.getIncidentStatus());
        assertEquals(rescueRequest.getRescueDeadline(), response.getRescueDeadline());
    }

    @Test
    void createMentorSupportRequest_createsInactivePartnerIncident() {
        ClassMember reporter = learnerMember(LEARNER_USER_ID);
        ClassMember reported = learnerMember(REPORTED_USER_ID);
        LearnerMentorSupportRequest request = new LearnerMentorSupportRequest(
                IncidentType.INACTIVE_PARTNER,
                null,
                STUDY_GROUP_ID,
                REPORTED_USER_ID,
                null,
                "My partner has not responded for a week",
                null);

        when(groupMemberRepository.findByStudyGroupIdAndClassMemberUserId(STUDY_GROUP_ID, LEARNER_USER_ID))
                .thenReturn(Optional.of(GroupMember.builder().classMember(reporter).build()));
        when(groupMemberRepository.findByStudyGroupIdAndClassMemberUserId(STUDY_GROUP_ID, REPORTED_USER_ID))
                .thenReturn(Optional.of(GroupMember.builder().classMember(reported).build()));
        stubSavedIncidentId();

        LearnerMentorSupportResponse response = service.createMentorSupportRequest(LEARNER_USER_ID, request);

        ArgumentCaptor<Incident> incidentCaptor = ArgumentCaptor.forClass(Incident.class);
        verify(incidentRepository).save(incidentCaptor.capture());
        verify(rescueRequestRepository, never()).save(any());

        Incident incident = incidentCaptor.getValue();
        assertEquals(IncidentType.INACTIVE_PARTNER, incident.getIncidentType());
        assertEquals(reporter, incident.getReporter());
        assertEquals(reported, incident.getReported());
        assertEquals("My partner has not responded for a week", incident.getReason());
        assertEquals(IncidentStatus.PENDING, incident.getStatus());

        assertEquals(99L, response.getIncidentId());
        assertEquals(IncidentType.INACTIVE_PARTNER, response.getIncidentType());
        assertEquals(IncidentStatus.PENDING, response.getIncidentStatus());
    }

    @Test
    void createMentorSupportRequest_rejectsSelfReport() {
        LearnerMentorSupportRequest request = new LearnerMentorSupportRequest(
                IncidentType.INACTIVE_PARTNER,
                null,
                STUDY_GROUP_ID,
                LEARNER_USER_ID,
                null,
                "I accidentally selected myself",
                null);

        when(groupMemberRepository.findByStudyGroupIdAndClassMemberUserId(STUDY_GROUP_ID, LEARNER_USER_ID))
                .thenReturn(Optional.of(GroupMember.builder().classMember(learnerMember(LEARNER_USER_ID)).build()));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> service.createMentorSupportRequest(LEARNER_USER_ID, request));

        assertEquals("You cannot report yourself", exception.getMessage());
        verify(incidentRepository, never()).save(any());
        verify(rescueRequestRepository, never()).save(any());
    }

    @Test
    void createMentorSupportRequest_requiresCourseForGeneralIncident() {
        LearnerMentorSupportRequest request = new LearnerMentorSupportRequest(
                IncidentType.SYSTEM_ERROR,
                null,
                null,
                null,
                null,
                "The learning video cannot be opened",
                "https://evidence.example/system-error.png");

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> service.createMentorSupportRequest(LEARNER_USER_ID, request));

        assertEquals("Course ID is required for this incident type", exception.getMessage());
        verify(incidentRepository, never()).save(any());
        verify(rescueRequestRepository, never()).save(any());
    }

    private static ClassMember learnerMember(Long userId) {
        return ClassMember.builder()
                .id(userId + 1000)
                .user(User.builder().id(userId).build())
                .courseClass(CourseClass.builder()
                        .id(CLASS_ID)
                        .course(Course.builder().id(COURSE_ID).build())
                        .build())
                .contextRole("LEARNER")
                .learnerStatus(LearnerStatus.ACTIVE)
                .build();
    }

    private void stubSavedIncidentId() {
        when(incidentRepository.save(any(Incident.class))).thenAnswer(invocation -> {
            Incident incident = invocation.getArgument(0);
            incident.setId(99L);
            return incident;
        });
    }
}
