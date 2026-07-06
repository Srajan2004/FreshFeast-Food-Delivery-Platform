package com.freshfeast.backend.controller;

import com.freshfeast.backend.dto.menu.*;
import com.freshfeast.backend.security.UserPrincipal;
import com.freshfeast.backend.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    // Public: browse a restaurant's menu
    @GetMapping("/api/restaurants/{restaurantId}/menu-items")
    public ResponseEntity<List<MenuItemResponse>> getMenuItems(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(menuService.getMenuItemsForRestaurant(restaurantId));
    }

    @GetMapping("/api/restaurants/{restaurantId}/categories")
    public ResponseEntity<List<MenuCategoryResponse>> getCategories(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(menuService.getCategories(restaurantId));
    }

    @PostMapping("/api/restaurants/{restaurantId}/categories")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    public ResponseEntity<MenuCategoryResponse> addCategory(@AuthenticationPrincipal UserPrincipal principal,
                                                             @PathVariable Long restaurantId,
                                                             @Valid @RequestBody MenuCategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(menuService.addCategory(principal.getUser(), restaurantId, request));
    }

    @PostMapping("/api/restaurants/{restaurantId}/menu-items")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    public ResponseEntity<MenuItemResponse> addMenuItem(@AuthenticationPrincipal UserPrincipal principal,
                                                         @PathVariable Long restaurantId,
                                                         @Valid @RequestBody MenuItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(menuService.addMenuItem(principal.getUser(), restaurantId, request));
    }

    @PutMapping("/api/menu-items/{itemId}")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    public ResponseEntity<MenuItemResponse> updateMenuItem(@AuthenticationPrincipal UserPrincipal principal,
                                                            @PathVariable Long itemId,
                                                            @Valid @RequestBody MenuItemRequest request) {
        return ResponseEntity.ok(menuService.updateMenuItem(principal.getUser(), itemId, request));
    }

    @DeleteMapping("/api/menu-items/{itemId}")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    public ResponseEntity<Void> deleteMenuItem(@AuthenticationPrincipal UserPrincipal principal,
                                                @PathVariable Long itemId) {
        menuService.deleteMenuItem(principal.getUser(), itemId);
        return ResponseEntity.noContent().build();
    }
}
