package com.familyfit.repository;

import com.familyfit.entity.DailyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyLogRepository extends JpaRepository<DailyLog, Long> {
    Optional<DailyLog> findByFamilyMemberIdAndDate(Long memberId, LocalDate date);
    List<DailyLog> findByFamilyMemberIdOrderByDateDesc(Long memberId);
    List<DailyLog> findByFamilyMemberIdAndDateBetweenOrderByDateDesc(Long memberId, LocalDate from, LocalDate to);
}
