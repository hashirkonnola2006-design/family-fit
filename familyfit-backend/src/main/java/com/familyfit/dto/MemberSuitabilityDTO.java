package com.familyfit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberSuitabilityDTO {
    private Long memberId;
    private String memberName;
    private String memberRole;
    private boolean suitable;
    private String reason;
}
