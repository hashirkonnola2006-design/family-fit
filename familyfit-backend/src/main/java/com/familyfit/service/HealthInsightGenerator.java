package com.familyfit.service;

import com.familyfit.entity.DailyLog;
import com.familyfit.entity.FamilyMember;

import java.util.List;

/**
 * Strategy interface for generating natural-language health insights
 * from a member's log history. Can later be backed by an AI service.
 */
public interface HealthInsightGenerator {
    /**
     * @param member  the family member to analyse
     * @param history recent daily logs (up to 14 days)
     * @return a human-readable insight string (max ~160 chars)
     */
    String generateInsight(FamilyMember member, List<DailyLog> history);
}
