import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// In a real application, you would use a database to store these settings
// For simplicity, we're using a simple in-memory store here
export const userSettings = new Map<string, { geminiApiKey?: string; githubPatToken?: string }>()
