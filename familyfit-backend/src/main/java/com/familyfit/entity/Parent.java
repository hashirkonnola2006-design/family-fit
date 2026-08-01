package com.familyfit.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * Concrete FamilyMember subclass for adult parents.
 * Kcal goal is calculated via {@link com.familyfit.service.impl.AdultNutritionCalculator}
 * using the Mifflin-St Jeor formula.
 */
@Entity
@DiscriminatorValue("PARENT")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@SuperBuilder
public class Parent extends FamilyMember {
    // No extra fields — behaviour difference lives in AdultNutritionCalculator
}
