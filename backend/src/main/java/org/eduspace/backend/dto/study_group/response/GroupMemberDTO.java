package org.eduspace.backend.dto.study_group.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroupMemberDTO {
    private Long id;          // user_id
    private String fullName;
    private String email;
    private String username;
    private String avatarUrl;
    private Integer totalExp;
}
