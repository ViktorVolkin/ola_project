import { test, expect } from 'vitest';
import { isValidDateString } from '@/components/widgets/BouquetDetailPreferences/BouquetDetailPreferences';

test('empty string is valid', () => {
  expect(isValidDateString('')).toBe(true);
  expect(isValidDateString('   ')).toBe(false);
});

test('valid DD.MM.YYYY dates', () => {
  expect(isValidDateString('01.01.2026')).toBe(true);
  expect(isValidDateString('31.12.2026')).toBe(true);
  expect(isValidDateString('29.02.2024')).toBe(true); // leap year
  expect(isValidDateString('29.02.2020')).toBe(true); // leap year
  expect(isValidDateString('29.02.2000')).toBe(true); // century leap year
});

test('invalid month', () => {
  expect(isValidDateString('01.00.2026')).toBe(false);
  expect(isValidDateString('01.13.2026')).toBe(false);
});

test('invalid day for month', () => {
  expect(isValidDateString('00.01.2026')).toBe(false);
  expect(isValidDateString('32.01.2026')).toBe(false);
  expect(isValidDateString('31.04.2026')).toBe(false); // April has 30
  expect(isValidDateString('31.06.2026')).toBe(false); // June has 30
  expect(isValidDateString('31.09.2026')).toBe(false); // September has 30
  expect(isValidDateString('31.11.2026')).toBe(false); // November has 30
});

test('February non-leap year', () => {
  expect(isValidDateString('29.02.2026')).toBe(false);
  expect(isValidDateString('29.02.2025')).toBe(false);
  expect(isValidDateString('29.02.2023')).toBe(false);
});

test('February leap year valid', () => {
  expect(isValidDateString('29.02.2024')).toBe(true);
  expect(isValidDateString('29.02.2020')).toBe(true);
});

test('century leap year rules', () => {
  expect(isValidDateString('29.02.2000')).toBe(true); // divisible by 400
  expect(isValidDateString('29.02.1900')).toBe(false); // divisible by 100 but not 400
  expect(isValidDateString('29.02.2100')).toBe(false);
});

test('malformed format', () => {
  expect(isValidDateString('2026/01/01')).toBe(false);
  expect(isValidDateString('01-01-2026')).toBe(false);
  expect(isValidDateString('1.1.2026')).toBe(false);
  expect(isValidDateString('01.01.26')).toBe(false);
  expect(isValidDateString('bad-date')).toBe(false);
  expect(isValidDateString('45.13.2026')).toBe(false);
  expect(isValidDateString('not-a-date')).toBe(false);
});

test('past dates are valid (no min constraint)', () => {
  expect(isValidDateString('01.01.2000')).toBe(true);
  expect(isValidDateString('01.01.1900')).toBe(true);
  expect(isValidDateString('01.01.0099')).toBe(true);
  expect(isValidDateString('29.02.0001')).toBe(false);
});