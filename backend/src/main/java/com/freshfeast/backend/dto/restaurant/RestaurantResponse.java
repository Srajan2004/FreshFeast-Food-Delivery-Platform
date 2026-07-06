package com.freshfeast.backend.dto.restaurant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantResponse {
    private Long id;
    private Long ownerId;
    private String ownerName;
    private String name;
    private String description;
    private String cuisineType;
    private String address;
    private String imageUrl;
    private Double rating;
    private String priceRange;
    private Boolean isOpen;
    private Integer avgDeliveryTimeMinutes;
    private Instant createdAt;
}
