package com.freshfeast.backend.dto.support;

import com.freshfeast.backend.entity.TicketStatus;
import lombok.Data;

@Data
public class UpdateTicketRequest {
    private TicketStatus status;
    private String adminResponse;
}
