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

    function extractPrices(chunk, cssClass) {
      const match = chunk.match(
        new RegExp(`${cssClass}">([\\.\\d,]+)<\\/td>\\s*<td class="${cssClass}">([\\.\\d,]+)`)
      );
      return match
        ? [parseFloat(match[1].replace(/,/g, "")), parseFloat(match[2].replace(/,/g, ""))]
        : [null, null];
    }

    const usdIdx   = html.lastIndexOf("USD-to-IQD/blackMarket");
    const usdChunk = html.substring(usdIdx, usdIdx + 500);
    let [usdBuy, usdSell] = extractPrices(usdChunk, "text-success");
    if (usdBuy === null) [usdBuy, usdSell] = extractPrices(usdChunk, "text-danger");

    const gold18Idx   = html.lastIndexOf("18k-in-IQD/stock");
    const gold18Chunk = html.substring(gold18Idx, gold18Idx + 500);
    let [gold18Buy, gold18Sell] = extractPrices(gold18Chunk, "text-success");
    if (gold18Buy === null) [gold18Buy, gold18Sell] = extractPrices(gold18Chunk, "text-danger");

    const gold21Idx   = html.lastIndexOf("21k-in-IQD/stock");
    const gold21Chunk = html.substring(gold21Idx, gold21Idx + 500);
    let [gold21Buy, gold21Sell] = extractPrices(gold21Chunk, "text-success");
    if (gold21Buy === null) [gold21Buy, gold21Sell] = extractPrices(gold21Chunk, "text-danger");

    const gold24Idx   = html.lastIndexOf("24k-in-IQD/stock");
    const gold24Chunk = html.substring(gold24Idx, gold24Idx + 500);
    let [gold24Buy, gold24Sell] = extractPrices(gold24Chunk, "text-success");
    if (gold24Buy === null) [gold24Buy, gold24Sell] = extractPrices(gold24Chunk, "text-danger");

    const silverIdx   = html.lastIndexOf("xag-in-IQD/stock");
    const silverChunk = html.substring(silverIdx, silverIdx + 500);
    let [silverBuy, silverSell] = extractPrices(silverChunk, "text-danger");
    if (silverBuy === null) [silverBuy, silverSell] = extractPrices(silverChunk, "text-success");

    console.log("USD:",    { usdBuy, usdSell });
    console.log("Gold18:", { gold18Buy, gold18Sell });
    console.log("Gold21:", { gold21Buy, gold21Sell });
    console.log("Gold24:", { gold24Buy, gold24Sell });
    console.log("Silver:", { silverBuy, silverSell });

    if (usdBuy && usdSell)
      await sendToBackend(
        "https://apiiraqmarket.runasp.net/api/GitDataMarketIraqi/priceDinarIQ",
        { BuyPrice: usdBuy, SellPrice: usdSell }
      );
    else console.warn("USD: null —");

    if (gold18Buy && gold18Sell)
      await sendToBackend(
        "https://apiiraqmarket.runasp.net/api/GitDataMarketIraqi/priceGoldIQ",
        { BuyPricePerGram: gold18Buy, SellPricePerGram: gold18Sell, Karat: 18 }
      );
    else console.warn("Gold18: null —");

    if (gold21Buy && gold21Sell)
      await sendToBackend(
        "https://apiiraqmarket.runasp.net/api/GitDataMarketIraqi/priceGoldIQ",
        { BuyPricePerGram: gold21Buy, SellPricePerGram: gold21Sell, Karat: 21 }
      );
    else console.warn("Gold21: null — ");

    if (gold24Buy && gold24Sell)
      await sendToBackend(
        "https://apiiraqmarket.runasp.net/api/GitDataMarketIraqi/priceGoldIQ",
        { BuyPricePerGram: gold24Buy, SellPricePerGram: gold24Sell, Karat: 24 }
      );
    else console.warn("Gold24: null — ");

    if (silverBuy && silverSell)
      await sendToBackend(
        "https://apiiraqmarket.runasp.net/api/GitDataMarketIraqi/priceSilverIQ",
        { BuyPriceGram: silverBuy, SellPriceGram: silverSell }
      );
    else console.warn("Silver: null — ");

    return Response.json({
      success: true,
      data: { usdBuy, usdSell, gold18Buy, gold18Sell, gold21Buy, gold21Sell, gold24Buy, gold24Sell, silverBuy, silverSell }
    });

  } catch (err) {
    console.error("Error:", err.message);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

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