import { useState, useMemo, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import type { ABTestData, LineStyle, TimeFrame } from '../types/data';
import {
  processDailyData,
  processWeeklyData,
  getVariationId,
  getVariationColor,
} from '../utils/dataProcessing';
import Dropdown from './Dropdown';
import MultiSelectDropdown from './MultiSelectDropdown';
import CustomTooltip from './CustomTooltip';
import styles from './Chart.module.css';
import PanIcon from '../assets/icons/pan.svg?react';
import ZoomInIcon from '../assets/icons/zoom-in.svg?react';
import ZoomOutIcon from '../assets/icons/zoom-out.svg?react';
import RefreshIcon from '../assets/icons/refresh.svg?react';
import MoonIcon from '../assets/icons/moon.svg?react';
import SunIcon from '../assets/icons/sun.svg?react';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  data: ABTestData;
}

const Chart = ({ data }: Props) => {
  const { theme, toggleTheme } = useTheme();
  const [selectedVariations, setSelectedVariations] = useState<string[]>(() =>
    data.variations.map((v) => getVariationId(v))
  );
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('day');
  const [lineStyle, setLineStyle] = useState<LineStyle>('smooth');
  const chartRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(() => {
    if (timeFrame === 'week') {
      return processWeeklyData(data.data, selectedVariations);
    }
    return processDailyData(data.data, selectedVariations);
  }, [data.data, selectedVariations, timeFrame]);

  const variationOptions = data.variations.map((v) => ({
    value: getVariationId(v),
    label: v.name,
  }));

  const ChartComponent = lineStyle === 'area' ? AreaChart : LineChart;
  const curveType = lineStyle === 'smooth' || lineStyle === 'area' ? 'monotone' : 'linear';

  return (
    <div className={styles.container} ref={chartRef}>
      <div className={styles.controls}>
        <div className={styles.leftControls}>
          <MultiSelectDropdown
            label="All variations selected"
            options={variationOptions}
            selectedValues={selectedVariations}
            onChange={setSelectedVariations}
          />
          <Dropdown
            label="Day"
            options={[
              { value: 'day', label: 'Day' },
              { value: 'week', label: 'Week' },
            ]}
            value={timeFrame}
            onChange={(value) => setTimeFrame(value as TimeFrame)}
          />
        </div>

        <div className={styles.rightControls}>
          <Dropdown
            label="Line style"
            options={[
              { value: 'line', label: 'Line style: line' },
              { value: 'smooth', label: 'Line style: smooth' },
              { value: 'area', label: 'Line style: area' },
            ]}
            value={lineStyle}
            onChange={(value) => setLineStyle(value as LineStyle)}
          />
          <div className={styles.chartControls}>
            <button className={styles.themeBtn} onClick={toggleTheme} title={theme === 'light' ? 'Dark mode' : 'Light mode'}>
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
            <button className={styles.panBtn} title="Pan">
              <PanIcon />
            </button>
            <div className={styles.zoomGroup}>
              <button className={styles.zoomBtn} title="Zoom out">
                <ZoomOutIcon />
              </button>
              <button className={styles.zoomBtn} title="Zoom in">
                <ZoomInIcon />
              </button>
            </div>
            <button className={styles.refreshBtn} title="Reset">
              <RefreshIcon />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={400}>
          <ChartComponent data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === 'dark' ? '#2A2E45' : '#f0f0f0'}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: theme === 'dark' ? '#7C7C8C' : '#8c8c8c' }}
              axisLine={{ stroke: theme === 'dark' ? '#3A3E55' : '#d9d9d9' }}
              tickLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short' });
              }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: theme === 'dark' ? '#7C7C8C' : '#8c8c8c' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              content={<CustomTooltip variations={data.variations} selectedVariations={selectedVariations} />}
            />

            {selectedVariations.map((varId) => {
              const variationIndex = data.variations.findIndex((v) => getVariationId(v) === varId);
              const color = getVariationColor(variationIndex);

              if (lineStyle === 'area') {
                return (
                  <Area
                    key={varId}
                    type={curveType}
                    dataKey={`var_${varId}`}
                    stroke={color}
                    fill={color}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                );
              }

              return (
                <Line
                  key={varId}
                  type={curveType}
                  dataKey={`var_${varId}`}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              );
            })}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
