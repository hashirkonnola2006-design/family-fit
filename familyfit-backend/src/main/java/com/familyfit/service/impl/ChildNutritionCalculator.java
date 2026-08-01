package com.familyfit.service.impl;

import com.familyfit.entity.FamilyMember;
import com.familyfit.service.NutritionCalculator;
import org.springframework.stereotype.Service;

/**
 * Calculates daily caloric goal for children using WHO/FAO paediatric reference values.
 * Segmented by age band with weight-based base rate plus per-year adjustments.
 *
 * Age bands (approximate):
 *  1–3   years: 100 kcal/kg × weight
 *  4–8   years:  90 kcal/kg × weight
 *  9–13  years:  80 kcal/kg × weight
 *  14–17 years:  70 kcal/kg × weight (approaching adult values)
 */
@Service("childCalculator")
public class ChildNutritionCalculator implements NutritionCalculator {

    @Override
    public int calculateKcalGoal(FamilyMember member) {
        int age = member.getAge();
        double weight = member.getWeightKg();

        double kcalPerKg;
        if (age <= 3) {
            kcalPerKg = 100;
        } else if (age <= 8) {
            kcalPerKg = 90;
        } else if (age <= 13) {
            kcalPerKg = 80;
        } else {
            kcalPerKg = 70;
        }
        return (int) Math.round(kcalPerKg * weight);
    }
}
