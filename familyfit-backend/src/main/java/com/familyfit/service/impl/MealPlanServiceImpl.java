package com.familyfit.service.impl;

import com.familyfit.dto.MealPlanDTO;
import com.familyfit.entity.MealPlan;
import com.familyfit.exception.ResourceNotFoundException;
import com.familyfit.repository.MealPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MealPlanServiceImpl {

    private final MealPlanRepository mealPlanRepository;
    private final EntityMapper mapper;

    public List<MealPlanDTO> getAllPlans() {
        return mealPlanRepository.findAll()
                .stream().map(mapper::toMealPlanDTO).collect(Collectors.toList());
    }

    public MealPlanDTO getPlanById(Long id) {
        MealPlan plan = mealPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MealPlan", id));
        return mapper.toMealPlanDTO(plan);
    }

    public List<MealPlanDTO> getRecommended() {
        // Return top 3 plans tagged "family" or "recommended"
        List<MealPlan> recommended = mealPlanRepository
                .findByTagsContaining(List.of("family", "recommended", "balanced"));
        if (recommended.isEmpty()) {
            recommended = mealPlanRepository.findAll();
        }
        return recommended.stream()
                .limit(3)
                .map(mapper::toMealPlanDTO)
                .collect(Collectors.toList());
    }
}
