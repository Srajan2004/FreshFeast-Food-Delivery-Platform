package com.freshfeast.backend.repository;

import com.freshfeast.backend.entity.MenuItem;
import com.freshfeast.backend.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByRestaurant(Restaurant restaurant);
    List<MenuItem> findByRestaurantId(Long restaurantId);
}
