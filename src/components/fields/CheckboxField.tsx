/**
 * Checkbox (Multi-select) Field Component
 */

import React from 'react';
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormHelperText,
  Typography,
} from '@mui/material';
import { Controller, FieldError } from 'react-hook-form';
import { CheckboxQuestion, CheckboxOption } from '../../types/form';

interface CheckboxFieldProps {
  question: CheckboxQuestion;
  control?: any;
  error?: FieldError;
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
}

/**
 * Checkbox (Multi-select) Field Component
 * Supports multiple selection with visual feedback
 */
export const CheckboxFieldComponent: React.FC<CheckboxFieldProps> = ({
  question,
  control,
  error,
  onChange,
  disabled = false,
}) => {
  const isRequired = question.required ?? false;
  const hasError = !!error;

  const getOptions = (): CheckboxOption[] => {
    return question.options.map((opt) =>
      typeof opt === 'string' ? { label: opt, value: opt } : opt
    );
  };

  const options = getOptions();

  return (
    <Controller<any>
      name={question.id}
      control={control}
      defaultValue={[] as string[]}
      rules={{
        validate: {
          hasSelection: (val: any) =>
            isRequired && (!Array.isArray(val) || val.length === 0)
              ? `Please select at least one option for ${question.label}`
              : true,
        },
      }}
      render={({ field }) => (
        <FormControl
          component="fieldset"
          error={hasError}
          disabled={disabled}
          fullWidth
          required={isRequired}
        >
          <Typography
            component="legend"
            sx={{
              fontSize: '0.875rem',
              fontWeight: 500,
              mb: 1,
              color: hasError ? 'error.main' : 'text.primary',
            }}
          >
            {question.label}
            {isRequired && <span style={{ color: '#d32f2f' }}> *</span>}
          </Typography>
          <FormGroup
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const checked = e.target.checked;
              const newValue = checked
                ? [...(field.value || []), e.target.value]
                : (field.value || []).filter((v: string) => v !== e.target.value);
              field.onChange(newValue);
              onChange?.(newValue);
            }}
            row={options.length > 2}
            sx={{
              '& .MuiFormControlLabel-root': {
                mr: options.length > 2 ? 2 : 0,
                mb: options.length > 2 ? 0 : 1,
              },
            }}
          >
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    value={option.value}
                    checked={Array.isArray(field.value) && field.value.includes(option.value)}
                    disabled={disabled}
                    inputProps={{
                      'aria-label': option.label,
                      'aria-required': isRequired,
                    }}
                  />
                }
                label={option.label}
              />
            ))}
          </FormGroup>
          {hasError ? (
            <FormHelperText error sx={{ mt: 1 }}>
              {error?.message}
            </FormHelperText>
          ) : question.helpText ? (
            <FormHelperText sx={{ mt: 1 }}>
              {question.helpText}
            </FormHelperText>
          ) : null}
        </FormControl>
      )}
    />
  );
};

export default CheckboxFieldComponent;
