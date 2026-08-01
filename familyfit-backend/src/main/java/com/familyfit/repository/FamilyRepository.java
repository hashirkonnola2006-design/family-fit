package com.familyfit.repository;

import com.familyfit.entity.Family;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FamilyRepository extends JpaRepository<Family, Long> {
    Optional<Family> findByEmail(String email);
    boolean existsByEmail(String email);
}
