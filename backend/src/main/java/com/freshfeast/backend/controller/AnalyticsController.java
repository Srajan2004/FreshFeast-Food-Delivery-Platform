package com.freshfeast.backend.controller;

import com.freshfeast.backend.dto.restaurant.RestaurantAnalyticsResponse;
import com.freshfeast.backend.security.UserPrincipal;
import com.freshfeast.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    public ResponseEntity<RestaurantAnalyticsResponse> getAnalytics(@AuthenticationPrincipal UserPrincipal principal,
                                                                     @PathVariable Long restaurantId) {
        return ResponseEntity.ok(analyticsService.getRestaurantAnalytics(principal.getUser(), restaurantId));
    }
}
