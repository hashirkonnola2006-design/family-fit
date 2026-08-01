package com.familyfit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MacrosDTO {
    private double proteinG;
    private double carbsG;
    private double fatG;
    private double proteinPercent;
    private double carbsPercent;
    private double fatPercent;
}
