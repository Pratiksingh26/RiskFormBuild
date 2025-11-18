# Quick Reference Guide

## 🎯 Common Tasks

### 1. Run the Application
```bash
npm run dev
```
Opens at `http://localhost:5173`

### 2. Build for Production
```bash
npm run build
```
Output in `/dist` folder

### 3. Run Tests
```bash
npm run test                    # Run once
npm run test:watch             # Watch mode
npm run test:coverage          # With coverage
```

### 4. Lint Code
```bash
npm run lint
```

---

## 📝 Form Configuration

### Basic Example
```typescript
const config = {
  id: 'my-form',
  title: 'Assessment Form',
  sections: [{
    id: 'section1',
    title: 'First Section',
    questions: [
      {
        id: 'q1',
        type: 'text',
        label: 'Your Name',
        required: true,
        riskWeight: 3,
        placeholder: 'Enter name',
        maxLength: 50
      }
    ]
  }]
};
```

### Field Types Quick Reference

#### Text Field
```typescript
{
  id: 'q1',
  type: 'text',
  label: 'Question',
  placeholder?: string,
  minLength?: number,
  maxLength?: number,
  pattern?: string,
  required?: boolean,
  riskWeight?: number
}
```

#### Number Field
```typescript
{
  id: 'q1',
  type: 'number',
  label: 'Question',
  min?: number,
  max?: number,
  step?: number,
  required?: boolean,
  riskWeight?: number
}
```

#### Select Field
```typescript
{
  id: 'q1',
  type: 'select',
  label: 'Question',
  options: ['Option 1', 'Option 2'] // or
  options: [
    { label: 'Option 1', value: 'opt1', riskValue?: 5 }
  ],
  required?: boolean,
  riskWeight?: number,
  placeholder?: string
}
```

#### Checkbox Field
```typescript
{
  id: 'q1',
  type: 'checkbox',
  label: 'Select all that apply',
  options: ['Option 1', 'Option 2'],
  required?: boolean,
  riskWeight?: number
}
```

#### Date Field
```typescript
{
  id: 'q1',
  type: 'date',
  label: 'Select date',
  minDate?: string,      // ISO format
  maxDate?: string,      // ISO format
  required?: boolean,
  riskWeight?: number
}
```

#### File Field
```typescript
{
  id: 'q1',
  type: 'file',
  label: 'Upload file',
  accept?: string,       // '.pdf,.doc'
  maxSize?: number,      // MB
  multiple?: boolean,
  required?: boolean,
  riskWeight?: number
}
```

### Conditional Field
```typescript
{
  id: 'q2',
  type: 'text',
  label: 'Follow-up question',
  conditional: {
    questionId: 'q1',
    answer: 'yes',
    operator?: 'equals' | 'includes' | 'greaterThan' | 'lessThan'
  }
}
```

---

## 🎨 Component Usage

### Using RiskAssessmentForm
```typescript
import RiskAssessmentForm from './components/RiskAssessmentForm';
import { sampleFormConfig } from './config/formConfig';

<RiskAssessmentForm
  config={sampleFormConfig}
  onSubmit={async (values, riskScore) => {
    // Handle submission
    console.log(values, riskScore);
  }}
  autoSaveInterval={30000}      // 30 seconds
  showRiskScore={true}
  showAutoSave={true}
  enableDrafts={true}
/>
```

### Using RiskScoreDisplay
```typescript
import RiskScoreDisplay from './components/RiskScoreDisplay';

<RiskScoreDisplay
  riskScore={riskScore}
  showBreakdown={true}
  compact={false}
/>
```

---

## 🔧 Utility Functions

### Risk Calculation
```typescript
import { 
  calculateRiskScore, 
  getRiskLevelColor, 
  getRiskLevelText 
} from './utils/riskCalculation';

const score = calculateRiskScore(config, values);
// Returns: { totalScore, maxScore, percentage, level, breakdown }

const color = getRiskLevelColor('High');
// Returns: '#f44336'

const text = getRiskLevelText('High');
// Returns: '⚠ High Risk'
```

### Validation
```typescript
import { 
  validateField, 
  isFieldVisible, 
  validateForm 
} from './utils/validation';

const isVisible = isFieldVisible(question, formValues);
const error = validateField(question, value, isVisible);
const errors = validateForm(questions, formValues);
```

