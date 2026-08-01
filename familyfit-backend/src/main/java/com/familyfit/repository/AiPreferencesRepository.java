package com.familyfit.repository;

import com.familyfit.entity.AiPreferences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AiPreferencesRepository extends JpaRepository<AiPreferences, Long> {
    Optional<AiPreferences> findByFamilyId(Long familyId);
}
