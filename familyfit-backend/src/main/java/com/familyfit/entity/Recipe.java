package com.familyfit.entity;

import com.familyfit.service.Favoritable;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * A detailed recipe with ingredients, steps, nutritional info, allergens, health tags, and health benefits description.
 */
@Entity
@Table(name = "recipes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recipe implements Favoritable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    private int kcal;
    private double proteinG;
    private double carbsG;
    private double fatG;
    private int prepTimeMinutes;
    private String imageUrl;

    @Column(length = 1000)
    private String whyItsGood;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "recipe_tags", joinColumns = @JoinColumn(name = "recipe_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "recipe_allergens", joinColumns = @JoinColumn(name = "recipe_id"))
    @Column(name = "allergen")
    @Builder.Default
    private List<String> containsAllergens = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "recipe_health_tags", joinColumns = @JoinColumn(name = "recipe_id"))
    @Column(name = "health_tag")
    @Builder.Default
    private List<String> healthTags = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id")
    @Builder.Default
    private List<Ingredient> ingredients = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "recipe_steps", joinColumns = @JoinColumn(name = "recipe_id"))
    @OrderColumn(name = "step_index")
    @Column(name = "step", length = 500)
    @Builder.Default
    private List<String> steps = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private boolean favorited = false;

    // ─── Favoritable interface ────────────────────────────────────────────

    @Override
    public boolean isFavorited() {
        return this.favorited;
    }

    @Override
    public void toggleFavorite() {
        this.favorited = !this.favorited;
    }
}
