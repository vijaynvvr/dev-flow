// app/api/og/route.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui',
            position: 'relative',
          }}
        >
          {/* Header with Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 60,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 24,
              }}
            >
              <span
                style={{
                  color: 'white',
                  fontSize: 36,
                  fontWeight: 'bold',
                }}
              >
                DF
              </span>
            </div>
            <span
              style={{
                color: 'white',
                fontSize: 42,
                fontWeight: 'bold',
              }}
            >
              DevFlow
            </span>
          </div>

          {/* Main Headline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              marginBottom: 40,
            }}
          >
            <h1
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: 'white',
                margin: 0,
                lineHeight: 1.1,
                marginBottom: 16,
              }}
            >
              Generate Perfect
            </h1>
            <h1
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #10b981 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              PR Descriptions
            </h1>
            <p
              style={{
                fontSize: 28,
                color: '#94a3b8',
                margin: 0,
                marginTop: 20,
                fontWeight: 400,
              }}
            >
              AI-powered automation for better code reviews
            </p>
          </div>

          {/* Feature Pills */}
          <div
            style={{
              display: 'flex',
              gap: 32,
              marginBottom: 60,
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(59, 130, 246, 0.1)',
                padding: '12px 24px',
                borderRadius: 50,
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <span style={{ fontSize: 24, marginRight: 12 }}>🚀</span>
              <span style={{ fontSize: 20, color: '#e2e8f0', fontWeight: 500 }}>Save Hours</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '12px 24px',
                borderRadius: 50,
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
            >
              <span style={{ fontSize: 24, marginRight: 12 }}>💡</span>
              <span style={{ fontSize: 20, color: '#e2e8f0', fontWeight: 500 }}>
                Smart Analysis
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(245, 158, 11, 0.1)',
                padding: '12px 24px',
                borderRadius: 50,
                border: '1px solid rgba(245, 158, 11, 0.2)',
              }}
            >
              <span style={{ fontSize: 24, marginRight: 12 }}>⚡</span>
              <span style={{ fontSize: 20, color: '#e2e8f0', fontWeight: 500 }}>One-Click PRs</span>
            </div>
          </div>

          {/* Code Preview */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(51, 65, 85, 0.8)',
              borderRadius: 12,
              padding: 24,
              fontSize: 16,
              color: '#94a3b8',
              maxWidth: 600,
              marginBottom: 40,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: '#ef4444' }} />
              <div style={{ width: 12, height: 12, borderRadius: 6, background: '#f59e0b' }} />
              <div style={{ width: 12, height: 12, borderRadius: 6, background: '#10b981' }} />
            </div>
            <div style={{ color: '#22c55e', marginBottom: 8 }}>🚀 Features</div>
            <div style={{ marginBottom: 8 }}>- Added user authentication system</div>
            <div style={{ color: '#3b82f6', marginBottom: 8 }}>🛠 Fixes</div>
            <div>- Fixed pagination bug in user list</div>
          </div>

          {/* Bottom Section */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              left: 60,
              right: 60,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                color: '#64748b',
                fontSize: 24,
                fontWeight: 500,
              }}
            >
              devflow-pr.vercel.app
            </div>
            <div
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: 'white',
                padding: '12px 32px',
                borderRadius: 50,
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              GitHub Ready
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(`${e.message}`)
    } else {
      console.log('Unknown error occurred')
    }

    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
