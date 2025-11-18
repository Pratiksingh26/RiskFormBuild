# Getting Started Guide

Welcome to the Dynamic Risk Assessment Form Builder! This guide will help you set up and run the project quickly.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 16.0 or higher
- **npm** 7.0 or higher

Check your versions:
```bash
node --version
npm --version
```

## 🚀 Installation & Setup

### Step 1: Install Dependencies
```bash
cd RiskForm
npm install
```

This will install all required packages including:
- React 18.2
- Material-UI v5
- React Hook Form
- TypeScript
- Vite
- Testing libraries

### Step 2: Start Development Server
```bash
npm run dev
```

The application will automatically open at `http://localhost:5173`

### Step 3: Verify Installation
You should see:
- ✅ Form titled "Vendor Risk Assessment Form"
- ✅ Multiple form sections (Compliance, Security, Financial, Operational)
- ✅ Real-time risk score display
- ✅ Auto-save indicator

## 📝 First Form Submission

1. **Fill out the form**:
   - Navigate through sections using the accordion
   - Answer questions from each category
   - Watch the risk score update in real-time

2. **Test Conditional Logic**:
   - Select "Yes" for SOC2 certification
   - Notice the file upload field appears
   - Select "No" to hide it

3. **Save as Draft**:
   - Click "Save as Draft" button
   - Enter a draft name (e.g., "First Review")
   - Click "Save Draft"

4. **Submit Form**:
   - Fill in required fields (marked with *)
   - Click "Complete Assessment"
   - Success message appears with your risk score

## 🛠️ Build Commands

```bash
# Development
npm run dev              # Start dev server on port 5173

# Building
npm run build           # Build for production (creates /dist folder)
npm run preview         # Preview production build locally

# Linting & Quality
npm run lint            # Run ESLint

# Testing
npm run test            # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
```

## 📖 Project Structure

```
RiskForm/
├── src/
│   ├── components/           # React components
│   │   ├── RiskAssessmentForm.tsx    # Main form component
│   │   ├── RiskScoreDisplay.tsx      # Risk score visualization
│   │   └── fields/
│   │       ├── FieldRenderer.tsx     # Field router
│   │       ├── TextField.tsx
│   │       ├── NumberField.tsx
│   │       ├── SelectField.tsx
│   │       ├── CheckboxField.tsx
│   │       ├── DateField.tsx
│   │       └── FileField.tsx
│   │
│   ├── utils/               # Business logic
│   │   ├── riskCalculation.ts       # Risk scoring
│   │   ├── validation.ts             # Form validation
│   │   ├── storage.ts                # Auto-save & drafts
│   │   └── *.test.ts                 # Unit tests
│   │
│   ├── types/               # TypeScript interfaces
│   │   └── form.ts                   # Type definitions
│   │
│   ├── config/              # Configuration
│   │   └── formConfig.ts             # Example form config
│   │
│   ├── App.tsx              # Root component
│   ├── main.tsx             # React entry point
│   ├── index.css
│   └── App.css
│
├── public/                  # Static assets
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── jest.config.js          # Jest configuration
├── eslint.config.js        # ESLint configuration
├── package.json            # Dependencies
├── README.md               # Full documentation
├── DESIGN_DECISIONS.md     # Architecture decisions
└── GETTING_STARTED.md      # This file
```

## 🎯 Key Features to Try

### 1. Dynamic Form Rendering
- All fields render from JSON configuration
- No hard-coded fields
- Try editing `src/config/formConfig.ts` to modify the form

### 2. Conditional Fields
- Select "Yes" for SOC2 certification
- File upload field appears (conditional)
- Select "No" to hide it
- Try other conditional fields

### 3. Real-time Risk Calculation
- Risk score updates as you type
- Section-wise breakdown visible
- Color-coded risk levels (Low/Medium/High/Critical)

### 4. Auto-save Functionality
- Form state saved every 30 seconds
- "Last saved" timestamp displayed
- Close browser and reopen - your data is restored

### 5. Draft Management
- Click "Save as Draft" to create named drafts
- Load previous drafts with "Load Draft" button
- Edit multiple versions of the form

