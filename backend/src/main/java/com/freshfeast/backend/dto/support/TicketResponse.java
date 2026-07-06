package com.freshfeast.backend.dto.support;

import com.freshfeast.backend.entity.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String subject;
    private String message;
    private String adminResponse;
    private TicketStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
