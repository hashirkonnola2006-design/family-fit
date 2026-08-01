package com.familyfit.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Embeddable macronutrient data attached to DailyLog.
 * Provides percentage helpers for pie/ring display.
 */
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Macros {

    private double proteinG;
    private double carbsG;
    private double fatG;

    // ─── Derived helpers ──────────────────────────────────────────────────

    public double totalKcal() {
        return (proteinG * 4) + (carbsG * 4) + (fatG * 9);
    }

    public double proteinPercent() {
        double total = totalKcal();
        return total == 0 ? 0 : (proteinG * 4 / total) * 100;
    }

    public double carbsPercent() {
        double total = totalKcal();
        return total == 0 ? 0 : (carbsG * 4 / total) * 100;
    }

    public double fatPercent() {
        double total = totalKcal();
        return total == 0 ? 0 : (fatG * 9 / total) * 100;
    }
}
