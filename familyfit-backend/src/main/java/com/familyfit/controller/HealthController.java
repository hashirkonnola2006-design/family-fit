package com.familyfit.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

/**
 * Lightweight public health endpoint used by external keep-alive pingers (e.g. UptimeRobot)
 * and the frontend wake-up trigger.
 *
 * Route: GET /health (also /api/health and /healthz)
 * Returns HTTP 200 with {"status": "ok"}
 * Excluded from authentication, session checks, and CORS restrictions.
 * Performs zero database queries, zero external API calls, and zero heavy logic.
 */
@CrossOrigin(origins = "*")
@RestController
public class HealthController {

    @GetMapping(value = {"/health", "/api/health", "/healthz"}, produces = "application/json")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Collections.singletonMap("status", "ok"));
    }
}
