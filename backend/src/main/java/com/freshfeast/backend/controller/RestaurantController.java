package com.freshfeast.backend.controller;

import com.freshfeast.backend.dto.restaurant.RestaurantRequest;
import com.freshfeast.backend.dto.restaurant.RestaurantResponse;
import com.freshfeast.backend.security.UserPrincipal;
import com.freshfeast.backend.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<List<RestaurantResponse>> getAll(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(restaurantService.getAll(search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.getById(id));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    public ResponseEntity<List<RestaurantResponse>> getMine(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(restaurantService.getByOwner(principal.getUser()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    public ResponseEntity<RestaurantResponse> create(@AuthenticationPrincipal UserPrincipal principal,
                                                      @Valid @RequestBody RestaurantRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(restaurantService.create(principal.getUser(), request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    public ResponseEntity<RestaurantResponse> update(@AuthenticationPrincipal UserPrincipal principal,
                                                      @PathVariable Long id,
                                                      @Valid @RequestBody RestaurantRequest request) {
        return ResponseEntity.ok(restaurantService.update(principal.getUser(), id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        restaurantService.delete(principal.getUser(), id);
        return ResponseEntity.noContent().build();
    }
}
