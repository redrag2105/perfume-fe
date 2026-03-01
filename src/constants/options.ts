// Dropdown options and select values
import type { ConcentrationType, TargetAudienceType } from '@/types';

export interface SelectOption<T = string> {
  value: T;
  label: string;
}

export const CONCENTRATION_OPTIONS: SelectOption<ConcentrationType>[] = [
  { value: 'EDP', label: 'Eau de Parfum' },
  { value: 'EDT', label: 'Eau de Toilette' },
  { value: 'Extrait', label: 'Extrait de Parfum' },
  { value: 'Cologne', label: 'Cologne' },
];

export const TARGET_AUDIENCE_OPTIONS: SelectOption<TargetAudienceType>[] = [
  { value: 'unisex', label: 'Unisex' },
  { value: 'male', label: 'Masculine' },
  { value: 'female', label: 'Feminine' },
];

export const GENDER_OPTIONS: SelectOption<string>[] = [
  { value: 'true', label: 'Male' },
  { value: 'false', label: 'Female' },
];
