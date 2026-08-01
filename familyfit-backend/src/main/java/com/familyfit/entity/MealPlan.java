package com.familyfit.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * A curated collection of meals grouped under a named plan
 * (e.g. "Vitality & Growth Plan", "Weight Loss Plan").
 */
@Entity
@Table(name = "meal_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    private String targetGroup;  // e.g. "Family of 4", "Active Adults"

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "meal_plan_tags", joinColumns = @JoinColumn(name = "plan_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    private String imageUrl;

    @OneToMany(mappedBy = "mealPlan", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Meal> meals = new ArrayList<>();
}
