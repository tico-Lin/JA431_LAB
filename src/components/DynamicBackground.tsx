import React from 'react';
import { useThemeMode } from '../hooks/useTheme';

export const DynamicBackground: React.FC = () => {
  const { resolvedTheme, isDynamic, isDark } = useThemeMode();

  const getBaseFill = () => {
    switch (resolvedTheme) {
      case 'dynamic-dark':
        return 'url(#base-grad-dark)';
      case 'dynamic-light':
        return 'url(#base-grad-light)';
      case 'pure-dark':
        return '#0a0a0a';
      case 'pure-light':
        return '#fafafa';
      default:
        return '#0a0a0a';
    }
  };

  return (
    <div
      className='fixed inset-0 pointer-events-none z-[-1] overflow-hidden'
      style={{ background: getBaseFill() }}
    >
      <svg
        className='w-full h-full'
        preserveAspectRatio='xMidYMid slice'
        xmlns='http://www.w3.org/2000/svg'
      >
        <defs>
          <linearGradient
            id='base-grad-dark'
            x1='0%'
            y1='0%'
            x2='100%'
            y2='100%'
          >
            <stop offset='0%' stopColor='#080c14' />
            <stop offset='100%' stopColor='#0f172a' />
          </linearGradient>
          <linearGradient
            id='base-grad-light'
            x1='0%'
            y1='0%'
            x2='100%'
            y2='100%'
          >
            <stop offset='0%' stopColor='#f8fafc' />
            <stop offset='100%' stopColor='#edf2f7' />
          </linearGradient>

          <filter id='glow-blur' x='-50%' y='-50%' width='200%' height='200%'>
            <feGaussianBlur in='SourceGraphic' stdDeviation='80' />
          </filter>

          <style>
            {`
              @keyframes float1 {
                0% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(10vw, -15vh) scale(1.2); }
                66% { transform: translate(-10vw, 10vh) scale(0.9); }
                100% { transform: translate(0, 0) scale(1); }
              }
              @keyframes float2 {
                0% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(-15vw, 15vh) scale(1.1); }
                66% { transform: translate(15vw, -5vh) scale(0.95); }
                100% { transform: translate(0, 0) scale(1); }
              }
              @keyframes float3 {
                0% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(10vw, 10vh) scale(1.15); }
                66% { transform: translate(-5vw, -15vh) scale(0.85); }
                100% { transform: translate(0, 0) scale(1); }
              }
              .node-1 { animation: float1 25s infinite ease-in-out; }
              .node-2 { animation: float2 30s infinite ease-in-out; }
              .node-3 { animation: float3 35s infinite ease-in-out; }
            `}
          </style>
        </defs>

        <rect width='100%' height='100%' fill={getBaseFill()} />

        {isDynamic && isDark && (
          <g filter='url(#glow-blur)' opacity='0.2'>
            <circle
              cx='20%'
              cy='30%'
              r='300'
              fill='#3b82f6'
              className='node-1'
            />
            <circle
              cx='80%'
              cy='70%'
              r='350'
              fill='#10b981'
              className='node-2'
            />
            <circle
              cx='60%'
              cy='20%'
              r='250'
              fill='#6366f1'
              className='node-3'
            />
          </g>
        )}

        {isDynamic && !isDark && (
          <g filter='url(#glow-blur)' opacity='0.06'>
            <circle
              cx='30%'
              cy='20%'
              r='400'
              fill='#3b82f6'
              className='node-1'
            />
            <circle
              cx='70%'
              cy='80%'
              r='450'
              fill='#10b981'
              className='node-2'
            />
            <circle
              cx='40%'
              cy='70%'
              r='300'
              fill='#6366f1'
              className='node-3'
            />
          </g>
        )}
      </svg>
    </div>
  );
};
