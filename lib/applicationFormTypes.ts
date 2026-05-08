import type { ReactNode } from "react";

export type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export type LabelFieldProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};
