package com.familyfit.service.impl;

import com.familyfit.entity.FamilyMember;
import com.familyfit.service.NutritionCalculator;
import org.springframework.stereotype.Service;

/**
 * Calculates daily caloric goal for adult parents using the Mifflin-St Jeor equation,
 * tailored for gender, activity level, and fitness goal.
 */
@Service("adultCalculator")
public class AdultNutritionCalculator implements NutritionCalculator {

    @Override
    public int calculateKcalGoal(FamilyMember member) {
        int sexConstant = (member.getGender() == FamilyMember.Gender.MALE) ? 5 : -161;

        double bmr = (10.0 * member.getWeightKg())
                   + (6.25 * member.getHeightCm())
                   - (5.0 * member.getAge())
                   + sexConstant;

        double activityFactor = 1.55;
        if (member.getActivityLevel() != null) {
            switch (member.getActivityLevel()) {
                case SEDENTARY: activityFactor = 1.2; break;
                case LIGHTLY_ACTIVE: activityFactor = 1.375; break;
                case MODERATELY_ACTIVE: activityFactor = 1.55; break;
                case VERY_ACTIVE: activityFactor = 1.725; break;
            }
        }

        double tdee = bmr * activityFactor;

        // Fitness goal adjustment
        if (member.getFitnessGoal() != null) {
            switch (member.getFitnessGoal()) {
                case WEIGHT_LOSS: tdee -= 400; break;
                case WEIGHT_GAIN:
                case MUSCLE_GAIN: tdee += 350; break;
                case MAINTAIN_WEIGHT:
                case MANAGE_CONDITION:
                default: break;
            }
        }

        return (int) Math.max(1200, Math.round(tdee));
    }
}
