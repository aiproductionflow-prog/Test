import { FollowUpData } from "@/app/page";

type Props = {
  data: FollowUpData;
  onChange: (data: FollowUpData) => void;
  onNext: () => void;
};

const urgencyOptions = ["Now", "Within a month", "No rush"] as const;

export default function FollowUpForm({ data, onChange, onNext }: Props) {
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

      <button
        onClick={onNext}
        className="w-full py-3.5 rounded-xl font-semibold text-white transition-all"
        style={{ background: "var(--accent)" }}
      >
        Get Verdict
      </button>
    </div>
  );
}
