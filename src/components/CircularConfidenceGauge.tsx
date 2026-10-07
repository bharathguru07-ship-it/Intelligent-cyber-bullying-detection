import React from 'react';

interface Props {
  confidence: number; // 0.0 to 1.0 or 0 to 100
  prediction?: 'safe' | 'bullying' | 'severe_bullying';
  size?: number;
  strokeWidth?: number;
}

export const CircularConfidenceGauge: React.FC<Props> = ({
  confidence,
  prediction = 'safe',
  size = 64,
  strokeWidth = 6,
}) => {
  // Normalize percentage
  const percentage = confidence > 1 ? Math.round(confidence) : Math.round(confidence * 100);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let strokeColor = '#10b981'; // emerald
  let bgColor = 'text-emerald-500/20';

  if (prediction === 'bullying') {
    strokeColor = '#f59e0b'; // amber
    bgColor = 'text-amber-500/20';
  } else if (prediction === 'severe_bullying') {
    strokeColor = '#f43f5e'; // rose
    bgColor = 'text-rose-500/20';
  }

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={`${bgColor} stroke-current`}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xs font-bold leading-none tracking-tight text-[#0F172A] dark:text-slate-100">
          {percentage}%
        </span>
      </div>
    </div>
  );
};
