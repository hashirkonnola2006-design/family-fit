package com.familyfit.repository;

import com.familyfit.entity.HealthScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HealthScoreRepository extends JpaRepository<HealthScore, Long> {
    Optional<HealthScore> findTopByFamilyMemberIdOrderByDateDesc(Long memberId);
    List<HealthScore> findByFamilyMemberIdOrderByDateDesc(Long memberId);
    List<HealthScore> findByFamilyMemberId(Long memberId);
}
