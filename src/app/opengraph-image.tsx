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
          background: 'linear-gradient(to bottom right, #09090b, #18181b)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontWeight: 700,
              color: 'white',
              lineHeight: 1,
            }}
          >
            ADchaser
          </div>
          <div
            style={{
              fontSize: 30,
              color: '#34d399',
              fontWeight: 500,
            }}
          >
            The TikTok Ad Spy Tool
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
