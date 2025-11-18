/**
 * Type definitions for Dynamic Risk Assessment Form Builder
 */

/**
 * Conditional display logic for a field
 */
export interface ConditionalLogic {
  questionId: string;
  answer: string | string[] | number | boolean;
  operator?: 'equals' | 'includes' | 'greaterThan' | 'lessThan';
}

/**
 * Base question type with common properties
 */
export interface BaseQuestion {
  id: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'file' | 'date';
  label: string;
  required?: boolean;
  riskWeight?: number;
  helpText?: string;
  conditional?: ConditionalLogic;
  validation?: ValidationRule[];
}

/**
 * Text input field
 */
export interface TextQuestion extends BaseQuestion {
  type: 'text';
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

/**
 * Number input field
 */
export interface NumberQuestion extends BaseQuestion {
  type: 'number';
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Select (dropdown) field
 */
export interface SelectQuestion extends BaseQuestion {
  type: 'select';
  options: string[] | SelectOption[];
  placeholder?: string;
  multiple?: boolean;
}

/**
 * Option for select fields
 */
export interface SelectOption {
  label: string;
  value: string;
  riskValue?: number;
}

/**
 * Checkbox (multi-select) field
 */
export interface CheckboxQuestion extends BaseQuestion {
  type: 'checkbox';
  options: string[] | CheckboxOption[];
}

/**
 * Option for checkbox fields
 */
export interface CheckboxOption {
  label: string;
  value: string;
  riskValue?: number;
}

/**
 * File upload field
 */
export interface FileQuestion extends BaseQuestion {
  type: 'file';
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
}

/**
 * Date picker field
 */
export interface DateQuestion extends BaseQuestion {
  type: 'date';
  minDate?: string; // ISO format
  maxDate?: string; // ISO format;
  placeholder?: string;
}

/**
 * Union type for all question types
 */
export type Question = TextQuestion | NumberQuestion | SelectQuestion | CheckboxQuestion | FileQuestion | DateQuestion;

/**
 * Validation rule for custom validation
 */
export interface ValidationRule {
  type: 'custom' | 'pattern' | 'min' | 'max' | 'required';
  message: string;
  value?: string | number | RegExp;
  validate?: (value: any) => boolean | string;
}

/**
 * Form section containing multiple questions
 */
export interface Section {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  collapsible?: boolean;
}

/**
 * Complete form configuration
 */
export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  sections: Section[];
  submitText?: string;
  maxRiskScore?: number;
}

/**
 * Form field values (dynamic key-value pairs)
 */
export interface FormValues {
  [key: string]: any;
}

/**
 * Risk score breakdown by section
 */
export interface RiskScoreBreakdown {
  [sectionId: string]: {
    score: number;
    maxScore: number;
    percentage: number;
  };
}

/**
 * Risk score calculation result
 */
export interface RiskScore {
  totalScore: number;
  maxScore: number;
  percentage: number;
  level: 'Low' | 'Medium' | 'High' | 'Critical';
  breakdown: RiskScoreBreakdown;
}

/**
 * File upload metadata
 */
export interface FileUploadMeta {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

/**
 * Form submission result
 */
export interface FormSubmissionResult {
  success: boolean;
  message: string;
  data?: FormValues;
  riskScore?: RiskScore;
  errors?: Record<string, string>;
}

/**
 * Auto-save state
 */
export interface AutoSaveState {
  lastSavedAt: string;
  isDraft: boolean;
  draftId: string;
}

/**
 * Form state for persistence
 */
export interface PersistedFormState {
  formId: string;
  values: FormValues;
  autoSave: AutoSaveState;
  timestamp: string;
}
