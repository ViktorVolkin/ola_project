'use client';

import { useState, useId } from 'react';
import Image from 'next/image';
import styles from './BouquetDetailPreferences.module.css';

export type FullnessValue = 'standard' | 'medium' | 'large';
export type ExtraKey = 'balloons' | 'chocolates' | 'greetingCard';

export type PreferencesState = Readonly<{
  fullness: FullnessValue;
  extras: Readonly<Record<ExtraKey, boolean>>;
  preferredDate: string;
  cardMessage: string;
}>;

export type PreferencesProps = Readonly<{
  initialState?: Partial<PreferencesState>;
  labels: Readonly<{
    fullnessLegend: string;
    fullnessHelper: string;
    fullnessOptions: Readonly<Record<FullnessValue, string>>;
    extrasLegend: string;
    extraLabels: Readonly<Record<ExtraKey, string>>;
    dateLegend: string;
    datePlaceholder: string;
    dateFormatError: string;
    messageLegend: string;
    messagePlaceholder: string;
  }>;
  fullnessImages: ReadonlyArray<Readonly<{ src: string; alt: string }>>;
  extraImages: ReadonlyArray<Readonly<{ src: string; alt: string }>>;
}>;

const FULLNESS_OPTIONS: readonly FullnessValue[] = ['standard', 'medium', 'large'];
const EXTRA_KEYS: readonly ExtraKey[] = ['balloons', 'chocolates', 'greetingCard'];

export function isValidDateString(value: string): boolean {
  if (value === '') return true;
  const m = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return false;
  const [, d, mo, y] = m;
  const day = Number(d);
  const month = Number(mo);
  const year = Number(y);
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function BouquetDetailPreferences({
  initialState = {},
  labels,
  fullnessImages,
  extraImages,
}: PreferencesProps) {
  const [fullness, setFullness] = useState<FullnessValue>(initialState.fullness ?? 'standard');
  const [extras, setExtras] = useState<Record<ExtraKey, boolean>>(
    initialState.extras ?? { balloons: false, chocolates: false, greetingCard: false }
  );
  const [preferredDate, setPreferredDate] = useState<string>(initialState.preferredDate ?? '');
  const [cardMessage, setCardMessage] = useState<string>(initialState.cardMessage ?? '');
  const [dateError, setDateError] = useState<boolean>(false);

  const fullnessGroupId = useId();
  const extrasGroupId = useId();

  const handleDateBlur = () => {
    setDateError(!isValidDateString(preferredDate));
  };

  const handleDateChange = (value: string) => {
    setPreferredDate(value);
    if (dateError && isValidDateString(value)) {
      setDateError(false);
    }
  };

  return (
    <section className={styles.preferences} aria-labelledby={fullnessGroupId}>
      {/* Fullness — native radio group */}
      <fieldset className={styles.fieldset} aria-labelledby={fullnessGroupId}>
        <legend id={fullnessGroupId} className={styles.legend}>
          {labels.fullnessLegend}
        </legend>
        <p className={styles.helper}>{labels.fullnessHelper}</p>
        <div className={styles.fullnessRow} role="radiogroup" aria-labelledby={fullnessGroupId}>
          {FULLNESS_OPTIONS.map((value, index) => (
            <label key={value} className={styles.fullnessOption}>
              <input
                type="radio"
                name={fullnessGroupId}
                value={value}
                checked={fullness === value}
                onChange={() => setFullness(value)}
                className={styles.radioInput}
              />
              <span className={styles.radioLabel}>
                <Image
                  src={fullnessImages[index]?.src ?? ''}
                  alt=""
                  width={186}
                  height={176}
                  className={styles.radioImage}
                />
                <span className={styles.radioCaption}>
                  <span className={styles.radioMark} aria-hidden="true" />
                  <span className={styles.radioLabelText}>{labels.fullnessOptions[value]}</span>
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Extras — independent checkboxes */}
      <fieldset className={styles.fieldset} aria-labelledby={extrasGroupId}>
        <legend id={extrasGroupId} className={styles.legend}>
          {labels.extrasLegend}
        </legend>
        <div className={styles.extrasRow} role="group" aria-labelledby={extrasGroupId}>
          {EXTRA_KEYS.map((key, index) => (
            <label key={key} className={styles.extraOption}>
              <input
                type="checkbox"
                checked={extras[key]}
                onChange={() =>
                  setExtras((prev) => ({ ...prev, [key]: !prev[key] }))
                }
                className={styles.checkboxInput}
              />
              <span className={styles.checkboxLabel}>
                <Image
                  src={extraImages[index]?.src ?? ''}
                  alt=""
                  width={188}
                  height={104}
                  className={styles.checkboxImage}
                />
                <span className={styles.checkboxLabelText}>{labels.extraLabels[key]}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Preferred date — optional, native date input with custom format */}
      <div className={styles.fieldWrapper}>
        <label htmlFor="preferred-date" className={styles.fieldLabel}>
          {labels.dateLegend}
        </label>
        <input
          id="preferred-date"
          type="text"
          placeholder={labels.datePlaceholder}
          value={preferredDate}
          onChange={(e) => handleDateChange(e.target.value)}
          onBlur={handleDateBlur}
          className={`${styles.fieldInput} ${dateError ? styles.fieldError : ''}`}
          aria-invalid={dateError}
          aria-describedby={dateError ? 'date-error' : undefined}
        />
        {dateError && (
          <p id="date-error" className={styles.errorMessage} role="alert">
            {labels.dateFormatError}
          </p>
        )}
      </div>

      {/* Card message — optional, independent of greeting card checkbox */}
      <div className={styles.fieldWrapper}>
        <label htmlFor="card-message" className={styles.fieldLabel}>
          {labels.messageLegend}
        </label>
        <textarea
          id="card-message"
          placeholder={labels.messagePlaceholder}
          value={cardMessage}
          onChange={(e) => setCardMessage(e.target.value)}
          className={styles.fieldTextarea}
          rows={4}
        />
      </div>
    </section>
  );
}