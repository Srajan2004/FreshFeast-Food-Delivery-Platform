package com.freshfeast.backend.controller;

import com.freshfeast.backend.dto.support.CreateTicketRequest;
import com.freshfeast.backend.dto.support.TicketResponse;
import com.freshfeast.backend.dto.support.UpdateTicketRequest;
import com.freshfeast.backend.security.UserPrincipal;
import com.freshfeast.backend.service.SupportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support/tickets")
@RequiredArgsConstructor
public class SupportController {

    private final SupportService supportService;

    @PostMapping
    public ResponseEntity<TicketResponse> create(@AuthenticationPrincipal UserPrincipal principal,
                                                  @Valid @RequestBody CreateTicketRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(supportService.createTicket(principal.getUser(), request));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<TicketResponse>> getMine(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(supportService.getMyTickets(principal.getUser()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TicketResponse>> getAll() {
        return ResponseEntity.ok(supportService.getAllTickets());
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponse> update(@AuthenticationPrincipal UserPrincipal principal,
                                                  @PathVariable Long id,
                                                  @RequestBody UpdateTicketRequest request) {
        return ResponseEntity.ok(supportService.updateTicket(principal.getUser(), id, request));
    }
}
