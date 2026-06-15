"use client";

import { InputData } from "@/app/page";
import type { VerdictResponse } from "@/app/api/verdict/route";

type Props = {
  inputData: InputData;
  verdictResult: VerdictResponse | null;
  onReset: () => void;
};

export default function VerdictScreen({ inputData, verdictResult, onReset }: Props) {
  // Fallback if result somehow missing (shouldn't happen in normal flow)
  if (!verdictResult) {
    return (
      <div className="flex flex-col items-center gap-6 text-center py-20">
        <p className="text-gray-400">No verdict available.</p>
        <button
          onClick={onReset}
          className="px-8 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 shadow-sm transition-all"
        >
          Start Over
        </button>
      </div>
    );
  }

  const { verdict, reason, details } = verdictResult;

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-[#1A1A1A]">Here&apos;s your verdict</h2>
        <p className="text-gray-500">
          For: <span className="font-semibold text-[#1A1A1A]">{inputData.productName}</span>
        </p>
      </div>

      {/* Verdict badge */}
      <div
        className="px-10 py-5 rounded-2xl text-white text-3xl font-bold shadow-lg"
        style={{ background: "var(--accent)" }}
      >
        {verdict}
      </div>

      {/* Reason — real research-backed text from the API */}
      <p className="text-gray-600 max-w-sm leading-relaxed">{reason}</p>

      {/* Research detail cards */}
      <div className="w-full grid grid-cols-2 gap-3 text-left">
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm px-4 py-3">
          <p className="text-xs text-gray-400 mb-1">Best price found</p>
          <p className="font-semibold text-[#1A1A1A]">
            ${details.best_current_price}{" "}
            <span className="font-normal text-gray-500 text-sm">at {details.best_price_source}</span>
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm px-4 py-3">
          <p className="text-xs text-gray-400 mb-1">Typical price range</p>
          <p className="font-semibold text-[#1A1A1A]">
            {typeof details.typical_price === "number"
              ? `$${details.typical_price}`
              : details.typical_price}
          </p>
        </div>
        {details.common_issues.length > 0 && (
          <div className="col-span-2 rounded-xl border border-gray-100 bg-white shadow-sm px-4 py-3">
            <p className="text-xs text-gray-400 mb-2">Known issues</p>
            <ul className="flex flex-col gap-1">
              {details.common_issues.map((issue, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}
        {details.sale_or_new_model_imminent && details.imminent_details && (
          <div className="col-span-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
            <p className="text-xs text-amber-500 mb-1 font-medium">Heads up</p>
            <p className="text-sm text-amber-800">{details.imminent_details}</p>
          </div>
        )}
      </div>

      <button
        onClick={onReset}
        className="px-8 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 shadow-sm transition-all"
      >
        Start Over
      </button>
    </div>
  );
}
