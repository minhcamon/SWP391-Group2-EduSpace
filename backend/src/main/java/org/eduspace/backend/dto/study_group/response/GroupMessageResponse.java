package org.eduspace.backend.dto.study_group.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupMessageResponse {
    private Long id;
    private String content;
    private String messageType;
    private LocalDateTime sendAt;

    // Thông tin người gửi
    private Long senderGroupMemberId;
    private Long senderUserId;
    private String senderName;
    private String senderAvatar;
}
