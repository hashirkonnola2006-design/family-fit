package com.familyfit.controller;

import com.familyfit.dto.HealthScoreDTO;
import com.familyfit.service.impl.ProgressServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressServiceImpl progressService;

    @GetMapping("/health-score/{memberId}")
    public ResponseEntity<HealthScoreDTO> getHealthScore(@PathVariable Long memberId) {
        return ResponseEntity.ok(progressService.getHealthScore(memberId));
    }

    @GetMapping("/family-comparison/{familyId}")
    public ResponseEntity<Map<Long, HealthScoreDTO>> getFamilyComparison(@PathVariable Long familyId) {
        return ResponseEntity.ok(progressService.getFamilyComparison(familyId));
    }
}
