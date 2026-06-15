"use client";

import { useState } from "react";
import { FollowUpData, InputData } from "@/app/page";
import type { VerdictResponse } from "@/app/api/verdict/route";

type Props = {
  data: FollowUpData;
  inputData: InputData;
  onChange: (data: FollowUpData) => void;
  onVerdictReady: (result: VerdictResponse) => void;
};

const urgencyOptions = ["Now", "Within a month", "No rush"] as const;

export default function FollowUpForm({ data, inputData, onChange, onVerdictReady }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGetVerdict() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: inputData.productName,
          price: inputData.price,
          whereToBuy: inputData.whereToBuy,
          urgency: data.urgency,
          mainUse: data.mainUse,
          lowestPrice: data.lowestPrice,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }

      const result: VerdictResponse = await res.json();
      onVerdictReady(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't complete research — try again.");
    } finally {
      setLoading(false);
    }
  }

  // Loading state — shown in place of the button area
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
        {/* Subtle pulse ring */}
        <div className="relative w-14 h-14">
          <div
            className="absolute inset-0 rounded-full opacity-30 animate-ping"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <div
            className="relative w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <svg
              className="w-6 h-6 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold text-[#1A1A1A]">
            Researching {inputData.productName}…
          </p>
          <p className="text-sm text-gray-400">Finding the best prices and reviews</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-[#1A1A1A]">A few more things</h2>
        <p className="text-gray-500">Help us give you a better verdict.</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Urgency */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-[#1A1A1A]">How soon do you need it?</label>
          <div className="flex gap-2">
            {urgencyOptions.map((option) => {
              const isSelected = data.urgency === option;
              return (
                <button
                  key={option}
                  onClick={() => onChange({ ...data, urgency: option })}
                  className="flex-1 py-2.5 px-3 rounded-xl text-sm font-medium border transition-all"
                  style={{
                    backgroundColor: isSelected ? "var(--accent)" : "white",
                    color: isSelected ? "white" : "#1A1A1A",
                    borderColor: isSelected ? "var(--accent)" : "#e5e7eb",
                    boxShadow: isSelected ? "none" : "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main use */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#1A1A1A]">What will you mainly use it for?</label>
          <input
            type="text"
            placeholder="e.g. Daily commute, working from home"
            value={data.mainUse}
            onChange={(e) => onChange({ ...data, mainUse: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1A1A1A] placeholder-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0FB5AE] focus:border-transparent transition"
          />
        </div>

        {/* Lowest price seen (optional) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#1A1A1A]">
            What&apos;s the lowest price you&apos;ve seen for it?{" "}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              value={data.lowestPrice}
              onChange={(e) => onChange({ ...data, lowestPrice: e.target.value })}
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1A1A1A] placeholder-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0FB5AE] focus:border-transparent transition"
            />
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        onClick={handleGetVerdict}
        className="w-full py-3.5 rounded-xl font-semibold text-white transition-all"
        style={{ background: "var(--accent)" }}
      >
        Get Verdict
      </button>
    </div>
  );
}
