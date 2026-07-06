package com.freshfeast.backend.dto.restaurant;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RestaurantRequest {

    @NotBlank(message = "Restaurant name is required")
    private String name;

    private String description;
    private String cuisineType;
    private String address;
    private String imageUrl;
    private String priceRange;
    private Boolean isOpen;
    private Integer avgDeliveryTimeMinutes;
}
