import { createDefaultProfileData } from '../mocks/mockProfile.js'

export const PROFILE_STORAGE_KEY = 'consigai-profile-v1'

export function loadProfileData() {
  if (typeof window === 'undefined') return createDefaultProfileData()

  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!raw) return createDefaultProfileData()
    return { ...createDefaultProfileData(), ...JSON.parse(raw) }
  } catch {
    return createDefaultProfileData()
  }
}

export function saveProfileData(patch) {
  const next = { ...loadProfileData(), ...patch }
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next))
  return next
}
