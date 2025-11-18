/**
 * Tests for storage utilities
 */

import {
  saveFormState,
  loadFormState,
  clearFormState,
  saveDraft,
  loadDraft,
  getDraftsList,
} from '../utils/storage';

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('saveFormState and loadFormState', () => {
    it('should save and load form state', () => {
      const formId = 'test-form';
      const values = { q1: 'answer1', q2: 42 };

      const saved = saveFormState(formId, values);
      expect(saved.formId).toBe(formId);
      expect(saved.values).toEqual(values);

      const loaded = loadFormState(formId);
      expect(loaded).not.toBeNull();
      expect(loaded?.values).toEqual(values);
    });

    it('should return null when loading non-existent state', () => {
      const loaded = loadFormState('non-existent');
      expect(loaded).toBeNull();
    });

    it('should mark state as draft when draftId provided', () => {
      const saved = saveFormState('form1', {}, 'draft-1');
      expect(saved.autoSave.isDraft).toBe(true);
      expect(saved.autoSave.draftId).toBe('draft-1');
    });
  });

  describe('clearFormState', () => {
    it('should clear form state', () => {
      const formId = 'test-form';
      saveFormState(formId, { q1: 'value' });

      clearFormState(formId);
      const loaded = loadFormState(formId);
      expect(loaded).toBeNull();
    });
  });

  describe('saveDraft and loadDraft', () => {
    it('should save and load draft', () => {
      const formId = 'test-form';
      const draftName = 'My Draft';
      const values = { q1: 'answer1' };

      const draftId = saveDraft(formId, draftName, values);
      expect(typeof draftId).toBe('string');

      const loaded = loadDraft(formId, draftId);
      expect(loaded).not.toBeNull();
      expect(loaded?.values).toEqual(values);
      expect(loaded?.autoSave.isDraft).toBe(true);
    });

    it('should return null when loading non-existent draft', () => {
      const loaded = loadDraft('form1', 'non-existent');
      expect(loaded).toBeNull();
    });
  });

  describe('getDraftsList', () => {
    it('should return empty array when no drafts exist', () => {
      const drafts = getDraftsList('form1');
      expect(drafts).toEqual([]);
    });

    it('should list all drafts for a form', () => {
      const formId = 'test-form';
      saveDraft(formId, 'Draft 1', { q1: 'a' });
      saveDraft(formId, 'Draft 2', { q1: 'b' });

      const drafts = getDraftsList(formId);
      expect(drafts.length).toBe(2);
      expect(drafts[0].name).toBe('Draft 1');
      expect(drafts[1].name).toBe('Draft 2');
    });

    it('should not mix drafts between forms', () => {
      saveDraft('form1', 'Draft 1', { q1: 'a' });
      saveDraft('form2', 'Draft 2', { q1: 'b' });

      const form1Drafts = getDraftsList('form1');
      const form2Drafts = getDraftsList('form2');

      expect(form1Drafts.length).toBe(1);
      expect(form2Drafts.length).toBe(1);
    });
  });
});
