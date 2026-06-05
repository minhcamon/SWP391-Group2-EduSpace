package org.eduspace.backend.dto.creator_request.response;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatorRequestResponse {
    private Long requestId;       
    private Long senderId;
    private String senderName;
    private String senderEmail;
    private Long approvedId;      
    private String status;    
    private LocalDateTime createdAt;
    private String reason;
}
