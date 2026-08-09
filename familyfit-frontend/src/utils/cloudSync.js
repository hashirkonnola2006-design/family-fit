// Shared Cloud Sync module for cross-device FamilyFit synchronization
import axios from 'axios'

const CLOUD_SYNC_OBJECT_ID = 'ff8081819f7e10ae019fe7ef91871726'
const CLOUD_API_URL = `https://api.restful-api.dev/objects/${CLOUD_SYNC_OBJECT_ID}`

export async function fetchCloudMembers() {
  try {
    const res = await axios.get(CLOUD_API_URL, { timeout: 8000 })
    if (res.data?.data?.members && Array.isArray(res.data.data.members)) {
      return res.data.data.members
    }
  } catch (err) {
    console.warn('Cloud sync fetch warning:', err.message)
  }
  return null
}

export async function syncMembersToCloud(members) {
  if (!Array.isArray(members)) return false
  try {
    const payload = {
      name: 'FamilyFit Shared Family Storage',
      data: {
        members,
        updatedAt: new Date().toISOString(),
      },
    }
    await axios.put(CLOUD_API_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 8000,
    })
    return true
  } catch (err) {
    console.warn('Cloud sync save warning:', err.message)
    return false
  }
}
