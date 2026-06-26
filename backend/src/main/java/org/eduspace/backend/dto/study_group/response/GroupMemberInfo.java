package org.eduspace.backend.dto.study_group.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupMemberInfo {
    private Long userId;
    private String fullName;
    private String avatarUrl;
}
