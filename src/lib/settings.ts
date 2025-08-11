import { eq } from 'drizzle-orm'
import { db, userSettings } from './db'
import { encrypt, decrypt } from './encryption'

export interface UserSettingsData {
  geminiApiKey?: string
  githubPatToken?: string
  geminiKeyExpiresAt?: Date
  githubTokenExpiresAt?: Date
}

function isCredentialExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return false
  return new Date() > expiresAt
}

export async function getUserSettings(userEmail: string): Promise<UserSettingsData> {
  try {
    const result = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userEmail, userEmail))
      .limit(1)

    if (result.length === 0) {
      return { geminiApiKey: '', githubPatToken: '' }
    }

    const settings = result[0]
    const geminiExpired = isCredentialExpired(settings.geminiKeyExpiresAt)
    const githubExpired = isCredentialExpired(settings.githubTokenExpiresAt)
    
    return {
      geminiApiKey: settings.geminiApiKey && !geminiExpired ? decrypt(settings.geminiApiKey, userEmail) : '',
      githubPatToken: settings.githubPatToken && !githubExpired ? decrypt(settings.githubPatToken, userEmail) : '',
      geminiKeyExpiresAt: settings.geminiKeyExpiresAt || undefined,
      githubTokenExpiresAt: settings.githubTokenExpiresAt || undefined,
    }
  } catch (error) {
    console.error('Failed to fetch user settings')
    return { geminiApiKey: '', githubPatToken: '' }
  }
}

export async function createEmptyUserSettings(userEmail: string): Promise<boolean> {
  try {
    const existingSettings = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userEmail, userEmail))
      .limit(1)

    if (existingSettings.length === 0) {
      await db.insert(userSettings).values({
        id: crypto.randomUUID(),
        userEmail,
        geminiApiKey: null,
        githubPatToken: null,
        geminiKeyExpiresAt: null,
        githubTokenExpiresAt: null,
        updatedAt: new Date(),
      })
    }
    return true
  } catch (error) {
    console.error('Failed to create user settings')
    return false
  }
}

export async function saveUserSettings(
  userEmail: string,
  settings: UserSettingsData
): Promise<boolean> {
  try {
    const defaultExpiration = new Date()
    defaultExpiration.setMonth(defaultExpiration.getMonth() + 6)
    
    const encryptedSettings = {
      userEmail,
      geminiApiKey: settings.geminiApiKey ? encrypt(settings.geminiApiKey, userEmail) : null,
      githubPatToken: settings.githubPatToken ? encrypt(settings.githubPatToken, userEmail) : null,
      geminiKeyExpiresAt: settings.geminiApiKey ? (settings.geminiKeyExpiresAt || defaultExpiration) : null,
      githubTokenExpiresAt: settings.githubPatToken ? (settings.githubTokenExpiresAt || defaultExpiration) : null,
      updatedAt: new Date(),
    }

    const existingSettings = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userEmail, userEmail))
      .limit(1)

    if (existingSettings.length === 0) {
      await db.insert(userSettings).values({
        id: crypto.randomUUID(),
        ...encryptedSettings,
      })
    } else {
      await db
        .update(userSettings)
        .set(encryptedSettings)
        .where(eq(userSettings.userEmail, userEmail))
    }

    return true
  } catch (error) {
    console.error('Failed to save user settings')
    return false
  }
}