import { InputData } from "@/app/page";

type Props = {
  data: InputData;
  onChange: (data: InputData) => void;
  onNext: () => void;
};

export default function InputForm({ data, onChange, onNext }: Props) {
  const isValid = data.productName.trim() && data.price.trim() && data.whereToBuy.trim();

  return (
    <div className="flex flex-col gap-8">
      {/* TODO: Replace with /public/hero.png — 16:9, 4K */}
      <div
        className="w-full border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50"
        style={{ aspectRatio: "16/9" }}
      >
        <span className="text-sm font-medium text-gray-300 tracking-widest uppercase">
          Hero Image
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Is it worth it?</h1>
        <p className="text-gray-500">Tell us what you're thinking of buying.</p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#1A1A1A]">Product name</label>
          <input
            type="text"
            placeholder="e.g. Sony WH-1000XM5"
            value={data.productName}
            onChange={(e) => onChange({ ...data, productName: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1A1A1A] placeholder-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0FB5AE] focus:border-transparent transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#1A1A1A]">Price you&apos;d pay</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              value={data.price}
              onChange={(e) => onChange({ ...data, price: e.target.value })}
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1A1A1A] placeholder-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0FB5AE] focus:border-transparent transition"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#1A1A1A]">Where you&apos;d buy it</label>
          <input
            type="text"
            placeholder="e.g. Amazon, Best Buy"
            value={data.whereToBuy}
            onChange={(e) => onChange({ ...data, whereToBuy: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#1A1A1A] placeholder-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0FB5AE] focus:border-transparent transition"
          />
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        className="w-full py-3.5 rounded-xl font-semibold text-white transition-all"
        style={{
          background: isValid ? "var(--accent)" : "#d1d5db",
          opacity: isValid ? 1 : 0.4,
          cursor: isValid ? "pointer" : "not-allowed",
        }}
      >
        Continue
      </button>
    </div>
  );
}
