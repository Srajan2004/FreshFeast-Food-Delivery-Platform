package com.freshfeast.backend.repository;

import com.freshfeast.backend.entity.Order;
import com.freshfeast.backend.entity.Restaurant;
import com.freshfeast.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerOrderByCreatedAtDesc(User customer);
    List<Order> findByRestaurantOrderByCreatedAtDesc(Restaurant restaurant);
    List<Order> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
}
