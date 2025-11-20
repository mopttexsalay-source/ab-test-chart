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
import DownloadIcon from '../assets/icons/download.svg?react';
import { useTheme } from '../contexts/ThemeContext';
import html2canvas from 'html2canvas';

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

  const [zoomState, setZoomState] = useState<{
    left: number | null;
    right: number | null;
  }>({ left: null, right: null });
  const [isPanning, setIsPanning] = useState(false);

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

  const zoomedData = useMemo(() => {
    if (zoomState.left === null || zoomState.right === null) {
      return chartData;
    }
    return chartData.slice(zoomState.left, zoomState.right + 1);
  }, [chartData, zoomState]);

  const handleZoomIn = () => {
    const dataLength = chartData.length;
    if (dataLength === 0) return;

    const currentLeft = zoomState.left ?? 0;
    const currentRight = zoomState.right ?? dataLength - 1;
    const range = currentRight - currentLeft;

    if (range <= 5) return;

    const newRange = Math.floor(range * 0.7);
    const center = Math.floor((currentLeft + currentRight) / 2);
    const newLeft = Math.max(0, center - Math.floor(newRange / 2));
    const newRight = Math.min(dataLength - 1, newLeft + newRange);

    setZoomState({ left: newLeft, right: newRight });
  };

  const handleZoomOut = () => {
    const dataLength = chartData.length;
    if (dataLength === 0) return;

    const currentLeft = zoomState.left ?? 0;
    const currentRight = zoomState.right ?? dataLength - 1;
    const range = currentRight - currentLeft;

    if (range >= dataLength - 1) {
      setZoomState({ left: null, right: null });
      return;
    }

    const newRange = Math.floor(range * 1.5);
    const center = Math.floor((currentLeft + currentRight) / 2);
    const newLeft = Math.max(0, center - Math.floor(newRange / 2));
    const newRight = Math.min(dataLength - 1, newLeft + newRange);

    setZoomState({ left: newLeft, right: newRight });
  };

  const handlePanLeft = () => {
    const dataLength = chartData.length;
    if (dataLength === 0) return;

    const currentLeft = zoomState.left ?? 0;
    const currentRight = zoomState.right ?? dataLength - 1;
    const range = currentRight - currentLeft;

    if (currentLeft === 0) return;

    const step = Math.max(1, Math.floor(range * 0.2));
    const newLeft = Math.max(0, currentLeft - step);
    const newRight = newLeft + range;

    setZoomState({ left: newLeft, right: newRight });
  };

  const handlePanRight = () => {
    const dataLength = chartData.length;
    if (dataLength === 0) return;

    const currentLeft = zoomState.left ?? 0;
    const currentRight = zoomState.right ?? dataLength - 1;
    const range = currentRight - currentLeft;

    if (currentRight >= dataLength - 1) return;

    const step = Math.max(1, Math.floor(range * 0.2));
    const newRight = Math.min(dataLength - 1, currentRight + step);
    const newLeft = newRight - range;

    setZoomState({ left: newLeft, right: newRight });
  };

  const handleReset = () => {
    setZoomState({ left: null, right: null });
    setIsPanning(false);
  };

  const handleExportToPNG = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: theme === 'dark' ? '#13172E' : '#ffffff',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `ab-test-chart-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to export chart:', error);
    }
  };

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
            <button className={styles.downloadBtn} onClick={handleExportToPNG} title="Download as PNG">
              <DownloadIcon />
            </button>
            {isPanning && zoomState.left !== null && zoomState.right !== null && (
              <div className={styles.panControls}>
                <button className={styles.panArrow} onClick={handlePanLeft} title="Pan left">
                  ←
                </button>
                <button className={styles.panArrow} onClick={handlePanRight} title="Pan right">
                  →
                </button>
              </div>
            )}
            <button
              className={styles.panBtn}
              onClick={() => setIsPanning(!isPanning)}
              title="Pan"
              style={{ opacity: isPanning && zoomState.left !== null && zoomState.right !== null ? 1 : 0.6 }}
            >
              <PanIcon />
            </button>
            <div className={styles.zoomGroup}>
              <button className={styles.zoomBtn} onClick={handleZoomOut} title="Zoom out">
                <ZoomOutIcon />
              </button>
              <button className={styles.zoomBtn} onClick={handleZoomIn} title="Zoom in">
                <ZoomInIcon />
              </button>
            </div>
            <button className={styles.refreshBtn} onClick={handleReset} title="Reset">
              <RefreshIcon />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={400}>
          <ChartComponent data={zoomedData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
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
