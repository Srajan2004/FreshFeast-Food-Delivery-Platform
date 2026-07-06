package com.freshfeast.backend.config;

import com.freshfeast.backend.entity.*;
import com.freshfeast.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Seeds the database with demo accounts and sample menu data so the
 * frontend has something to display out of the box. Runs only when
 * the users table is empty, so it is safe across restarts.
 *
 * Demo accounts (password for all: "password123"):
 * - admin@freshfeast.com (ADMIN)
 * - owner@freshfeast.com (RESTAURANT_OWNER)
 * - customer@freshfeast.com (CUSTOMER)
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

        private final UserRepository userRepository;
        private final RestaurantRepository restaurantRepository;
        private final MenuCategoryRepository menuCategoryRepository;
        private final MenuItemRepository menuItemRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) {
                if (userRepository.count() > 0) {
                        return;
                }

                String demoPassword = passwordEncoder.encode("password123");

                User admin = userRepository.save(User.builder()
                                .name("Platform Admin")
                                .email("admin@freshfeast.com")
                                .password(demoPassword)
                                .role(Role.ADMIN)
                                .status(UserStatus.ACTIVE)
                                .build());

                User owner = userRepository.save(User.builder()
                                .name("Maria Rossi")
                                .email("owner@freshfeast.com")
                                .password(demoPassword)
                                .role(Role.RESTAURANT_OWNER)
                                .phone("+91 90000 11111")
                                .status(UserStatus.ACTIVE)
                                .build());

                userRepository.save(User.builder()
                                .name("Alex Chen")
                                .email("customer@freshfeast.com")
                                .password(demoPassword)
                                .role(Role.CUSTOMER)
                                .phone("+91 90000 22222")
                                .status(UserStatus.ACTIVE)
                                .build());

                Restaurant restaurant = restaurantRepository.save(Restaurant.builder()
                                .owner(owner)
                                .name("QuickBite Kitchen")
                                .description("Fresh, fast, and flavorful meals delivered to your door.")
                                .cuisineType("Italian, Fast Food")
                                .address("221B Market Street, Indore")
                                .imageUrl("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4")
                                .priceRange("$$")
                                .isOpen(true)
                                .avgDeliveryTimeMinutes(30)
                                .rating(4.5)
                                .build());

                MenuCategory mains = menuCategoryRepository.save(MenuCategory.builder()
                                .restaurant(restaurant).name("Mains").displayOrder(1).build());
                MenuCategory sides = menuCategoryRepository.save(MenuCategory.builder()
                                .restaurant(restaurant).name("Sides").displayOrder(2).build());

                menuItemRepository.save(MenuItem.builder()
                                .restaurant(restaurant).category(mains)
                                .name("Margherita Pizza")
                                .description("Classic tomato, mozzarella, and basil on a wood-fired crust.")
                                .price(new BigDecimal("299.00"))
                                .imageUrl("https://images.unsplash.com/photo-1548365328-9f547fb0953b")
                                .isVeg(true).isAvailable(true)
                                .build());

                menuItemRepository.save(MenuItem.builder()
                                .restaurant(restaurant).category(mains)
                                .name("Grilled Chicken Burger")
                                .description("Char-grilled chicken breast, lettuce, and house sauce.")
                                .price(new BigDecimal("249.00"))
                                .imageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd")
                                .isVeg(false).isAvailable(true)
                                .build());

                menuItemRepository.save(MenuItem.builder()
                                .restaurant(restaurant).category(sides)
                                .name("Garlic Bread")
                                .description("Toasted baguette with garlic butter and herbs.")
                                .price(new BigDecimal("129.00"))
                                .imageUrl("https://images.unsplash.com/photo-1573140247632-f8fd74997d5c")
                                .isVeg(true).isAvailable(true)
                                .build());
        }
}
