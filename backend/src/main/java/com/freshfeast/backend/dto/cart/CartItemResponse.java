package com.freshfeast.backend.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Long id;
    private Long menuItemId;
    private String menuItemName;
    private String imageUrl;
    private BigDecimal price;
    private Integer quantity;
    private Long restaurantId;
    private String restaurantName;
    private BigDecimal lineTotal;
}
