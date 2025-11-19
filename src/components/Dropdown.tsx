import { useState, useRef, useEffect } from 'react';
import styles from './Dropdown.module.css';
import DropdownArrow from '../assets/icons/dropdown-arrow.svg?react';

interface DropdownOption {
  value: string;
  label: string;
}

interface Props {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
}

const Dropdown = ({ label, options, value, onChange }: Props) => {
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

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span>{selectedOption?.label || label}</span>
        <DropdownArrow className={isOpen ? styles.arrowUp : ''} />
      </button>

      {isOpen && (
        <div className={styles.menu}>
          {options.map((option) => (
            <button
              key={option.value}
              className={`${styles.option} ${
                option.value === value ? styles.selected : ''
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
