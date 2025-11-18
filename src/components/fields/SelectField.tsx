/**
 * Select (Dropdown) Field Component
 */

import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { Controller, FieldError } from 'react-hook-form';
import { SelectQuestion, SelectOption } from '../../types/form';

interface SelectFieldProps {
  question: SelectQuestion;
  control?: any;
  error?: FieldError;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

/**
 * Select (Dropdown) Field Component
 * Supports single and multiple selection
 */
export const SelectFieldComponent: React.FC<SelectFieldProps> = ({
  question,
  control,
  error,
  onChange,
  disabled = false,
}) => {
  const isRequired = question.required ?? false;
  const hasError = !!error;

  const getOptions = (): SelectOption[] => {
    return question.options.map((opt) =>
      typeof opt === 'string' ? { label: opt, value: opt } : opt
    );
  };

  const options = getOptions();

  return (
    <Controller
      name={question.id}
      control={control}
      defaultValue={question.multiple ? [] : ''}
      rules={{
        required: isRequired ? `${question.label} is required` : false,
        validate: {
          hasSelection: (val) =>
            question.required && (val === '' || (Array.isArray(val) && val.length === 0))
              ? `Please select an option for ${question.label}`
              : true,
        },
      }}
      render={({ field }) => (
        <FormControl fullWidth error={hasError} variant="outlined" required={isRequired}>
          <InputLabel
            id={`${question.id}-label`}
            sx={{
              color: hasError ? 'error.main' : undefined,
            }}
          >
            {question.label}
          </InputLabel>
          <Select
            {...field}
            labelId={`${question.id}-label`}
            id={question.id}
            label={question.label}
            disabled={disabled}
            multiple={question.multiple}
            value={field.value || (question.multiple ? [] : '')}
            onChange={(e) => {
              field.onChange(e);
              onChange?.(e.target.value as string);
            }}
            inputProps={{
              'aria-label': question.label,
              'aria-required': isRequired,
              'aria-describedby': question.helpText
                ? `${question.id}-helper-text`
                : undefined,
            }}
            sx={{
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: hasError ? 'error.main' : 'primary.main',
              },
            }}
          >
            {question.placeholder && (
              <MenuItem value="" disabled>
                {question.placeholder}
              </MenuItem>
            )}
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {hasError ? (
            <FormHelperText error>{error?.message}</FormHelperText>
          ) : question.helpText ? (
            <FormHelperText id={`${question.id}-helper-text`}>
              {question.helpText}
            </FormHelperText>
          ) : null}
        </FormControl>
      )}
    />
  );
};

export default SelectFieldComponent;
