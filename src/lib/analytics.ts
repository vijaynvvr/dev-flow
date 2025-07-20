// lib/analytics.ts
import { track } from '@vercel/analytics'

// Event types for better type safety
export type AnalyticsEvent =
  | 'pr_description_generated'
  | 'pr_created'
  | 'repository_selected'
  | 'branches_selected'
  | 'user_signed_in'
  | 'user_signed_out'
  | 'error_occurred'
  | 'page_viewed'

interface AnalyticsProperties {
  [key: string]: any
}

// Custom analytics wrapper
export function trackEvent(event: AnalyticsEvent, properties?: AnalyticsProperties) {
  if (typeof window !== 'undefined') {
    track(event, properties)
  }
}

// Specific tracking functions for your app
export const analytics = {
  // Track when a PR description is generated
  prDescriptionGenerated: (data: {
    repository?: string
    baseBranch?: string
    targetBranch?: string
    filesChanged?: number
    success: boolean
  }) => {
    trackEvent('pr_description_generated', {
      repository: data.repository,
      base_branch: data.baseBranch,
      target_branch: data.targetBranch,
      files_changed: data.filesChanged,
      success: data.success,
    })
  },

  // Track when a PR is successfully created
  prCreated: (data: { repository?: string; prUrl?: string }) => {
    trackEvent('pr_created', {
      repository: data.repository,
      has_url: !!data.prUrl,
    })
  },

  // Track repository selection
  repositorySelected: (data: { repository?: string; isPrivate?: boolean }) => {
    trackEvent('repository_selected', {
      repository: data.repository,
      is_private: data.isPrivate,
    })
  },

  // Track branch selection
  branchesSelected: (data: { repository?: string; baseBranch?: string; targetBranch?: string }) => {
    trackEvent('branches_selected', {
      repository: data.repository,
      base_branch: data.baseBranch,
      target_branch: data.targetBranch,
    })
  },

  // Track user authentication
  userSignedIn: (data: { provider: string; username?: string }) => {
    trackEvent('user_signed_in', {
      provider: data.provider,
      has_username: !!data.username,
    })
  },

  userSignedOut: () => {
    trackEvent('user_signed_out')
  },

  // Track errors
  errorOccurred: (data: { error_type: string; error_message?: string; page?: string }) => {
    trackEvent('error_occurred', {
      error_type: data.error_type,
      has_message: !!data.error_message,
      page: data.page,
    })
  },

  // Track page views
  pageViewed: (data: { page: string; user_authenticated: boolean }) => {
    trackEvent('page_viewed', {
      page: data.page,
      user_authenticated: data.user_authenticated,
    })
  },
}

// Performance tracking
export function trackPerformance(metricName: string, value: number) {
  if (typeof window !== 'undefined') {
    track('performance_metric', {
      metric_name: metricName,
      value: value,
    })
  }
}

// Error boundary tracking
export function trackError(error: Error) {
  analytics.errorOccurred({
    error_type: error.name,
    error_message: error.message,
    page: typeof window !== 'undefined' ? window.location.pathname : undefined,
  })
}
