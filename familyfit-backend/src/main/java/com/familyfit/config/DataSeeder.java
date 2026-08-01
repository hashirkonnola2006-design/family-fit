package com.familyfit.config;

import com.familyfit.entity.*;
import com.familyfit.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Seeds only recipes and meal plan catalogue data.
 * Family accounts, members, daily logs and health scores start empty —
 * users create their own data after signing up.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final MealPlanRepository mealPlanRepository;
    private final RecipeRepository recipeRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (recipeRepository.count() > 0) {
            log.info("Recipe catalogue already seeded, skipping DataSeeder.");
            return;
        }
        log.info("Seeding recipe & meal plan catalogue...");
        seedMealPlans();
        seedRecipes();
        log.info("Catalogue seeded. No demo family created — users register fresh.");
    }

    // ─── Meal Plans ──────────────────────────────────────────────────────

    private void seedMealPlans() {
        MealPlan vitality = MealPlan.builder()
                .name("Vitality & Growth Plan")
                .description("Perfectly balanced nutrients for active adults and growing kids.")
                .targetGroup("Family of 4")
                .tags(List.of("family", "balanced", "recommended"))
                .imageUrl("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80")
                .build();

        vitality.setMeals(List.of(
                Meal.builder().mealPlan(vitality).type(Meal.MealType.BREAKFAST)
                        .name("Oats with Fruits & Nuts").kcal(350).proteinG(12).carbsG(52).fatG(10).prepTimeMinutes(10)
                        .imageUrl("https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=600&q=80").build(),
                Meal.builder().mealPlan(vitality).type(Meal.MealType.LUNCH)
                        .name("Grilled Chicken with Quinoa").kcal(520).proteinG(42).carbsG(45).fatG(12).prepTimeMinutes(25)
                        .imageUrl("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80").build(),
                Meal.builder().mealPlan(vitality).type(Meal.MealType.DINNER)
                        .name("Baked Salmon with Veggies").kcal(480).proteinG(38).carbsG(28).fatG(20).prepTimeMinutes(30)
                        .imageUrl("https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80").build(),
                Meal.builder().mealPlan(vitality).type(Meal.MealType.SNACK)
                        .name("Greek Yoghurt & Berries").kcal(180).proteinG(14).carbsG(20).fatG(4).prepTimeMinutes(5)
                        .imageUrl("https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80").build()
        ));
        mealPlanRepository.save(vitality);

        MealPlan weightLoss = MealPlan.builder()
                .name("Lean & Clean Plan")
                .description("Lower-calorie, high-satiety meals for gradual healthy weight loss.")
                .targetGroup("Adults")
                .tags(List.of("weight-loss", "low-carb", "high-protein"))
                .imageUrl("https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80")
                .build();

        weightLoss.setMeals(List.of(
                Meal.builder().mealPlan(weightLoss).type(Meal.MealType.BREAKFAST)
                        .name("Avocado Egg Toast").kcal(290).proteinG(16).carbsG(24).fatG(14).prepTimeMinutes(10)
                        .imageUrl("https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80").build(),
                Meal.builder().mealPlan(weightLoss).type(Meal.MealType.LUNCH)
                        .name("Mediterranean Salad Bowl").kcal(380).proteinG(22).carbsG(30).fatG(16).prepTimeMinutes(15)
                        .imageUrl("https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80").build(),
                Meal.builder().mealPlan(weightLoss).type(Meal.MealType.DINNER)
                        .name("Turkey Stir-Fry with Broccoli").kcal(420).proteinG(35).carbsG(32).fatG(14).prepTimeMinutes(20)
                        .imageUrl("https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80").build()
        ));
        mealPlanRepository.save(weightLoss);

        MealPlan diabetesFriendly = MealPlan.builder()
                .name("Blood Sugar Balance Plan")
                .description("Low-GI meals that help stabilise blood glucose while being family-friendly.")
                .targetGroup("Adults with Diabetes")
                .tags(List.of("diabetes", "low-gi", "balanced"))
                .imageUrl("https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80")
                .build();

        diabetesFriendly.setMeals(List.of(
                Meal.builder().mealPlan(diabetesFriendly).type(Meal.MealType.BREAKFAST)
                        .name("Veggie Omelette").kcal(260).proteinG(20).carbsG(8).fatG(16).prepTimeMinutes(10)
                        .imageUrl("https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&q=80").build(),
                Meal.builder().mealPlan(diabetesFriendly).type(Meal.MealType.LUNCH)
                        .name("Lentil Soup with Wholegrain Bread").kcal(410).proteinG(22).carbsG(54).fatG(8).prepTimeMinutes(30)
                        .imageUrl("https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80").build()
        ));
        mealPlanRepository.save(diabetesFriendly);

        MealPlan kidsFriendly = MealPlan.builder()
                .name("Happy Kids Plan")
                .description("Fun, nutritious meals designed for children aged 4–12.")
                .targetGroup("Children 4-12")
                .tags(List.of("kids", "fun", "colourful"))
                .imageUrl("https://images.unsplash.com/photo-1564802270019-c50fa2d5c945?w=800&q=80")
                .build();

        kidsFriendly.setMeals(List.of(
                Meal.builder().mealPlan(kidsFriendly).type(Meal.MealType.BREAKFAST)
                        .name("Banana Pancakes").kcal(280).proteinG(8).carbsG(42).fatG(8).prepTimeMinutes(15)
                        .imageUrl("https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80").build(),
                Meal.builder().mealPlan(kidsFriendly).type(Meal.MealType.SNACK)
                        .name("Apple Slices with Peanut Butter").kcal(200).proteinG(6).carbsG(26).fatG(8).prepTimeMinutes(5)
                        .imageUrl("https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80").build()
        ));
        mealPlanRepository.save(kidsFriendly);

        log.info("Seeded 4 meal plans.");
    }

    // ─── Recipes ─────────────────────────────────────────────────────────

    private void seedRecipes() {
        recipeRepository.saveAll(List.of(
                Recipe.builder()
                        .name("Grilled Chicken Quinoa Bowl")
                        .description("A protein-packed bowl with grilled chicken, fluffy quinoa, roasted vegetables, and a lemon-tahini drizzle.")
                        .kcal(520).proteinG(42).carbsG(45).fatG(12).prepTimeMinutes(25)
                        .imageUrl("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80")
                        .tags(List.of("High-Protein", "Gluten-Free", "Lunch"))
                        .containsAllergens(List.of())
                        .healthTags(List.of("high-protein", "low-gi", "heart-healthy", "weight-loss"))
                        .whyItsGood("Rich in lean protein and low-GI quinoa, providing sustained energy while supporting blood sugar and muscle recovery.")
                        .ingredients(List.of(
                                Ingredient.builder().name("Chicken Breast").quantity("200").unit("g").build(),
                                Ingredient.builder().name("Quinoa").quantity("80").unit("g").build(),
                                Ingredient.builder().name("Cherry Tomatoes").quantity("100").unit("g").build(),
                                Ingredient.builder().name("Tahini").quantity("2").unit("tbsp").build(),
                                Ingredient.builder().name("Lemon Juice").quantity("1").unit("tbsp").build()
                        ))
                        .steps(List.of(
                                "Season chicken with salt, pepper, and garlic powder.",
                                "Grill 6–7 min per side. Rest 5 min then slice.",
                                "Cook quinoa in 1.5x water for 15 min. Fluff with a fork.",
                                "Whisk tahini with lemon juice, 2 tbsp water, and salt.",
                                "Assemble bowl: quinoa base, chicken, vegetables, tahini drizzle."
                        ))
                        .favorited(false).build(),

                Recipe.builder()
                        .name("Herb-Baked Salmon with Roasted Vegetables")
                        .description("Omega-3-rich salmon fillet baked with a herb crust alongside colourful roasted vegetables.")
                        .kcal(480).proteinG(38).carbsG(28).fatG(20).prepTimeMinutes(30)
                        .imageUrl("https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80")
                        .tags(List.of("Omega-3", "Dinner", "Gluten-Free"))
                        .containsAllergens(List.of("Seafood/Fish"))
                        .healthTags(List.of("heart-healthy", "omega-3", "low-gi", "diabetic-friendly"))
                        .whyItsGood("Essential omega-3 fatty acids and fiber-rich greens help stabilize blood sugar and heart cholesterol.")
                        .ingredients(List.of(
                                Ingredient.builder().name("Salmon Fillet").quantity("200").unit("g").build(),
                                Ingredient.builder().name("Broccoli").quantity("150").unit("g").build(),
                                Ingredient.builder().name("Olive Oil").quantity("2").unit("tbsp").build(),
                                Ingredient.builder().name("Fresh Dill").quantity("1").unit("tbsp").build(),
                                Ingredient.builder().name("Garlic").quantity("2").unit("cloves").build()
                        ))
                        .steps(List.of(
                                "Preheat oven to 200°C.",
                                "Toss broccoli in olive oil, season, place on baking tray.",
                                "Spread dill-garlic mixture over salmon. Roast both 18–20 min.",
                                "Serve salmon over the roasted vegetables."
                        ))
                        .favorited(false).build(),

                Recipe.builder()
                        .name("Smashed Avocado Egg Toast")
                        .description("Creamy smashed avocado on sourdough with a perfectly poached egg and red pepper flakes.")
                        .kcal(290).proteinG(16).carbsG(24).fatG(14).prepTimeMinutes(10)
                        .imageUrl("https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80")
                        .tags(List.of("Breakfast", "Quick", "Vegetarian"))
                        .containsAllergens(List.of("Eggs", "Wheat/Gluten"))
                        .healthTags(List.of("vegetarian", "high-protein", "quick-snack"))
                        .whyItsGood("Heart-healthy monounsaturated fats from avocado with complete egg protein for a nutritious breakfast.")
                        .ingredients(List.of(
                                Ingredient.builder().name("Sourdough Bread").quantity("2").unit("slices").build(),
                                Ingredient.builder().name("Avocado").quantity("1").unit("medium").build(),
                                Ingredient.builder().name("Eggs").quantity("2").unit("large").build(),
                                Ingredient.builder().name("Lemon Juice").quantity("1").unit("tsp").build()
                        ))
                        .steps(List.of(
                                "Toast the sourdough until golden.",
                                "Mash avocado with lemon juice, salt, and pepper.",
                                "Poach eggs in gently simmering water for 3 min.",
                                "Spread avocado on toast, top with egg and red pepper flakes."
                        ))
                        .favorited(false).build(),

                Recipe.builder()
                        .name("Overnight Oats with Berries")
                        .description("Creamy no-cook oats soaked overnight with chia seeds and topped with fresh mixed berries.")
                        .kcal(350).proteinG(14).carbsG(52).fatG(10).prepTimeMinutes(5)
                        .imageUrl("https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&q=80")
                        .tags(List.of("Breakfast", "Make-Ahead", "High-Fibre"))
                        .containsAllergens(List.of())
                        .healthTags(List.of("kid-friendly", "high-fiber", "low-sodium", "child-growth"))
                        .whyItsGood("Slow-release carbohydrates and antioxidant-rich berries fuel active family growth.")
                        .ingredients(List.of(
                                Ingredient.builder().name("Rolled Oats").quantity("80").unit("g").build(),
                                Ingredient.builder().name("Chia Seeds").quantity("1").unit("tbsp").build(),
                                Ingredient.builder().name("Almond Milk").quantity("200").unit("ml").build(),
                                Ingredient.builder().name("Mixed Berries").quantity("100").unit("g").build()
                        ))
                        .steps(List.of(
                                "Combine oats, chia seeds, almond milk in a jar. Stir and refrigerate overnight.",
                                "Top with fresh mixed berries in the morning."
                        ))
                        .favorited(false).build(),

                Recipe.builder()
                        .name("Red Lentil & Vegetable Soup")
                        .description("A warming, filling soup packed with plant protein, fibre, and warming spices.")
                        .kcal(320).proteinG(18).carbsG(48).fatG(6).prepTimeMinutes(35)
                        .imageUrl("https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80")
                        .tags(List.of("Vegan", "High-Fibre", "Dinner"))
                        .containsAllergens(List.of())
                        .healthTags(List.of("vegan", "high-fiber", "diabetic-friendly", "heart-healthy"))
                        .whyItsGood("Soluble fiber from red lentils helps manage blood sugar and cholesterol levels.")
                        .ingredients(List.of(
                                Ingredient.builder().name("Red Lentils").quantity("200").unit("g").build(),
                                Ingredient.builder().name("Carrots").quantity("2").unit("medium").build(),
                                Ingredient.builder().name("Cumin").quantity("1").unit("tsp").build(),
                                Ingredient.builder().name("Vegetable Stock").quantity("1").unit("litre").build()
                        ))
                        .steps(List.of(
                                "Dice onion and carrots. Sauté 5 min.",
                                "Add spices, then lentils and stock. Simmer 25 min.",
                                "Blend half the soup for a creamy texture. Season and serve."
                        ))
                        .favorited(false).build(),

                Recipe.builder()
                        .name("Turkey & Broccoli Stir-Fry")
                        .description("Quick, high-protein stir-fry with lean turkey mince and a savoury ginger-soy sauce.")
                        .kcal(420).proteinG(35).carbsG(32).fatG(14).prepTimeMinutes(20)
                        .imageUrl("https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80")
                        .tags(List.of("High-Protein", "Quick", "Dinner"))
                        .containsAllergens(List.of("Soy"))
                        .healthTags(List.of("high-protein", "weight-loss", "low-gi"))
                        .whyItsGood("Lean turkey delivers high-quality protein with low saturated fat alongside fiber-rich broccoli.")
                        .ingredients(List.of(
                                Ingredient.builder().name("Turkey Mince").quantity("300").unit("g").build(),
                                Ingredient.builder().name("Broccoli").quantity("200").unit("g").build(),
                                Ingredient.builder().name("Soy Sauce").quantity("3").unit("tbsp").build(),
                                Ingredient.builder().name("Brown Rice").quantity("80").unit("g").build()
                        ))
                        .steps(List.of(
                                "Cook brown rice per package directions.",
                                "Stir-fry turkey in hot wok 5 min. Add broccoli 3–4 min.",
                                "Add soy sauce and ginger. Serve over rice."
                        ))
                        .favorited(false).build(),

                Recipe.builder()
                        .name("2-Ingredient Banana Pancakes")
                        .description("Naturally sweet kid-favourite pancakes made with just banana and eggs.")
                        .kcal(220).proteinG(10).carbsG(28).fatG(8).prepTimeMinutes(10)
                        .imageUrl("https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80")
                        .tags(List.of("Kids", "Breakfast", "Gluten-Free", "Quick"))
                        .containsAllergens(List.of("Eggs"))
                        .healthTags(List.of("kid-friendly", "gluten-free", "child-growth"))
                        .whyItsGood("Naturally sweetened with banana, providing potassium and energy without refined sugar.")
                        .ingredients(List.of(
                                Ingredient.builder().name("Ripe Banana").quantity("1").unit("large").build(),
                                Ingredient.builder().name("Eggs").quantity("2").unit("large").build()
                        ))
                        .steps(List.of(
                                "Mash banana, beat in eggs.",
                                "Cook tablespoons of batter in a non-stick pan, 2 min per side.",
                                "Top with fresh fruit or maple syrup."
                        ))
                        .favorited(false).build(),

                Recipe.builder()
                        .name("Greek Yoghurt Parfait")
                        .description("Layers of creamy Greek yoghurt, crunchy granola, and vibrant mixed berries.")
                        .kcal(180).proteinG(14).carbsG(22).fatG(4).prepTimeMinutes(5)
                        .imageUrl("https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80")
                        .tags(List.of("Snack", "High-Protein", "Quick", "Vegetarian"))
                        .containsAllergens(List.of("Milk/Dairy"))
                        .healthTags(List.of("high-protein", "probiotic", "kid-friendly"))
                        .whyItsGood("Probiotic yoghurt cultures support gut health alongside calcium for strong bones.")
                        .ingredients(List.of(
                                Ingredient.builder().name("Greek Yoghurt").quantity("150").unit("g").build(),
                                Ingredient.builder().name("Granola").quantity("30").unit("g").build(),
                                Ingredient.builder().name("Mixed Berries").quantity("80").unit("g").build(),
                                Ingredient.builder().name("Honey").quantity("1").unit("tsp").build()
                        ))
                        .steps(List.of(
                                "Layer yoghurt, granola, and berries in a glass.",
                                "Drizzle with honey and serve immediately."
                        ))
                        .favorited(false).build()
        ));

        log.info("Seeded 8 recipes.");
    }
}
