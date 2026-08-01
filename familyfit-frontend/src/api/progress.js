import client from './client'

export const getHealthScore     = (memberId) => client.get(`/progress/health-score/${memberId}`)
export const getFamilyComparison = (familyId) => client.get(`/progress/family-comparison/${familyId}`)
