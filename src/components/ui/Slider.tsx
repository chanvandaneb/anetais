"use client";

import { Info } from "lucide-react";

type SliderProps = {
  label: string;
  paramKey: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

export function Slider({ label, paramKey, value, min, max, step, onChange }: SliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-zinc-200">{label}</span>
          <Info className="h-3.5 w-3.5 text-zinc-500" />
        </div>
        <div className="w-16 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-center text-xs text-zinc-200">
          {value.toFixed(2)}
        </div>
      </div>
      <span className="inline-block rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
        {paramKey}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
