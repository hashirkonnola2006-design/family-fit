package com.familyfit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthScoreDTO {
    private Long id;
    private Long memberId;
    private LocalDate date;
    private int score;
    private String insightText;
}
