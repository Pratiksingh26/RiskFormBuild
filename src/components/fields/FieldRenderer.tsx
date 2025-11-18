/**
 * Field Renderer Component
 * Dynamically renders the appropriate field component based on question type
 */

import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { FieldError } from 'react-hook-form';
import { Question, FormValues } from '../../types/form';
import { isFieldVisible } from '../../utils/validation';
import TextFieldComponent from './TextField';
import NumberFieldComponent from './NumberField';
import SelectFieldComponent from './SelectField';
import CheckboxFieldComponent from './CheckboxField';
import DateFieldComponent from './DateField';
import FileFieldComponent from './FileField';

interface FieldRendererProps {
  question: Question;
  control?: any;
  errors?: Record<string, FieldError | undefined>;
  formValues: FormValues;
  disabled?: boolean;
  isLoading?: boolean;
}

/**
 * Field Renderer Component
 * Renders appropriate field based on question type and visibility conditions
 */
export const FieldRenderer: React.FC<FieldRendererProps> = ({
  question,
  control,
  errors,
  formValues,
  disabled = false,
  isLoading = false,
}) => {
  // Check if field should be visible
  if (!isFieldVisible(question, formValues)) {
    return null;
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  const error = errors?.[question.id];

  const fieldProps = {
    control,
    error,
    disabled: disabled || isLoading,
    value: formValues[question.id],
  };

  switch (question.type) {
    case 'text':
      return <TextFieldComponent {...fieldProps} question={question as any} />;

    case 'number':
      return <NumberFieldComponent {...fieldProps} question={question as any} />;

    case 'select':
      return <SelectFieldComponent {...fieldProps} question={question as any} />;

    case 'checkbox':
      return <CheckboxFieldComponent {...fieldProps} question={question as any} />;

    case 'date':
      return <DateFieldComponent {...fieldProps} question={question as any} />;

    case 'file':
      return <FileFieldComponent {...fieldProps} question={question as any} />;

    default:
      return null;
  }
};

export default FieldRenderer;
