package com.freshfeast.backend.controller;

import com.freshfeast.backend.dto.order.OrderResponse;
import com.freshfeast.backend.dto.order.PlaceOrderRequest;
import com.freshfeast.backend.dto.order.UpdateOrderStatusRequest;
import com.freshfeast.backend.security.UserPrincipal;
import com.freshfeast.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<OrderResponse> placeOrder(@AuthenticationPrincipal UserPrincipal principal,
                                                     @Valid @RequestBody PlaceOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.placeOrder(principal.getUser(), request));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(orderService.getMyOrders(principal.getUser()));
    }

    @GetMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    public ResponseEntity<List<OrderResponse>> getRestaurantOrders(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @PathVariable Long restaurantId) {
        return ResponseEntity.ok(orderService.getOrdersForRestaurant(principal.getUser(), restaurantId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getById(@AuthenticationPrincipal UserPrincipal principal,
                                                  @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getById(principal.getUser(), id));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    public ResponseEntity<OrderResponse> updateStatus(@AuthenticationPrincipal UserPrincipal principal,
                                                       @PathVariable Long id,
                                                       @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(principal.getUser(), id, request.getStatus()));
    }
}
