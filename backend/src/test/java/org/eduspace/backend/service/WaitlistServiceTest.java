package org.eduspace.backend.service;

import org.eduspace.backend.dto.user.response.UserResponse;
import org.eduspace.backend.entity.Course;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.entity.Waitlist;
import org.eduspace.backend.entity.WaitlistEntry;
import org.eduspace.backend.enums.CourseStatus;
import org.eduspace.backend.enums.WaitlistStatus;
import org.eduspace.backend.repository.CourseRepository;
import org.eduspace.backend.repository.UserRepository;
import org.eduspace.backend.repository.WaitlistEntryRepository;
import org.eduspace.backend.repository.WaitlistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WaitlistServiceTest {

    @Mock
    private WaitlistRepository waitlistRepository;

    @Mock
    private WaitlistEntryRepository waitlistEntryRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SystemService systemService;

    private WaitlistService waitlistService;

    @BeforeEach
    void setUp() {
        waitlistService = new WaitlistService(
                waitlistRepository,
                waitlistEntryRepository,
                courseRepository,
                userRepository,
                systemService
        );
        ReflectionTestUtils.setField(waitlistService, "waitlistCapacity", 3);
    }

    @Test
    void enrollToWaitlistCreatesOpeningWaitlistAndEntryWhenCourseHasNoActiveWaitlist() {
        Course course = publishedCourse(10L);
        User learner = learner(21L, "Learner One");
        Waitlist savedWaitlist = waitlist(31L, course, WaitlistStatus.OPENING);

        when(courseRepository.findByIdForUpdate(course.getId())).thenReturn(Optional.of(course));
        when(waitlistEntryRepository.isUserAlreadyWaiting(course.getId(), learner.getId())).thenReturn(false);
        when(waitlistRepository.findByCourseIdAndStatus(course.getId(), WaitlistStatus.OPENING)).thenReturn(Optional.empty());
        when(waitlistRepository.save(any(Waitlist.class))).thenReturn(savedWaitlist);
        when(userRepository.findById(learner.getId())).thenReturn(Optional.of(learner));
        when(waitlistEntryRepository.countByWaitlistId(savedWaitlist.getId())).thenReturn(1);

        boolean enrolled = waitlistService.enrollToWaitlist(course.getId(), learner.getId());

        assertThat(enrolled).isTrue();

        ArgumentCaptor<Waitlist> waitlistCaptor = ArgumentCaptor.forClass(Waitlist.class);
        verify(waitlistRepository).save(waitlistCaptor.capture());
        assertThat(waitlistCaptor.getValue().getCourse()).isSameAs(course);
        assertThat(waitlistCaptor.getValue().getStatus()).isEqualTo(WaitlistStatus.OPENING);
        assertThat(waitlistCaptor.getValue().getCreatedAt()).isNotNull();

        ArgumentCaptor<WaitlistEntry> entryCaptor = ArgumentCaptor.forClass(WaitlistEntry.class);
        verify(waitlistEntryRepository).save(entryCaptor.capture());
        assertThat(entryCaptor.getValue().getWaitlist()).isSameAs(savedWaitlist);
        assertThat(entryCaptor.getValue().getUser()).isSameAs(learner);
        assertThat(entryCaptor.getValue().getEnrolledAt()).isNotNull();

        verify(systemService, never()).createClassFromWaitlist(any());
        verify(systemService, never()).createTimelineForClass(any());
    }

    @Test
    void enrollToWaitlistRejectsDuplicateLearnerInOpeningWaitlist() {
        Course course = publishedCourse(10L);
        Long learnerId = 21L;

        when(courseRepository.findByIdForUpdate(course.getId())).thenReturn(Optional.of(course));
        when(waitlistEntryRepository.isUserAlreadyWaiting(course.getId(), learnerId)).thenReturn(true);

        assertThatThrownBy(() -> waitlistService.enrollToWaitlist(course.getId(), learnerId))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("already in the waitlist");

        verify(waitlistRepository, never()).save(any());
        verify(waitlistEntryRepository, never()).save(any());
        verify(systemService, never()).createClassFromWaitlist(any());
    }

    @Test
    void enrollToWaitlistCreatesClassAndTimelineWhenCapacityIsReached() {
        Course course = publishedCourse(10L);
        User learner = learner(21L, "Learner One");
        Waitlist activeWaitlist = waitlist(31L, course, WaitlistStatus.OPENING);
        Long createdClassId = 41L;

        when(courseRepository.findByIdForUpdate(course.getId())).thenReturn(Optional.of(course));
        when(waitlistEntryRepository.isUserAlreadyWaiting(course.getId(), learner.getId())).thenReturn(false);
        when(waitlistRepository.findByCourseIdAndStatus(course.getId(), WaitlistStatus.OPENING))
                .thenReturn(Optional.of(activeWaitlist));
        when(userRepository.findById(learner.getId())).thenReturn(Optional.of(learner));
        when(waitlistEntryRepository.countByWaitlistId(activeWaitlist.getId())).thenReturn(3);
        when(systemService.createClassFromWaitlist(activeWaitlist.getId())).thenReturn(createdClassId);

        boolean enrolled = waitlistService.enrollToWaitlist(course.getId(), learner.getId());

        assertThat(enrolled).isTrue();
        assertThat(activeWaitlist.getStatus()).isEqualTo(WaitlistStatus.FULLED);
        verify(systemService).createClassFromWaitlist(activeWaitlist.getId());
    }

    @Test
    void leaveWaitlistDeletesLearnerEntryWhenWaitlistIsStillOpen() {
        Long learnerId = 21L;
        Long courseId = 10L;
        Waitlist openWaitlist = waitlist(31L, publishedCourse(courseId), WaitlistStatus.OPENING);

        when(waitlistRepository.findWaitlistByUserAndCourse(learnerId, courseId))
                .thenReturn(Optional.of(openWaitlist.getId()));
        when(waitlistRepository.findById(openWaitlist.getId())).thenReturn(Optional.of(openWaitlist));

        waitlistService.leaveWaitlist(learnerId, courseId);

        verify(waitlistRepository).deleteEntryByUserAndWaitlist(learnerId, openWaitlist.getId());
    }

    @Test
    void leaveWaitlistRejectsFulfilledWaitlist() {
        Long learnerId = 21L;
        Long courseId = 10L;
        Waitlist closedWaitlist = waitlist(31L, publishedCourse(courseId), WaitlistStatus.FULLED);

        when(waitlistRepository.findWaitlistByUserAndCourse(learnerId, courseId))
                .thenReturn(Optional.of(closedWaitlist.getId()));
        when(waitlistRepository.findById(closedWaitlist.getId())).thenReturn(Optional.of(closedWaitlist));

        assertThatThrownBy(() -> waitlistService.leaveWaitlist(learnerId, courseId))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("full");

        verify(waitlistRepository, never()).deleteEntryByUserAndWaitlist(any(), any());
    }

    @Test
    void getMembersInWaitlistMapsUsersToPublicResponsesInEnrollmentOrder() {
        Long learnerId = 21L;
        Long courseId = 10L;
        Long waitlistId = 31L;
        User first = learner(101L, "First Learner");
        first.setAvatarUrl("https://example.com/first.png");
        User second = learner(102L, "Second Learner");

        when(waitlistRepository.findWaitlistByUserAndCourse(learnerId, courseId)).thenReturn(Optional.of(waitlistId));
        when(waitlistRepository.findUsersByWaitListId(waitlistId)).thenReturn(List.of(first, second));

        List<UserResponse> members = waitlistService.getMembersInWaitlist(learnerId, courseId);

        assertThat(members).hasSize(2);
        assertThat(members).extracting(UserResponse::getId).containsExactly(101L, 102L);
        assertThat(members).extracting(UserResponse::getFullName).containsExactly("First Learner", "Second Learner");
        assertThat(members.get(0).getAvatarUrl()).isEqualTo("https://example.com/first.png");
    }

    private Course publishedCourse(Long id) {
        return Course.builder()
                .id(id)
                .title("IELTS Speaking")
                .description("Practice speaking with peers")
                .status(CourseStatus.PUBLISHED)
                .createdAt(LocalDateTime.now())
                .build();
    }

    private User learner(Long id, String fullName) {
        return User.builder()
                .id(id)
                .fullName(fullName)
                .username("learner" + id)
                .email("learner" + id + "@example.com")
                .password("encoded-password")
                .createdAt(LocalDateTime.now())
                .build();
    }

    private Waitlist waitlist(Long id, Course course, WaitlistStatus status) {
        return Waitlist.builder()
                .id(id)
                .course(course)
                .status(status)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
