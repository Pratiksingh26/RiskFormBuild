/**
 * Tests for validation utilities
 */

import { validateField, isFieldVisible, validateForm } from '../utils/validation';
import { TextQuestion, NumberQuestion } from '../types/form';

describe('Validation Utilities', () => {
  describe('isFieldVisible', () => {
    it('should show field without conditional', () => {
      const question: TextQuestion = {
        id: 'q1',
        type: 'text',
        label: 'Question',
      };
      expect(isFieldVisible(question, {})).toBe(true);
    });

    it('should show field when condition is met', () => {
      const question: TextQuestion = {
        id: 'q2',
        type: 'text',
        label: 'Question',
        conditional: {
          questionId: 'q1',
          answer: 'yes',
        },
      };
      expect(isFieldVisible(question, { q1: 'yes' })).toBe(true);
    });

    it('should hide field when condition is not met', () => {
      const question: TextQuestion = {
        id: 'q2',
        type: 'text',
        label: 'Question',
        conditional: {
          questionId: 'q1',
          answer: 'yes',
        },
      };
      expect(isFieldVisible(question, { q1: 'no' })).toBe(false);
    });
  });

  describe('validateField', () => {
    it('should validate required field', () => {
      const question: TextQuestion = {
        id: 'q1',
        type: 'text',
        label: 'Name',
        required: true,
      };
      const error = validateField(question, '', true);
      expect(error).toContain('required');
    });

    it('should validate text field length', () => {
      const question: TextQuestion = {
        id: 'q1',
        type: 'text',
        label: 'Name',
        minLength: 5,
        maxLength: 10,
      };

      const tooShort = validateField(question, 'ab', true);
      expect(tooShort).toContain('Minimum length');

      const tooLong = validateField(question, 'abcdefghijk', true);
      expect(tooLong).toContain('Maximum length');

      const valid = validateField(question, 'abcde', true);
      expect(valid).toBeNull();
    });

    it('should validate number field range', () => {
      const question: NumberQuestion = {
        id: 'q1',
        type: 'number',
        label: 'Age',
        min: 18,
        max: 65,
      };

      const tooSmall = validateField(question, 10, true);
      expect(tooSmall).toContain('Minimum');

      const tooBig = validateField(question, 100, true);
      expect(tooBig).toContain('Maximum');

      const valid = validateField(question, 25, true);
      expect(valid).toBeNull();
    });

    it('should skip validation for hidden fields', () => {
      const question: TextQuestion = {
        id: 'q1',
        type: 'text',
        label: 'Name',
        required: true,
      };
      const error = validateField(question, '', false);
      expect(error).toBeNull();
    });
  });

  describe('validateForm', () => {
    it('should validate all questions', () => {
      const questions: TextQuestion[] = [
        {
          id: 'q1',
          type: 'text',
          label: 'Name',
          required: true,
        },
        {
          id: 'q2',
          type: 'text',
          label: 'Email',
          required: true,
        },
      ];

      const errors = validateForm(questions, {});
      expect(Object.keys(errors).length).toBe(2);
      expect(errors['q1']).toBeDefined();
      expect(errors['q2']).toBeDefined();
    });

    it('should return empty object for valid form', () => {
      const questions: TextQuestion[] = [
        {
          id: 'q1',
          type: 'text',
          label: 'Name',
          required: true,
        },
      ];

      const errors = validateForm(questions, { q1: 'John' });
      expect(Object.keys(errors).length).toBe(0);
    });
  });
});
