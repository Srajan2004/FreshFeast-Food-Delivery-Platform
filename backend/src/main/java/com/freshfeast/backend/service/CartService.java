package com.freshfeast.backend.service;

import com.freshfeast.backend.dto.cart.AddToCartRequest;
import com.freshfeast.backend.dto.cart.CartItemResponse;
import com.freshfeast.backend.dto.cart.CartResponse;
import com.freshfeast.backend.dto.cart.UpdateCartItemRequest;
import com.freshfeast.backend.entity.CartItem;
import com.freshfeast.backend.entity.MenuItem;
import com.freshfeast.backend.entity.User;
import com.freshfeast.backend.exception.BadRequestException;
import com.freshfeast.backend.exception.ResourceNotFoundException;
import com.freshfeast.backend.repository.CartItemRepository;
import com.freshfeast.backend.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final MenuItemRepository menuItemRepository;

    public CartResponse getCart(User user) {
        List<CartItem> items = cartItemRepository.findByUser(user);
        return toCartResponse(items);
    }

    public CartResponse addItem(User user, AddToCartRequest request) {
        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

        if (!Boolean.TRUE.equals(menuItem.getIsAvailable())) {
            throw new BadRequestException("This item is currently unavailable");
        }

        List<CartItem> existingCart = cartItemRepository.findByUser(user);
        if (!existingCart.isEmpty()
                && !existingCart.get(0).getMenuItem().getRestaurant().getId().equals(menuItem.getRestaurant().getId())) {
            throw new BadRequestException("Your cart contains items from another restaurant. Clear your cart to add items from a new restaurant.");
        }

        CartItem cartItem = cartItemRepository.findByUserAndMenuItem(user, menuItem)
                .orElse(CartItem.builder().user(user).menuItem(menuItem).quantity(0).build());

        cartItem.setQuantity(cartItem.getQuantity() + (request.getQuantity() == null ? 1 : request.getQuantity()));
        cartItemRepository.save(cartItem);

        return getCart(user);
    }

    public CartResponse updateItem(User user, Long cartItemId, UpdateCartItemRequest request) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("This cart item does not belong to you");
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        return getCart(user);
    }

    public CartResponse removeItem(User user, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("This cart item does not belong to you");
        }

        cartItemRepository.delete(item);
        return getCart(user);
    }

    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }

    private CartResponse toCartResponse(List<CartItem> items) {
        List<CartItemResponse> responses = items.stream().map(ci -> CartItemResponse.builder()
                .id(ci.getId())
                .menuItemId(ci.getMenuItem().getId())
                .menuItemName(ci.getMenuItem().getName())
                .imageUrl(ci.getMenuItem().getImageUrl())
                .price(ci.getMenuItem().getPrice())
                .quantity(ci.getQuantity())
                .restaurantId(ci.getMenuItem().getRestaurant().getId())
                .restaurantName(ci.getMenuItem().getRestaurant().getName())
                .lineTotal(ci.getMenuItem().getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())))
                .build()).toList();

        BigDecimal subtotal = responses.stream()
                .map(CartItemResponse::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = responses.stream().mapToInt(CartItemResponse::getQuantity).sum();

        return CartResponse.builder()
                .items(responses)
                .subtotal(subtotal)
                .totalItems(totalItems)
                .build();
    }
}
