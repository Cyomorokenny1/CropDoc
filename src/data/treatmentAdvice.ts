import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import type { DiseaseLabel } from '@/utils/diseaseModel';

// Disease treatment and prevention advice
// To add new plant disease classes, edit this dictionary
export const DISEASE_ADVICE = {
  'Healthy': {
    icon: CheckCircle,
    color: 'success' as const,
    severity: 'low' as const,
    title: 'Healthy Plant',
    description: 'Your crop appears to be in excellent condition!',
    treatment: [
      'Continue with current care routine',
      'Maintain proper watering schedule',
      'Ensure adequate sunlight exposure',
      'Regular monitoring for early detection of issues'
    ],
    prevention: [
      'Keep soil well-draining but moist',
      'Provide proper spacing between plants',
      'Apply balanced fertilizer as needed',
      'Remove any dead or dying plant material promptly'
    ],
    urgency: 'No immediate action required',
    followUp: 'Continue regular monitoring and maintenance'
  },

  'Early Blight': {
    icon: AlertTriangle,
    color: 'warning' as const,
    severity: 'medium' as const,
    title: 'Early Blight Detection',
    description: 'Fungal infection causing dark spots with concentric rings on leaves.',
    treatment: [
      'Remove and destroy affected leaves immediately',
      'Apply copper-based fungicide every 7-14 days',
      'Improve air circulation around plants',
      'Avoid overhead watering - water at soil level',
      'Apply organic mulch to prevent soil splash'
    ],
    prevention: [
      'Rotate crops annually (3-4 year rotation)',
      'Space plants adequately for air flow',
      'Water early morning at soil level',
      'Remove plant debris at end of season',
      'Choose resistant varieties when available'
    ],
    urgency: 'Treat within 2-3 days to prevent spread',
    followUp: 'Monitor weekly and continue treatment until symptoms disappear'
  },

  'Late Blight': {
    icon: XCircle,
    color: 'destructive' as const,
    severity: 'high' as const,
    title: 'Late Blight - Urgent Action Required',
    description: 'Serious fungal disease that can destroy entire crops rapidly.',
    treatment: [
      'Remove ALL affected plant parts immediately',
      'Apply copper hydroxide or mancozeb fungicide',
      'Treat surrounding healthy plants preventively',
      'Improve drainage and air circulation',
      'Consider removing severely infected plants entirely'
    ],
    prevention: [
      'Plant certified disease-free seeds/seedlings',
      'Ensure excellent drainage',
      'Avoid overhead irrigation completely',
      'Apply preventive fungicide in humid conditions',
      'Maintain proper plant spacing'
    ],
    urgency: 'IMMEDIATE ACTION REQUIRED - Treat today',
    followUp: 'Daily monitoring required. Repeat treatment every 5-7 days'
  },

  'Leaf Spot': {
    icon: AlertTriangle,
    color: 'warning' as const,
    severity: 'medium' as const,
    title: 'Leaf Spot Disease',
    description: 'Bacterial or fungal spots causing circular lesions on leaves.',
    treatment: [
      'Remove spotted leaves and dispose properly',
      'Apply bactericide or fungicide as appropriate',
      'Increase air circulation around plants',
      'Avoid watering foliage directly',
      'Apply copper-based spray for bacterial spots'
    ],
    prevention: [
      'Water at soil level only',
      'Disinfect gardening tools between plants',
      'Provide adequate plant spacing',
      'Avoid working with wet plants',
      'Remove infected plant debris promptly'
    ],
    urgency: 'Treat within 1-2 days',
    followUp: 'Weekly monitoring and treatment as needed'
  },

  'Powdery Mildew': {
    icon: AlertTriangle,
    color: 'warning' as const,
    severity: 'medium' as const,
    title: 'Powdery Mildew',
    description: 'White powdery fungal growth on leaf surfaces.',
    treatment: [
      'Spray with baking soda solution (1 tsp/quart water)',
      'Apply neem oil or horticultural oil',
      'Increase air circulation significantly',
      'Remove heavily affected leaves',
      'Consider sulfur-based fungicides'
    ],
    prevention: [
      'Ensure proper air circulation',
      'Avoid overcrowding plants',
      'Plant in areas with good sunlight',
      'Avoid overhead watering',
      'Choose resistant varieties'
    ],
    urgency: 'Treat within 2-3 days',
    followUp: 'Continue treatment weekly until resolved'
  },

  'Bacterial Spot': {
    icon: AlertTriangle,
    color: 'warning' as const,
    severity: 'medium' as const,
    title: 'Bacterial Spot',
    description: 'Bacterial infection causing small dark spots with yellow halos.',
    treatment: [
      'Apply copper-based bactericide',
      'Remove and destroy affected leaves',
      'Improve air circulation',
      'Avoid overhead watering completely',
      'Disinfect tools between plants'
    ],
    prevention: [
      'Use certified disease-free seeds',
      'Rotate crops (3-4 year cycle)',
      'Avoid working with wet plants',
      'Disinfect tools regularly',
      'Remove plant debris thoroughly'
    ],
    urgency: 'Treat within 1-2 days',
    followUp: 'Monitor closely and retreat every 7-10 days'
  },

  'Mosaic Virus': {
    icon: XCircle,
    color: 'destructive' as const,
    severity: 'high' as const,
    title: 'Viral Mosaic Disease',
    description: 'Viral infection causing mottled, mosaic-like patterns on leaves.',
    treatment: [
      'Remove and destroy infected plants immediately',
      'Control aphids and other virus vectors',
      'Disinfect tools with 10% bleach solution',
      'Do not compost infected plant material',
      'Monitor surrounding plants closely'
    ],
    prevention: [
      'Use certified virus-free seeds/plants',
      'Control aphids and thrips aggressively',
      'Remove weeds that can harbor viruses',
      'Avoid tobacco use around plants',
      'Quarantine new plants before planting'
    ],
    urgency: 'IMMEDIATE REMOVAL REQUIRED',
    followUp: 'Monitor area for 2-3 weeks for new infections'
  },

  'Rust': {
    icon: AlertTriangle,
    color: 'warning' as const,
    severity: 'medium' as const,
    title: 'Plant Rust Disease',
    description: 'Fungal disease causing orange, yellow, or brown pustules on leaves.',
    treatment: [
      'Apply sulfur or copper-based fungicide',
      'Remove affected leaves carefully to avoid spore spread',
      'Improve air circulation around plants',
      'Avoid overhead watering',
      'Consider systemic fungicides for severe cases'
    ],
    prevention: [
      'Plant rust-resistant varieties',
      'Ensure proper plant spacing',
      'Water at soil level only',
      'Remove fallen leaves and debris',
      'Avoid high nitrogen fertilization'
    ],
    urgency: 'Treat within 2-3 days',
    followUp: 'Continue monitoring and treatment every 10-14 days'
  },

  'Anthracnose': {
    icon: AlertTriangle,
    color: 'warning' as const,
    severity: 'medium' as const,
    title: 'Anthracnose',
    description: 'Fungal disease causing dark, sunken lesions on stems and fruits.',
    treatment: [
      'Apply copper-based or chlorothalonil fungicide',
      'Remove and destroy infected plant parts',
      'Improve air circulation and drainage',
      'Avoid overhead irrigation',
      'Stake plants to keep fruit off ground'
    ],
    prevention: [
      'Rotate crops annually',
      'Choose resistant varieties',
      'Maintain proper plant spacing',
      'Remove crop debris at season end',
      'Avoid working with wet plants'
    ],
    urgency: 'Treat within 1-2 days',
    followUp: 'Weekly applications until symptoms resolve'
  },

  'Canker': {
    icon: XCircle,
    color: 'destructive' as const,
    severity: 'high' as const,
    title: 'Plant Canker',
    description: 'Bacterial disease causing sunken, dead areas on stems and branches.',
    treatment: [
      'Prune out infected areas 6 inches below visible symptoms',
      'Disinfect pruning tools with 70% alcohol between cuts',
      'Apply copper-based bactericide to wounds',
      'Improve plant nutrition and stress management',
      'Consider removing severely affected plants'
    ],
    prevention: [
      'Avoid mechanical damage to plants',
      'Maintain proper nutrition and watering',
      'Prune during dry weather only',
      'Disinfect tools regularly',
      'Remove and destroy infected debris'
    ],
    urgency: 'Immediate action required - prune today',
    followUp: 'Monitor weekly and retreat pruning cuts as needed'
  }
} as const satisfies Record<DiseaseLabel, {
  icon: any;
  color: 'success' | 'warning' | 'destructive';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  treatment: string[];
  prevention: string[];
  urgency: string;
  followUp: string;
}>;

// Helper function to get advice for a specific disease
export const getAdviceForDisease = (disease: DiseaseLabel) => {
  return DISEASE_ADVICE[disease];
};

// Helper function to get diseases by severity
export const getDiseasesBySeverity = (severity: 'low' | 'medium' | 'high') => {
  return Object.entries(DISEASE_ADVICE)
    .filter(([_, advice]) => advice.severity === severity)
    .map(([disease, _]) => disease as DiseaseLabel);
};

// Export types for TypeScript
export type DiseaseAdvice = typeof DISEASE_ADVICE[DiseaseLabel];
export type DiseaseSeverity = 'low' | 'medium' | 'high';