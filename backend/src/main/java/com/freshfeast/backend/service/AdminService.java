package com.freshfeast.backend.service;

import com.freshfeast.backend.dto.admin.PlatformStatsResponse;
import com.freshfeast.backend.dto.admin.UserResponse;
import com.freshfeast.backend.entity.Role;
import com.freshfeast.backend.entity.TicketStatus;
import com.freshfeast.backend.entity.User;
import com.freshfeast.backend.entity.UserStatus;
import com.freshfeast.backend.exception.BadRequestException;
import com.freshfeast.backend.exception.ResourceNotFoundException;
import com.freshfeast.backend.repository.OrderRepository;
import com.freshfeast.backend.repository.RestaurantRepository;
import com.freshfeast.backend.repository.SupportTicketRepository;
import com.freshfeast.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final OrderRepository orderRepository;
    private final SupportTicketRepository ticketRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    public UserResponse updateUserStatus(Long userId, UserStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot change status of another admin account");
        }

        user.setStatus(status);
        return toResponse(userRepository.save(user));
    }

    public PlatformStatsResponse getPlatformStats() {
        List<User> allUsers = userRepository.findAll();
        long totalCustomers = allUsers.stream().filter(u -> u.getRole() == Role.CUSTOMER).count();
        long totalOwners = allUsers.stream().filter(u -> u.getRole() == Role.RESTAURANT_OWNER).count();

        BigDecimal totalRevenue = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() != com.freshfeast.backend.entity.OrderStatus.CANCELLED)
                .map(com.freshfeast.backend.entity.Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long openTickets = ticketRepository.findAll().stream()
                .filter(t -> t.getStatus() == TicketStatus.OPEN || t.getStatus() == TicketStatus.IN_PROGRESS)
                .count();

        return PlatformStatsResponse.builder()
                .totalUsers(allUsers.size())
                .totalCustomers(totalCustomers)
                .totalRestaurantOwners(totalOwners)
                .totalRestaurants(restaurantRepository.count())
                .totalOrders(orderRepository.count())
                .totalRevenue(totalRevenue)
                .openSupportTickets(openTickets)
                .build();
    }

    private UserResponse toResponse(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .role(u.getRole())
                .status(u.getStatus())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
