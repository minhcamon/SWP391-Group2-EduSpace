package org.eduspace.backend.dto.group;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroupMemberDTO {
    private Long user_id;          // user_id
    private String fullName;
    private String email;
    private String username;
    private String avatarUrl;
    private Long totalExp;
}