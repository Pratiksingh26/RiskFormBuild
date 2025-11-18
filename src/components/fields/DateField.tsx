/**
 * Date Picker Field Component
 */

import React from 'react';
import { TextField } from '@mui/material';
import { Controller, FieldError } from 'react-hook-form';
import { DateQuestion } from '../../types/form';

interface DateFieldProps {
  question: DateQuestion;
  control?: any;
  error?: FieldError;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

/**
 * Date Picker Field Component
 * Supports date input with min/max date validation
 */
export const DateFieldComponent: React.FC<DateFieldProps> = ({
  question,
  control,
  error,
  onChange,
  disabled = false,
}) => {
  const isRequired = question.required ?? false;
  const hasError = !!error;

  return (
    <Controller<any>
      name={question.id}
      control={control}
      defaultValue=""
      rules={{
        required: isRequired ? `${question.label} is required` : false,
        validate: {
          isValidDate: (val) => {
            if (!val) return true;
            const date = new Date(val);
            return !isNaN(date.getTime()) || 'Please enter a valid date';
          },
          ...(question.minDate !== undefined && {
            minDate: (val: any) => {
              if (!val) return true;
              const date = new Date(val);
              const minDate = new Date(question.minDate!);
              return date >= minDate || `Date cannot be before ${question.minDate}`;
            },
          }),
          ...(question.maxDate !== undefined && {
            maxDate: (val: any) => {
              if (!val) return true;
              const date = new Date(val);
              const maxDate = new Date(question.maxDate!);
              return date <= maxDate || `Date cannot be after ${question.maxDate}`;
            },
          }),
        },
      }}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          label={question.label}
          placeholder={question.placeholder}
          type="date"
          variant="outlined"
          size="medium"
          disabled={disabled}
          error={hasError}
          helperText={error?.message || question.helpText}
          required={isRequired}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: question.minDate,
            max: question.maxDate,
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
          onChange={(e) => {
            field.onChange(e);
            onChange?.(e.target.value);
          }}
        />
      )}
    />
  );
};

export default DateFieldComponent;
