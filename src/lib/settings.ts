import { eq } from 'drizzle-orm'
import { db, userSettings, type UserSettings, type NewUserSettings } from './db'
import { encrypt, decrypt } from './encryption'

export interface UserSettingsData {
  geminiApiKey?: string
  githubPatToken?: string
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
    return {
      geminiApiKey: settings.geminiApiKey ? decrypt(settings.geminiApiKey) : '',
      githubPatToken: settings.githubPatToken ? decrypt(settings.githubPatToken) : '',
    }
  } catch (error) {
    console.error('Error fetching user settings:', error)
    return { geminiApiKey: '', githubPatToken: '' }
  }
}

export async function saveUserSettings(
  userEmail: string,
  settings: UserSettingsData
): Promise<boolean> {
  try {
    const encryptedSettings = {
      userEmail,
      geminiApiKey: settings.geminiApiKey ? encrypt(settings.geminiApiKey) : null,
      githubPatToken: settings.githubPatToken ? encrypt(settings.githubPatToken) : null,
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
    console.error('Error saving user settings:', error)
    return false
  }
}