import { type TranslationKey } from './translations';

export interface SpecItemData {
  id: string;
  labelKey: TranslationKey;
  valueKey: TranslationKey;
}

export interface MemberBioData {
  id: string;
  name: string;
  roleKey: TranslationKey;
  bioKey: TranslationKey;
  image: string;
  tags: { text?: string; translationKey?: TranslationKey }[];
}

export interface ServiceItemData {
  id: string;
  icon: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}

export interface BookingFormatData {
  id: string;
  icon: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}

export interface BookingStepData {
  step: number;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}

export interface TestimonialData {
  id: string;
  quoteKey: TranslationKey;
  authorKey: TranslationKey;
}

export interface FaqItemData {
  id: string;
  questionKey: TranslationKey;
  answerKey: TranslationKey;
}

export interface ContactFormData {
  name: string;
  email: string;
  serviceType: string;
  message: string;
}
