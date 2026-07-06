package com.freshfeast.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlatformStatsResponse {
    private long totalUsers;
    private long totalCustomers;
    private long totalRestaurantOwners;
    private long totalRestaurants;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long openSupportTickets;
}
