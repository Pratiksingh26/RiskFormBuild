import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Alert, CircularProgress } from '@mui/material';
import RiskAssessmentForm from './components/RiskAssessmentForm';
import { sampleFormConfig } from './config/formConfig';
import { FormValues, RiskScore } from './types/form';
import './App.css';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (values: FormValues, riskScore: RiskScore) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Form submitted with values:', values);
      console.log('Risk Score:', riskScore);

      setSubmitResult({
        success: true,
        message: `Assessment submitted successfully! Your risk score is ${riskScore.totalScore}/100 (${riskScore.level})`,
      });
    } catch (error) {
      setSubmitResult({
        success: false,
        message: 'Failed to submit the assessment. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoSave = (values: FormValues) => {
    console.log('Form auto-saved:', Object.keys(values).length, 'fields');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa', py: 2 }}>
        <Container maxWidth="lg">
          {submitResult && (
            <Alert
              severity={submitResult.success ? 'success' : 'error'}
              sx={{ mb: 3 }}
              onClose={() => setSubmitResult(null)}
            >
              {submitResult.message}
            </Alert>
          )}

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {!isLoading && (
            <RiskAssessmentForm
              config={sampleFormConfig}
              onSubmit={handleFormSubmit}
              onAutoSave={handleAutoSave}
              autoSaveInterval={30000}
              showRiskScore={true}
              showAutoSave={true}
              enableDrafts={true}
            />
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
