import React, { createContext, useContext, useState, useEffect } from 'react';

const DateRangeContext = createContext();

export const DATE_RANGES = [
  { id: '7d', label: '7D', fullLabel: 'Last 7 Days', days: 7 },
  { id: '30d', label: '30D', fullLabel: 'Last 30 Days', days: 30 },
  { id: '90d', label: '90D', fullLabel: 'Quarter (90D)', days: 90 },
  { id: 'all', label: '1Y', fullLabel: 'Trailing 1 Year', days: 365 },
];

export function DateRangeProvider({ children }) {
  const [dateRange, setDateRange] = useState(() => {
    try {
      return localStorage.getItem('twinora_date_range') || '30d';
    } catch {
      return '30d';
    }
  });

  const updateDateRange = (newRange) => {
    setDateRange(newRange);
    try {
      localStorage.setItem('twinora_date_range', newRange);
    } catch {}
  };

  const activeRangeObj = DATE_RANGES.find(r => r.id === dateRange) || DATE_RANGES[1];

  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange: updateDateRange, activeRangeObj, DATE_RANGES }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (!context) {
    return {
      dateRange: '30d',
      setDateRange: () => {},
      activeRangeObj: DATE_RANGES[1],
      DATE_RANGES
    };
  }
  return context;
}
