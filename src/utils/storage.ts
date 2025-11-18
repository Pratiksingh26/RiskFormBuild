/**
 * Local storage utilities for auto-save and draft management
 */

import { FormValues, PersistedFormState, AutoSaveState } from '../types/form';

const STORAGE_PREFIX = 'risk-form:';

/**
 * Get the storage key for a form
 */
function getStorageKey(formId: string): string {
  return `${STORAGE_PREFIX}${formId}`;
}

/**
 * Get the drafts list key
 */
function getDraftsListKey(formId: string): string {
  return `${STORAGE_PREFIX}drafts:${formId}`;
}

/**
 * Save form state to localStorage
 */
export function saveFormState(
  formId: string,
  values: FormValues,
  draftId?: string
): PersistedFormState {
  const autoSave: AutoSaveState = {
    lastSavedAt: new Date().toISOString(),
    isDraft: !!draftId,
    draftId: draftId || '',
  };

  const state: PersistedFormState = {
    formId,
    values,
    autoSave,
    timestamp: new Date().toISOString(),
  };

  try {
    const key = getStorageKey(formId);
    localStorage.setItem(key, JSON.stringify(state));
    return state;
  } catch (error) {
    console.error('Failed to save form state:', error);
    throw new Error('Failed to save form state');
  }
}

/**
 * Load form state from localStorage
 */
export function loadFormState(formId: string): PersistedFormState | null {
  try {
    const key = getStorageKey(formId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load form state:', error);
    return null;
  }
}

/**
 * Clear form state from localStorage
 */
export function clearFormState(formId: string): void {
  try {
    const key = getStorageKey(formId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear form state:', error);
  }
}

/**
 * Save a draft with a specific name
 */
export function saveDraft(
  formId: string,
  draftName: string,
  values: FormValues,
  draftId?: string
): string {
  const newDraftId = draftId || `draft-${Date.now()}`;
  const draftKey = `${STORAGE_PREFIX}draft:${formId}:${newDraftId}`;

  const autoSave: AutoSaveState = {
    lastSavedAt: new Date().toISOString(),
    isDraft: true,
    draftId: newDraftId,
  };

  const state: PersistedFormState = {
    formId,
    values,
    autoSave,
    timestamp: new Date().toISOString(),
  };

  try {
    localStorage.setItem(draftKey, JSON.stringify(state));

    // Update drafts list
    const listKey = getDraftsListKey(formId);
    const draftsList = getDraftsList(formId);
    draftsList.push({
      id: newDraftId,
      name: draftName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    localStorage.setItem(listKey, JSON.stringify(draftsList));

    return newDraftId;
  } catch (error) {
    console.error('Failed to save draft:', error);
    throw new Error('Failed to save draft');
  }
}

/**
 * Load a specific draft
 */
export function loadDraft(formId: string, draftId: string): PersistedFormState | null {
  try {
    const draftKey = `${STORAGE_PREFIX}draft:${formId}:${draftId}`;
    const stored = localStorage.getItem(draftKey);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load draft:', error);
    return null;
  }
}

/**
 * Get list of all drafts for a form
 */
export function getDraftsList(
  formId: string
): Array<{ id: string; name: string; createdAt: string; updatedAt: string }> {
  try {
    const listKey = getDraftsListKey(formId);
    const stored = localStorage.getItem(listKey);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get drafts list:', error);
    return [];
  }
}

/**
 * Delete a draft
 */
export function deleteDraft(formId: string, draftId: string): void {
  try {
    // Delete draft data
    const draftKey = `${STORAGE_PREFIX}draft:${formId}:${draftId}`;
    localStorage.removeItem(draftKey);

    // Update drafts list
    const listKey = getDraftsListKey(formId);
    const draftsList = getDraftsList(formId);
    const filteredList = draftsList.filter((d) => d.id !== draftId);
    localStorage.setItem(listKey, JSON.stringify(filteredList));
  } catch (error) {
    console.error('Failed to delete draft:', error);
  }
}

/**
 * Rename a draft
 */
export function renameDraft(formId: string, draftId: string, newName: string): void {
  try {
    const listKey = getDraftsListKey(formId);
    const draftsList = getDraftsList(formId);
    const draft = draftsList.find((d) => d.id === draftId);
    if (draft) {
      draft.name = newName;
      draft.updatedAt = new Date().toISOString();
      localStorage.setItem(listKey, JSON.stringify(draftsList));
    }
  } catch (error) {
    console.error('Failed to rename draft:', error);
  }
}

/**
 * Export form state as JSON
 */
export function exportFormState(formId: string): string {
  const state = loadFormState(formId);
  if (!state) {
    throw new Error('No form state to export');
  }
  return JSON.stringify(state, null, 2);
}

/**
 * Import form state from JSON
 */
export function importFormState(formId: string, jsonData: string): PersistedFormState {
  try {
    const state = JSON.parse(jsonData) as PersistedFormState;
    if (state.formId !== formId) {
      throw new Error('Form ID mismatch');
    }
    return saveFormState(formId, state.values, state.autoSave.draftId);
  } catch (error) {
    console.error('Failed to import form state:', error);
    throw new Error('Invalid form data');
  }
}

/**
 * Get storage usage info
 */
export function getStorageInfo(): {
  totalSize: number;
  itemCount: number;
  formCount: number;
} {
  let totalSize = 0;
  let itemCount = 0;
  const formIds = new Set<string>();

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      itemCount++;
      const value = localStorage.getItem(key);
      if (value) {
        totalSize += value.length;
        const formIdMatch = key.match(/risk-form:(?:draft:)?([^:]+)/);
        if (formIdMatch) {
          formIds.add(formIdMatch[1]);
        }
      }
    }
  }

  return {
    totalSize,
    itemCount,
    formCount: formIds.size,
  };
}

/**
 * Clear all stored data
 */
export function clearAllStorage(): void {
  try {
    const keysToDelete: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear all storage:', error);
  }
}
