package com.freshfeast.backend.service;

import com.freshfeast.backend.dto.support.CreateTicketRequest;
import com.freshfeast.backend.dto.support.TicketResponse;
import com.freshfeast.backend.dto.support.UpdateTicketRequest;
import com.freshfeast.backend.entity.SupportTicket;
import com.freshfeast.backend.entity.User;
import com.freshfeast.backend.exception.ResourceNotFoundException;
import com.freshfeast.backend.exception.UnauthorizedActionException;
import com.freshfeast.backend.repository.SupportTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupportService {

    private final SupportTicketRepository ticketRepository;

    public TicketResponse createTicket(User user, CreateTicketRequest request) {
        SupportTicket ticket = SupportTicket.builder()
                .user(user)
                .subject(request.getSubject())
                .message(request.getMessage())
                .build();
        return toResponse(ticketRepository.save(ticket));
    }

    public List<TicketResponse> getMyTickets(User user) {
        return ticketRepository.findByUserOrderByCreatedAtDesc(user).stream().map(this::toResponse).toList();
    }

    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    public TicketResponse updateTicket(User requester, Long ticketId, UpdateTicketRequest request) {
        if (requester.getRole() != com.freshfeast.backend.entity.Role.ADMIN) {
            throw new UnauthorizedActionException("Only admins can update support tickets");
        }
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        if (request.getStatus() != null) ticket.setStatus(request.getStatus());
        if (request.getAdminResponse() != null) ticket.setAdminResponse(request.getAdminResponse());

        return toResponse(ticketRepository.save(ticket));
    }

    private TicketResponse toResponse(SupportTicket t) {
        return TicketResponse.builder()
                .id(t.getId())
                .userId(t.getUser().getId())
                .userName(t.getUser().getName())
                .userEmail(t.getUser().getEmail())
                .subject(t.getSubject())
                .message(t.getMessage())
                .adminResponse(t.getAdminResponse())
                .status(t.getStatus())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }
}
