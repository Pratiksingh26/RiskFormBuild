/**
 * Risk score calculation utilities
 */

import { FormValues, FormConfig, RiskScore, RiskScoreBreakdown, Question } from '../types/form';

/**
 * Calculate risk score for a question based on answer
 */
function calculateQuestionRiskScore(
  question: Question,
  answer: any
): number {
  if (!answer || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
    return 0;
  }

  const weight = question.riskWeight || 0;

  // For select/checkbox with specific risk values
  if ((question.type === 'select' || question.type === 'checkbox') && Array.isArray(question.options)) {
    let score = 0;

    if (question.type === 'checkbox' && Array.isArray(answer)) {
      // For checkboxes, average the risk values
      const riskValues = answer
        .map((val) => {
          const option = question.options.find((opt: any) =>
            typeof opt === 'string' ? opt === val : opt.value === val
          );
          return (option as any)?.riskValue || weight;
        });
      score = riskValues.length > 0 ? riskValues.reduce((a, b) => a + b, 0) / riskValues.length : weight;
    } else {
      // For single select
      const option = question.options.find((opt: any) =>
        typeof opt === 'string' ? opt === answer : opt.value === answer
      );
      score = (option as any)?.riskValue || weight;
    }
    return score;
  }

  // Default: use weight for answered questions
  return weight;
}

/**
 * Calculate total risk score for all answers
 */
export function calculateRiskScore(
  formConfig: FormConfig,
  formValues: FormValues
): RiskScore {
  const breakdown: RiskScoreBreakdown = {};
  let totalScore = 0;
  let maxScore = 0;

  // Process each section
  formConfig.sections.forEach((section) => {
    let sectionScore = 0;
    let sectionMaxScore = 0;

    // Process each question in section
    section.questions.forEach((question) => {
      const maxScoreForQuestion = question.riskWeight || 0;
      sectionMaxScore += maxScoreForQuestion;
      maxScore += maxScoreForQuestion;

      const answer = formValues[question.id];
      const questionScore = calculateQuestionRiskScore(question, answer);
      sectionScore += questionScore;
      totalScore += questionScore;
    });

    breakdown[section.id] = {
      score: sectionScore,
      maxScore: sectionMaxScore,
      percentage: sectionMaxScore > 0 ? (sectionScore / sectionMaxScore) * 100 : 0,
    };
  });

  const maxScoreConfig = formConfig.maxRiskScore || 100;
  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  const normalizedScore = (percentage / 100) * maxScoreConfig;

  // Determine risk level
  let level: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  if (normalizedScore >= 75) {
    level = 'Critical';
  } else if (normalizedScore >= 50) {
    level = 'High';
  } else if (normalizedScore >= 25) {
    level = 'Medium';
  }

  return {
    totalScore: Math.round(normalizedScore),
    maxScore: maxScoreConfig,
    percentage: Math.round(percentage),
    level,
    breakdown,
  };
}

/**
 * Get risk level color
 */
export function getRiskLevelColor(level: 'Low' | 'Medium' | 'High' | 'Critical'): string {
  const colors: Record<string, string> = {
    Low: '#4caf50',
    Medium: '#ff9800',
    High: '#f44336',
    Critical: '#b71c1c',
  };
  return colors[level] || '#666';
}

/**
 * Get risk level background color
 */
export function getRiskLevelBgColor(level: 'Low' | 'Medium' | 'High' | 'Critical'): string {
  const colors: Record<string, string> = {
    Low: '#e8f5e9',
    Medium: '#fff3e0',
    High: '#ffebee',
    Critical: '#fce4ec',
  };
  return colors[level] || '#f5f5f5';
}

/**
 * Get risk level text
 */
export function getRiskLevelText(level: 'Low' | 'Medium' | 'High' | 'Critical'): string {
  const texts: Record<string, string> = {
    Low: '✓ Low Risk',
    Medium: '⚠ Medium Risk',
    High: '⚠ High Risk',
    Critical: '✗ Critical Risk',
  };
  return texts[level] || 'Unknown';
}
