import React from 'react';

export type LogoColor = 'white' | 'black' | 'gold' | 'current' | (string & {});

interface LogoProps {
  /**
   * Any CSS color. Named shortcuts: 'white', 'black', 'gold',
   * or 'current' to inherit the parent's `color`.
   */
  color?: LogoColor;
  className?: string;
  width?: number | string;
  height?: number | string;
  title?: string;
  style?: React.CSSProperties;
}

const COLOR_MAP: Record<string, string> = {
  white: 'var(--white, #ffffff)',
  black: '#000000',
  gold: 'var(--gold, #c9a44c)',
  current: 'currentColor',
};

export const Logo: React.FC<LogoProps> = ({
  color = 'white',
  className,
  width,
  height,
  title = 'Sax Machine',
  style,
}) => (
  <span
    role="img"
    aria-label={title}
    title={title}
    className={['logo-mark', className].filter(Boolean).join(' ')}
    style={{
      backgroundColor: COLOR_MAP[color] ?? color,
      ...(width !== undefined ? { width } : {}),
      ...(height !== undefined ? { height } : {}),
      ...style,
    }}
  />
);
