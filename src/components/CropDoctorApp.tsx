import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, Leaf, History, Info, CheckCircle, AlertTriangle, XCircle, Zap, Clock, AlertCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { predictDisease, fileToImageElement, type DiseaseLabel } from '@/utils/diseaseModel';
import { DISEASE_ADVICE, getAdviceForDisease } from '@/data/treatmentAdvice';
import heroImage from '@/assets/hero-image.jpg';

interface PredictionResult {
  id: string;
  disease: DiseaseLabel;
  confidence: number;
  timestamp: Date;
  imageUrl: string;
}

interface CropDoctorAppProps {}

export const CropDoctorApp: React.FC<CropDoctorAppProps> = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load prediction history from localStorage on component mount
  React.useEffect(() => {
    const savedHistory = localStorage.getItem('crop-doctor-history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  // Save prediction history to localStorage whenever it changes
  React.useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('crop-doctor-history', JSON.stringify(history));
    }
  }, [history]);

  // Advanced AI prediction using TensorFlow.js
  const performAIPrediction = useCallback(async (imageFile: File): Promise<PredictionResult> => {
    try {
      // Convert file to image element for TensorFlow.js processing
      const imageElement = await fileToImageElement(imageFile);
      
      // Use the actual AI model for prediction
      const prediction = await predictDisease(imageElement);
      
      return {
        id: Date.now().toString(),
        disease: prediction.disease,
        confidence: prediction.confidence,
        timestamp: new Date(),
        imageUrl: selectedImage || ''
      };
    } catch (error) {
      console.error('AI Prediction Error:', error);
      // Fallback prediction if AI fails
      throw new Error('AI analysis failed. Please try again.');
    }
  }, [selectedImage]);

  // Handle image upload
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('Image file is too large. Please select an image under 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setPrediction(null);
        toast.success('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Analyze the selected image
  const analyzeImage = useCallback(async () => {
    if (!selectedImage) {
      toast.error('Please select an image first.');
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);

    try {
      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Convert base64 to file for AI processing
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const file = new File([blob], 'crop-image.jpg', { type: 'image/jpeg' });

      // Perform AI analysis
      const result = await performAIPrediction(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setPrediction(result);
      setHistory(prev => [result, ...prev.slice(0, 9)]); // Keep only last 10 results
      
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  }, [selectedImage, performAIPrediction]);

  // Clear current analysis
  const clearAnalysis = useCallback(() => {
    setSelectedImage(null);
    setPrediction(null);
    setProgress(0);
  }, []);

  const selectedDisease = prediction ? getAdviceForDisease(prediction.disease) : null;
  const IconComponent = selectedDisease?.icon;

  return (
    <div className="min-h-screen" 
         style={{
           backgroundImage: `linear-gradient(135deg, rgba(135, 60, 25, 0.9), rgba(142, 76, 36, 0.8)), url(${heroImage})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="animate-leaf-bounce">
              <Leaf className="w-12 h-12 text-accent" />
            </div>
            <h1 className="text-4xl font-bold text-primary-foreground">AI Crop Doctor</h1>
          </div>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Advanced AI-powered plant disease detection and treatment recommendations for healthier crops
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upload Section */}
          <Card className="bg-gradient-card border-accent/20 shadow-lg animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Crop Image
              </CardTitle>
              <CardDescription>
                Select or capture an image of your crop leaves for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Preview */}
              {selectedImage && (
                <div className="relative group">
                  <img 
                    src={selectedImage} 
                    alt="Selected crop" 
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={clearAnalysis}
                  >
                    Clear
                  </Button>
                </div>
              )}

              {/* Upload Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="upload" 
                  className="h-24 flex-col"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-6 h-6 mb-2" />
                  Choose File
                </Button>
                <Button 
                  variant="camera" 
                  className="h-24 flex-col"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="w-6 h-6 mb-2" />
                  Take Photo
                </Button>
              </div>

              {/* Hidden Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleImageUpload}
              />

              {/* Analyze Button */}
              <Button 
                variant="hero" 
                className="w-full h-12"
                onClick={analyzeImage}
                disabled={!selectedImage || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Leaf className="w-4 h-4 mr-2" />
                    Analyze Crop Health
                  </>
                )}
              </Button>

              {/* Progress Bar */}
              {isAnalyzing && (
                <div className="space-y-2 animate-fade-in-up">
                  <Progress value={progress} className="w-full animate-pulse-glow" />
                  <p className="text-sm text-muted-foreground text-center">
                    Processing image... {Math.round(progress)}%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-gradient-card border-accent/20 shadow-lg animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Analysis Results
              </CardTitle>
              <CardDescription>
                AI diagnosis and treatment recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {prediction && selectedDisease ? (
                <div className="space-y-6 animate-fade-in-up">
                  {/* Disease Badge */}
                  <div className="flex items-center justify-center">
                    <Badge 
                      variant={selectedDisease.color as any}
                      className="text-lg px-4 py-2 flex items-center gap-2"
                    >
                      {IconComponent && <IconComponent className="w-5 h-5" />}
                      {prediction.disease}
                    </Badge>
                  </div>

                  {/* Confidence Score */}
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {Math.round(prediction.confidence * 100)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Confidence</p>
                  </div>

                  {/* Treatment Advice */}
                  <div className="bg-secondary/30 p-6 rounded-lg border border-accent/20 space-y-4">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      {selectedDisease.title}
                    </h4>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedDisease.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm flex items-center gap-1">
                          <Zap className="w-4 h-4 text-warning" />
                          Immediate Treatment
                        </h5>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          {selectedDisease.treatment.slice(0, 3).map((step, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-accent font-bold">•</span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium text-sm flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-success" />
                          Prevention Tips
                        </h5>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          {selectedDisease.prevention.slice(0, 3).map((step, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-accent font-bold">•</span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-accent/10">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-warning">
                          <Clock className="w-3 h-3" />
                          {selectedDisease.urgency}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <AlertCircleIcon className="w-3 h-3" />
                          {selectedDisease.severity.toUpperCase()} severity
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <p className="text-xs text-muted-foreground text-center">
                    Analyzed on {prediction.timestamp.toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Leaf className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Upload an image to get started with AI analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* History Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="history">
              <History className="w-5 h-5" />
              Analys
            </h3>
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
              className="bg-background/10 border-primary-foreground/20 text-primary-foreground hover:bg-background/20"
            >
              {showHistory ? 'Hide' : 'Show'} History
            </Button>
          </div>

          {showHistory && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
              {history.length > 0 ? (
                history.map((item) => {
                  const historyDisease = getAdviceForDisease(item.disease);
                  const HistoryIcon = historyDisease.icon;
                  
                  return (
                    <Card key={item.id} className="bg-gradient-card border-accent/20 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={historyDisease.color as any} className="text-xs">
                            <HistoryIcon className="w-3 h-3 mr-1" />
                            {item.disease}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(item.confidence * 100)}%
                          </span>
                        </div>
                        
                        {item.imageUrl && (
                          <img 
                            src={item.imageUrl} 
                            alt="Historical analysis" 
                            className="w-full h-24 object-cover rounded mb-2"
                          />
                        )}
                        
                        <p className="text-xs text-muted-foreground">
                          {item.timestamp.toLocaleDateString()} at {item.timestamp.toLocaleTimeString()}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card className="col-span-full bg-gradient-card border-accent/20">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No analysis history available yet</p>
                    <p className="text-sm">Start by uploading and analyzing crop images</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropDoctorApp;