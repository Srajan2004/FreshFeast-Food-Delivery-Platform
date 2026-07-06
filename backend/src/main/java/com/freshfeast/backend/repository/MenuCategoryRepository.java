package com.freshfeast.backend.repository;

import com.freshfeast.backend.entity.MenuCategory;
import com.freshfeast.backend.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Long> {
    List<MenuCategory> findByRestaurant(Restaurant restaurant);
}
