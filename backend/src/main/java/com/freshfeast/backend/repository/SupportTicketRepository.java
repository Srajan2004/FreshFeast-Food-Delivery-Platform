package com.freshfeast.backend.repository;

import com.freshfeast.backend.entity.SupportTicket;
import com.freshfeast.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByUserOrderByCreatedAtDesc(User user);
    List<SupportTicket> findAllByOrderByCreatedAtDesc();
}
