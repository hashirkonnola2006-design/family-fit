package com.familyfit.service;

import com.familyfit.entity.FamilyMember;

/**
 * Strategy interface for calculating a member's daily caloric goal.
 * Implementations differ by member type:
 * <ul>
 *   <li>{@link com.familyfit.service.impl.AdultNutritionCalculator} — Mifflin-St Jeor formula</li>
 *   <li>{@link com.familyfit.service.impl.ChildNutritionCalculator} — WHO paediatric tables</li>
 * </ul>
 */
public interface NutritionCalculator {
    /**
     * @param member the family member to calculate for
     * @return recommended daily kcal as an integer
     */
    int calculateKcalGoal(FamilyMember member);
}
