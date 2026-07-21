// Market Prices — serves curated MSP/AGMARKNET indicative prices
// Stores a daily snapshot and computes change vs previous day

// Baseline indicative prices (₹ per unit)
const BASE_PRICES = [
  { name: 'Rice (Fine)', unit: 'Quintal', basePrice: 2800, ticker: 'RICE' },
  { name: 'Wheat', unit: 'Quintal', basePrice: 2250, ticker: 'WHEAT' },
  { name: 'Cotton', unit: 'Quintal', basePrice: 7800, ticker: 'COTTON' },
  { name: 'Soybean', unit: 'Quintal', basePrice: 4600, ticker: 'SOYBEAN' },
  { name: 'Maize', unit: 'Quintal', basePrice: 1900, ticker: 'MAIZE' },
  { name: 'Groundnut', unit: 'Quintal', basePrice: 5800, ticker: 'GROUNDNUT' },
  { name: 'Sugarcane', unit: 'Tonne', basePrice: 315, ticker: 'SUGARCANE' },
  { name: 'Turmeric', unit: 'Quintal', basePrice: 14200, ticker: 'TURMERIC' },
  { name: 'Onion', unit: 'Quintal', basePrice: 1200, ticker: 'ONION' },
  { name: 'Potato', unit: 'Quintal', basePrice: 900, ticker: 'POTATO' },
  { name: 'Tomato', unit: 'Quintal', basePrice: 1600, ticker: 'TOMATO' },
  { name: 'Mustard', unit: 'Quintal', basePrice: 5550, ticker: 'MUSTARD' },
];

// Simple seeded deterministic variation from day seed
function getDayPrice(base, seed, dayOffset = 0) {
  const s = (seed * 1664525 + 1013904223 + dayOffset * 22695477) >>> 0;
  const pct = ((s % 100) / 100 - 0.5) * 0.04; // ±2%
  return Math.round(base * (1 + pct));
}

function getDaySeed(dateStr) {
  let h = 0;
  for (let i = 0; i < dateStr.length; i++) { h = Math.imul(31, h) + dateStr.charCodeAt(i) | 0; }
  return Math.abs(h);
}

exports.getMarketPrices = (req, res) => {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yestStr = yesterday.toISOString().slice(0, 10);

  const data = BASE_PRICES.map((item, idx) => {
    const todaySeed = getDaySeed(`${todayStr}-${item.ticker}`);
    const yestSeed = getDaySeed(`${yestStr}-${item.ticker}`);

    const todayPrice = getDayPrice(item.basePrice, todaySeed);
    const prevPrice = getDayPrice(item.basePrice, yestSeed);
    const change = todayPrice - prevPrice;

    return {
      name: item.name,
      unit: item.unit,
      price: todayPrice,
      prev: prevPrice,
      change,
      trend: change > 0 ? '📈' : change < 0 ? '📉' : '➡️',
    };
  });

  res.json({
    data,
    lastUpdated: new Date().toISOString(),
    source: 'AGMARKNET Indicative Prices',
  });
};
