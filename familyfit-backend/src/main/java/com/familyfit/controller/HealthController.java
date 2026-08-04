package com.familyfit.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Lightweight health-check endpoint used by Render (and any other platform)
 * to verify the service is running.
 *
 * GET /healthz → 200 {"status":"UP"}
 *
 * This endpoint is explicitly permitted without authentication in SecurityConfig.
 */
@RestController
public class HealthController {

    @GetMapping("/healthz")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
