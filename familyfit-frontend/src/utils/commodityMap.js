/**
 * commodityMap.js
 *
 * Maps FamilyFit grocery recommendation items to data.gov.in (Agmarknet) Kerala mandi commodities.
 * Uses case-insensitive, normalized partial matching.
 * Calculates median modal wholesale price across Kerala markets and applies RETAIL_MARKUP.
 */

// Wholesale -> Retail multiplier (wholesale mandi prices + handling/transport margin)
export const RETAIL_MARKUP = 1.3;

/**
 * Mappings between FamilyFit app items and Agmarknet commodities.
 * Each entry specifies the exact or partial commodity names returned by Kerala mandis,
 * with optional variety preferences (e.g. green/nendran for bananas, small for onions).
 */
export const COMMODITY_MAPPINGS = [
  {
    appItemName: 'Ethakka / Nendran Plantain (1 kg)',
    apiKeywords: ['Banana - Green', 'Banana', 'Plantain'],
    preferredVariety: ['nendra', 'green'],
    unit: '1 kg',
  },
  {
    appItemName: 'Tapioca / Kappa (1 kg)',
    apiKeywords: ['Tapioca', 'Cassava'],
    unit: '1 kg',
  },
  {
    appItemName: 'Chena / Elephant Foot Yam (1 kg)',
    apiKeywords: ['Elephant Yam', 'Suran', 'Amorphophallus'],
    unit: '1 kg',
  },
  {
    appItemName: 'Capsicum Yellow (1 kg)',
    apiKeywords: ['Capsicum'],
    unit: '1 kg',
  },
  {
    appItemName: 'Beans (1 kg)',
    apiKeywords: ['French Beans', 'Frasbean', 'Beans', 'Cowpea'],
    unit: '1 kg',
  },
  {
    appItemName: 'Muringakka / Drumsticks (Pack of 3)',
    apiKeywords: ['Drumstick'],
    unit: 'Pack of 3',
    unitFactor: 0.35,
  },
  {
    appItemName: 'Fresh Grated Coconut (Pack of 2)',
    apiKeywords: ['Coconut'],
    unit: 'Pack of 2',
    unitFactor: 0.5,
  },
  {
    appItemName: 'Small Onions / Shallots (500g)',
    apiKeywords: ['Onion', 'Shallot'],
    preferredVariety: ['small'],
    unit: '500g',
    unitFactor: 0.5,
  },
  {
    appItemName: 'Kerala Farm Fresh Tomatoes / Thakkali (1 kg)',
    apiKeywords: ['Tomato'],
    unit: '1 kg',
  },
  {
    appItemName: 'Fresh Potatoes / Urulakkizhangu (1 kg)',
    apiKeywords: ['Potato'],
    unit: '1 kg',
  },
  {
    appItemName: 'Venda / Okra / Ladies Finger (1 kg)',
    apiKeywords: ['Bhindi(Ladies Finger)', 'Bhindi', 'Ladies Finger'],
    unit: '1 kg',
  },
  {
    appItemName: 'Pavakka / Bitter Gourd (1 kg)',
    apiKeywords: ['Bitter gourd', 'Bitter Gourd'],
    unit: '1 kg',
  },
  {
    appItemName: 'Padavalanga / Snake Gourd (1 kg)',
    apiKeywords: ['Snakeguard', 'Snake Gourd'],
    unit: '1 kg',
  },
  {
    appItemName: 'Kumbalanga / Ash Gourd (1 kg)',
    apiKeywords: ['Ashgourd', 'Ash Gourd', 'White Pumpkin'],
    unit: '1 kg',
  },
  {
    appItemName: 'Mathanga / Red Pumpkin (1 kg)',
    apiKeywords: ['Pumpkin'],
    unit: '1 kg',
  },
  {
    appItemName: 'Ooty Carrots (1 kg)',
    apiKeywords: ['Carrot'],
    unit: '1 kg',
  },
  {
    appItemName: 'Fresh Green Cabbage (1 kg)',
    apiKeywords: ['Cabbage'],
    unit: '1 kg',
  },
  {
    appItemName: 'Fresh Cauliflower (1 piece / 800g)',
    apiKeywords: ['Cauliflower'],
    unit: '1 piece',
    unitFactor: 0.8,
  },
  {
    appItemName: 'Beetroot (1 kg)',
    apiKeywords: ['Beetroot'],
    unit: '1 kg',
  },
  {
    appItemName: 'Vazhuthananga / Green Brinjal (1 kg)',
    apiKeywords: ['Brinjal'],
    unit: '1 kg',
  },
  {
    appItemName: 'Cheera / Red Amaranth Spinach (Bunch)',
    apiKeywords: ['Amaranthus', 'Amranthas Red'],
    unit: 'Bunch',
    unitFactor: 0.35,
  },
  {
    appItemName: 'Chembu / Colocasia / Taro Root (1 kg)',
    apiKeywords: ['Colacasia', 'Colocasia'],
    unit: '1 kg',
  },
  {
    appItemName: 'Vellarikka / Kerala Golden Cucumber (1 kg)',
    apiKeywords: ['Cucumbar(Kheera)', 'Cucumbar', 'Cucumber'],
    unit: '1 kg',
  },
  {
    appItemName: 'Nadan Inji / Fresh Green Ginger (250g)',
    apiKeywords: ['Ginger(Green)', 'Green Ginger', 'Ginger'],
    unit: '250g',
    unitFactor: 0.25,
  },
  {
    appItemName: 'Fresh Green Chillies / Pacha Mulaku (250g)',
    apiKeywords: ['Green Chilli', 'Green Chilly'],
    unit: '250g',
    unitFactor: 0.25,
  },
  {
    appItemName: 'Kerala Matta Rice (5 kg)',
    apiKeywords: ['Rice', 'Paddy'],
    unit: '5 kg',
    unitFactor: 5,
  },
  {
    appItemName: 'Cold-Pressed Coconut Oil (1L)',
    apiKeywords: ['Coconut Oil'],
    unit: '1L',
    unitFactor: 1,
  },
  {
    appItemName: 'Peanuts / Roasted Groundnuts (500g)',
    apiKeywords: ['Groundnut', 'Peanut'],
    unit: '500g',
    unitFactor: 0.5,
  },
  {
    appItemName: 'Whole Wheat Chakki Atta (5 kg)',
    apiKeywords: ['Wheat', 'Atta'],
    unit: '5 kg',
    unitFactor: 5,
  },
];

