package com.familyfit.service.impl;

import com.familyfit.dto.RecipeDTO;
import com.familyfit.entity.Recipe;
import com.familyfit.exception.ResourceNotFoundException;
import com.familyfit.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RecipeServiceImpl {

    private final RecipeRepository recipeRepository;
    private final EntityMapper mapper;

    @Transactional(readOnly = true)
    public List<RecipeDTO> getAllRecipes(String search, String tag) {
        List<Recipe> recipes;
        if (search != null && !search.isBlank()) {
            recipes = recipeRepository.searchByName(search);
        } else if (tag != null && !tag.isBlank()) {
            recipes = recipeRepository.findByTag(tag);
        } else {
            recipes = recipeRepository.findAll();
        }
        return recipes.stream().map(mapper::toRecipeDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RecipeDTO getRecipeById(Long id) {
        return mapper.toRecipeDTO(recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe", id)));
    }

    public RecipeDTO toggleFavorite(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe", id));
        recipe.toggleFavorite();  // polymorphic call via Favoritable
        return mapper.toRecipeDTO(recipeRepository.save(recipe));
    }

    @Transactional(readOnly = true)
    public List<RecipeDTO> getFavorites() {
        return recipeRepository.findFavorites().stream()
                .map(mapper::toRecipeDTO).collect(Collectors.toList());
    }
}
