package com.freshfeast.backend.service;

import com.freshfeast.backend.dto.restaurant.RestaurantAnalyticsResponse;
import com.freshfeast.backend.entity.Order;
import com.freshfeast.backend.entity.OrderItem;
import com.freshfeast.backend.entity.OrderStatus;
import com.freshfeast.backend.entity.Restaurant;
import com.freshfeast.backend.entity.User;
import com.freshfeast.backend.exception.ResourceNotFoundException;
import com.freshfeast.backend.exception.UnauthorizedActionException;
import com.freshfeast.backend.repository.OrderRepository;
import com.freshfeast.backend.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final RestaurantRepository restaurantRepository;

    public RestaurantAnalyticsResponse getRestaurantAnalytics(User requester, Long restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        boolean isAdmin = requester.getRole().name().equals("ADMIN");
        boolean isOwner = restaurant.getOwner().getId().equals(requester.getId());
        if (!isAdmin && !isOwner) {
            throw new UnauthorizedActionException("You do not have permission to view this restaurant's analytics");
        }

        List<Order> orders = orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);

        long totalOrders = orders.size();

        BigDecimal totalRevenue = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal avgOrderValue = totalOrders == 0
                ? BigDecimal.ZERO
                : totalRevenue.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP);

        Map<String, Long> ordersByStatus = orders.stream()
                .collect(Collectors.groupingBy(o -> o.getStatus().name(), LinkedHashMap::new, Collectors.counting()));

        Map<String, long[]> itemStats = new LinkedHashMap<>(); // name -> [qty]
        Map<String, BigDecimal> itemRevenue = new LinkedHashMap<>();

        for (Order order : orders) {
            if (order.getStatus() == OrderStatus.CANCELLED) continue;
            for (OrderItem item : order.getItems()) {
                String name = item.getItemNameSnapshot();
                itemStats.merge(name, new long[]{item.getQuantity()}, (a, b) -> new long[]{a[0] + b[0]});
                BigDecimal lineRevenue = item.getPriceSnapshot().multiply(BigDecimal.valueOf(item.getQuantity()));
                itemRevenue.merge(name, lineRevenue, BigDecimal::add);
            }
        }

        List<RestaurantAnalyticsResponse.TopMenuItem> topItems = itemStats.entrySet().stream()
                .map(e -> RestaurantAnalyticsResponse.TopMenuItem.builder()
                        .name(e.getKey())
                        .quantitySold(e.getValue()[0])
                        .revenue(itemRevenue.getOrDefault(e.getKey(), BigDecimal.ZERO))
                        .build())
                .sorted(Comparator.comparingLong(RestaurantAnalyticsResponse.TopMenuItem::getQuantitySold).reversed())
                .limit(5)
                .toList();

        return RestaurantAnalyticsResponse.builder()
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .averageOrderValue(avgOrderValue)
                .ordersByStatus(ordersByStatus)
                .topMenuItems(topItems)
                .build();
    }
}
