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
  // ----- TRANSLATIONS -----
  const translations: Record<string, Record<string, string>> = {
    en: {
      crop: 'AI Crop Doctor',
      description: 'Advanced AI-powered plant disease detection with precision treatment recommendations for healthier, more productive crops',
      uploadTitle: 'Upload Crop Image',
      uploadDescription: 'Select or capture an image of your crop leaves for comprehensive AI analysis',
      chooseFile: 'Choose File',
      browseImages: 'Browse images',
      takePhoto: 'Take Photo',
      useCamera: 'Use camera',
      analyze: 'Analyze Crop Health',
      analyzing: 'Analyzing Disease...',
      processing: 'Processing image... {P}%',
      clear: 'Clear',
      readyTitle: 'Ready for Analysis',
      readyDesc: 'Upload a crop image to begin AI-powered disease detection',
      analysisResults: 'Analysis Results',
      analysisDescription: 'Comprehensive AI diagnosis with expert treatment recommendations',
      confidenceScore: 'Confidence Score',
      immediateTreatment: 'Immediate Treatment',
      preventionTips: 'Prevention Tips',
      showHistory: 'Show History',
      hideHistory: 'Hide History',
      noHistoryTitle: 'No History Yet',
      noHistoryDesc: 'Start analyzing crop images to build your history',
      imageTooLarge: 'Image file is too large. Please select an image under 10MB.',
      imageUploadSuccess: 'Image uploaded successfully!',
      selectImageFirst: 'Please select an image first.',
      analysisComplete: 'Analysis complete!',
      analysisFailed: 'Analysis failed. Please try again.',
      history: 'Analysis History',
    },
    rw: {
      crop: 'AI Muganga w’Ibihingwa',
      description: "Ikoranabuhanga rishingiye kuri AI mu kumenya indwara z'ibihingwa no gutanga inama z'ubuvuzi zinoze kandi zizewe.",
      uploadTitle: 'Ohereza Ifoto y’Igihingwa',
      uploadDescription: 'Hitamo cyangwa fata ifoto y’ibyatsi kugirango hakorwe isesengura rya AI',
      chooseFile: 'Hitamo Ifoto',
      browseImages: 'Sura amafoto',
      takePhoto: 'Fata Ifoto',
      useCamera: 'Koresha Camera',
      analyze: 'Suzuma Ubuzima bw’Igihingwa',
      analyzing: 'Kuri gusuzuma indwara...',
      processing: 'Kuri gutunganya ishusho... {P}%',
      clear: 'Siba',
      readyTitle: 'Niteguye Gusesengura',
      readyDesc: 'Ohereza ifoto y’igihingwa kugira ngo utangire isuzuma ukoresheje AI',
      analysisResults: 'Ibyavuye mu Isesengura',
      analysisDescription: 'Isuzuma ryimbitse rya AI hamwe n’innama z’ubuvuzi',
      confidenceScore: 'Urwego rw’Imyizerere',
      immediateTreatment: 'Uburyo bwo Kuvura ako kanya',
      preventionTips: 'Inama zo Gukumira',
      showHistory: 'Erekana Amateka',
      hideHistory: 'Hisha Amateka',
      noHistoryTitle: 'Nta Mateka Arahanditswe',
      noHistoryDesc: 'Tangira gusesengura amashusho y’ibihingwa kugira ngo wubake amateka',
      imageTooLarge: 'Ifoto nini cyane. Hitamo ifoto iri munsi ya 10MB.',
      imageUploadSuccess: 'Ifoto yoherejwe neza!',
      selectImageFirst: 'Nyamuneka hitamo ifoto mbere.',
      analysisComplete: 'Isesengura ryarangiye!',
      analysisFailed: 'Isesengura ryanze. Ongera ugerageze.',
      history: 'Amasuzuma Aheruka',
    }
  };

  const [lang, setLang] = useState<'en' | 'rw'>('en');
  const t = (key: string) => translations[lang][key] ?? key;

  // ----- existing state & refs -----
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load/save history
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

  React.useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('crop-doctor-history', JSON.stringify(history));
    }
  }, [history]);

  // AI prediction wrapper
  const performAIPrediction = useCallback(async (imageFile: File): Promise<PredictionResult> => {
    try {
      const imageElement = await fileToImageElement(imageFile);
      const predictionResult = await predictDisease(imageElement);
      return {
        id: Date.now().toString(),
        disease: predictionResult.disease,
        confidence: predictionResult.confidence,
        timestamp: new Date(),
        imageUrl: selectedImage || ''
      };
    } catch (error) {
      console.error('AI Prediction Error:', error);
      throw new Error(t('analysisFailed'));
    }
  }, [selectedImage, lang]); // include lang only for error string selection

  // Handle file input change
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t('imageTooLarge'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setPrediction(null);
        toast.success(t('imageUploadSuccess'));
      };
      reader.readAsDataURL(file);
    }
  }, [lang]);

  // Analyze image
  const analyzeImage = useCallback(async () => {
    if (!selectedImage) {
      toast.error(t('selectImageFirst'));
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const file = new File([blob], 'crop-image.jpg', { type: 'image/jpeg' });

      const result = await performAIPrediction(file);

      clearInterval(progressInterval);
      setProgress(100);
      setPrediction(result);
      setHistory(prev => [result, ...prev.slice(0, 9)]);
      toast.success(t('analysisComplete'));
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(t('analysisFailed'));
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  }, [selectedImage, performAIPrediction, lang]);

  const clearAnalysis = useCallback(() => {
    setSelectedImage(null);
    setPrediction(null);
    setProgress(0);
  }, []);

  const selectedDisease = prediction ? getAdviceForDisease(prediction.disease) : null;
  const IconComponent = selectedDisease?.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-success/10"
         style={{
           backgroundImage: `linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--accent) / 0.05)), url(${heroImage})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="animate-leaf-bounce relative">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse-glow"></div>
              <Leaf className="relative w-14 h-14 text-accent drop-shadow-lg" />
            </div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-i18n="crop">
              {t('crop')}
            </h1>

            <div className="language-switcher flex items-center gap-2 ml-4">
              <button
                onClick={() => setLang('en')}
                aria-label="English"
                className={`p-1 rounded ${lang === 'en' ? 'ring-2 ring-primary' : 'opacity-80'}`}
              >
                <img src="https://cdn-icons-png.flaticon.com/128/197/197484.png" alt="English" className="w-6 h-6"/>
              </button>
              <button
                onClick={() => setLang('rw')}
                aria-label="Kinyarwanda"
                className={`p-1 rounded ${lang === 'rw' ? 'ring-2 ring-primary' : 'opacity-80'}`}
              >
                <img src="https://cdn-icons-png.flaticon.com/128/197/197393.png" alt="Kinyarwanda" className="w-6 h-6"/>
              </button>
            </div>
          </div>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-i18n="description">
            {t('description')}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Section */}
          <Card className="glass-card hover-lift animate-fade-in-up border-2 border-accent/20 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-accent/5 to-primary/5 pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl bg-accent/10">
                  <Upload className="w-6 h-6 text-accent" />
                </div>
                {t('uploadTitle')}
              </CardTitle>
              <CardDescription className="text-base">
                {t('uploadDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Image Preview */}
              {selectedImage && (
                <div className="relative group rounded-2xl overflow-hidden shadow-lg hover-glow">
                  <img
                    src={selectedImage}
                    alt="Selected crop"
                    className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 glass-button"
                    onClick={clearAnalysis}
                  >
                    {t('clear')}
                  </Button>
                </div>
              )}

              {/* Upload Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-28 flex-col glass-button rounded-2xl hover-lift border-2 border-dashed border-accent/30 hover:border-accent/60 bg-gradient-to-br from-accent/5 to-primary/5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="p-3 rounded-full bg-accent/10 mb-3 animate-gentle-float">
                    <Upload className="w-7 h-7 text-accent" />
                  </div>
                  <span className="font-semibold">{t('chooseFile')}</span>
                  <span className="text-xs text-muted-foreground mt-1">{t('browseImages')}</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-28 flex-col glass-button rounded-2xl hover-lift border-2 border-dashed border-primary/30 hover:border-primary/60 bg-gradient-to-br from-primary/5 to-accent/5"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <div className="p-3 rounded-full bg-primary/10 mb-3 animate-gentle-float">
                    <Camera className="w-7 h-7 text-primary" />
                  </div>
                  <span className="font-semibold">{t('takePhoto')}</span>
                  <span className="text-xs text-muted-foreground mt-1">{t('useCamera')}</span>
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
                variant="default"
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-accent text-lg font-semibold shadow-lg hover:shadow-glow hover:scale-[1.02] transition-all duration-300 border-0"
                onClick={analyzeImage}
                disabled={!selectedImage || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground mr-3" />
                    {t('analyzing')}
                  </>
                ) : (
                  <>
                    <div className="p-1 rounded-lg bg-white/20 mr-3">
                      <Leaf className="w-5 h-5" />
                    </div>
                    {t('analyze')}
                  </>
                )}
              </Button>

              {/* Progress Bar */}
              {isAnalyzing && (
                <div className="space-y-4 animate-fade-in-up p-4 glass-card rounded-xl">
                  <Progress value={progress} className="w-full h-3 animate-pulse-glow" />
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                    <p className="text-sm font-medium text-foreground">
                      {t('processing').replace('{P}', String(Math.round(progress)))}
                    </p>
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="glass-card hover-lift animate-fade-in-up border-2 border-primary/20 rounded-2xl overflow-hidden" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="bg-gradient-to-br from-primary/5 to-accent/5 pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Info className="w-6 h-6 text-primary" />
                </div>
                {t('analysisResults')}
              </CardTitle>
              <CardDescription className="text-base">
                {t('analysisDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {prediction && selectedDisease ? (
                <div className="space-y-8 animate-fade-in-up">
                  {/* Disease Badge */}
                  <div className="flex items-center justify-center">
                    <Badge
                      variant={selectedDisease.color as any}
                      className="text-xl px-6 py-3 flex items-center gap-3 rounded-2xl shadow-lg hover:shadow-glow transition-all duration-300"
                    >
                      {IconComponent && <IconComponent className="w-6 h-6" />}
                      {prediction.disease}
                    </Badge>
                  </div>

                  {/* Confidence Score */}
                  <div className="text-center p-6 glass-card rounded-2xl">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
                      <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {Math.round(prediction.confidence * 100)}%
                      </p>
                    </div>
                    <p className="text-base font-medium text-muted-foreground">{t('confidenceScore')}</p>
                  </div>

                  {/* Treatment Advice */}
                  <div className="glass-card p-8 rounded-2xl border border-accent/30 space-y-6 hover-glow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20">
                        <Info className="w-6 h-6 text-accent" />
                      </div>
                      <h4 className="font-bold text-xl text-foreground">
                        {selectedDisease.title}
                      </h4>
                    </div>

                    <p className="text-base text-muted-foreground leading-relaxed">
                      {selectedDisease.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm flex items-center gap-1">
                          <Zap className="w-4 h-4 text-warning" />
                          {t('immediateTreatment')}
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
                          {t('preventionTips')}
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
                    {new Date(prediction.timestamp).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-accent/10 rounded-full blur-xl animate-pulse"></div>
                    <Leaf className="relative w-20 h-20 mx-auto opacity-40 animate-gentle-float" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t('readyTitle')}</h3>
                  <p className="text-base">{t('readyDesc')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* History Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="history text-2xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-xl">
                <History className="w-6 h-6 text-primary" />
              </div>
              {t('history')}
            </h3>
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
              className="glass-button rounded-xl px-6 py-3 font-semibold hover-lift"
            >
              {showHistory ? t('hideHistory') : t('showHistory')}
            </Button>
          </div>

          {showHistory && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
              {history.length > 0 ? (
                history.map((item, index) => {
                  const historyDisease = getAdviceForDisease(item.disease);
                  const HistoryIcon = historyDisease.icon;

                  return (
                    <Card key={item.id} className="glass-card hover-lift rounded-2xl border border-accent/20 overflow-hidden group"
                          style={{ animationDelay: `${index * 0.1}s` }}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant={historyDisease.color as any} className="text-sm px-3 py-1 rounded-xl">
                            <HistoryIcon className="w-4 h-4 mr-2" />
                            {item.disease}
                          </Badge>
                          <div className="text-right">
                            <span className="text-lg font-bold text-primary">
                              {Math.round(item.confidence * 100)}%
                            </span>
                            <p className="text-xs text-muted-foreground">confidence</p>
                          </div>
                        </div>

                        {item.imageUrl && (
                          <div className="rounded-xl overflow-hidden mb-4 hover-glow">
                            <img
                              src={item.imageUrl}
                              alt="Historical analysis"
                              className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        )}

                        <div className="text-center p-3 glass-card rounded-xl">
                          <p className="text-sm font-medium text-foreground">
                            {item.timestamp.toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card className="col-span-full glass-card rounded-2xl border-2 border-dashed border-accent/30">
                  <CardContent className="p-12 text-center text-muted-foreground">
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
                      <History className="relative w-16 h-16 mx-auto opacity-40 animate-gentle-float" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">{t('noHistoryTitle')}</h4>
                    <p className="text-base">{t('noHistoryDesc')}</p>
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
