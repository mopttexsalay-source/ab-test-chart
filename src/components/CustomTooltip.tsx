import type { Variation } from '../types/data';
import { getVariationId, getVariationColor } from '../utils/dataProcessing';
import styles from './CustomTooltip.module.css';
import CalendarIcon from '../assets/icons/calendar.svg?react';
import TrophyIcon from '../assets/icons/trophy.svg?react';

interface Props {
  active?: boolean;
  payload?: Array<{
    value?: number;
    dataKey?: string;
  }>;
  label?: string;
  variations: Variation[];
  selectedVariations: string[];
}

const CustomTooltip = ({ active, payload, label, variations }: Props) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const sortedPayload = [...payload].sort((a, b) => {
    const aValue = typeof a.value === 'number' ? a.value : 0;
    const bValue = typeof b.value === 'number' ? b.value : 0;
    return bValue - aValue;
  });

  const bestValue = sortedPayload[0]?.value;

  return (
    <div className={styles.tooltip}>
      <div className={styles.header}>
        <CalendarIcon />
        <span className={styles.date}>
          {label && new Date(label).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </span>
      </div>

      <div className={styles.content}>
        {sortedPayload.map((entry) => {
          const varId = entry.dataKey?.toString().replace('var_', '') || '';
          const variation = variations.find((v) => getVariationId(v) === varId);
          const variationIndex = variations.findIndex((v) => getVariationId(v) === varId);
          const isBest = entry.value === bestValue;

          return (
            <div key={varId} className={styles.item}>
              <div className={styles.left}>
                <span
                  className={styles.bullet}
                  style={{ backgroundColor: getVariationColor(variationIndex) }}
                />
                <span className={styles.name}>{variation?.name}</span>
                {isBest && <TrophyIcon className={styles.trophy} />}
              </div>
              <span className={styles.value}>
                {typeof entry.value === 'number' ? entry.value.toFixed(2) : '0.00'}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomTooltip;
