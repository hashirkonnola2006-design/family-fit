/**
 * familyCache.js
 *
 * Central definition of all localStorage keys that are scoped to a specific
 * family/account.  Any time a user logs out or a new user logs in, ALL of
 * these keys must be cleared so that stale data from a previous session never
 * leaks into a new one.
 *
 * Keys intentionally NOT listed here (kept across sessions):
 *   - familyfit_theme          → UI preference, not account data
 *   - familyfit_user_registry  → local multi-account credential store
 *   - familyfit_onboarding_done_<familyId> → already keyed by familyId ✅
 */

export const FAMILY_CACHE_KEYS = [
  'familyfit_members',        // family member list
  'familyfit_saved_recipes',  // favorited recipes
  'familyfit_planned_meals',  // grocery-plan meal list
  'familyfit_grocery_budget', // per-family budget setting
  'familyfit_grocery_period', // per-family budget period
]

/**
 * Removes all family-scoped localStorage entries.
 * Call on logout AND at the very start of login (before the API response
 * arrives) to prevent stale data from a previous account bleeding through.
 */
export function clearFamilyCache() {
  FAMILY_CACHE_KEYS.forEach((key) => localStorage.removeItem(key))
}
