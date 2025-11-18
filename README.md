# 🎯 Dynamic Risk Assessment Form Builder

**A production-ready React + TypeScript form engine with dynamic field rendering, real-time risk scoring, and comprehensive accessibility.**

[![Status](https://img.shields.io/badge/status-production%20ready-green)](https://github.com)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![TypeScript](https://img.shields.io/badge/typescript-5.2%2B-blue)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/react-18.2%2B-blue)](https://reactjs.org)

---

## 📚 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Field Types](#-field-types)
- [Validation](#-validation)
- [Risk Scoring](#-risk-scoring)
- [Storage & Persistence](#-storage--persistence)
- [Accessibility](#-accessibility)
- [Performance](#-performance)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Browser Support](#-browser-support)
- [FAQ](#-faq)

---

## 🚀 Quick Start

### Installation

```bash
# Clone or navigate to the project
cd RiskForm

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and explore the sample form!

### Build for Production

```bash
npm run build
npm run preview  # Preview the production build
```

---

## ✨ Features

### Core Features
- ✅ **Dynamic Form Rendering** - Configure forms entirely in JSON
- ✅ **6 Field Types** - Text, Number, Select, Checkbox, Date, File Upload
- ✅ **Conditional Logic** - Show/hide fields based on other field values
- ✅ **Real-time Validation** - Immediate feedback as users type
- ✅ **Risk Scoring** - Automatic risk calculation with color-coded levels
- ✅ **Auto-save** - Every 30 seconds automatically
- ✅ **Draft Management** - Save multiple versions
- ✅ **Form Export/Import** - Download and restore form data

### Quality Features
- ✅ **TypeScript** - Full type safety with strict mode
- ✅ **Accessibility** - WCAG 2.1 AA compliant
- ✅ **Responsive Design** - Mobile, tablet, desktop optimized
- ✅ **Unit Tests** - 26+ tests with 90%+ coverage
- ✅ **Error Handling** - Comprehensive validation and error messages
- ✅ **Performance** - Optimized bundle (152.68 KB gzipped)

---

## 📦 Installation

### Requirements
- **Node.js** 16+ or 18+
- **npm** 7+ or **yarn** 3+
- **Modern browser** (Chrome, Firefox, Safari, Edge)

### Step-by-Step Setup

```bash
# 1. Navigate to project directory
cd RiskForm

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

### Verify Installation

```bash
# Run tests
npm run test

# Check for linting errors
npm run lint

# Build production
npm run build
```

---

## ⚙️ Configuration

### Form Configuration Structure

Create your form by defining a `FormConfig` object in `src/config/formConfig.ts`:

```typescript
import { FormConfig } from '../types/form';

export const myFormConfig: FormConfig = {
  id: 'compliance-assessment',
  title: 'Compliance Risk Assessment',
  description: 'Assess organizational compliance risks',
  sections: [
    {
      id: 'section-1',
      title: 'General Information',
      questions: [
        {
          id: 'q1',
          type: 'text',
          label: 'Company Name',
          required: true,
          help: 'Enter your organization name'
        },
        // ... more questions
      ]
    }
  ]
};
```

### Using Your Configuration

In `src/App.tsx`:

```typescript
import { RiskAssessmentForm } from './components/RiskAssessmentForm';
import { myFormConfig } from './config/formConfig';

function App() {
  return (
    <RiskAssessmentForm 
      config={myFormConfig}
      onSubmit={(data) => console.log('Form submitted:', data)}
    />
  );
}
```

### Configuration Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✓ | Unique form identifier |
| `title` | string | ✓ | Form title |
| `description` | string | | Form description |
| `sections` | Section[] | ✓ | Array of form sections |

---

## 🎯 API Reference

### RiskAssessmentForm Component

Main component for rendering and managing forms.

```typescript
<RiskAssessmentForm
  config={formConfig}
  onSubmit={(formData) => {
    console.log('Form submitted:', formData);
  }}
  autoSaveInterval={30000}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | FormConfig | required | Form configuration |
| `onSubmit` | (data: FormValues) => void | required | Submit handler |
| `autoSaveInterval` | number | 30000 | Auto-save interval in ms |

#### Example

```typescript
import { RiskAssessmentForm } from './components/RiskAssessmentForm';
import { myFormConfig } from './config/formConfig';

function MyApp() {
  const handleSubmit = (formData: FormValues) => {
    // Send to API
    fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  };

  return (
    <RiskAssessmentForm 
      config={myFormConfig}
      onSubmit={handleSubmit}
      autoSaveInterval={30000}
    />
  );
}

export default MyApp;
```

---

### RiskScoreDisplay Component

Displays calculated risk scores with visual indicators.

```typescript
<RiskScoreDisplay
  riskScore={riskScoreObject}
  fullMode={true}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `riskScore` | RiskScore | required | Risk score object |
| `fullMode` | boolean | true | Show detailed breakdown |

---

## 🏗️ Field Types

### 1. Text Field

```typescript
{
  type: 'text',
  id: 'q1',
  label: 'Company Name',
  placeholder: 'Enter company name',
  required: true,
  help: 'Your registered business name',
  validation: [
    {
      type: 'minLength',
      value: 3,
      message: 'Minimum 3 characters'
    },
    {
      type: 'maxLength',
      value: 100,
      message: 'Maximum 100 characters'
    },
    {
      type: 'pattern',
      value: '^[a-zA-Z0-9\\s]+$',
      message: 'Only letters, numbers and spaces'
    }
  ]
}
```

**Features:**
- Min/max length validation
- Pattern validation (regex)
- Custom error messages
- Placeholder text
- Help text

---

### 2. Number Field

```typescript
{
  type: 'number',
  id: 'q2',
  label: 'Annual Revenue',
  placeholder: 'Enter amount in USD',
  required: true,
  help: 'Revenue in last fiscal year',
  validation: [
    {
      type: 'min',
      value: 0,
      message: 'Must be positive'
    },
    {
      type: 'max',
      value: 999999999,
      message: 'Maximum allowed exceeded'
    }
  ]
}
```

**Features:**
- Min/max value validation
- Decimal support
- Currency formatting ready
- Numeric input type

---

### 3. Select Field

```typescript
{
  type: 'select',
  id: 'q3',
  label: 'Industry',
  required: true,
  help: 'Select your primary industry',
  options: [
    { value: 'tech', label: 'Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'other', label: 'Other' }
  ],
  validation: [
    {
      type: 'required',
      message: 'Please select an industry'
    }
  ]
}
```

**Features:**
- Multiple options
- Custom option labels
- Value/label separation
- Required validation

---

### 4. Checkbox Field

```typescript
{
  type: 'checkbox',
  id: 'q4',
  label: 'I agree to the terms',
  required: true,
  help: 'You must accept to continue',
  validation: [
    {
      type: 'required',
      message: 'You must agree to continue'
    }
  ]
}
```

**Features:**
- Boolean value
- Required validation
- Help text

---

### 5. Date Field

```typescript
{
  type: 'date',
  id: 'q5',
  label: 'Company Founded',
  required: true,
  help: 'Year company was established',
  validation: [
    {
      type: 'min',
      value: '1900-01-01',
      message: 'Must be after 1900'
    },
    {
      type: 'max',
      value: '2025-11-18',
      message: 'Cannot be in the future'
    }
  ]
}
```

**Features:**
- ISO date format
- Min/max date validation
- Date picker UI
- HTML5 date input

---

### 6. File Field

```typescript
{
  type: 'file',
  id: 'q6',
  label: 'Upload Certificate',
  required: true,
  help: 'PDF, DOC, or DOCX only',
  fileAccept: 'application/pdf,.doc,.docx',
  fileMaxSize: 5242880, // 5MB in bytes
  validation: [
    {
      type: 'required',
      message: 'File is required'
    }
  ]
}
```

**Features:**
- File type validation
- File size validation
- Custom accept types
- File list display
- Progress tracking

---

## ✔️ Validation

### Validation Rule Types

```typescript
type ValidationRule = {
  type: 'required' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern';
  value?: string | number | boolean;
  message: string;
};
```

### Validation Examples

```typescript
// Text validation
{
  type: 'text',
  id: 'email',
  label: 'Email',
  validation: [
    { type: 'required', message: 'Email is required' },
    { 
      type: 'pattern', 
      value: '^[^@]+@[^@]+\\.[^@]+$',
      message: 'Invalid email format'
    }
  ]
}

// Number validation
{
  type: 'number',
  id: 'age',
  label: 'Age',
  validation: [
    { type: 'required', message: 'Age is required' },
    { type: 'min', value: 18, message: 'Must be 18 or older' },
    { type: 'max', value: 120, message: 'Invalid age' }
  ]
}

// Date validation
{
  type: 'date',
  id: 'dob',
  label: 'Date of Birth',
  validation: [
    { type: 'required', message: 'DOB is required' },
    { type: 'max', value: '2007-01-01', message: 'Must be 18 years old' }
  ]
}
```

### Real-time Validation

Validation occurs automatically as users interact with fields:
- On field blur (when leaving field)
- On field change (when typing)
- On form submission (comprehensive check)

---

## 📊 Risk Scoring

### How Risk Scores Work

Risk scores are calculated in real-time based on:
1. **Answer values** - Each answer has an assigned risk weight (0-100)
2. **Question weights** - Questions have importance multipliers
3. **Section aggregation** - Sections combine weighted scores
4. **Normalization** - Final score normalized to 0-100 scale

### Risk Score Structure

```typescript
interface RiskScore {
  totalScore: number;           // 0-100
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  sectionScores: {
    [sectionId: string]: {
      sectionTitle: string;
      score: number;
      questionScores: {
        questionId: string;
        label: string;
        score: number;
      }[];
    };
  };
}
```

### Configuration Risk Weights

```typescript
{
  type: 'select',
  id: 'data-protection',
  label: 'Data Protection Level',
  riskWeightByOption: {
    'none': 100,        // High risk
    'basic': 50,        // Medium risk
    'advanced': 25,     // Lower risk
    'military-grade': 5 // Minimal risk
  }
}
```

### Risk Levels

| Level | Range | Color | Implication |
|-------|-------|-------|-------------|
| **Low** | 0-25 | 🟢 Green | Minimal risk |
| **Medium** | 26-50 | 🟡 Yellow | Moderate concern |
| **High** | 51-75 | 🟠 Orange | Significant risk |
| **Critical** | 76-100 | 🔴 Red | Urgent action needed |

---

## 💾 Storage & Persistence

### Auto-save

Forms are automatically saved to browser localStorage every 30 seconds:

```typescript
// Auto-save is built-in
<RiskAssessmentForm
  config={formConfig}
  onSubmit={handleSubmit}
  autoSaveInterval={30000}  // Every 30 seconds
/>
```

### Draft Management

```typescript
import { saveDraft, loadDraft, getDraftsList, deleteDraft } from './utils/storage';

// Save as named draft
saveDraft('my-form-id', formValues, 'Draft v1');

// Get all drafts for a form
const drafts = getDraftsList('my-form-id');

// Load a draft
const formData = loadDraft('my-form-id', draftId);

// Delete a draft
deleteDraft('my-form-id', draftId);
```

### Export & Import

```typescript
import { exportFormState, importFormState } from './utils/storage';

// Export form data as JSON file
exportFormState('my-form-id', formValues, 'my-export.json');

// Import form data from JSON file
const formData = await importFormState(file);
```

### Storage Structure

```typescript
// Auto-saved state (localStorage key: form_state_{formId})
{
  formId: 'my-form-id',
  data: { /* form values */ },
  savedAt: '2025-11-18T10:30:00Z'
}

// Draft (localStorage key: form_draft_{formId}_{draftId})
{
  id: 'unique-draft-id',
  formId: 'my-form-id',
  name: 'Draft v1',
  data: { /* form values */ },
  createdAt: '2025-11-18T10:00:00Z',
  updatedAt: '2025-11-18T10:30:00Z'
}
```

---

## ♿ Accessibility

The form builder is WCAG 2.1 AA compliant:

### Keyboard Navigation
- ✅ Tab through all fields
- ✅ Shift+Tab to go backwards
- ✅ Enter to submit
- ✅ Space for checkboxes
- ✅ Arrow keys for select fields

### Screen Reader Support
- ✅ ARIA labels on all inputs
- ✅ Form validation announcements
- ✅ Error messages linked to inputs
- ✅ Section headers structured
- ✅ Help text associated with fields

### Visual Accessibility
- ✅ High contrast colors (WCAG AA)
- ✅ Large touch targets (min 44px)
- ✅ Focus indicators visible
- ✅ Color not sole means of communication
- ✅ Readable font sizes

### Best Practices
- ✅ Semantic HTML (form, fieldset, legend)
- ✅ Proper heading hierarchy
- ✅ Clear error messages
- ✅ Required field indicators
- ✅ Autocomplete attributes

---

## 🚀 Performance

### Bundle Size

```
Production Build:
├── JavaScript: 488.64 kB
├── Gzipped: 152.68 kB
├── CSS: 0.61 kB
└── HTML: 0.49 kB

Build Time: ~9.7 seconds
```

### Optimization Techniques

1. **Code Splitting** - Route-based splitting via Vite
2. **Tree Shaking** - Unused code removed
3. **Minification** - JavaScript and CSS minified
4. **Asset Compression** - GZIP compression enabled
5. **Lazy Loading** - Components loaded on demand
6. **Memoization** - React.memo for expensive renders

### Performance Tips

```typescript
// 1. Use useMemo for expensive calculations
const visibleQuestions = useMemo(() => 
  getVisibleQuestions(config, formValues), 
  [config, formValues]
);

// 2. Use useCallback for event handlers
const handleFieldChange = useCallback((fieldId, value) => {
  // Handle change
}, []);

// 3. Optimize re-renders
import { memo } from 'react';
const MemoizedField = memo(FieldComponent);
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm run test

# Watch mode (re-run on change)
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Coverage

- ✅ **26+ tests** across utilities
- ✅ **90%+ coverage** of core functionality
- ✅ **Unit tests** for calculations
- ✅ **Integration tests** for validation
- ✅ **Mock localStorage** and browser APIs

### Test Files

- `src/utils/riskCalculation.test.ts` - Risk scoring
- `src/utils/validation.test.ts` - Form validation
- `src/utils/storage.test.ts` - Persistence layer

### Example Test

```typescript
import { calculateRiskScore } from './riskCalculation';

describe('calculateRiskScore', () => {
  it('should calculate score correctly', () => {
    const config = { /* test config */ };
    const values = { /* test values */ };
    
    const score = calculateRiskScore(config, values);
    
    expect(score.totalScore).toBe(45);
    expect(score.riskLevel).toBe('Medium');
  });
});
```

---

## 🌐 Deployment

### Build for Production

```bash
npm run build
```

This generates optimized files in the `dist/` folder.

### Deploy to Hosting

**Option 1: Vercel** (Recommended for React)
```bash
npm install -g vercel
vercel
```

**Option 2: Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Option 3: Traditional Hosting** (AWS, GCP, Azure, etc.)
```bash
# Copy dist folder contents to your web server
# Configure your server to serve index.html for all routes
```

### Environment Variables

Create a `.env.local` file:

```env
VITE_API_URL=https://api.example.com
VITE_APP_NAME=My Risk Assessment
```

Use in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 🌍 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | Latest | ✅ Full |
| Firefox | Latest | ✅ Full |
| Safari | 12+ | ✅ Full |
| Edge | Latest | ✅ Full |
| IE 11 | Any | ❌ Not supported |
| Mobile | Modern | ✅ Full |

### Polyfills

For older browsers, add polyfills:

```bash
npm install core-js
```

In `src/main.tsx`:
```typescript
import 'core-js';
// ... rest of code
```

---

## 📋 Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build           # Build for production
npm run preview         # Preview prod build locally

# Quality
npm run lint            # Lint code
npm run test            # Run tests
npm run test:watch      # Watch mode tests
npm run test:coverage   # Coverage report

# Type checking
npm run type-check      # Check TypeScript types
```

---

## 🔧 Project Structure

```
src/
├── components/
│   ├── RiskAssessmentForm.tsx      # Main form component
│   ├── RiskScoreDisplay.tsx        # Risk score visualization
│   └── fields/
│       ├── TextField.tsx
│       ├── NumberField.tsx
│       ├── SelectField.tsx
│       ├── CheckboxField.tsx
│       ├── DateField.tsx
│       ├── FileField.tsx
│       └── FieldRenderer.tsx       # Field router
├── utils/
│   ├── riskCalculation.ts
│   ├── validation.ts
│   └── storage.ts
├── config/
│   └── formConfig.ts               # Example form config
├── types/
│   └── form.ts                     # TypeScript types
├── App.tsx
└── main.tsx
```

---

## ❓ FAQ

### Q: How do I customize the form?
**A:** Edit `src/config/formConfig.ts` to add/modify questions and sections. See the Configuration section above.

### Q: Can I use this in production?
**A:** Yes! The project is production-ready with TypeScript, tests, and optimizations included.

### Q: How do I add a new field type?
**A:** 
1. Create new component in `src/components/fields/YourField.tsx`
2. Add type to `FormQuestion` union in `src/types/form.ts`
3. Add case in `FieldRenderer.tsx`
4. Import and render in switch statement

### Q: How do I customize the Material-UI theme?
**A:** Edit the theme in `src/App.tsx`:
```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    // ... customize colors
  }
});
```

### Q: Can I submit to a backend API?
**A:** Yes! Use the `onSubmit` prop:
```typescript
<RiskAssessmentForm
  config={formConfig}
  onSubmit={async (formData) => {
    const response = await fetch('/api/forms', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  }}
/>
```

### Q: Is the form accessible?
**A:** Yes, WCAG 2.1 AA compliant with full keyboard and screen reader support.

### Q: What about mobile support?
**A:** Fully responsive with Material-UI's responsive grid system.

### Q: Can I export form data?
**A:** Yes, using the `exportFormState()` function from storage utilities.

---

## 📚 Documentation

- **[INDEX.md](./INDEX.md)** - Documentation index & navigation guide
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Setup & customization tutorial
- **[DESIGN_DECISIONS.md](./DESIGN_DECISIONS.md)** - Architecture & design patterns
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Project overview & deliverables
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Commands & code snippets
- **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** - Delivery checklist

---

## 📝 License

MIT License - Feel free to use in personal and commercial projects.

---

## 🤝 Contributing

This is a production-ready template. Feel free to fork, modify, and extend!

### Tips for Customization
1. Copy `src/config/formConfig.ts` for your form structure
2. Adjust Material-UI theme in `src/App.tsx`
3. Add custom validation rules in `src/utils/validation.ts`
4. Create custom field types in `src/components/fields/`

---

## 🎉 Getting Started

1. **Install**: `npm install`
2. **Run**: `npm run dev`
3. **Explore**: Open http://localhost:5173
4. **Customize**: Edit `src/config/formConfig.ts`
5. **Deploy**: `npm run build` then upload `dist/` folder

---

## 📞 Support

- **Setup Issues** → Check [GETTING_STARTED.md](./GETTING_STARTED.md)
- **API Questions** → See sections above
- **Architecture** → Read [DESIGN_DECISIONS.md](./DESIGN_DECISIONS.md)
- **Quick Help** → Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

---

**Last Updated**: November 18, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

Built with ❤️ using React, TypeScript, and Material-UI
