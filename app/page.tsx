"use client";

import { useState } from "react";
import InputForm from "@/components/InputForm";
import FollowUpForm from "@/components/FollowUpForm";
import VerdictScreen from "@/components/VerdictScreen";
import type { VerdictResponse } from "@/app/api/verdict/route";

export type InputData = {
  productName: string;
  price: string;
  whereToBuy: string;
};

export type FollowUpData = {
  urgency: "Now" | "Within a month" | "No rush" | "";
  mainUse: string;
  lowestPrice: string;
};

export type Step = "input" | "followup" | "verdict";

export default function Home() {
  const [step, setStep] = useState<Step>("input");
  const [inputData, setInputData] = useState<InputData>({
    productName: "",
    price: "",
    whereToBuy: "",
  });
  const [followUpData, setFollowUpData] = useState<FollowUpData>({
    urgency: "",
    mainUse: "",
    lowestPrice: "",
  });
  const [verdictResult, setVerdictResult] = useState<VerdictResponse | null>(null);

  const handleReset = () => {
    setStep("input");
    setInputData({ productName: "", price: "", whereToBuy: "" });
    setFollowUpData({ urgency: "", mainUse: "", lowestPrice: "" });
    setVerdictResult(null);
  };

  return (
    /* TODO: Replace with animated background video/CSS — keep subtle, calm */
    <div className="animated-bg">
      <div className="min-h-screen flex flex-col">
        {/* Header / Nav */}
        <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
            {/* TODO: Replace with /public/logo.png — square, minimal */}
            <div className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-[9px] font-bold text-gray-400 tracking-wider flex-shrink-0">
              LOGO
            </div>
            <span className="text-xl font-bold text-[#1A1A1A] tracking-tight">
              Worth It
            </span>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-start px-6 py-10">
          <div className="w-full max-w-xl">
            {step === "input" && (
              <InputForm
                data={inputData}
                onChange={setInputData}
                onNext={() => setStep("followup")}
              />
            )}
            {step === "followup" && (
              <FollowUpForm
                data={followUpData}
                inputData={inputData}
                onChange={setFollowUpData}
                onVerdictReady={(result) => {
                  setVerdictResult(result);
                  setStep("verdict");
                }}
              />
            )}
            {step === "verdict" && (
              <VerdictScreen
                inputData={inputData}
                verdictResult={verdictResult}
                onReset={handleReset}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
