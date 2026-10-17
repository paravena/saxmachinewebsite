import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Sax Machine — Saxophone Duo · Live Music for Cruise Lines and Events';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), 'public/favicon-512.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        background: '#0a0a0a',
        padding: '0 80px',
        gap: 64,
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img src={logoSrc} width={460} height={460} />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div
          style={{ fontSize: 30, letterSpacing: 6, color: '#c9a44c', textTransform: 'uppercase' }}
        >
          Saxophone Duo
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 52,
            lineHeight: 1.15,
            fontWeight: 700,
            color: '#ffffff',
          }}
        >
          Live music for cruise lines, private events & celebrations
        </div>
        <div style={{ marginTop: 28, fontSize: 28, color: 'rgba(245, 241, 232, 0.72)' }}>
          Jazz · Lounge · Pop · Latin
        </div>
        <div style={{ marginTop: 44, fontSize: 26, color: '#e3c878' }}>
          saxmachineentertainment.com
        </div>
      </div>
    </div>,
    size
  );
}
