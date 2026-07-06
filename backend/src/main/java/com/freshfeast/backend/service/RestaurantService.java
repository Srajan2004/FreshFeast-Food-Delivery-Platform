package com.freshfeast.backend.service;

import com.freshfeast.backend.dto.restaurant.RestaurantRequest;
import com.freshfeast.backend.dto.restaurant.RestaurantResponse;
import com.freshfeast.backend.entity.Restaurant;
import com.freshfeast.backend.entity.User;
import com.freshfeast.backend.exception.ResourceNotFoundException;
import com.freshfeast.backend.exception.UnauthorizedActionException;
import com.freshfeast.backend.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public List<RestaurantResponse> getAll(String search) {
        List<Restaurant> restaurants;
        if (StringUtils.hasText(search)) {
            restaurants = restaurantRepository
                    .findByNameContainingIgnoreCaseOrCuisineTypeContainingIgnoreCase(search, search);
        } else {
            restaurants = restaurantRepository.findAll();
        }
        return restaurants.stream().map(this::toResponse).toList();
    }

    public RestaurantResponse getById(Long id) {
        return toResponse(findEntity(id));
    }

    public List<RestaurantResponse> getByOwner(User owner) {
        return restaurantRepository.findByOwner(owner).stream().map(this::toResponse).toList();
    }

    public RestaurantResponse create(User owner, RestaurantRequest request) {
        Restaurant restaurant = Restaurant.builder()
                .owner(owner)
                .name(request.getName())
                .description(request.getDescription())
                .cuisineType(request.getCuisineType())
                .address(request.getAddress())
                .imageUrl(request.getImageUrl())
                .priceRange(request.getPriceRange())
                .isOpen(request.getIsOpen() == null || request.getIsOpen())
                .avgDeliveryTimeMinutes(request.getAvgDeliveryTimeMinutes())
                .rating(0.0)
                .build();

        return toResponse(restaurantRepository.save(restaurant));
    }

    public RestaurantResponse update(User requester, Long id, RestaurantRequest request) {
        Restaurant restaurant = findEntity(id);
        assertOwnership(requester, restaurant);

        restaurant.setName(request.getName());
        restaurant.setDescription(request.getDescription());
        restaurant.setCuisineType(request.getCuisineType());
        restaurant.setAddress(request.getAddress());
        restaurant.setImageUrl(request.getImageUrl());
        restaurant.setPriceRange(request.getPriceRange());
        if (request.getIsOpen() != null) {
            restaurant.setIsOpen(request.getIsOpen());
        }
        restaurant.setAvgDeliveryTimeMinutes(request.getAvgDeliveryTimeMinutes());

        return toResponse(restaurantRepository.save(restaurant));
    }

    public void delete(User requester, Long id) {
        Restaurant restaurant = findEntity(id);
        assertOwnership(requester, restaurant);
        restaurantRepository.delete(restaurant);
    }

    public Restaurant findEntity(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
    }

    private void assertOwnership(User requester, Restaurant restaurant) {
        boolean isAdmin = requester.getRole().name().equals("ADMIN");
        boolean isOwner = restaurant.getOwner().getId().equals(requester.getId());
        if (!isAdmin && !isOwner) {
            throw new UnauthorizedActionException("You do not own this restaurant");
        }
    }

    private RestaurantResponse toResponse(Restaurant r) {
        return RestaurantResponse.builder()
                .id(r.getId())
                .ownerId(r.getOwner().getId())
                .ownerName(r.getOwner().getName())
                .name(r.getName())
                .description(r.getDescription())
                .cuisineType(r.getCuisineType())
                .address(r.getAddress())
                .imageUrl(r.getImageUrl())
                .rating(r.getRating())
                .priceRange(r.getPriceRange())
                .isOpen(r.getIsOpen())
                .avgDeliveryTimeMinutes(r.getAvgDeliveryTimeMinutes())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
