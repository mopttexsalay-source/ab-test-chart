import type { ChartDataPoint, DailyData } from '../types/data';
import { startOfWeek, format } from 'date-fns';

export const calculateConversionRate = (conversions: number, visits: number): number => {
  if (visits === 0) return 0;
  return (conversions / visits) * 100;
};

export const getVariationId = (variation: { id?: number; name: string }): string => {
  return variation.id !== undefined ? variation.id.toString() : '0';
};

export const processDailyData = (
  data: DailyData[],
  selectedVariations: string[]
): ChartDataPoint[] => {
  return data.map((day) => {
    const point: ChartDataPoint = { date: day.date };

    selectedVariations.forEach((varId) => {
      const visits = day.visits[varId] || 0;
      const conversions = day.conversions[varId] || 0;
      point[`var_${varId}`] = calculateConversionRate(conversions, visits);
    });

    return point;
  });
};

export const processWeeklyData = (
  data: DailyData[],
  selectedVariations: string[]
): ChartDataPoint[] => {
  const weeklyMap = new Map<string, Record<string, { visits: number; conversions: number }>>();

  data.forEach((day) => {
    const weekStart = format(startOfWeek(new Date(day.date), { weekStartsOn: 1 }), 'yyyy-MM-dd');

    if (!weeklyMap.has(weekStart)) {
      weeklyMap.set(weekStart, {});
    }

    const weekData = weeklyMap.get(weekStart)!;

    selectedVariations.forEach((varId) => {
      if (!weekData[varId]) {
        weekData[varId] = { visits: 0, conversions: 0 };
      }
      weekData[varId].visits += day.visits[varId] || 0;
      weekData[varId].conversions += day.conversions[varId] || 0;
    });
  });

  return Array.from(weeklyMap.entries())
    .map(([date, weekData]) => {
      const point: ChartDataPoint = { date };

      selectedVariations.forEach((varId) => {
        const { visits, conversions } = weekData[varId] || { visits: 0, conversions: 0 };
        point[`var_${varId}`] = calculateConversionRate(conversions, visits);
      });

      return point;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const getVariationColor = (index: number): string => {
  const colors = ['#5E5D67', '#3838E7', '#FF8346', '#73D13D'];
  return colors[index % colors.length];
};

export const findBestVariation = (
  chartData: ChartDataPoint[],
  dateIndex: number,
  variations: string[]
): string | null => {
  if (!chartData[dateIndex]) return null;

  const point = chartData[dateIndex];
  let maxRate = -1;
  let bestVar = null;

  variations.forEach((varId) => {
    const rate = point[`var_${varId}`];
    if (typeof rate === 'number' && rate > maxRate) {
      maxRate = rate;
      bestVar = varId;
    }
  });

  return bestVar;
};
