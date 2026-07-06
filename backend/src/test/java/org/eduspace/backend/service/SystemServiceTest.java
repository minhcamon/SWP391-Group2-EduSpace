package org.eduspace.backend.service;

import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.Course;
import org.eduspace.backend.entity.CourseClass;
import org.eduspace.backend.entity.CourseModule;
import org.eduspace.backend.entity.GroupMember;
import org.eduspace.backend.entity.StudyGroup;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.entity.Waitlist;
import org.eduspace.backend.entity.WaitlistEntry;
import org.eduspace.backend.enums.ClassStatus;
import org.eduspace.backend.enums.WaitlistStatus;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.ClassRepository;
import org.eduspace.backend.repository.ClassTimelineRepository;
import org.eduspace.backend.repository.GroupMemberRepository;
import org.eduspace.backend.repository.ModuleRepository;
import org.eduspace.backend.repository.StudyGroupRepository;
import org.eduspace.backend.repository.WaitlistEntryRepository;
import org.eduspace.backend.repository.WaitlistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SystemServiceTest {

    @Mock
    private WaitlistRepository waitlistRepository;

    @Mock
    private WaitlistEntryRepository waitlistEntryRepository;

    @Mock
    private ClassRepository classRepository;

    @Mock
    private ClassMemberRepository classMemberRepository;

    @Mock
    private ModuleRepository moduleRepository;

    @Mock
    private ClassTimelineRepository classTimelineRepository;

    @Mock
    private StudyGroupRepository studyGroupRepository;

    @Mock
    private GroupMemberRepository groupMemberRepository;

    private SystemService systemService;

    @BeforeEach
    void setUp() {
        systemService = new SystemService(
                waitlistRepository,
                waitlistEntryRepository,
                classRepository,
                classMemberRepository,
                moduleRepository,
                classTimelineRepository,
                studyGroupRepository,
                groupMemberRepository
        );
    }

    @Test
    void createClassFromWaitlistPairsHighestExpLearnerWithLowestExpLearner() {
        Course course = course(10L);
        Waitlist waitlist = waitlist(20L, course);
        CourseClass savedClass = courseClass(30L, course);
        CourseModule firstModule = module(40L, course, 1);
        List<WaitlistEntry> entries = waitlistEntriesWithExp(course, 90, 10, 70, 30, 50, 20, 80, 40, 60, 0);

        when(waitlistRepository.findById(waitlist.getId())).thenReturn(Optional.of(waitlist));
        when(classRepository.save(any(CourseClass.class))).thenReturn(savedClass);
        when(waitlistEntryRepository.findByWaitlistId(waitlist.getId())).thenReturn(entries);
        when(classMemberRepository.save(any(ClassMember.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(moduleRepository.findByCourseIdOrderBySortOrder(course.getId())).thenReturn(List.of(firstModule));
        when(studyGroupRepository.save(any(StudyGroup.class))).thenAnswer(newStudyGroupAnswer(savedClass, firstModule));
        when(classTimelineRepository.findByCourseClassId(savedClass.getId())).thenReturn(List.of());
        when(classRepository.findById(savedClass.getId())).thenReturn(Optional.of(savedClass));

        Long createdClassId = systemService.createClassFromWaitlist(waitlist.getId());

        assertThat(createdClassId).isEqualTo(savedClass.getId());
        assertThat(waitlist.getStatus()).isEqualTo(WaitlistStatus.FULLED);
        verify(waitlistRepository).save(waitlist);

        ArgumentCaptor<GroupMember> groupMemberCaptor = ArgumentCaptor.forClass(GroupMember.class);
        verify(groupMemberRepository, org.mockito.Mockito.times(10)).save(groupMemberCaptor.capture());

        List<List<Integer>> pairedExp = groupMemberCaptor.getAllValues().stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        gm -> gm.getStudyGroup().getId(),
                        java.util.LinkedHashMap::new,
                        java.util.stream.Collectors.mapping(
                                gm -> gm.getClassMember().getUser().getTotalExp(),
                                java.util.stream.Collectors.toList()
                        )
                ))
                .values()
                .stream()
                .toList();

        assertThat(pairedExp).containsExactly(
                List.of(90, 0),
                List.of(80, 10),
                List.of(70, 20),
                List.of(60, 30),
                List.of(50, 40)
        );

        verify(waitlistEntryRepository, org.mockito.Mockito.times(10)).delete(any(WaitlistEntry.class));
        verify(classTimelineRepository).save(any());
    }

    @Test
    void createClassFromWaitlistRejectsClosingClassWhenWaitlistHasLessThanTenLearners() {
        Course course = course(10L);
        Waitlist waitlist = waitlist(20L, course);
        CourseClass savedClass = courseClass(30L, course);
        List<WaitlistEntry> entries = waitlistEntriesWithExp(course, 90, 80, 70);

        when(waitlistRepository.findById(waitlist.getId())).thenReturn(Optional.of(waitlist));
        when(classRepository.save(any(CourseClass.class))).thenReturn(savedClass);
        when(waitlistEntryRepository.findByWaitlistId(waitlist.getId())).thenReturn(entries);

        assertThatThrownBy(() -> systemService.createClassFromWaitlist(waitlist.getId()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("10");

        verify(classMemberRepository, never()).save(any());
        verify(studyGroupRepository, never()).save(any());
        verify(groupMemberRepository, never()).save(any());
    }

    @Test
    void splitExistingClassIntoPairsSortsByExpAndPairsStrongLearnersWithWeakLearners() {
        Course course = course(10L);
        CourseClass courseClass = courseClass(30L, course);
        CourseModule module = module(40L, course, 1);
        List<ClassMember> members = classMembers(courseClass, 100, 5, 60, 20);

        when(classRepository.findById(courseClass.getId())).thenReturn(Optional.of(courseClass));
        when(moduleRepository.findById(module.getId())).thenReturn(Optional.of(module));
        when(classMemberRepository.findByCourseClassId(courseClass.getId())).thenReturn(members);
        when(studyGroupRepository.save(any(StudyGroup.class))).thenAnswer(newStudyGroupAnswer(courseClass, module));

        systemService.splitExistingClassIntoPairs(courseClass.getId(), module.getId());

        ArgumentCaptor<GroupMember> groupMemberCaptor = ArgumentCaptor.forClass(GroupMember.class);
        verify(groupMemberRepository, org.mockito.Mockito.times(4)).save(groupMemberCaptor.capture());

        List<List<Integer>> pairedExp = groupMemberCaptor.getAllValues().stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        gm -> gm.getStudyGroup().getId(),
                        java.util.LinkedHashMap::new,
                        java.util.stream.Collectors.mapping(
                                gm -> gm.getClassMember().getUser().getTotalExp(),
                                java.util.stream.Collectors.toList()
                        )
                ))
                .values()
                .stream()
                .toList();

        assertThat(pairedExp).containsExactly(
                List.of(100, 5),
                List.of(60, 20)
        );
    }

    @Test
    void reMatchGroupsAfterDropAddsSingleOrphanToAvailableLowestExpGroup() {
        Long classId = 30L;
        Long moduleId = 40L;
        Course course = course(10L);
        CourseClass courseClass = courseClass(classId, course);
        CourseModule module = module(moduleId, course, 1);
        ClassMember orphan = classMember(courseClass, 99L, 120);
        StudyGroup availableGroup = StudyGroup.builder()
                .id(501L)
                .courseClass(courseClass)
                .module(module)
                .chatStatus("ACTIVE")
                .build();

        when(groupMemberRepository.findOrphansByClassId(classId, moduleId)).thenReturn(new ArrayList<>(List.of(orphan)));
        when(studyGroupRepository.findAvailableGroupWithLowestExp(classId, moduleId)).thenReturn(Optional.of(availableGroup));

        systemService.reMatchGroupsAfterDrop(classId, moduleId);

        verify(groupMemberRepository, org.mockito.Mockito.times(2)).deleteByLearnerStatusNotActive(classId, moduleId);
        verify(studyGroupRepository).deleteEmptyGroups(classId, moduleId);
        verify(studyGroupRepository).deleteGroupsWithSingleMember(classId, moduleId);
        verify(groupMemberRepository)
                .deleteAllByClassMemberInAndStudyGroupCourseClassIdAndStudyGroupModuleId(List.of(orphan), classId, moduleId);

        ArgumentCaptor<GroupMember> groupMemberCaptor = ArgumentCaptor.forClass(GroupMember.class);
        verify(groupMemberRepository).save(groupMemberCaptor.capture());
        assertThat(groupMemberCaptor.getValue().getStudyGroup()).isSameAs(availableGroup);
        assertThat(groupMemberCaptor.getValue().getClassMember()).isSameAs(orphan);
    }

    @Test
    void reMatchGroupsAfterDropSplitsFourOrphansIntoBalancedPairs() {
        Long classId = 30L;
        Long moduleId = 40L;
        Course course = course(10L);
        CourseClass courseClass = courseClass(classId, course);
        CourseModule module = module(moduleId, course, 1);
        List<ClassMember> orphans = classMembers(courseClass, 90, 20, 70, 10);

        when(groupMemberRepository.findOrphansByClassId(classId, moduleId)).thenReturn(orphans);
        when(classRepository.findById(classId)).thenReturn(Optional.of(courseClass));
        when(moduleRepository.findByCourseIdOrderBySortOrder(course.getId())).thenReturn(List.of(module));
        when(studyGroupRepository.save(any(StudyGroup.class))).thenAnswer(newStudyGroupAnswer(courseClass, module));

        systemService.reMatchGroupsAfterDrop(classId, moduleId);

        ArgumentCaptor<GroupMember> groupMemberCaptor = ArgumentCaptor.forClass(GroupMember.class);
        verify(groupMemberRepository, org.mockito.Mockito.times(4)).save(groupMemberCaptor.capture());

        List<List<Integer>> pairedExp = groupMemberCaptor.getAllValues().stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        gm -> gm.getStudyGroup().getId(),
                        java.util.LinkedHashMap::new,
                        java.util.stream.Collectors.mapping(
                                gm -> gm.getClassMember().getUser().getTotalExp(),
                                java.util.stream.Collectors.toList()
                        )
                ))
                .values()
                .stream()
                .toList();

        assertThat(pairedExp).containsExactly(
                List.of(90, 10),
                List.of(70, 20)
        );
    }

    private Course course(Long id) {
        return Course.builder()
                .id(id)
                .title("IELTS Pair Matching")
                .description("Pair learners by experience")
                .createdAt(LocalDateTime.now())
                .build();
    }

    private CourseClass courseClass(Long id, Course course) {
        return CourseClass.builder()
                .id(id)
                .course(course)
                .name("IELTS_PAIR_MATCHING_B1")
                .activatedAt(LocalDateTime.now())
                .status(ClassStatus.RUNNING)
                .build();
    }

    private CourseModule module(Long id, Course course, int sortOrder) {
        return CourseModule.builder()
                .id(id)
                .course(course)
                .title("Module " + sortOrder)
                .days(7)
                .sortOrder(sortOrder)
                .build();
    }

    private List<WaitlistEntry> waitlistEntriesWithExp(Course course, int... expValues) {
        List<WaitlistEntry> entries = new ArrayList<>();
        Waitlist waitlist = waitlist(20L, course);
        long id = 1L;
        for (int exp : expValues) {
            entries.add(WaitlistEntry.builder()
                    .id(id)
                    .waitlist(waitlist)
                    .user(user(id, exp))
                    .enrolledAt(LocalDateTime.now().plusMinutes(id))
                    .build());
            id++;
        }
        return entries;
    }

    private List<ClassMember> classMembers(CourseClass courseClass, int... expValues) {
        List<ClassMember> members = new ArrayList<>();
        long id = 1L;
        for (int exp : expValues) {
            members.add(classMember(courseClass, id, exp));
            id++;
        }
        return members;
    }

    private ClassMember classMember(CourseClass courseClass, Long id, int exp) {
        return ClassMember.builder()
                .id(id)
                .courseClass(courseClass)
                .user(user(id, exp))
                .contextRole("LEARNER")
                .joinedAt(LocalDateTime.now())
                .build();
    }

    private User user(Long id, int totalExp) {
        return User.builder()
                .id(id)
                .fullName("Learner " + id)
                .username("learner" + id)
                .email("learner" + id + "@example.com")
                .password("encoded-password")
                .totalExp(totalExp)
                .build();
    }

    private Waitlist waitlist(Long id, Course course) {
        return Waitlist.builder()
                .id(id)
                .course(course)
                .status(WaitlistStatus.OPENING)
                .createdAt(LocalDateTime.now())
                .build();
    }

    private org.mockito.stubbing.Answer<StudyGroup> newStudyGroupAnswer(CourseClass courseClass, CourseModule module) {
        AtomicLong groupId = new AtomicLong(1L);
        return invocation -> {
            StudyGroup group = invocation.getArgument(0);
            group.setId(groupId.getAndIncrement());
            if (group.getCourseClass() == null) {
                group.setCourseClass(courseClass);
            }
            if (group.getModule() == null) {
                group.setModule(module);
            }
            return group;
        };
    }
}
