import { format, parseISO, isValid } from 'date-fns';

export const formatCurrency = (value, decimals = 2) => {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatPct = (value, decimals = 2) => {
  if (value === null || value === undefined) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${Number(value).toFixed(decimals)}%`;
};

export const formatDate = (dateStr, fmt = 'MMM d, yyyy') => {
  if (!dateStr) return '—';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    return isValid(date) ? format(date, fmt) : dateStr;
  } catch {
    return dateStr;
  }
};

export const formatDateShort = (dateStr) => formatDate(dateStr, 'MMM d');

export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined) return '—';
  return Number(value).toFixed(decimals);
};

export const colorClass = (value, positiveClass = 'text-profit', negativeClass = 'text-loss') => {
  if (value > 0) return positiveClass;
  if (value < 0) return negativeClass;
  return 'text-secondary';
};
