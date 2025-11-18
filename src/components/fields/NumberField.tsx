/**
 * Number Input Field Component
 */

import React from 'react';
import {
  TextField,
  Box,
  FormHelperText,
} from '@mui/material';
import { Controller, FieldValues, UseFormRegister, FieldError } from 'react-hook-form';
import { NumberQuestion } from '../../types/form';

interface NumberFieldProps {
  question: NumberQuestion;
  control?: any;
  register?: UseFormRegister<FieldValues>;
  error?: FieldError;
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

/**
 * Number Input Field Component
 * Supports number input with validation rules like min, max, and step
 */
export const NumberFieldComponent: React.FC<NumberFieldProps> = ({
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
        validate: {
          isNumber: (val) =>
            val === '' || !isNaN(Number(val)) || 'Please enter a valid number',
          ...(question.min !== undefined && {
            minValue: (val) =>
              val === '' || Number(val) >= question.min!
                ? true
                : `Minimum value is ${question.min}`,
          }),
          ...(question.max !== undefined && {
            maxValue: (val) =>
              val === '' || Number(val) <= question.max!
                ? true
                : `Maximum value is ${question.max}`,
          }),
        },
      }}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          label={question.label}
          placeholder={question.placeholder}
          type="number"
          variant="outlined"
          size="medium"
          disabled={disabled}
          error={hasError}
          helperText={error?.message || question.helpText}
          required={isRequired}
          inputProps={{
            step: question.step || 1,
            min: question.min,
            max: question.max,
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
        validate: {
          isNumber: (val) =>
            val === '' || !isNaN(Number(val)) || 'Please enter a valid number',
          ...(question.min !== undefined && {
            minValue: (val) =>
              val === '' || Number(val) >= question.min!
                ? true
                : `Minimum value is ${question.min}`,
          }),
          ...(question.max !== undefined && {
            maxValue: (val) =>
              val === '' || Number(val) <= question.max!
                ? true
                : `Maximum value is ${question.max}`,
          }),
        },
      }) : {})}
      fullWidth
      label={question.label}
      placeholder={question.placeholder}
      type="number"
      variant="outlined"
      size="medium"
      disabled={disabled}
      error={hasError}
      helperText={error?.message || question.helpText}
      required={isRequired}
      value={value !== undefined ? value : ''}
      onChange={(e) => onChange?.(Number(e.target.value))}
      inputProps={{
        step: question.step || 1,
        min: question.min,
        max: question.max,
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
      {question.min !== undefined && question.max !== undefined && (
        <FormHelperText sx={{ mt: 0.5 }}>
          Range: {question.min} - {question.max}
        </FormHelperText>
      )}
    </Box>
  );
};

export default NumberFieldComponent;
