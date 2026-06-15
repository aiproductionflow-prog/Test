import { NextRequest, NextResponse } from "next/server";

export type ResearchData = {
  typical_price: number | string;
  fair_price_assessment: string;
  best_current_price: number;
  best_price_source: string;
  common_issues: string[];
  sale_or_new_model_imminent: boolean;
  imminent_details: string | null;
};

export type VerdictLabel = "Buy It" | "Skip It" | "Wait" | "Shortlist It";

export type VerdictResponse = {
  verdict: VerdictLabel;
  reason: string;
  details: ResearchData;
};

function buildPrompt(body: {
  productName: string;
  price: string;
  whereToBuy: string;
  urgency: string;
  mainUse: string;
  lowestPrice: string;
}): string {
  const lowestPriceClause = body.lowestPrice
    ? ` The user has previously seen it for $${body.lowestPrice}.`
    : "";

  return `You are a product research assistant. The user is considering buying "${body.productName}" for $${body.price} at "${body.whereToBuy}". They need it ${body.urgency.toLowerCase()} and will use it for: ${body.mainUse}.${lowestPriceClause}

Research this specific product right now and respond with ONLY valid JSON — no markdown, no code fences, no commentary, no extra text before or after. Return exactly this shape:

{
  "typical_price": <number or short price-range string like "149-179">,
  "fair_price_assessment": <one short sentence on whether the listed price is fair>,
  "best_current_price": <lowest price found today as a number>,
  "best_price_source": <retailer or site name where that price was found>,
  "common_issues": [<up to 3 short strings describing known recurring problems, or empty array>],
  "sale_or_new_model_imminent": <true if a sale event or successor model is confirmed/very likely within 6 weeks, else false>,
  "imminent_details": <short string explaining the sale/new model if true, else null>
}`;
}

function decideVerdict(
  research: ResearchData,
  userPrice: number,
  urgency: string
): { verdict: VerdictLabel; reason: string } {
  const best = research.best_current_price;
  const hasSeriosIssues = research.common_issues.length >= 2;
  const pricePaidRatio = best > 0 ? userPrice / best : 1;

  // "Skip It" — user is paying notably over fair value, or serious known issues
  if (pricePaidRatio > 1.15 && hasSeriosIssues) {
    return {
      verdict: "Skip It",
      reason: `The best current price is $${best} at ${research.best_price_source}, so $${userPrice} is above fair value. On top of that, this product has known issues: ${research.common_issues.slice(0, 2).join("; ")}. Not worth it at this price.`,
    };
  }

  // "Wait" — sale or new model imminent, or user price is clearly above best found
  if (research.sale_or_new_model_imminent) {
    return {
      verdict: "Wait",
      reason: `${research.imminent_details ?? "A sale or new model is expected soon."} Hold off — you could get a better deal shortly.`,
    };
  }

  if (pricePaidRatio > 1.1) {
    return {
      verdict: "Wait",
      reason: `Found it for $${best} at ${research.best_price_source} — that's meaningfully below your $${userPrice}. Worth shopping around or waiting for the price to drop.`,
    };
  }

  // "Skip It" — price is fine but serious issues regardless
  if (hasSeriosIssues) {
    return {
      verdict: "Skip It",
      reason: `Even at $${best}, this product has recurring complaints: ${research.common_issues.slice(0, 2).join("; ")}. Consider an alternative.`,
    };
  }

  // "Buy It" — good price, no major issues, not waiting on anything
  if (pricePaidRatio <= 1.05 && !hasSeriosIssues) {
    return {
      verdict: "Buy It",
      reason: `$${userPrice} is right in line with the best price found ($${best} at ${research.best_price_source}). ${research.fair_price_assessment} No major issues reported — go for it.`,
    };
  }

  // "Shortlist It" — close call or no-rush fallback
  return {
    verdict: "Shortlist It",
    reason: `Not an obvious buy right now. ${research.fair_price_assessment} Best price found was $${best} at ${research.best_price_source}. ${urgency === "No rush" ? "Since you're not in a hurry, keep an eye on it." : "Worth monitoring before committing."}`,
  };
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "PERPLEXITY_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { productName, price, whereToBuy, urgency, mainUse, lowestPrice } = body;

  if (!productName || !price || !whereToBuy) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const prompt = buildPrompt({ productName, price, whereToBuy, urgency, mainUse, lowestPrice });

  let perplexityRaw: string;
  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1, // low temp for consistent JSON output
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Perplexity API error:", response.status, errText);
      return NextResponse.json(
        { error: "Research service returned an error. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    perplexityRaw = data.choices?.[0]?.message?.content ?? "";
  } catch (err) {
    console.error("Perplexity fetch failed:", err);
    return NextResponse.json(
      { error: "Could not reach research service. Check your connection." },
      { status: 502 }
    );
  }

  // Strip any accidental markdown fences before parsing
  const cleaned = perplexityRaw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  let research: ResearchData;
  try {
    research = JSON.parse(cleaned);
  } catch {
    console.error("Failed to parse Perplexity JSON:", perplexityRaw);
    return NextResponse.json(
      { error: "Research returned an unexpected format. Please try again." },
      { status: 502 }
    );
  }

  const userPrice = parseFloat(price);
  const { verdict, reason } = decideVerdict(research, userPrice, urgency);

  const result: VerdictResponse = { verdict, reason, details: research };
  return NextResponse.json(result);
}
