"use client";

import { useEffect, useState } from "react";
import { InputData, FollowUpData } from "@/app/page";

type Props = {
  inputData: InputData;
  followUpData: FollowUpData;
  onReset: () => void;
};

type Verdict = "Buy It" | "Skip It" | "Wait" | "Shortlist It";

// PLACEHOLDER LOGIC — replace with real API call in Phase 2
const VERDICTS: Verdict[] = ["Buy It", "Skip It", "Wait", "Shortlist It"];

function getPlaceholderVerdict(): Verdict {
  return VERDICTS[Math.floor(Math.random() * VERDICTS.length)];
}

export default function VerdictScreen({ inputData, onReset }: Props) {
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  useEffect(() => {
    // PLACEHOLDER: randomly pick a verdict. Phase 2 will call a real API here.
    setVerdict(getPlaceholderVerdict());
  }, []);

  if (!verdict) return null;

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-[#1A1A1A]">Here&apos;s your verdict</h2>
        <p className="text-gray-500">
          For: <span className="font-semibold text-[#1A1A1A]">{inputData.productName}</span>
        </p>
      </div>

      {/* Verdict badge — PLACEHOLDER label, real logic in Phase 2 */}
      <div
        className="px-10 py-5 rounded-2xl text-white text-3xl font-bold shadow-lg"
        style={{ background: "var(--accent)" }}
      >
        {verdict}
      </div>

      {/* Reason text — PLACEHOLDER, real reasoning in Phase 2 */}
      <p className="text-gray-500 max-w-sm leading-relaxed">
        Placeholder reason — live research coming in Phase 2.
      </p>

      <button
        onClick={onReset}
        className="px-8 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 shadow-sm transition-all"
      >
        Start Over
      </button>
    </div>
  );
}