/**
 * Calculates mathematical median of an array of numbers.
 */
export function calculateMedian(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) {
    return sorted[mid];
  }
  return Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 10) / 10;
}

/**
 * Cleans string for case-insensitive, punctuation-free comparison.
 */
function cleanStr(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Formats arrival date string (e.g. "20/10/2026" or ISO string) to readable short form (e.g. "20 Oct").
 */
export function formatArrivalDate(dateStr) {
  if (!dateStr) return 'Today';
  const trimmed = String(dateStr).trim();

  // Pattern DD/MM/YYYY
  const parts = trimmed.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthIdx = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const d = new Date(year, monthIdx, day);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
  }

  // ISO string fallback
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }

  return trimmed;
}

/**
 * Cleans market name (e.g. "Thrissur Market" -> "Thrissur")
 */
function cleanMarketName(name) {
  if (!name) return 'Kerala Mandis';
  return name.replace(/\s*(Market|APMC|VFPCK)\s*/gi, '').trim() || name;
}

/**
 * Maps raw API items array [{ commodity, market, district, modalPerKg, arrivalDate, ... }]
 * to an indexed lookup map for all app grocery items.
 */
export function mapApiPricesToGroceryItems(apiItems = [], markup = RETAIL_MARKUP) {
  if (!Array.isArray(apiItems) || apiItems.length === 0) {
    return {};
  }

  const resultMap = {};

  for (const mapping of COMMODITY_MAPPINGS) {
    // 1. Find all API records matching the mapping keywords
    const candidateMatches = apiItems.filter((item) => {
      const commClean = cleanStr(item.commodity);
      return mapping.apiKeywords.some((kw) => {
        const kwClean = cleanStr(kw);
        return commClean.includes(kwClean) || kwClean.includes(commClean);
      });
    });

    if (candidateMatches.length === 0) {
      continue;
    }

    // 2. If mapping specifies a variety preference, prioritize preferred records
    let matches = candidateMatches;
    if (mapping.preferredVariety && mapping.preferredVariety.length > 0) {
      const preferred = candidateMatches.filter((item) => {
        const varClean = cleanStr(item.variety);
        return mapping.preferredVariety.some((pv) => varClean.includes(cleanStr(pv)));
      });
      if (preferred.length > 0) {
        matches = preferred;
      }
    }

    // 3. Extract modal prices per kg
    const validPrices = matches.map((m) => m.modalPerKg).filter((p) => typeof p === 'number' && p > 0);
    if (validPrices.length === 0) continue;

    // 4. Compute median modal price across Kerala markets
    const wholesaleMedian = calculateMedian(validPrices);

    // 5. Apply retail markup
    const factor = mapping.unitFactor || 1;
    const baseRetailPerKg = Math.round(wholesaleMedian * markup);
    const finalItemPrice = Math.round(baseRetailPerKg * factor);

    // 6. Find representative market & date (closest to median)
    let representative = matches[0];
    let minDiff = Infinity;
    for (const m of matches) {
      const diff = Math.abs((m.modalPerKg || 0) - wholesaleMedian);
      if (diff < minDiff) {
        minDiff = diff;
        representative = m;
      }
    }

    const marketClean = cleanMarketName(representative.market || representative.district);
    const arrivalDateFormatted = formatArrivalDate(representative.arrivalDate);

    resultMap[mapping.appItemName] = {
      isLive: true,
      commodity: representative.commodity,
      wholesalePerKg: wholesaleMedian,
      retailPricePerKg: baseRetailPerKg,
      finalItemPrice,
      unit: mapping.unit,
      market: marketClean,
      district: representative.district,
      arrivalDate: arrivalDateFormatted,
      marketsReporting: matches.length,
      // String format matching prompt requirement: e.g. "Rs 42/kg, Thrissur, 20 Oct"
      smallPriceText: `Rs ${wholesaleMedian}/kg, ${marketClean}, ${arrivalDateFormatted}`,
      approxRetailText: `~₹${finalItemPrice} / ${mapping.unit}`,
    };
  }

  return resultMap;
}