### Storage
```typescript
import {
  saveFormState,
  loadFormState,
  saveDraft,
  loadDraft,
  getDraftsList,
  deleteDraft
} from './utils/storage';

// Auto-save
saveFormState('form-id', values);

// Load
const state = loadFormState('form-id');

// Drafts
const draftId = saveDraft('form-id', 'Draft Name', values);
const draft = loadDraft('form-id', draftId);
const drafts = getDraftsList('form-id');
```

---

## 📦 Type Definitions

### FormConfig
```typescript
interface FormConfig {
  id: string;
  title: string;
  description?: string;
  sections: Section[];
  submitText?: string;
  maxRiskScore?: number;
}
```

### Section
```typescript
interface Section {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  collapsible?: boolean;
}
```

### RiskScore
```typescript
interface RiskScore {
  totalScore: number;
  maxScore: number;
  percentage: number;
  level: 'Low' | 'Medium' | 'High' | 'Critical';
  breakdown: RiskScoreBreakdown;
}
```

---

## 🎯 Risk Levels

| Level | Score Range | Color | Action |
|-------|------------|-------|--------|
| Low | 0-25 | 🟢 Green | Continue |
| Medium | 25-50 | 🟠 Orange | Review |
| High | 50-75 | 🔴 Red | Address |
| Critical | 75-100 | 🟣 Dark Red | Urgent |

---

## 🔐 Security Checklist

- [ ] Validate all inputs server-side
- [ ] Encrypt sensitive data before storage
- [ ] Implement HTTPS only
- [ ] Add CSRF protection
- [ ] Set up rate limiting
- [ ] Enable CORS properly
- [ ] Sanitize file uploads
- [ ] Log security events

---

## 🚀 Deployment Checklist

- [ ] Run `npm run build`
- [ ] Test production build locally
- [ ] Set environment variables
- [ ] Configure backend API endpoints
- [ ] Enable analytics (optional)
- [ ] Set up error logging
- [ ] Configure backup/recovery
- [ ] Test auto-save functionality
- [ ] Verify accessibility
- [ ] Deploy to staging
- [ ] Test all browsers
- [ ] Deploy to production

---

## 📱 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome | 90+ ✅ |
| Firefox | 88+ ✅ |
| Safari | 14+ ✅ |
| Edge | 90+ ✅ |
| IE 11 | ❌ Not supported |

---

## 📊 File Size References

```
Production Bundle Breakdown:
├── Core JS: ~150 KB (gzipped)
├── CSS: ~0.3 KB (gzipped)
├── Dependencies:
│   ├── React: ~40 KB
│   ├── Material-UI: ~60 KB
│   └── Other: ~50 KB
└── Total: ~152 KB (gzipped)
```

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### Tests Failing
```bash
npm run test -- --clearCache
npm run test
```

### Build Errors
```bash
rm -rf node_modules
npm install
npm run build
```

### Performance Issues
```bash
npm run test:coverage  # Check what's expensive
npm run build          # Check final bundle size
```

---

## 📖 File Reference

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main component |
| `src/components/RiskAssessmentForm.tsx` | Form orchestrator |
| `src/components/RiskScoreDisplay.tsx` | Risk visualization |
| `src/utils/riskCalculation.ts` | Scoring logic |
| `src/utils/validation.ts` | Validation rules |
| `src/utils/storage.ts` | Auto-save & drafts |
| `src/types/form.ts` | Type definitions |
| `src/config/formConfig.ts` | Example form |
| `README.md` | Full documentation |
| `DESIGN_DECISIONS.md` | Architecture guide |
| `GETTING_STARTED.md` | Setup tutorial |

---

## 🔗 Useful Links

- [React Documentation](https://react.dev)
- [Material-UI Docs](https://mui.com)
- [React Hook Form](https://react-hook-form.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Jest Documentation](https://jestjs.io)
- [Vite Documentation](https://vitejs.dev)

---

## 💡 Tips & Tricks

### Debug Form Values
```typescript
const formValues = watch();
console.log('Current form state:', formValues);
```

### Check Visibility
```typescript
const visible = getVisibleQuestions(questions, formValues);
console.log('Visible count:', visible.length);
```

### Monitor Auto-save
Open DevTools → Application → LocalStorage
Look for keys starting with `risk-form:`

### Test Conditional Logic
1. Select different answers
2. Watch fields appear/disappear
3. Check console for conditional evaluation

### Validate Performance
1. Run `npm run build`
2. Check bundle size output
3. Open DevTools → Lighthouse
4. Run performance audit

---

**Last Updated**: November 17, 2025

**Version**: 1.0.0 - Production Ready
