import client from './client'

export const getAllRecipes         = (params)     => client.get('/recipes', { params })
export const getRecipeById        = (id)         => client.get(`/recipes/${id}`)
export const getRecommendedRecipes = (familyId=1) => client.get('/recipes/recommended', { params: { familyId } })
export const getRecipeDetail       = (id, familyId=1) => client.get(`/recipes/${id}/detail`, { params: { familyId } })
export const toggleFavorite        = (id)         => client.post(`/recipes/${id}/favorite`)
export const getFavorites         = ()           => client.get('/recipes/favorites')
