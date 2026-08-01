package com.familyfit.controller;

import com.familyfit.dto.MealPlanDTO;
import com.familyfit.service.impl.MealPlanServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class MealPlanController {

    private final MealPlanServiceImpl mealPlanService;

    @GetMapping
    public ResponseEntity<List<MealPlanDTO>> getAllPlans() {
        return ResponseEntity.ok(mealPlanService.getAllPlans());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MealPlanDTO> getPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(mealPlanService.getPlanById(id));
    }

    @GetMapping("/recommended")
    public ResponseEntity<List<MealPlanDTO>> getRecommended() {
        return ResponseEntity.ok(mealPlanService.getRecommended());
    }
}
