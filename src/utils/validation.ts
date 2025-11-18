/**
 * Validation utilities for form fields
 */

import { Question, FormValues, ConditionalLogic } from '../types/form';

/**
 * Check if a field should be visible based on conditional logic
 */
export function isFieldVisible(
  question: Question,
  formValues: FormValues
): boolean {
  if (!question.conditional) {
    return true;
  }

  const { questionId, answer, operator = 'equals' } = question.conditional;
  const currentValue = formValues[questionId];

  if (currentValue === undefined || currentValue === null || currentValue === '') {
    return false;
  }

  switch (operator) {
    case 'equals':
      if (Array.isArray(answer)) {
        return Array.isArray(currentValue)
          ? answer.some((a) => currentValue.includes(a))
          : answer.includes(currentValue);
      }
      return currentValue === answer;

    case 'includes':
      if (Array.isArray(currentValue)) {
        return Array.isArray(answer)
          ? answer.some((a) => currentValue.includes(a))
          : currentValue.includes(answer);
      }
      return String(currentValue).includes(String(answer));

    case 'greaterThan':
      return Number(currentValue) > Number(answer);

    case 'lessThan':
      return Number(currentValue) < Number(answer);

    default:
      return true;
  }
}

/**
 * Validate a single field value
 */
export function validateField(
  question: Question,
  value: any,
  isVisible: boolean
): string | null {
  // Skip validation if field is not visible
  if (!isVisible) {
    return null;
  }

  // Check if required and empty
  if (question.required && (value === undefined || value === null || value === '')) {
    return `${question.label} is required`;
  }

  // Skip further validation if not required and empty
  if (!question.required && (value === undefined || value === null || value === '')) {
    return null;
  }

  switch (question.type) {
    case 'text': {
      const textQ = question as any;
      if (textQ.minLength && value.length < textQ.minLength) {
        return `Minimum length is ${textQ.minLength} characters`;
      }
      if (textQ.maxLength && value.length > textQ.maxLength) {
        return `Maximum length is ${textQ.maxLength} characters`;
      }
      if (textQ.pattern) {
        const regex = new RegExp(textQ.pattern);
        if (!regex.test(value)) {
          return `Invalid format for ${question.label}`;
        }
      }
      break;
    }

    case 'number': {
      const numQ = question as any;
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return 'Please enter a valid number';
      }
      if (numQ.min !== undefined && numValue < numQ.min) {
        return `Minimum value is ${numQ.min}`;
      }
      if (numQ.max !== undefined && numValue > numQ.max) {
        return `Maximum value is ${numQ.max}`;
      }
      break;
    }

    case 'date': {
      const dateQ = question as any;
      const dateValue = new Date(value);
      if (isNaN(dateValue.getTime())) {
        return 'Please enter a valid date';
      }
      if (dateQ.minDate && dateValue < new Date(dateQ.minDate)) {
        return `Date cannot be before ${dateQ.minDate}`;
      }
      if (dateQ.maxDate && dateValue > new Date(dateQ.maxDate)) {
        return `Date cannot be after ${dateQ.maxDate}`;
      }
      break;
    }

    case 'file': {
      const fileQ = question as any;
      if (Array.isArray(value)) {
        // Multiple files - validate each one
        for (const file of value) {
          const fileError = validateFileUpload(file, fileQ);
          if (fileError) return fileError;
        }
      } else if (value instanceof File) {
        // Single file
        return validateFileUpload(value, fileQ);
      }
      break;
    }

    case 'select':
    case 'checkbox':
      // Basic validation - value should not be empty if required
      if (Array.isArray(value) && value.length === 0 && question.required) {
        return `Please select at least one option for ${question.label}`;
      }
      break;
  }

  // Custom validation rules
  if (question.validation && Array.isArray(question.validation)) {
    for (const rule of question.validation) {
      if (rule.type === 'custom' && rule.validate) {
        const result = rule.validate(value);
        if (result !== true) {
          return typeof result === 'string' ? result : rule.message;
        }
      }
    }
  }

  return null;
}

/**
 * Validate file upload
 */
function validateFileUpload(file: File, fileQuestion: any): string | null {
  // Check file type
  if (fileQuestion.accept) {
    const acceptedTypes = fileQuestion.accept.split(',').map((t: string) => t.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    const isAccepted = acceptedTypes.some((type: string) => {
      if (type.startsWith('.')) {
        return fileExtension.toLowerCase() === type.toLowerCase();
      }
      return file.type.includes(type);
    });

    if (!isAccepted) {
      return `File type not supported. Accepted types: ${fileQuestion.accept}`;
    }
  }

  // Check file size
  if (fileQuestion.maxSize) {
    const maxSizeBytes = fileQuestion.maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${fileQuestion.maxSize}MB limit`;
    }
  }

  return null;
}

/**
 * Validate entire form
 */
export function validateForm(
  questions: Question[],
  formValues: FormValues
): Record<string, string> {
  const errors: Record<string, string> = {};

  questions.forEach((question) => {
    const isVisible = isFieldVisible(question, formValues);
    const error = validateField(question, formValues[question.id], isVisible);
    if (error) {
      errors[question.id] = error;
    }
  });

  return errors;
}

/**
 * Get all questions that should be visible
 */
export function getVisibleQuestions(
  questions: Question[],
  formValues: FormValues
): Question[] {
  return questions.filter((question) => isFieldVisible(question, formValues));
}

/**
 * Merge conditional operator with equality check
 */
export function evaluateCondition(
  conditional: ConditionalLogic,
  currentValue: any
): boolean {
  if (!conditional) return true;

  const { answer, operator = 'equals' } = conditional;

  switch (operator) {
    case 'equals':
      return Array.isArray(answer)
        ? Array.isArray(currentValue)
          ? answer.some((a) => currentValue.includes(a))
          : answer.includes(currentValue)
        : currentValue === answer;

    case 'includes':
      return Array.isArray(currentValue)
        ? currentValue.includes(answer)
        : String(currentValue).includes(String(answer));

    case 'greaterThan':
      return Number(currentValue) > Number(answer);

    case 'lessThan':
      return Number(currentValue) < Number(answer);

    default:
      return false;
  }
}
