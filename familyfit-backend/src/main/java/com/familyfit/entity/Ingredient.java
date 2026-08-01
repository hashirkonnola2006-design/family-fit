package com.familyfit.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * An ingredient used in a {@link Recipe}.
 * Stored as a dependent entity with cascade from Recipe.
 */
@Entity
@Table(name = "ingredients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String quantity;  // e.g. "200", "1/2"
    private String unit;      // e.g. "g", "cup", "tbsp"
}
