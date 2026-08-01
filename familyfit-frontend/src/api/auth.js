import client from './client'

export const register = (data) => client.post('/auth/register', data)
export const login    = (data) => client.post('/auth/login', data)
export const refresh  = (data) => client.post('/auth/refresh', data)
