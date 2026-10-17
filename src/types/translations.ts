import { type en } from '../i18n/en';

export type Language = 'es' | 'en';

export type TranslationKey = keyof typeof en;

export type Translations = Record<TranslationKey, string>;
