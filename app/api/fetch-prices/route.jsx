export async function GET() {
  try {
    const res = await fetch("https://egcurrency.com/en/country/IQ", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      cache: "no-store",
    });

    const html = await res.text();

    const lastIdx = html.lastIndexOf("USD-to-IQD/blackMarket");
    const chunk = html.substring(lastIdx, lastIdx + 500);

    const priceMatch = chunk.match(
      /text-success">([\d,]+\.?\d*)<\/td>\s*<td class="text-success">([\d,]+\.?\d*)/,
    );
    const usdBuy = priceMatch ? priceMatch[1].replace(/,/g, "") : null;
    const usdSell = priceMatch ? priceMatch[2].replace(/,/g, "") : null;

    const data = {
      BuyPrice: parseFloat(usdBuy),
      SellPrice: parseFloat(usdSell),
    };
    console.log("Data:", data);

    try {
      const backendRes = await fetch(
        "https://apiiraqmarket.runasp.net/api/GitDataMarketIraqi/priceDinarIQ",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      console.log("Backend status:", backendRes.status);
      const backendText = await backendRes.text();
      console.log("Backend status:", backendRes.status);
      console.log("Backend response:", backendText);
    } catch (backendErr) {
      console.error("Backend error:", backendErr.message);
    }

    return Response.json({ success: true, data });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
