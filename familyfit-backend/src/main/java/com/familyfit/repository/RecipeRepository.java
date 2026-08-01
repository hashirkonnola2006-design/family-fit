package com.familyfit.repository;

import com.familyfit.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    @Query("SELECT r FROM Recipe r WHERE r.favorited = true")
    List<Recipe> findFavorites();

    @Query("SELECT DISTINCT r FROM Recipe r JOIN r.tags t WHERE LOWER(t) LIKE LOWER(CONCAT('%', :tag, '%'))")
    List<Recipe> findByTag(String tag);

    @Query("SELECT r FROM Recipe r WHERE LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Recipe> searchByName(String query);
}
