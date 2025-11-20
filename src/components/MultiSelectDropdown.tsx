import { useState, useRef, useEffect } from 'react';
import styles from './MultiSelectDropdown.module.css';
import DropdownArrow from '../assets/icons/dropdown-arrow.svg?react';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface Props {
  label: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

const MultiSelectDropdown = ({ label, options, selectedValues, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (value: string) => {
    let newValues: string[];

    if (selectedValues.includes(value)) {
      newValues = selectedValues.filter((v) => v !== value);
      if (newValues.length === 0) {
        return;
      }
    } else {
      newValues = [...selectedValues, value];
    }

    onChange(newValues);
  };

  const displayLabel =
    selectedValues.length === options.length
      ? 'All variations selected'
      : selectedValues.length === 1
      ? options.find((opt) => opt.value === selectedValues[0])?.label || label
      : `${selectedValues.length} variations selected`;

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span>{displayLabel}</span>
        <DropdownArrow className={isOpen ? styles.arrowUp : ''} />
      </button>

      {isOpen && (
        <div className={styles.menu}>
          {options.map((option) => (
            <label
              key={option.value}
              className={styles.option}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => handleToggle(option.value)}
                className={styles.checkbox}
              />
              <span className={styles.optionLabel}>{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
