package com.familyfit.service.impl;

import com.familyfit.dto.HealthScoreDTO;
import com.familyfit.entity.*;
import com.familyfit.exception.ResourceNotFoundException;
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

    public HealthScoreDTO getHealthScore(Long memberId) {
        FamilyMember member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("FamilyMember", memberId));

        List<DailyLog> history = dailyLogRepository
                .findByFamilyMemberIdAndDateBetweenOrderByDateDesc(
                        memberId, LocalDate.now().minusDays(14), LocalDate.now());

        // Compute score: baseline 60 + kcal adherence bonus (up to 30) + water bonus (up to 10)
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

    /** Returns latest health score for each member in the family, keyed by memberId */
    public Map<Long, HealthScoreDTO> getFamilyComparison(Long familyId) {
        List<FamilyMember> members = memberRepository.findByFamilyId(familyId);
        return members.stream()
                .collect(Collectors.toMap(
                        FamilyMember::getId,
                        m -> getHealthScore(m.getId())
                ));
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
