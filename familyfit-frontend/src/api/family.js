import client from './client'

export const getFamily     = (id)       => client.get(`/family/${id}`)
export const updateFamily  = (id, data) => client.patch(`/family/${id}`, data)
export const getMembers    = (familyId) => client.get(`/family/${familyId}/members`)
export const addMember     = (familyId, data) => client.post(`/family/${familyId}/members`, data)
export const updateMember  = (memberId, data) => client.patch(`/family/members/${memberId}`, data)
export const deleteMember  = (memberId) => client.delete(`/family/members/${memberId}`)
