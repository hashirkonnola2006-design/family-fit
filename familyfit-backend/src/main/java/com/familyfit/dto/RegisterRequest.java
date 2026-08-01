package com.familyfit.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/** Request body for POST /api/auth/register */
@Data
public class RegisterRequest {
    @NotBlank
    @Size(min = 2, max = 100)
    private String familyName;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 6, max = 100)
    private String password;
}
