import React from 'react';

type Color = 'green' | 'yellow' | 'blue' | 'red' | 'gray' | 'purple';

const colors: Record<Color, string> = {
  green:  'bg-emerald-100 text-emerald-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  blue:   'bg-blue-100 text-blue-700',
  red:    'bg-red-100 text-red-700',
  gray:   'bg-gray-100 text-gray-600',
  purple: 'bg-purple-100 text-purple-700',
};

interface Props {
  children: React.ReactNode;
  color?: Color;
  className?: string;
}

export default function Badge({ children, color = 'gray', className = '' }: Props) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
}

// Helper to map status → color
export function statusColor(status: string): Color {
  const map: Record<string, Color> = {
    AVAILABLE: 'green',
    RESERVED: 'yellow',
    COLLECTED: 'blue',
    EXPIRED: 'gray',
    PENDING: 'yellow',
    ACCEPTED: 'green',
    REJECTED: 'red',
  };
  return map[status] ?? 'gray';
}
