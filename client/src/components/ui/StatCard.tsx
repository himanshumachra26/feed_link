import type { ElementType, ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ElementType;
  color: string;
  subtitle?: ReactNode;
}

export default function StatCard({ label, value, icon: Icon, color, subtitle }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
          <Icon size={15} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}
