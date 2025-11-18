/**
 * Main Risk Assessment Form Component
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  Container,
  Box,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as MuiTextField,
  LinearProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  GetApp as DownloadIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { FormConfig, FormValues, RiskScore } from '../types/form';
import { calculateRiskScore } from '../utils/riskCalculation';
import { validateForm, getVisibleQuestions } from '../utils/validation';
import { saveFormState, loadFormState, saveDraft, getDraftsList, loadDraft } from '../utils/storage';
import FieldRenderer from './fields/FieldRenderer';
import RiskScoreDisplay from './RiskScoreDisplay';

interface RiskAssessmentFormProps {
  config: FormConfig;
  onSubmit?: (values: FormValues, riskScore: RiskScore) => Promise<void>;
  onAutoSave?: (values: FormValues) => void;
  autoSaveInterval?: number; // in milliseconds
  showRiskScore?: boolean;
  showAutoSave?: boolean;
  enableDrafts?: boolean;
}

interface FormState {
  values: FormValues;
  errors: Record<string, any>;
  isDirty: boolean;
  isSubmitting: boolean;
  lastSavedAt: string | null;
}

/**
 * Main Risk Assessment Form Component
 * Handles form rendering, validation, risk calculation, and auto-save
 */
export const RiskAssessmentForm: React.FC<RiskAssessmentFormProps> = ({
  config,
  onSubmit,
  onAutoSave,
  autoSaveInterval = 30000, // 30 seconds
  showRiskScore = true,
  showAutoSave = true,
  enableDrafts = true,
}) => {
  const { control, handleSubmit, watch, formState: { errors }, setValue } = useForm<any>({
    defaultValues: {},
    mode: 'onChange',
  });

  const formValues = watch();
  const [formState, setFormState] = useState<FormState>({
    values: formValues,
    errors: {},
    isDirty: false,
    isSubmitting: false,
    lastSavedAt: null,
  });

  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftsList, setDraftsList] = useState<any[]>([]);
  const [showDraftsDialog, setShowDraftsDialog] = useState(false);

  // Calculate all visible questions (for future use in analytics/progress tracking)
  useMemo(() => {
    return config.sections.reduce((acc, section) => {
      const visible = getVisibleQuestions(section.questions, formValues);
      return [...acc, ...visible];
    }, [] as any[]);
  }, [config.sections, formValues]);

  // Calculate risk score in real-time
  useEffect(() => {
    const score = calculateRiskScore(config, formValues);
    setRiskScore(score);
  }, [config, formValues]);

  // Auto-save functionality
  useEffect(() => {
    const timer = setInterval(() => {
      if (Object.keys(formValues).length > 0) {
        saveFormState(config.id, formValues);
        setFormState((prev) => ({
          ...prev,
          lastSavedAt: new Date().toLocaleTimeString(),
        }));
        onAutoSave?.(formValues);
      }
    }, autoSaveInterval);

    return () => clearInterval(timer);
  }, [config.id, formValues, autoSaveInterval, onAutoSave]);

  // Load saved state on mount
  useEffect(() => {
    const saved = loadFormState(config.id);
    if (saved) {
      Object.entries(saved.values).forEach(([key, value]) => {
        setValue(key, value);
      });
      setFormState((prev) => ({
        ...prev,
        lastSavedAt: new Date(saved.autoSave.lastSavedAt).toLocaleTimeString(),
      }));
    }

    // Load drafts list
    if (enableDrafts) {
      setDraftsList(getDraftsList(config.id));
    }
  }, [config.id, setValue, enableDrafts]);

  // Validate and submit
  const handleFormSubmit = useCallback(
    async (_data: FormValues) => {
      const allQuestions = config.sections.reduce((acc, section) => {
        return [...acc, ...getVisibleQuestions(section.questions, formValues)];
      }, [] as any[]);

      const validationErrors = validateForm(allQuestions, formValues);

      if (Object.keys(validationErrors).length > 0) {
        setSnackbar({
          open: true,
          message: 'Please fix validation errors before submitting',
          severity: 'error',
        });
        return;
      }

      setFormState((prev) => ({ ...prev, isSubmitting: true }));

      try {
        const score = calculateRiskScore(config, formValues);
        await onSubmit?.(formValues, score);

        // Clear saved state after successful submission
        saveFormState(config.id, {});

        setSnackbar({
          open: true,
          message: 'Form submitted successfully!',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: error instanceof Error ? error.message : 'Failed to submit form',
          severity: 'error',
        });
      } finally {
        setFormState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [config, formValues, onSubmit]
  );

  // Manual save
  const handleManualSave = () => {
    saveFormState(config.id, formValues);
    setFormState((prev) => ({
      ...prev,
      lastSavedAt: new Date().toLocaleTimeString(),
    }));
    setSnackbar({
      open: true,
      message: 'Form saved successfully!',
      severity: 'success',
    });
  };

  // Save as draft
  const handleSaveDraft = () => {
    if (!draftName.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a draft name',
        severity: 'error',
      });
      return;
    }

    saveDraft(config.id, draftName, formValues);
    setDraftsList(getDraftsList(config.id));
    setShowDraftDialog(false);
    setDraftName('');
    setSnackbar({
      open: true,
      message: `Draft "${draftName}" saved successfully!`,
      severity: 'success',
    });
  };

  // Load draft
  const handleLoadDraft = (draftId: string) => {
    const draft = loadDraft(config.id, draftId);
    if (draft) {
      Object.entries(draft.values).forEach(([key, value]) => {
        setValue(key, value);
      });
      setShowDraftsDialog(false);
      setSnackbar({
        open: true,
        message: 'Draft loaded successfully!',
        severity: 'success',
      });
    }
  };

  // Export form data
  const handleExport = () => {
    const data = {
      formId: config.id,
      formTitle: config.title,
      answers: formValues,
      riskScore: riskScore,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.id}-assessment-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setSnackbar({
      open: true,
      message: 'Form data exported successfully!',
      severity: 'success',
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Form Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
          {config.title}
        </Typography>
        {config.description && (
          <Typography variant="body1" color="textSecondary">
            {config.description}
          </Typography>
        )}
      </Box>

      {/* Auto-save status */}
      {showAutoSave && (
        <Card sx={{ mb: 3, backgroundColor: '#f5f5f5' }}>
          <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon fontSize="small" />
                <Typography variant="caption">
                  {formState.lastSavedAt
                    ? `Last saved at ${formState.lastSavedAt}`
                    : 'No saved version'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleManualSave}
                  disabled={formState.isSubmitting}
                >
                  <SaveIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Save
                </Button>
                {enableDrafts && (
                  <>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setShowDraftDialog(true)}
                      disabled={formState.isSubmitting}
                    >
                      Save as Draft
                    </Button>
                    {draftsList.length > 0 && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setShowDraftsDialog(true)}
                        disabled={formState.isSubmitting}
                      >
                        Load Draft ({draftsList.length})
                      </Button>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Risk Score Display */}
      {showRiskScore && riskScore && (
        <Box sx={{ mb: 4 }}>
          <RiskScoreDisplay riskScore={riskScore} showBreakdown={true} />
        </Box>
      )}

      {/* Form Sections */}
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {config.sections.map((section, sectionIndex) => (
          <Accordion
            key={section.id}
            defaultExpanded={sectionIndex === 0}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {section.title}
                </Typography>
                {section.description && (
                  <Typography variant="caption" color="textSecondary">
                    {section.description}
                  </Typography>
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ width: '100%' }}>
                {section.questions.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    No questions in this section
                  </Typography>
                ) : (
                  <Grid container spacing={3}>
                    {section.questions.map((question) => (
                      <Grid item xs={12} key={question.id}>
                        <FieldRenderer
                          question={question}
                          control={control}
                          errors={errors as any}
                          formValues={formValues}
                          disabled={formState.isSubmitting}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}

        {/* Form Actions */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleExport}
            startIcon={<DownloadIcon />}
            disabled={formState.isSubmitting || Object.keys(formValues).length === 0}
          >
            Export
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={formState.isSubmitting}
            sx={{ minWidth: 120 }}
          >
            {formState.isSubmitting ? 'Submitting...' : config.submitText || 'Submit'}
          </Button>
        </Box>

        {formState.isSubmitting && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
          </Box>
        )}
      </form>

      {/* Save Draft Dialog */}
      <Dialog open={showDraftDialog} onClose={() => setShowDraftDialog(false)}>
        <DialogTitle>Save as Draft</DialogTitle>
        <DialogContent>
          <MuiTextField
            fullWidth
            label="Draft Name"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            placeholder="e.g., First Review, Updated Assessment"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDraftDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveDraft} variant="contained">
            Save Draft
          </Button>
        </DialogActions>
      </Dialog>

      {/* Load Drafts Dialog */}
      <Dialog open={showDraftsDialog} onClose={() => setShowDraftsDialog(false)}>
        <DialogTitle>Load Draft</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select a draft to load:
          </Typography>
          {draftsList.map((draft) => (
            <Card
              key={draft.id}
              sx={{
                mb: 1,
                p: 2,
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f5f5f5' },
              }}
              onClick={() => handleLoadDraft(draft.id)}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {draft.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Created: {new Date(draft.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                Updated: {new Date(draft.updatedAt).toLocaleString()}
              </Typography>
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDraftsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity as any}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default RiskAssessmentForm;
