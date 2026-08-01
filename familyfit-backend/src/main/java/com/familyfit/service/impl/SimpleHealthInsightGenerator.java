package com.familyfit.service.impl;

import com.familyfit.entity.DailyLog;
import com.familyfit.entity.FamilyMember;
import com.familyfit.service.HealthInsightGenerator;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.OptionalDouble;

/**
 * Rule-based health insight generator.
 * Analyses recent daily logs and produces a plain-English insight string.
 * Can be swapped for an AI-backed implementation in the future
 * (just inject a different {@link HealthInsightGenerator} bean).
 */
@Service
public class SimpleHealthInsightGenerator implements HealthInsightGenerator {

    @Override
    public String generateInsight(FamilyMember member, List<DailyLog> history) {
        if (history == null || history.isEmpty()) {
            return "Start logging your meals to unlock personalised health insights!";
        }

        OptionalDouble avgKcal = history.stream()
                .mapToInt(DailyLog::getKcalConsumed)
                .average();
        OptionalDouble avgProtein = history.stream()
                .mapToDouble(log -> log.getMacros().getProteinG())
                .average();

        double goal = history.get(0).getKcalGoal();

        if (avgKcal.isPresent() && avgKcal.getAsDouble() < goal * 0.8) {
            return String.format("Your family is eating below target (avg %.0f kcal). "
                    + "Try adding a nutrient-dense snack to reach your daily goal.", avgKcal.getAsDouble());
        }

        if (avgProtein.isPresent() && avgProtein.getAsDouble() < 50) {
            return "Protein intake is a bit low this week. "
                    + "Adding eggs, legumes or lean meat to meals can help.";
        }

        double proteinTrend = computeTrend(history);
        if (proteinTrend > 5) {
            return String.format("Your family is thriving! Protein intake is up %.0f%% this week, "
                    + "significantly boosting overall vitality levels.", proteinTrend);
        }

        return "Great consistency this week! Keep up your balanced eating habits.";
    }

    // Simple trend: compare last 3 days protein vs previous 3 days
    private double computeTrend(List<DailyLog> history) {
        if (history.size() < 6) return 0;
        double recent = history.subList(0, 3).stream()
                .mapToDouble(l -> l.getMacros().getProteinG()).average().orElse(0);
        double older = history.subList(3, 6).stream()
                .mapToDouble(l -> l.getMacros().getProteinG()).average().orElse(0);
        return older == 0 ? 0 : ((recent - older) / older) * 100;
    }
}
