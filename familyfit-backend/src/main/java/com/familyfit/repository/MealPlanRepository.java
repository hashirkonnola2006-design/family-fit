package com.familyfit.repository;

import com.familyfit.entity.MealPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {
    @Query("SELECT DISTINCT mp FROM MealPlan mp JOIN mp.tags t WHERE t IN :tags")
    List<MealPlan> findByTagsContaining(List<String> tags);
}
