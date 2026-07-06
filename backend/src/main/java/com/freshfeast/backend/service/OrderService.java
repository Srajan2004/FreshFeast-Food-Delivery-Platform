package com.freshfeast.backend.service;

import com.freshfeast.backend.dto.order.OrderItemResponse;
import com.freshfeast.backend.dto.order.OrderResponse;
import com.freshfeast.backend.dto.order.PlaceOrderRequest;
import com.freshfeast.backend.entity.*;
import com.freshfeast.backend.exception.BadRequestException;
import com.freshfeast.backend.exception.ResourceNotFoundException;
import com.freshfeast.backend.exception.UnauthorizedActionException;
import com.freshfeast.backend.repository.CartItemRepository;
import com.freshfeast.backend.repository.OrderRepository;
import com.freshfeast.backend.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final RestaurantRepository restaurantRepository;

    @Transactional
    public OrderResponse placeOrder(User customer, PlaceOrderRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUser(customer);
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Your cart is empty");
        }

        Restaurant restaurant = cartItems.get(0).getMenuItem().getRestaurant();

        List<OrderItem> orderItems = cartItems.stream().map(ci -> OrderItem.builder()
                .menuItem(ci.getMenuItem())
                .itemNameSnapshot(ci.getMenuItem().getName())
                .quantity(ci.getQuantity())
                .priceSnapshot(ci.getMenuItem().getPrice())
                .build()).toList();

        BigDecimal total = orderItems.stream()
                .map(oi -> oi.getPriceSnapshot().multiply(BigDecimal.valueOf(oi.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

       Order order = Order.builder()
        .customer(customer)
        .restaurant(restaurant)
        .status(OrderStatus.PENDING)
        .totalAmount(total)
        .deliveryAddress(request.getDeliveryAddress())
        .build();

orderItems.forEach(oi -> oi.setOrder(order));
order.setItems(orderItems);

Order savedOrder = orderRepository.save(order);

cartItemRepository.deleteByUser(customer);

return toResponse(savedOrder);
    }

    public List<OrderResponse> getMyOrders(User customer) {
        return orderRepository.findByCustomerOrderByCreatedAtDesc(customer).stream().map(this::toResponse).toList();
    }

    public List<OrderResponse> getOrdersForRestaurant(User requester, Long restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        assertOwnership(requester, restaurant);
        return orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId).stream().map(this::toResponse).toList();
    }

    public OrderResponse getById(User requester, Long orderId) {
        Order order = findEntity(orderId);
        boolean isCustomer = order.getCustomer().getId().equals(requester.getId());
        boolean isOwner = order.getRestaurant().getOwner().getId().equals(requester.getId());
        boolean isAdmin = requester.getRole() == Role.ADMIN;
        if (!isCustomer && !isOwner && !isAdmin) {
            throw new UnauthorizedActionException("You do not have access to this order");
        }
        return toResponse(order);
    }

    public OrderResponse updateStatus(User requester, Long orderId, OrderStatus newStatus) {
        Order order = findEntity(orderId);
        assertOwnership(requester, order.getRestaurant());
        order.setStatus(newStatus);
        return toResponse(orderRepository.save(order));
    }

    public Order findEntity(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    private void assertOwnership(User requester, Restaurant restaurant) {
        boolean isAdmin = requester.getRole() == Role.ADMIN;
        boolean isOwner = restaurant.getOwner().getId().equals(requester.getId());
        if (!isAdmin && !isOwner) {
            throw new UnauthorizedActionException("You do not have permission to manage orders for this restaurant");
        }
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream().map(oi -> OrderItemResponse.builder()
                .id(oi.getId())
                .menuItemId(oi.getMenuItem().getId())
                .itemName(oi.getItemNameSnapshot())
                .quantity(oi.getQuantity())
                .price(oi.getPriceSnapshot())
                .build()).toList();

        return OrderResponse.builder()
                .id(order.getId())
                .customerId(order.getCustomer().getId())
                .customerName(order.getCustomer().getName())
                .restaurantId(order.getRestaurant().getId())
                .restaurantName(order.getRestaurant().getName())
                .items(items)
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .deliveryAddress(order.getDeliveryAddress())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
