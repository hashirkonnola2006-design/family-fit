package com.familyfit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyLogDTO {
    private Long id;
    private Long memberId;
    private LocalDate date;
    private List<MealDTO> mealsEaten;
    private int kcalConsumed;
    private int kcalGoal;
    private MacrosDTO macros;
    private double waterIntakeL;
}
