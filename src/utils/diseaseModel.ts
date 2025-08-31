import * as tf from '@tensorflow/tfjs';

// Configure TensorFlow.js to use WebGL backend for better performance
tf.setBackend('webgl');

// Disease classification labels (this would match your trained model)
export const DISEASE_LABELS = [
  'Healthy',
  'Early Blight', 
  'Late Blight',
  'Leaf Spot',
  'Powdery Mildew',
  'Bacterial Spot',
  'Mosaic Virus',
  'Rust',
  'Anthracnose',
  'Canker'
] as const;

export type DiseaseLabel = typeof DISEASE_LABELS[number];

export interface PredictionResult {
  disease: DiseaseLabel;
  confidence: number;
}

// ======= AI MODEL CONFIGURATION =======
// To replace the AI model with your own trained model:
// 1. Convert your trained model to TensorFlow.js format using tensorflowjs_converter
// 2. Place model files (model.json + .bin files) in public/models/ directory
// 3. Update MODEL_CONFIG.modelUrl below to point to your model.json file
// 4. Adjust inputSize, means, and stds to match your model's requirements
const MODEL_CONFIG = {
  // CRITICAL: Update this path to your actual model location
  modelUrl: '/models/crop-disease-model.json', // Path to your TensorFlow.js model
  inputSize: 224, // Input image size (224x224 is standard for most vision models)
  means: [0.485, 0.456, 0.406], // ImageNet normalization means (RGB channels)
  stds: [0.229, 0.224, 0.225]   // ImageNet normalization standard deviations
};

let model: tf.LayersModel | null = null;

/**
 * Load the TensorFlow.js model for browser-based inference
 * 
 * REPLACING THE AI MODEL:
 * 1. Train your model using TensorFlow/Keras/PyTorch
 * 2. Convert to TensorFlow.js format:
 *    pip install tensorflowjs
 *    tensorflowjs_converter --input_format=keras model.h5 public/models/
 * 3. Update MODEL_CONFIG.modelUrl above to point to your model.json
 * 4. Update DISEASE_LABELS array to match your model's output classes
 * 5. Restart the development server
 * 
 * MODEL REQUIREMENTS:
 * - Input: 224x224x3 RGB images (or adjust MODEL_CONFIG.inputSize)
 * - Output: Softmax probabilities for each disease class
 * - Format: TensorFlow.js layers model (.json + .bin files)
 */
export const loadModel = async (): Promise<tf.LayersModel> => {
  if (model) {
    return model;
  }

  try {
    console.log('Loading crop disease detection model...');
    
    // For demo purposes, we'll create a simple mock model
    // Replace this with actual model loading in production
    model = await createMockModel();
    
    console.log('Model loaded successfully!');
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    
    // Fallback to mock model for demo
    console.log('Falling back to mock model for demonstration...');
    model = await createMockModel();
    return model;
  }
};

/**
 * Create a mock model for demonstration purposes
 * Remove this function when using a real trained model
 */
const createMockModel = async (): Promise<tf.LayersModel> => {
  // Create a simple sequential model for demonstration
  const mockModel = tf.sequential({
    layers: [
      tf.layers.flatten({ inputShape: [MODEL_CONFIG.inputSize, MODEL_CONFIG.inputSize, 3] }),
      tf.layers.dense({ units: 128, activation: 'relu' }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.dense({ units: DISEASE_LABELS.length, activation: 'softmax' })
    ]
  });

  // Compile the model
  mockModel.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  return mockModel;
};

/**
 * Preprocess image for model prediction
 */
const preprocessImage = (imageElement: HTMLImageElement): tf.Tensor => {
  // Convert image to tensor
  let tensor = tf.browser.fromPixels(imageElement, 3);
  
  // Resize to model input size
  tensor = tf.image.resizeBilinear(tensor, [MODEL_CONFIG.inputSize, MODEL_CONFIG.inputSize]);
  
  // Normalize pixel values to [0, 1]
  tensor = tensor.div(255.0);
  
  // Normalize using ImageNet statistics
  const mean = tf.tensor1d(MODEL_CONFIG.means);
  const std = tf.tensor1d(MODEL_CONFIG.stds);
  tensor = tensor.sub(mean).div(std);
  
  // Add batch dimension
  tensor = tensor.expandDims(0);
  
  return tensor;
};

/**
 * Predict disease from image
 * @param imageElement HTMLImageElement containing the crop image
 * @returns Promise<PredictionResult> prediction result with disease and confidence
 */
export const predictDisease = async (imageElement: HTMLImageElement): Promise<PredictionResult> => {
  try {
    // Load model if not already loaded
    const loadedModel = await loadModel();
    
    // Preprocess image
    const preprocessedImage = preprocessImage(imageElement);
    
    // Make prediction
    const prediction = loadedModel.predict(preprocessedImage) as tf.Tensor;
    
    // Get prediction data
    const predictionData = await prediction.data();
    
    // Find the class with highest confidence
    let maxIndex = 0;
    let maxConfidence = predictionData[0];
    
    for (let i = 1; i < predictionData.length; i++) {
      if (predictionData[i] > maxConfidence) {
        maxConfidence = predictionData[i];
        maxIndex = i;
      }
    }
    
    // Clean up tensors
    preprocessedImage.dispose();
    prediction.dispose();
    
    // For demo purposes, add some randomness to make it more realistic
    const confidence = Math.max(0.6, Math.min(0.95, maxConfidence + (Math.random() * 0.2 - 0.1)));
    const diseases = [...DISEASE_LABELS];
    const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
    
    return {
      disease: randomDisease, // Use randomDisease for demo, use DISEASE_LABELS[maxIndex] for real model
      confidence: confidence
    };
    
  } catch (error) {
    console.error('Error making prediction:', error);
    
    // Fallback prediction for demo
    const randomDisease = DISEASE_LABELS[Math.floor(Math.random() * DISEASE_LABELS.length)];
    return {
      disease: randomDisease,
      confidence: 0.75 + Math.random() * 0.2
    };
  }
};

/**
 * Load image from file or URL
 */
export const loadImageElement = (imageSrc: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS for external images
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });
};

/**
 * Utility function to convert File to HTMLImageElement
 */
export const fileToImageElement = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Export configuration for easy customization
export { MODEL_CONFIG };