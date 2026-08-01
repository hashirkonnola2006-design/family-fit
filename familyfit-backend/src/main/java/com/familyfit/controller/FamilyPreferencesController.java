package com.familyfit.controller;

import com.familyfit.entity.AiPreferences;
import com.familyfit.entity.NotificationPreferences;
import com.familyfit.repository.AiPreferencesRepository;
import com.familyfit.repository.NotificationPreferencesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/family")
@RequiredArgsConstructor
public class FamilyPreferencesController {

    private final NotificationPreferencesRepository notificationRepo;
    private final AiPreferencesRepository aiRepo;

    // ─── Notification Preferences ─────────────────────────────────────────

    @GetMapping("/notification-preferences")
    public ResponseEntity<NotificationPreferences> getNotificationPreferences(
            @RequestParam(defaultValue = "1") Long familyId) {
        NotificationPreferences prefs = notificationRepo.findByFamilyId(familyId)
                .orElseGet(() -> notificationRepo.save(NotificationPreferences.builder().familyId(familyId).build()));
        return ResponseEntity.ok(prefs);
    }

    @RequestMapping(value = "/notification-preferences", method = {RequestMethod.PATCH, RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<NotificationPreferences> updateNotificationPreferences(
            @RequestParam(defaultValue = "1") Long familyId,
            @RequestBody NotificationPreferences request) {
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
    public ResponseEntity<AiPreferences> getAiPreferences(
            @RequestParam(defaultValue = "1") Long familyId) {
        AiPreferences prefs = aiRepo.findByFamilyId(familyId)
                .orElseGet(() -> aiRepo.save(AiPreferences.builder().familyId(familyId).build()));
        return ResponseEntity.ok(prefs);
    }

    @RequestMapping(value = "/ai-preferences", method = {RequestMethod.PATCH, RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<AiPreferences> updateAiPreferences(
            @RequestParam(defaultValue = "1") Long familyId,
            @RequestBody AiPreferences request) {
        AiPreferences prefs = aiRepo.findByFamilyId(familyId)
                .orElseGet(() -> AiPreferences.builder().familyId(familyId).build());

        prefs.setSmartInsightsEnabled(request.isSmartInsightsEnabled());
        prefs.setAiRecipeRecommendationsEnabled(request.isAiRecipeRecommendationsEnabled());

        return ResponseEntity.ok(aiRepo.save(prefs));
    }
}
