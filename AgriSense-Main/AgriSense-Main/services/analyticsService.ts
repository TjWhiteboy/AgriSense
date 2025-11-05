import { CROP_DATA, DISTRICT_CROP_DATA, COMMON_CROPS } from '../constants';


// A simple hashing function to create deterministic "randomness" from the location string
const simpleHash = (str: string): number => {
  let hash = 0;
  if (!str) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// FIX: The self-import of this interface has been removed to resolve a name conflict.
export interface SoilHealth {
  n: { value: number; status: 'optimal' | 'low' | 'high' };
  p: { value: number; status: 'optimal' | 'low' | 'high' };
  k: { value: number; status: 'optimal' | 'low' | 'high' };
  ph: number;
}

export interface ResourceInsights {
    rainfall: { deviation: number };
    market: { forecast: 'strong' | 'stable' | 'weak' };
}

export interface MarketTrend {
    month: string;
    price: number;
}

export interface YieldPrediction {
    crop: string;
    predictedYield: number; // in tons/hectare
    confidence: number; // percentage
}

export interface PestPrediction {
    pestName: string;
    probability: number; // percentage
}

export interface PlantingAdvice {
  recommendedCrop: string;
  reason: string;
}

export interface DistrictBenchmark {
    rank: string; // e.g., 'Top 25%'
    note: string;
}

export interface CurrentWeather {
    temp: string;
    condition: string;
    humidity: number;
}

export interface DashboardAnalytics {
  weather: { temp: string; condition: 'Partly Cloudy' | 'Sunny' | 'Light Showers' | 'Clear Skies' | 'Humid' };
  pestAlerts: { level: 'low' | 'medium' | 'high'; message: string };
  soilHealth: SoilHealth;
  resourceInsights: ResourceInsights;
  marketTrends: { crop: string; data: MarketTrend[] };
  yieldPrediction: YieldPrediction;
  plantingAdvisor: PlantingAdvice;
  districtBenchmark: DistrictBenchmark;
  pestOutbreakPrediction: PestPrediction;
}

const getStatus = (value: number, optimal: number, range: number): 'optimal' | 'low' | 'high' => {
    if (value > optimal + range) return 'high';
    if (value < optimal - range) return 'low';
    return 'optimal';
};

const getSoilHealthForLocation = (location: string, hash: number): SoilHealth => {
    const districtData = DISTRICT_CROP_DATA[location];
    
    // Prioritize crops from the district if available, otherwise use the common list
    const cropSource = districtData?.crops.length > 0 ? districtData.crops : COMMON_CROPS;
    const primaryCrop = cropSource[hash % cropSource.length];
    
    const relevantCropData = CROP_DATA.filter(d => d.Crop.toLowerCase() === primaryCrop.toLowerCase());

    if (relevantCropData.length > 0) {
        const avgN = relevantCropData.reduce((sum, item) => sum + item.Nitrogen, 0) / relevantCropData.length;
        const avgP = relevantCropData.reduce((sum, item) => sum + item.Phosphorus, 0) / relevantCropData.length;
        const avgK = relevantCropData.reduce((sum, item) => sum + item.Potassium, 0) / relevantCropData.length;
        const avgPh = relevantCropData.reduce((sum, item) => sum + item.pH_Value, 0) / relevantCropData.length;

        // Use averages as a base and add some deterministic variance
        const nValue = Math.round(avgN + ((hash % 20) - 10)); // +/- 10
        const pValue = Math.round(avgP + ((hash % 10) - 5)); // +/- 5
        const kValue = Math.round(avgK + ((hash % 10) - 5)); // +/- 5
        const phValue = parseFloat((avgPh + ((hash % 10) / 10) - 0.5).toFixed(1)); // +/- 0.5

        return {
            n: { value: nValue, status: getStatus(nValue, avgN, 10) },
            p: { value: pValue, status: getStatus(pValue, avgP, 5) },
            k: { value: kValue, status: getStatus(kValue, avgK, 5) },
            ph: phValue,
        };
    }
    
    // Fallback to old hash-based method if no specific data is found for the crop
    return {
        n: { value: 80 + ((hash % 80) - 40), status: getStatus(120 + ((hash % 50) - 25), 100, 20) },
        p: { value: 40 + ((hash % 30) - 15), status: getStatus(45 + ((hash % 20) - 10), 45, 10) },
        k: { value: 45 + ((hash % 30) - 15), status: getStatus(60 + ((hash % 20) - 10), 50, 10) },
        ph: parseFloat((6.2 + (hash % 15) / 10).toFixed(1)),
    };
};

// This service simulates fetching data from a Big Data backend.
export const analyticsService = {
  getCurrentWeather: (location: string): CurrentWeather => {
    const hash = simpleHash(location);
    const conditions = ['Partly Cloudy', 'Sunny', 'Light Showers', 'Clear Skies', 'Humid'] as const;
    return {
      temp: `${28 + (hash % 8)}°C`,
      condition: conditions[hash % conditions.length],
      humidity: 60 + (hash % 25),
    };
  },

  getDashboardAnalytics: (location: string): DashboardAnalytics => {
    const hash = simpleHash(location);

    const pests = ['Aphids', 'Bollworm', 'Whitefly', 'Stem Borer', 'Thrips'];
    
    const districtCrops = DISTRICT_CROP_DATA[location]?.crops || COMMON_CROPS;
    const primaryCropForAnalytics = districtCrops[hash % districtCrops.length];

    // Generate Market Trends data
    const trendData: MarketTrend[] = Array.from({ length: 6 }, (_, i) => {
        const priceFluctuation = (simpleHash(`${location}-month-${i}`) % 20) - 10;
        return {
            month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
            price: 180 + (i * 5) + priceFluctuation,
        };
    });

    const soilHealth = getSoilHealthForLocation(location, hash);

    return {
      weather: {
        temp: `${28 + (hash % 8)}°C`,
        condition: (['Partly Cloudy', 'Sunny', 'Light Showers', 'Clear Skies', 'Humid'] as const)[hash % 5],
      },
      pestAlerts: {
        level: ['low', 'medium', 'high'][hash % 3] as 'low' | 'medium' | 'high',
        message: [
            "Monitor your wheat crop for Yellow Rust disease.",
            "High probability of locust swarms detected in western regions.",
            "Increased sightings of the Fall Armyworm pest in maize fields.",
        ][hash % 3],
      },
      soilHealth,
      resourceInsights: {
          rainfall: { deviation: (hash % 30) - 15 },
          market: { forecast: ['strong', 'stable', 'weak'][hash % 3] as 'strong' | 'stable' | 'weak' }
      },
      marketTrends: {
          crop: primaryCropForAnalytics,
          data: trendData
      },
      yieldPrediction: {
          crop: primaryCropForAnalytics,
          predictedYield: parseFloat((4.5 + (hash % 20) / 10).toFixed(1)),
          confidence: 85 + (hash % 10)
      },
      plantingAdvisor: {
        recommendedCrop: ['Sugarcane', 'Cotton', 'Soybean', 'Maize'][hash % 4],
        reason: [
            'High market demand is forecasted and current soil moisture is optimal.',
            'Favorable long-range weather predictions and stable market prices.',
            'Excellent for crop rotation to improve soil nitrogen levels for the following season.',
            'Short growth cycle and rising demand from the local poultry feed industry.'
        ][hash % 4],
      },
      districtBenchmark: {
          rank: ['Top 10%', 'Top 25%', 'Top 50%', 'Average'][hash % 4],
          note: 'Based on last season\'s yield data for your primary crop.'
      },
      pestOutbreakPrediction: {
          pestName: pests[hash % pests.length],
          probability: 60 + (hash % 35)
      }
    };
  },
};