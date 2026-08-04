package com.familyfit.controller;

import com.familyfit.entity.AiPreferences;
import com.familyfit.entity.NotificationPreferences;
import com.familyfit.repository.AiPreferencesRepository;
import com.familyfit.repository.NotificationPreferencesRepository;
import com.familyfit.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Manages per-family notification and AI preferences.
 *
 * <p><strong>Multi-tenancy enforcement:</strong> The family ID is always
 * resolved from the authenticated user's JWT via {@link SecurityUtils} —
 * never from a client-supplied query parameter.  The old
 * {@code @RequestParam(defaultValue = "1")} pattern was a security hole:
 * any client that omitted the param silently received family 1's settings.
 */
@RestController
@RequestMapping("/api/family")
@RequiredArgsConstructor
public class FamilyPreferencesController {

    private final NotificationPreferencesRepository notificationRepo;
    private final AiPreferencesRepository aiRepo;
    private final SecurityUtils securityUtils;

    // ─── Notification Preferences ─────────────────────────────────────────

    @GetMapping("/notification-preferences")
    public ResponseEntity<NotificationPreferences> getNotificationPreferences() {
        Long familyId = securityUtils.currentFamilyId();
        NotificationPreferences prefs = notificationRepo.findByFamilyId(familyId)
                .orElseGet(() -> notificationRepo.save(
                        NotificationPreferences.builder().familyId(familyId).build()));
        return ResponseEntity.ok(prefs);
    }

    @RequestMapping(value = "/notification-preferences",
            method = {RequestMethod.PATCH, RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<NotificationPreferences> updateNotificationPreferences(
            @RequestBody NotificationPreferences request) {
        Long familyId = securityUtils.currentFamilyId();
        NotificationPreferences prefs = notificationRepo.findByFamilyId(familyId)
                .orElseGet(() -> NotificationPreferences.builder().familyId(familyId).build());

        prefs.setMealRemindersEnabled(request.isMealRemindersEnabled());
        prefs.setDailySummaryEnabled(request.isDailySummaryEnabled());
        prefs.setGoalAlertsEnabled(request.isGoalAlertsEnabled());
        prefs.setWeeklyReportEnabled(request.isWeeklyReportEnabled());

        return ResponseEntity.ok(notificationRepo.save(prefs));
    }

    // ─── AI Preferences ───────────────────────────────────────────────────

    @GetMapping("/ai-preferences")
    public ResponseEntity<AiPreferences> getAiPreferences() {
        Long familyId = securityUtils.currentFamilyId();
        AiPreferences prefs = aiRepo.findByFamilyId(familyId)
                .orElseGet(() -> aiRepo.save(
                        AiPreferences.builder().familyId(familyId).build()));
        return ResponseEntity.ok(prefs);
    }

    @RequestMapping(value = "/ai-preferences",
            method = {RequestMethod.PATCH, RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<AiPreferences> updateAiPreferences(
            @RequestBody AiPreferences request) {
        Long familyId = securityUtils.currentFamilyId();
        AiPreferences prefs = aiRepo.findByFamilyId(familyId)
                .orElseGet(() -> AiPreferences.builder().familyId(familyId).build());

        prefs.setSmartInsightsEnabled(request.isSmartInsightsEnabled());
        prefs.setAiRecipeRecommendationsEnabled(request.isAiRecipeRecommendationsEnabled());

        return ResponseEntity.ok(aiRepo.save(prefs));
    }
}
