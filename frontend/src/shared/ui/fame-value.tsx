interface FameValueProps {
  value: number;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
}

export function FameValue({ value, className = "", textClassName = "", iconClassName = "" }: FameValueProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <img src="/fame.png" alt="명성" className={`h-4 w-4 object-contain ${iconClassName}`} />
      <span className={`font-semibold text-[#9a641f] ${textClassName}`}>{value.toLocaleString()}</span>
    </div>
  );
}
