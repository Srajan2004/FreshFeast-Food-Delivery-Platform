package com.freshfeast.backend.dto.restaurant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantAnalyticsResponse {
    private long totalOrders;
    private BigDecimal totalRevenue;
    private BigDecimal averageOrderValue;
    private Map<String, Long> ordersByStatus;
    private List<TopMenuItem> topMenuItems;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopMenuItem {
        private String name;
        private long quantitySold;
        private BigDecimal revenue;
    }
}
