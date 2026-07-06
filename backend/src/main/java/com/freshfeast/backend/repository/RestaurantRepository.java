package com.freshfeast.backend.repository;

import com.freshfeast.backend.entity.Restaurant;
import com.freshfeast.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByOwner(User owner);
    List<Restaurant> findByNameContainingIgnoreCaseOrCuisineTypeContainingIgnoreCase(String name, String cuisine);
}
