package org.eduspace.backend.dto.study_group.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyGroupResponse {
    private Long studyGroupId;
    private List<GroupMemberInfo> members;
    private String status;
    private Double progress;
}

