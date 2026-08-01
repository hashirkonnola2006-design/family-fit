import client from './client'

export const getTodayLog = (memberId) => client.get(`/nutrition/today/${memberId}`)
export const logMeal     = (memberId, mealId) => client.post('/nutrition/log', { memberId, mealId })
export const updateWater = (memberId, waterIntakeL) => client.patch(`/nutrition/water/${memberId}`, { waterIntakeL })
