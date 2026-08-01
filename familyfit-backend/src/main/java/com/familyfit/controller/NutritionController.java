package com.familyfit.controller;

import com.familyfit.dto.DailyLogDTO;
import com.familyfit.service.impl.NutritionServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/nutrition")
@RequiredArgsConstructor
public class NutritionController {

    private final NutritionServiceImpl nutritionService;

    @GetMapping("/today/{memberId}")
    public ResponseEntity<DailyLogDTO> getTodayLog(@PathVariable Long memberId) {
        return ResponseEntity.ok(nutritionService.getTodayLog(memberId));
    }

    @PostMapping("/log")
    public ResponseEntity<DailyLogDTO> logMeal(@RequestBody Map<String, Long> body) {
        Long memberId = body.get("memberId");
        Long mealId = body.get("mealId");
        return ResponseEntity.ok(nutritionService.logMeal(memberId, mealId));
    }

    @PatchMapping("/water/{memberId}")
    public ResponseEntity<DailyLogDTO> updateWater(@PathVariable Long memberId,
                                                    @RequestBody Map<String, Double> body) {
        return ResponseEntity.ok(nutritionService.updateWater(memberId, body.get("waterIntakeL")));
    }
}
