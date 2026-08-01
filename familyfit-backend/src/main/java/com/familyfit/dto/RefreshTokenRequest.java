package com.familyfit.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** Body for POST /api/auth/refresh */
@Data
public class RefreshTokenRequest {
    @NotBlank
    private String refreshToken;
}
