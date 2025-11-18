/**
 * Tests for risk calculation utilities
 */

import { calculateRiskScore, getRiskLevelColor, getRiskLevelText } from '../utils/riskCalculation';
import { FormConfig } from '../types/form';

describe('Risk Calculation Utilities', () => {
  const mockConfig: FormConfig = {
    id: 'test-form',
    title: 'Test Form',
    maxRiskScore: 100,
    sections: [
      {
        id: 'section1',
        title: 'Section 1',
        questions: [
          {
            id: 'q1',
            type: 'select',
            label: 'Question 1',
            options: [
              { label: 'Yes', value: 'yes', riskValue: 0 },
              { label: 'No', value: 'no', riskValue: 10 },
            ],
            riskWeight: 10,
          },
          {
            id: 'q2',
            type: 'number',
            label: 'Question 2',
            riskWeight: 5,
          },
        ],
      },
    ],
  };

  describe('calculateRiskScore', () => {
    it('should calculate risk score with no answers', () => {
      const result = calculateRiskScore(mockConfig, {});
      expect(result.totalScore).toBe(0);
      expect(result.percentage).toBe(0);
      expect(result.level).toBe('Low');
    });

    it('should calculate risk score with partial answers', () => {
      const result = calculateRiskScore(mockConfig, { q1: 'yes' });
      expect(result.totalScore).toBeGreaterThan(0);
      expect(result.level).toBeDefined();
    });

    it('should calculate correct risk level', () => {
      const lowRisk = calculateRiskScore(mockConfig, { q1: 'yes' });
      expect(lowRisk.level).toBe('Low');

      const highRisk = calculateRiskScore(mockConfig, { q1: 'no' });
      expect(['Low', 'Medium', 'High', 'Critical']).toContain(highRisk.level);
    });

    it('should include section breakdown', () => {
      const result = calculateRiskScore(mockConfig, { q1: 'yes' });
      expect(result.breakdown).toBeDefined();
      expect(result.breakdown['section1']).toBeDefined();
      expect(result.breakdown['section1'].score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getRiskLevelColor', () => {
    it('should return correct colors for each level', () => {
      expect(getRiskLevelColor('Low')).toBe('#4caf50');
      expect(getRiskLevelColor('Medium')).toBe('#ff9800');
      expect(getRiskLevelColor('High')).toBe('#f44336');
      expect(getRiskLevelColor('Critical')).toBe('#b71c1c');
    });
  });

  describe('getRiskLevelText', () => {
    it('should return correct text for each level', () => {
      expect(getRiskLevelText('Low')).toContain('Low Risk');
      expect(getRiskLevelText('Medium')).toContain('Medium Risk');
      expect(getRiskLevelText('High')).toContain('High Risk');
      expect(getRiskLevelText('Critical')).toContain('Critical Risk');
    });
  });
});
