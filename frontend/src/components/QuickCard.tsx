import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  color?: string; // tailwind bg color e.g. "bg-blue-50"
  icon?: ReactNode;
  onClick?: () => void;
}

export default function QuickCard({ title, subtitle, color = "bg-white", icon, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow ${color} w-full text-left`}
      aria-label={title}
    >
      <div className="w-12 h-12 rounded-lg bg-white/60 flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-slate-800">{title}</div>
        {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
      </div>
    </button>
  );
}
