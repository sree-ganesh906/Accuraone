import React from 'react';
import './GlitchText.css';

interface GlitchTextProps {
  children: string;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const GlitchText = ({
  children,
  speed = 1,
  enableShadows = true,
  enableOnHover = false,
  className = '',
  style
}: GlitchTextProps) => {
  const inlineStyles: React.CSSProperties = {
    '--after-duration': `${speed * 3}s`,
    '--before-duration': `${speed * 2}s`,
    '--after-shadow': enableShadows ? '-3px 0 red' : 'none',
    '--before-shadow': enableShadows ? '3px 0 cyan' : 'none',
    ...style
  } as React.CSSProperties;

  const hoverClass = enableOnHover ? 'enable-on-hover' : '';

  return (
    <div
      className={`glitch ${hoverClass} ${className}`}
      style={inlineStyles}
      data-text={children}
    >
      {children}
    </div>
  );
};

export default GlitchText;
