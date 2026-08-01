import client from './client'

export const getNotificationPreferences = (familyId = 1) =>
  client.get('/family/notification-preferences', { params: { familyId } })

export const updateNotificationPreferences = (familyId = 1, prefs) =>
  client.patch(`/family/notification-preferences?familyId=${familyId}`, prefs)

export const getAiPreferences = (familyId = 1) =>
  client.get('/family/ai-preferences', { params: { familyId } })

export const updateAiPreferences = (familyId = 1, prefs) =>
  client.patch(`/family/ai-preferences?familyId=${familyId}`, prefs)

export const submitSupportRequest = (request) =>
  client.post('/support/contact', request)

export const logoutUser = () =>
  client.post('/auth/logout')
