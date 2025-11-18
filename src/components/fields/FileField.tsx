/**
 * File Upload Field Component
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  FormHelperText,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { Controller, FieldError } from 'react-hook-form';
import { FileQuestion } from '../../types/form';

interface FileFieldProps {
  question: FileQuestion;
  control?: any;
  error?: FieldError;
  value?: File[];
  onChange?: (value: File[]) => void;
  disabled?: boolean;
}

interface FileUploadState {
  loading: boolean;
  error: string | null;
}

/**
 * File Upload Field Component
 * Supports PDF file upload with size validation
 */
export const FileFieldComponent: React.FC<FileFieldProps> = ({
  question,
  control,
  error,
  onChange,
  disabled = false,
}) => {
  const isRequired = question.required ?? false;
  const hasError = !!error;
  const [uploadState, setUploadState] = useState<FileUploadState>({
    loading: false,
    error: null,
  });

  const validateFile = (file: File): string | null => {
    // Check file type
    if (question.accept) {
      const acceptedTypes = question.accept.split(',').map((t) => t.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith('.')) {
          return fileExtension.toLowerCase() === type.toLowerCase();
        }
        return file.type.includes(type);
      });
      if (!isAccepted) {
        return `File type not supported. Accepted types: ${question.accept}`;
      }
    }

    // Check file size
    if (question.maxSize) {
      const maxSizeBytes = question.maxSize * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return `File size exceeds ${question.maxSize}MB limit`;
      }
    }

    return null;
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    currentFiles: File[],
    onChange: (files: File[]) => void
  ) => {
    if (!e.target.files) return;

    setUploadState({ loading: true, error: null });

    try {
      const newFiles = Array.from(e.target.files);
      const validationErrors: string[] = [];

      // Validate each file
      for (const file of newFiles) {
        const error = validateFile(file);
        if (error) {
          validationErrors.push(error);
        }
      }

      if (validationErrors.length > 0) {
        setUploadState({
          loading: false,
          error: validationErrors.join('; '),
        });
        return;
      }

      // Add files to existing files
      const updatedFiles = question.multiple
        ? [...currentFiles, ...newFiles]
        : newFiles;

      onChange(updatedFiles);
      setUploadState({ loading: false, error: null });

      // Reset input
      e.target.value = '';
    } catch (err) {
      setUploadState({
        loading: false,
        error: 'Failed to upload file',
      });
    }
  };

  const handleRemoveFile = (
    index: number,
    currentFiles: File[],
    onChange: (files: File[]) => void
  ) => {
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Controller<any>
      name={question.id}
      control={control}
      defaultValue={[] as File[]}
      rules={{
        validate: {
          required: (val) =>
            isRequired && (!val || val.length === 0)
              ? `${question.label} is required`
              : true,
        },
      }}
      render={({ field }) => (
        <Box sx={{ width: '100%' }}>
          <Typography
            component="label"
            sx={{
              display: 'block',
              mb: 1,
              fontSize: '0.875rem',
              fontWeight: 500,
              color: hasError ? 'error.main' : 'text.primary',
            }}
            htmlFor={question.id}
          >
            {question.label}
            {isRequired && <span style={{ color: '#d32f2f' }}> *</span>}
          </Typography>

          <input
            id={question.id}
            type="file"
            multiple={question.multiple}
            accept={question.accept}
            disabled={disabled || uploadState.loading}
            onChange={(e) =>
              handleFileInputChange(e, field.value || [], (files) => {
                field.onChange(files);
                onChange?.(files);
              })
            }
            style={{ display: 'none' }}
            aria-label={question.label}
            aria-required={isRequired}
          />

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mb: 2,
            }}
          >
            <Button
              component="label"
              htmlFor={question.id}
              variant="outlined"
              startIcon={
                uploadState.loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <CloudUploadIcon />
                )
              }
              disabled={disabled || uploadState.loading}
            >
              Choose File{question.multiple ? 's' : ''}
            </Button>
            {question.maxSize && (
              <FormHelperText sx={{ display: 'flex', alignItems: 'center' }}>
                Max {question.maxSize}MB
              </FormHelperText>
            )}
          </Box>

          {uploadState.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {uploadState.error}
            </Alert>
          )}

          {hasError && (
            <FormHelperText error sx={{ mb: 2 }}>
              {error?.message}
            </FormHelperText>
          )}

          {field.value && field.value.length > 0 && (
            <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
              {field.value.map((file: File, index: number) => (
                <ListItem
                  key={`${file.name}-${index}`}
                  sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <ListItemText
                    primary={file.name}
                    secondary={formatFileSize(file.size)}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() =>
                        handleRemoveFile(index, field.value || [], (files) => {
                          field.onChange(files);
                          onChange?.(files);
                        })
                      }
                      disabled={disabled}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}

          {question.helpText && !hasError && (
            <FormHelperText
              id={`${question.id}-helper-text`}
              sx={{ mt: 1 }}
            >
              {question.helpText}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
};

export default FileFieldComponent;
