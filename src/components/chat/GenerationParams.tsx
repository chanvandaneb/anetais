"use client";

import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/Slider";

export function GenerationParams({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(1.0);
  const [presencePenalty, setPresencePenalty] = useState(0.0);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.0);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-0 z-50 mb-2 w-80 space-y-5 rounded-xl border p-4 shadow-2xl"
      style={{ borderColor: "var(--border)", background: "var(--bg-base)" }}
    >
      <Slider
        label="Creativity Level"
        paramKey="temperature"
        value={temperature}
        min={0}
        max={2}
        step={0.01}
        onChange={setTemperature}
      />
      <Slider
        label="Openness to Ideas"
        paramKey="top_p"
        value={topP}
        min={0}
        max={1}
        step={0.01}
        onChange={setTopP}
      />
      <Slider
        label="Expression Divergence"
        paramKey="presence_penalty"
        value={presencePenalty}
        min={-2}
        max={2}
        step={0.01}
        onChange={setPresencePenalty}
      />
      <Slider
        label="Vocabulary Richness"
        paramKey="frequency_penalty"
        value={frequencyPenalty}
        min={-2}
        max={2}
        step={0.01}
        onChange={setFrequencyPenalty}
      />
    </div>
  );
}
