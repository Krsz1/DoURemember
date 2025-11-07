interface Props {
  label: string;
  value: string | number;
  hint?: string;
}

export default function StatsCard({ label, value, hint }: Props) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-bold text-slate-800">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}
