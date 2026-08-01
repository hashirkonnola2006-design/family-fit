package com.familyfit.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * Concrete FamilyMember subclass for children.
 * Kcal goal is calculated via {@link com.familyfit.service.impl.ChildNutritionCalculator}
 * using a WHO-based formula adjusted for age and weight.
 */
@Entity
@DiscriminatorValue("CHILD")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@SuperBuilder
public class Child extends FamilyMember {
    // No extra fields — behaviour difference lives in ChildNutritionCalculator
}
