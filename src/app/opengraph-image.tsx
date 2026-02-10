import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ADchaser | The TikTok Ad Spy Tool';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #18181b 0%, #09090b 50%, #000000 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        {/* Subtle glow */}
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Card mockup accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            right: 80,
            width: 160,
            height: 100,
            border: '2px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            background: 'rgba(0,0,0,0.3)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 200,
            left: 100,
            width: 120,
            height: 80,
            border: '2px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            background: 'rgba(0,0,0,0.2)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#34d399',
              lineHeight: 1,
            }}
          >
            ADchaser
          </div>
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            Unlock the Vault of Winning Ads.
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
