export type LocaleCode = "id" | "en" | "zh";

export interface LegalSection {
  /** Nomor/label opsional, mis. "1", "3.2" */
  number?: string;
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LegalDocument {
  title: string;
  metaDesc: string;
  intro: string[];
  sections: LegalSection[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqDocument {
  title: string;
  metaDesc: string;
  intro: string;
  items: FaqItem[];
}

export type Localized<T> = Record<LocaleCode, T>;