### 6. Validation
- Try submitting without required fields
- Error messages appear below fields
- Validation feedback is instant and helpful

### 7. File Upload
- Upload PDF files (try different types)
- Size validation (max 10MB in sample form)
- Files listed with remove option

### 8. Export Data
- Click "Export" after filling the form
- JSON file downloads with your answers and risk score
- Useful for record keeping

## 🔧 Customization Guide

### Change Form Configuration
Edit `src/config/formConfig.ts`:

```typescript
export const sampleFormConfig: FormConfig = {
  id: 'your-form-id',
  title: 'Your Form Title',
  sections: [
    {
      id: 'section-1',
      title: 'Section Title',
      questions: [
        {
          id: 'q1',
          type: 'text',
          label: 'Your Question',
          required: true,
          riskWeight: 5,
          // Add more properties...
        }
      ]
    }
  ]
};
```

### Customize Styling
Material-UI theme in `src/App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },    // Change primary color
    secondary: { main: '#dc004e' },  // Change secondary color
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

### Add Custom Validation
In form config:

```typescript
{
  id: 'q1',
  type: 'text',
  label: 'Email',
  validation: [
    {
      type: 'custom',
      message: 'Must be a valid email',
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    }
  ]
}
```

### Change Auto-save Interval
In `src/App.tsx`:

```typescript
<RiskAssessmentForm
  config={sampleFormConfig}
  autoSaveInterval={60000}  // 60 seconds instead of 30
  // ...
/>
```

## 🧪 Running Tests

### Run All Tests
```bash
npm run test
```

### Run Specific Test File
```bash
npm run test -- riskCalculation.test
```

### Watch Mode (re-run on file changes)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

View coverage in `./coverage/index.html`

## 🌐 Browser Support

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🐛 Troubleshooting

### "Port 5173 already in use"
```bash
# Use different port
npm run dev -- --port 3000
```

### Dependencies installation fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build fails with TypeScript errors
```bash
# Check TypeScript compilation
npx tsc --noEmit

# Fix issues reported
npm run lint
```

### Tests failing
```bash
# Ensure jest is properly set up
npm install --save-dev jest ts-jest @testing-library/react

# Run tests with verbose output
npm run test -- --verbose
```

## 📚 Learning Resources

### Understanding the Code
1. Start with `src/types/form.ts` - Understand data structures
2. Read `src/config/formConfig.ts` - See example configuration
3. Explore `src/components/RiskAssessmentForm.tsx` - Main component
4. Check `src/utils/*.ts` - Business logic

### Official Documentation
- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [React Hook Form Documentation](https://react-hook-form.com)
- [TypeScript Documentation](https://www.typescriptlang.org)

### Design Patterns Used
- See `DESIGN_DECISIONS.md` for architecture overview
- Configuration-driven rendering
- Composition pattern
- Strategy pattern for field types

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates optimized bundle in `/dist` folder

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
1. Connect your Git repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Deploy to Any Static Host
Copy contents of `/dist` folder to your hosting provider.

## 📞 Getting Help

### Issues & Debugging
1. Check browser console for errors (F12)
2. Check `DESIGN_DECISIONS.md` for architecture
3. Review test files for usage examples
4. Check `README.md` for API reference

### Common Questions

**Q: How do I add a new field type?**
A: Create component in `src/components/fields/`, add to `FieldRenderer.tsx`, define type in `src/types/form.ts`

**Q: Can I use this with a backend API?**
A: Yes! The `onSubmit` callback receives all form data - pass it to your API.

**Q: How do I change risk calculation?**
A: Edit `src/utils/riskCalculation.ts` - modify `calculateRiskScore` function

**Q: Can I customize the risk levels?**
A: Yes! Edit risk levels in `calculateRiskScore` and colors in `getRiskLevelColor`

## ✅ Next Steps

1. ✅ Install and run locally
2. ✅ Explore the sample form
3. ✅ Create your own form config
4. ✅ Customize styling
5. ✅ Run tests
6. ✅ Build and deploy

---

**Happy form building! 🎉**

For detailed API reference, see [README.md](./README.md)

For architectural decisions, see [DESIGN_DECISIONS.md](./DESIGN_DECISIONS.md)
