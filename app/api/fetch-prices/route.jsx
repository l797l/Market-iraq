export async function GET() {
  try {
    const res = await fetch("https://egcurrency.com/en/country/IQ", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      cache: "no-store",
    });

    const html = await res.text();

    // ---- USD ----
    const usdIdx = html.lastIndexOf("USD-to-IQD/blackMarket");
    const usdChunk = html.substring(usdIdx, usdIdx + 500);
    const usdMatch = usdChunk.match(
      /text-success">([\d,]+\.?\d*)<\/td>\s*<td class="text-success">([\d,]+\.?\d*)/
    );
    const usdBuy  = usdMatch ? parseFloat(usdMatch[1].replace(/,/g, "")) : null;
    const usdSell = usdMatch ? parseFloat(usdMatch[2].replace(/,/g, "")) : null;

    // ---- ذهب 18 ----
    const gold18Idx = html.lastIndexOf("18k-in-IQD/stock");
    const gold18Chunk = html.substring(gold18Idx, gold18Idx + 500);
    const gold18Match = gold18Chunk.match(
      /text-success">([\d,]+\.?\d*)<\/td>\s*<td class="text-success">([\d,]+\.?\d*)/
    );
    const gold18Buy  = gold18Match ? parseFloat(gold18Match[1].replace(/,/g, "")) : null;
    const gold18Sell = gold18Match ? parseFloat(gold18Match[2].replace(/,/g, "")) : null;

    // ---- ذهب 21 ----
    const gold21Idx = html.lastIndexOf("21k-in-IQD/stock");
    const gold21Chunk = html.substring(gold21Idx, gold21Idx + 500);
    const gold21Match = gold21Chunk.match(
      /text-success">([\d,]+\.?\d*)<\/td>\s*<td class="text-success">([\d,]+\.?\d*)/
    );
    const gold21Buy  = gold21Match ? parseFloat(gold21Match[1].replace(/,/g, "")) : null;
    const gold21Sell = gold21Match ? parseFloat(gold21Match[2].replace(/,/g, "")) : null;

    // ---- ذهب 24 ----
    const gold24Idx = html.lastIndexOf("24k-in-IQD/stock");
    const gold24Chunk = html.substring(gold24Idx, gold24Idx + 500);
    const gold24Match = gold24Chunk.match(
      /text-success">([\d,]+\.?\d*)<\/td>\s*<td class="text-success">([\d,]+\.?\d*)/
    );
    const gold24Buy  = gold24Match ? parseFloat(gold24Match[1].replace(/,/g, "")) : null;
    const gold24Sell = gold24Match ? parseFloat(gold24Match[2].replace(/,/g, "")) : null;

    // ---- فضة ----
    const silverIdx = html.lastIndexOf("xag-in-IQD/stock");
    const silverChunk = html.substring(silverIdx, silverIdx + 500);
    const silverMatch = silverChunk.match(
      /text-success">([\d,]+\.?\d*)<\/td>\s*<td class="text-success">([\d,]+\.?\d*)/
    );
    const silverBuy  = silverMatch ? parseFloat(silverMatch[1].replace(/,/g, "")) : null;
    const silverSell = silverMatch ? parseFloat(silverMatch[2].replace(/,/g, "")) : null;

    console.log("USD:",    { usdBuy, usdSell });
    console.log("Gold18:", { gold18Buy, gold18Sell });
    console.log("Gold21:", { gold21Buy, gold21Sell });
    console.log("Gold24:", { gold24Buy, gold24Sell });
    console.log("Silver:", { silverBuy, silverSell });

   /* await sendToBackend(
      "https://apiiraqmarket.runasp.net/api/GitDataMarketIraqi/priceDinarIQ",
      { BuyPrice: usdBuy, SellPrice: usdSell }
    );

    await sendToBackend(
      "https://apiiraqmarket.runasp.net/api/GitDataMarketIraqi/priceGoldIQ",
      { BuyPricePerGram: gold18Buy, SellPricePerGram: gold18Sell, Karat: 18 }
    );

    await sendToBackend(
      "https://apiiraqmarket.runasp.net/api/GitDataMarketIraqi/priceGoldIQ",
      { BuyPricePerGram: gold21Buy, SellPricePerGram: gold21Sell, Karat: 21 }
    );

    await sendToBackend(
      "https://apiiraqmarket.runasp.net/api/GitDataMarketIraqi/priceGoldIQ",
      { BuyPricePerGram: gold24Buy, SellPricePerGram: gold24Sell, Karat: 24 }
    );

    await sendToBackend(
      "https://apiiraqmarket.runasp.net/api/GitDataMarketIraqi/priceSilverIQ",
      { BuyPriceGram: silverBuy, SellPriceGram: silverSell }
    );
    */

    return Response.json({ success: true });

  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

// دالة مساعدة لإرسال البيانات
async function sendToBackend(url, data) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    console.log(`${url} → ${res.status}`);
  } catch (err) {
    console.error(`${url} → Error:`, err.message);
  }
}