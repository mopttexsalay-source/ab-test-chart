export interface Variation {
  id?: number;
  name: string;
}

export interface DailyData {
  date: string;
  visits: Record<string, number>;
  conversions: Record<string, number>;
}

export interface ChartDataPoint {
  date: string;
  [key: string]: number | string;
}

export interface ABTestData {
  variations: Variation[];
  data: DailyData[];
}

export type LineStyle = 'line' | 'smooth' | 'area';
export type TimeFrame = 'day' | 'week';
export type Theme = 'light' | 'dark';
