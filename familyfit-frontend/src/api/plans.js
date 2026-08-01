import client from './client'

export const getAllPlans    = ()  => client.get('/plans')
export const getPlanById   = (id) => client.get(`/plans/${id}`)
export const getRecommended = () => client.get('/plans/recommended')
