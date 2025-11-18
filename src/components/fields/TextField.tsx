/**
 * Text Input Field Component
 */

import React from 'react';
import {
  TextField,
  Box,
  FormHelperText,
} from '@mui/material';
import { Controller, FieldValues, UseFormRegister, FieldError } from 'react-hook-form';
import { TextQuestion } from '../../types/form';

interface TextFieldProps {
  question: TextQuestion;
  control?: any;
  register?: UseFormRegister<FieldValues>;
  error?: FieldError;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

/**
 * Text Input Field Component
 * Supports text input with validation rules like minLength, maxLength, and pattern
 */
export const TextFieldComponent: React.FC<TextFieldProps> = ({
  question,
  control,
  register,
  error,
  value,
  onChange,
  disabled = false,
}) => {
  const isRequired = question.required ?? false;
  const hasError = !!error;

  const renderWithController = () => (
    <Controller
      name={question.id}
      control={control}
      defaultValue=""
      rules={{
        required: isRequired ? `${question.label} is required` : false,
        minLength:
          question.minLength !== undefined
            ? {
                value: question.minLength,
                message: `Minimum length is ${question.minLength} characters`,
              }
            : undefined,
        maxLength:
          question.maxLength !== undefined
            ? {
                value: question.maxLength,
                message: `Maximum length is ${question.maxLength} characters`,
              }
            : undefined,
        pattern:
          question.pattern !== undefined
            ? {
                value: new RegExp(question.pattern),
                message: `Invalid format for ${question.label}`,
              }
            : undefined,
      }}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          label={question.label}
          placeholder={question.placeholder}
          variant="outlined"
          size="medium"
          disabled={disabled}
          error={hasError}
          helperText={error?.message || question.helpText}
          required={isRequired}
          inputProps={{
            maxLength: question.maxLength,
            'aria-label': question.label,
            'aria-required': isRequired,
            'aria-describedby': question.helpText
              ? `${question.id}-helper-text`
              : undefined,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: hasError ? 'error.main' : 'primary.main',
              },
            },
          }}
        />
      )}
    />
  );

  const renderUncontrolled = () => (
    <TextField
      {...(register ? register(question.id, {
        required: isRequired ? `${question.label} is required` : false,
        minLength:
          question.minLength !== undefined
            ? {
                value: question.minLength,
                message: `Minimum length is ${question.minLength} characters`,
              }
            : undefined,
        maxLength:
          question.maxLength !== undefined
            ? {
                value: question.maxLength,
                message: `Maximum length is ${question.maxLength} characters`,
              }
            : undefined,
        pattern:
          question.pattern !== undefined
            ? {
                value: new RegExp(question.pattern),
                message: `Invalid format for ${question.label}`,
              }
            : undefined,
      }) : {})}
      fullWidth
      label={question.label}
      placeholder={question.placeholder}
      variant="outlined"
      size="medium"
      disabled={disabled}
      error={hasError}
      helperText={error?.message || question.helpText}
      required={isRequired}
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      inputProps={{
        maxLength: question.maxLength,
        'aria-label': question.label,
        'aria-required': isRequired,
        'aria-describedby': question.helpText
          ? `${question.id}-helper-text`
          : undefined,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': {
            borderColor: hasError ? 'error.main' : 'primary.main',
          },
        },
      }}
    />
  );

  return (
    <Box sx={{ width: '100%' }}>
      {control ? renderWithController() : renderUncontrolled()}
      {question.helpText && !hasError && (
        <FormHelperText id={`${question.id}-helper-text`} sx={{ mt: 0.5 }}>
          {question.helpText}
        </FormHelperText>
      )}
      {question.maxLength && (
        <FormHelperText sx={{ mt: 0.5 }}>
          {value?.length || 0}/{question.maxLength}
        </FormHelperText>
      )}
    </Box>
  );
};

export default TextFieldComponent;
