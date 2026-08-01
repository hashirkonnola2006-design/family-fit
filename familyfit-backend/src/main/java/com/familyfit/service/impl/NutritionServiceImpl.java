package com.familyfit.service.impl;

import com.familyfit.dto.DailyLogDTO;
import com.familyfit.entity.*;
import com.familyfit.exception.ResourceNotFoundException;
import com.familyfit.repository.*;
import com.familyfit.service.NutritionCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@Transactional
public class NutritionServiceImpl {

    private final DailyLogRepository dailyLogRepository;
    private final FamilyMemberRepository memberRepository;
    private final MealPlanRepository mealPlanRepository;
    private final EntityMapper mapper;
    private final NutritionCalculator adultCalculator;
    private final NutritionCalculator childCalculator;

    public NutritionServiceImpl(
            DailyLogRepository dailyLogRepository,
            FamilyMemberRepository memberRepository,
            MealPlanRepository mealPlanRepository,
            EntityMapper mapper,
            @Qualifier("adultCalculator") NutritionCalculator adultCalculator,
            @Qualifier("childCalculator") NutritionCalculator childCalculator) {
        this.dailyLogRepository = dailyLogRepository;
        this.memberRepository = memberRepository;
        this.mealPlanRepository = mealPlanRepository;
        this.mapper = mapper;
        this.adultCalculator = adultCalculator;
        this.childCalculator = childCalculator;
    }

    @Transactional(readOnly = true)
    public DailyLogDTO getTodayLog(Long memberId) {
        LocalDate today = LocalDate.now();
        FamilyMember member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("FamilyMember", memberId));

        Optional<DailyLog> existing = dailyLogRepository.findByFamilyMemberIdAndDate(memberId, today);
        if (existing.isPresent()) {
            DailyLogDTO dto = mapper.toDailyLogDTO(existing.get());
            dto.setKcalGoal(getKcalGoal(member));
            return dto;
        }

        // Return a stub with just the goal if no log exists yet
        return DailyLogDTO.builder()
                .memberId(memberId)
                .date(today)
                .kcalConsumed(0)
                .kcalGoal(getKcalGoal(member))
                .macros(new com.familyfit.dto.MacrosDTO())
                .waterIntakeL(0)
                .build();
    }

    public DailyLogDTO logMeal(Long memberId, Long mealId) {
        LocalDate today = LocalDate.now();
        FamilyMember member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("FamilyMember", memberId));

        DailyLog log = dailyLogRepository.findByFamilyMemberIdAndDate(memberId, today)
                .orElseGet(() -> DailyLog.builder()
                        .familyMember(member)
                        .date(today)
                        .kcalGoal(getKcalGoal(member))
                        .macros(new Macros())
                        .build());

        // Find the meal across all plans
        Meal meal = mealPlanRepository.findAll().stream()
                .flatMap(p -> p.getMeals().stream())
                .filter(m -> m.getId().equals(mealId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Meal", mealId));

        log.getMealsEaten().add(meal);
        log.setKcalConsumed(log.getKcalConsumed() + meal.getKcal());

        Macros existing = log.getMacros();
        log.setMacros(Macros.builder()
                .proteinG(existing.getProteinG() + meal.getProteinG())
                .carbsG(existing.getCarbsG() + meal.getCarbsG())
                .fatG(existing.getFatG() + meal.getFatG())
                .build());

        return mapper.toDailyLogDTO(dailyLogRepository.save(log));
    }

    public DailyLogDTO updateWater(Long memberId, double waterIntakeL) {
        LocalDate today = LocalDate.now();
        FamilyMember member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("FamilyMember", memberId));

        DailyLog log = dailyLogRepository.findByFamilyMemberIdAndDate(memberId, today)
                .orElseGet(() -> DailyLog.builder()
                        .familyMember(member)
                        .date(today)
                        .kcalGoal(getKcalGoal(member))
                        .macros(new Macros())
                        .build());
        log.setWaterIntakeL(waterIntakeL);
        return mapper.toDailyLogDTO(dailyLogRepository.save(log));
    }

    // ─── Helper ──────────────────────────────────────────────────────────

    private int getKcalGoal(FamilyMember member) {
        if (member.getRole() == FamilyMember.Role.CHILD) {
            return childCalculator.calculateKcalGoal(member);
        }
        return adultCalculator.calculateKcalGoal(member);
    }
}
