package com.freshfeast.backend.service;

import com.freshfeast.backend.dto.menu.*;
import com.freshfeast.backend.entity.MenuCategory;
import com.freshfeast.backend.entity.MenuItem;
import com.freshfeast.backend.entity.Restaurant;
import com.freshfeast.backend.entity.User;
import com.freshfeast.backend.exception.BadRequestException;
import com.freshfeast.backend.exception.ResourceNotFoundException;
import com.freshfeast.backend.exception.UnauthorizedActionException;
import com.freshfeast.backend.repository.MenuCategoryRepository;
import com.freshfeast.backend.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final MenuCategoryRepository menuCategoryRepository;
    private final RestaurantService restaurantService;

    // ---- Categories ----

    public MenuCategoryResponse addCategory(User requester, Long restaurantId, MenuCategoryRequest request) {
        Restaurant restaurant = restaurantService.findEntity(restaurantId);
        assertOwnership(requester, restaurant);

        MenuCategory category = MenuCategory.builder()
                .restaurant(restaurant)
                .name(request.getName())
                .displayOrder(request.getDisplayOrder())
                .build();

        category = menuCategoryRepository.save(category);
        return toCategoryResponse(category);
    }

    public List<MenuCategoryResponse> getCategories(Long restaurantId) {
        Restaurant restaurant = restaurantService.findEntity(restaurantId);
        return menuCategoryRepository.findByRestaurant(restaurant).stream().map(this::toCategoryResponse).toList();
    }

    // ---- Menu items ----

    public MenuItemResponse addMenuItem(User requester, Long restaurantId, MenuItemRequest request) {
        Restaurant restaurant = restaurantService.findEntity(restaurantId);
        assertOwnership(requester, restaurant);

        MenuCategory category = null;
        if (request.getCategoryId() != null) {
            category = menuCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        }

        MenuItem item = MenuItem.builder()
                .restaurant(restaurant)
                .category(category)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .isVeg(request.getIsVeg() == null || request.getIsVeg())
                .isAvailable(request.getIsAvailable() == null || request.getIsAvailable())
                .build();

        item = menuItemRepository.save(item);
        return toItemResponse(item);
    }

    public List<MenuItemResponse> getMenuItemsForRestaurant(Long restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId).stream().map(this::toItemResponse).toList();
    }

    public MenuItemResponse updateMenuItem(User requester, Long itemId, MenuItemRequest request) {
        MenuItem item = findItemEntity(itemId);
        assertOwnership(requester, item.getRestaurant());

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setImageUrl(request.getImageUrl());
        if (request.getIsVeg() != null) item.setIsVeg(request.getIsVeg());
        if (request.getIsAvailable() != null) item.setIsAvailable(request.getIsAvailable());

        if (request.getCategoryId() != null) {
            MenuCategory category = menuCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            item.setCategory(category);
        }

        return toItemResponse(menuItemRepository.save(item));
    }

    public void deleteMenuItem(User requester, Long itemId) {
        MenuItem item = findItemEntity(itemId);
        assertOwnership(requester, item.getRestaurant());
        menuItemRepository.delete(item);
    }

    public MenuItem findItemEntity(Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
    }

    private void assertOwnership(User requester, Restaurant restaurant) {
        boolean isAdmin = requester.getRole().name().equals("ADMIN");
        boolean isOwner = restaurant.getOwner().getId().equals(requester.getId());
        if (!isAdmin && !isOwner) {
            throw new UnauthorizedActionException("You do not have permission to manage this restaurant's menu");
        }
    }

    private MenuCategoryResponse toCategoryResponse(MenuCategory c) {
        return MenuCategoryResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .displayOrder(c.getDisplayOrder())
                .build();
    }

    private MenuItemResponse toItemResponse(MenuItem item) {
        return MenuItemResponse.builder()
                .id(item.getId())
                .restaurantId(item.getRestaurant().getId())
                .categoryId(item.getCategory() != null ? item.getCategory().getId() : null)
                .categoryName(item.getCategory() != null ? item.getCategory().getName() : null)
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .imageUrl(item.getImageUrl())
                .isVeg(item.getIsVeg())
                .isAvailable(item.getIsAvailable())
                .build();
    }
}
