package com.familyfit.service.impl;

import com.familyfit.dto.HealthScoreDTO;
import com.familyfit.entity.*;
import com.familyfit.exception.ResourceNotFoundException;
import com.familyfit.exception.UnauthorizedException;
import com.familyfit.repository.*;
import com.familyfit.service.HealthInsightGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProgressServiceImpl {

    private final HealthScoreRepository healthScoreRepository;
    private final FamilyMemberRepository memberRepository;
    private final DailyLogRepository dailyLogRepository;
    private final HealthInsightGenerator insightGenerator;
    private final EntityMapper mapper;

    /**
     * Returns the health score for a member, after verifying the caller owns the member.
     *
     * @param callerFamilyId family ID from the caller's JWT
     */
    public HealthScoreDTO getHealthScore(Long memberId, Long callerFamilyId) {
        FamilyMember member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("FamilyMember", memberId));

        // ── Multi-tenancy guard ──────────────────────────────────────────
        if (!member.getFamily().getId().equals(callerFamilyId)) {
            throw new UnauthorizedException(
                    "Access denied: this member belongs to a different family account.");
        }

        return computeHealthScore(member);
    }

    /** Returns latest health score for each member in the family, keyed by memberId */
    public Map<Long, HealthScoreDTO> getFamilyComparison(Long familyId) {
        List<FamilyMember> members = memberRepository.findByFamilyId(familyId);
        return members.stream()
                .collect(Collectors.toMap(
                        FamilyMember::getId,
                        m -> computeHealthScore(m)
                ));
    }

    // ─── Private helpers ──────────────────────────────────────────────────

    /** Computes and returns the health score for a member (no ownership check — caller must verify). */
    private HealthScoreDTO computeHealthScore(FamilyMember member) {
        List<DailyLog> history = dailyLogRepository
                .findByFamilyMemberIdAndDateBetweenOrderByDateDesc(
                        member.getId(), LocalDate.now().minusDays(14), LocalDate.now());

        int score = computeScore(member, history);
        String insight = insightGenerator.generateInsight(member, history);

        HealthScore hs = HealthScore.builder()
                .familyMember(member)
                .date(LocalDate.now())
                .score(score)
                .insightText(insight)
                .build();

        return mapper.toHealthScoreDTO(hs);
    }

    // ─── Scoring logic ────────────────────────────────────────────────────

    private int computeScore(FamilyMember member, List<DailyLog> logs) {
        if (logs.isEmpty()) return 60;

        double avgAdherence = logs.stream()
                .mapToDouble(l -> l.getKcalGoal() == 0 ? 0 :
                        Math.min(1.0, (double) l.getKcalConsumed() / l.getKcalGoal()))
                .average().orElse(0.6);

        double avgWater = logs.stream().mapToDouble(DailyLog::getWaterIntakeL).average().orElse(0);
        double waterScore = Math.min(1.0, avgWater / 2.0); // target 2L

        return (int) Math.round(60 + (avgAdherence * 30) + (waterScore * 10));
    }
}
