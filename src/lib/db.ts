import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

const sql = neon(process.env.DATABASE_URL)
export const db = drizzle(sql)

export const userSettings = pgTable('user_settings', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userEmail: varchar('user_email', { length: 255 }).notNull().unique(),
  geminiApiKey: text('gemini_api_key'),
  githubPatToken: text('github_pat_token'),
  geminiKeyExpiresAt: timestamp('gemini_key_expires_at'),
  githubTokenExpiresAt: timestamp('github_token_expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type UserSettings = typeof userSettings.$inferSelect
export type NewUserSettings = typeof userSettings.$inferInsert