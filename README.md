# AI Crop Doctor - Web Application

A powerful **web-only** plant disease detection system using AI and computer vision. Upload crop images to get instant disease diagnosis and treatment recommendations.

![AI Crop Doctor](src/assets/hero-image.jpg)

**🌐 100% Browser-Based** - No React Native dependencies, fully optimized for web browsers with TensorFlow.js client-side AI.

## 🌟 Features

- **📸 Image Upload & Camera Capture** - Upload crop images or use device camera
- **🤖 AI Disease Detection** - Powered by TensorFlow.js for client-side inference  
- **💊 Treatment Recommendations** - Detailed advice for detected diseases
- **📊 Confidence Scoring** - AI prediction confidence levels
- **📱 Mobile-Friendly** - Responsive design for all devices
- **📈 Analysis History** - Local storage of previous predictions
- **🎨 Modern UI/UX** - Clean, nature-inspired design with smooth animations

## 🚀 Quick Start

### Prerequisites
- **Node.js 16+** - [Download here](https://nodejs.org/) 
- **npm** - Comes automatically with Node.js

### Installation Steps

1. **Get the project files:**
   ```bash
   # Option A: Download and extract the project files
   # Option B: Clone from Git repository
   git clone [your-repository-url]
   cd ai-crop-doctor
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```
   
   If you encounter any errors:
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   - Navigate to `http://localhost:8080`
   - The app should load immediately!

### ✅ Verify Everything Works
- You should see the AI Crop Doctor interface
- Try uploading a test image
- The AI analysis should work (demo mode)

## 🔧 Configuration & Customization

### Adding New Plant Disease Classes

To add new plant disease classes, edit the disease labels and advice:

1. **Update Disease Labels** (`src/utils/diseaseModel.ts`):
```typescript
// To add new plant classes, edit this array...
export const DISEASE_LABELS = [
  'Healthy',
  'Early Blight', 
  'Late Blight',
  'Your New Disease', // Add here
  // ... existing diseases
] as const;
```

2. **Add Treatment Advice** (`src/data/treatmentAdvice.ts`):
```typescript
// To change advice messages, edit this dictionary...
export const DISEASE_ADVICE = {
  'Your New Disease': {
    icon: AlertTriangle,
    color: 'warning' as const,
    severity: 'medium' as const,
    title: 'Your Disease Title',
    description: 'Disease description...',
    treatment: ['Treatment step 1', 'Treatment step 2'],
    prevention: ['Prevention tip 1', 'Prevention tip 2'],
    urgency: 'Treat within 1-2 days',
    followUp: 'Monitor weekly'
  },
  // ... existing diseases
};
```

### Replacing the AI Model

To replace or retrain the AI model:

1. **Convert Your Model** to TensorFlow.js format:
```bash
tensorflowjs_converter \
  --input_format=tf_saved_model \
  --output_format=tfjs_graph_model \
  /path/to/your/saved_model \
  /path/to/output/tfjs_model
```

2. **Update Model Configuration** (`src/utils/diseaseModel.ts`):
```typescript
// To change AI model file path, edit here...
const MODEL_CONFIG = {
  modelUrl: '/models/your-model.json', // Update this path
  inputSize: 224, // Your model's input size
  means: [0.485, 0.456, 0.406], // Update normalization
  stds: [0.229, 0.224, 0.225]   // Update normalization
};
```

3. **Place Model Files** in `public/models/` directory

### Customizing UI Appearance

To modify colors, fonts, and layout, edit the design system:

1. **Colors & Gradients** (`src/index.css`):
```css
:root {
  /* To change appearance, modify CSS classes here... */
  --primary: 135 60% 25%;        /* Main brand color */
  --accent: 142 76% 36%;         /* Accent color */
  --gradient-hero: linear-gradient(135deg, ...); /* Hero gradient */
  /* ... other design tokens */
}
```

2. **Component Variants** (`src/components/ui/button.tsx`):
```typescript
const buttonVariants = cva("...", {
  variants: {
    variant: {
      // Add custom button variants here
      "your-variant": "bg-your-color text-your-text hover:bg-your-hover",
    }
  }
});
```

3. **Typography & Spacing** (`tailwind.config.ts`):
```typescript
export default {
  theme: {
    extend: {
      // Add custom fonts, spacing, etc.
      fontFamily: {
        'custom': ['Your Font', 'sans-serif'],
      },
    }
  }
} satisfies Config;
```

### Adding New Languages

To add internationalization support:

1. Create language files in `src/locales/`
2. Update disease advice with translated content
3. Implement i18n library (react-i18next recommended)

## 🏗️ Architecture

```
src/
├── assets/           # Images and static assets
├── components/       # React components
│   ├── ui/          # Reusable UI components (shadcn/ui)
│   └── CropDoctorApp.tsx # Main application component
├── data/            # Static data and configurations
│   └── treatmentAdvice.ts # Disease advice and treatment info
├── utils/           # Utility functions
│   └── diseaseModel.ts # AI model loading and prediction
├── pages/           # Route components
├── hooks/           # Custom React hooks
└── lib/             # Shared utilities
```

## 🤖 AI Model Details

The application uses TensorFlow.js for client-side AI inference:

- **Input**: 224x224 RGB images
- **Output**: Disease classification with confidence scores
- **Preprocessing**: ImageNet normalization
- **Backend**: WebGL for GPU acceleration

### Model Performance Optimization

- Images automatically resized to optimal dimensions
- GPU acceleration via WebGL backend
- Efficient tensor memory management
- Progressive loading with user feedback

## 📱 Browser Compatibility

- **Modern Browsers**: Chrome 80+, Firefox 78+, Safari 14+, Edge 80+
- **Mobile**: iOS Safari 14+, Chrome Mobile 80+
- **WebGL Support**: Required for AI model inference
- **Camera Access**: HTTPS required for camera capture

## 🔒 Privacy & Security

- **Client-Side Processing**: All AI inference runs in the browser
- **No Data Upload**: Images are processed locally
- **Local Storage**: Analysis history stored in browser only
- **HTTPS Recommended**: For camera access and security

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deploy to Lovable
1. Open [Lovable Project](https://lovable.dev/projects/d418b09d-2442-48e7-9c4b-b1abee1238fc)
2. Click Share → Publish
3. Your app will be deployed automatically

### Deploy Elsewhere
The built files in `dist/` can be deployed to any static hosting service:
- Netlify, Vercel, GitHub Pages, AWS S3, etc.

## 🛠️ Development & Production

### Available Commands
```bash
# Development
npm run dev          # Start development server (localhost:8080)

# Production Build
npm run build        # Create optimized build in dist/
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Check for code issues
```

### 🐛 Troubleshooting

**Common Issues & Solutions:**

1. **"Module not found" or npm install errors:**
   ```bash
   # Clear everything and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **"Port 8080 already in use":**
   ```bash
   # Kill process using port
   npx kill-port 8080
   # Or change port in vite.config.ts
   ```

3. **AI model fails to load:**
   - Ensure model files are in `public/models/` directory
   - Check browser console for detailed error messages
   - Verify model path in `src/utils/diseaseModel.ts`

4. **Camera not working:**
   - Camera requires HTTPS in production
   - Check browser permissions for camera access
   - Test on localhost first (works with HTTP)

5. **Slow AI predictions:**
   - Enable hardware acceleration in browser
   - Close other memory-intensive tabs
   - Use production build for better performance

6. **TypeScript errors:**
   - Ensure you're using Node.js 16+
   - Run `npm run lint` to check for issues
   - Check that all imports have correct paths

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- TensorFlow.js team for client-side AI capabilities
- shadcn/ui for beautiful, accessible components
- Tailwind CSS for utility-first styling
- Plant disease datasets and research communities

---

**Need Help?** Check the [documentation](https://docs.lovable.dev) or open an issue for support.

**Live Demo:** [AI Crop Doctor](https://lovable.dev/projects/d418b09d-2442-48e7-9c4b-b1abee1238fc)
