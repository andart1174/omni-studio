import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldAlert, LayoutDashboard, Type, Search,
  Gamepad2, Workflow, Code2, Lock,
  Sigma, Palette, Upload, Download,
  Menu, X, Sparkles, Copy, RefreshCcw,
  Image as ImageIcon, ScanText, FileText, Table,
  Mic, Box as BoxIcon, Eye, Monitor, Scissors, Sun, Moon, History, QrCode,
  Eraser, Maximize, MonitorPlay
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';

// Engines
import * as privacy from './engine/privacyEngine';
import * as security from './engine/securityEngine';
import * as codeEngine from './engine/codeEngine';
import * as architecture from './engine/architectureEngine';
import * as game from './engine/gameEngine';
import * as fontEngine from './engine/fontEngine';
import * as seo from './engine/seoEngine';
import * as mathModule from './engine/mathEngine';
import * as visual from './engine/visualEngine';
import * as analytics from './engine/analyticsEngine';
import * as cyber from './engine/cyberEngine';
import * as qr from './engine/qrEngine';
import * as audiogram from './engine/motionEngine';
import * as pdfEngine from './engine/pdfEngine';
import * as ocr from './engine/ocrEngine';
import * as doc from './engine/docEngine';
import * as dataEngine from './engine/dataEngine';
import * as audio from './engine/audioEngine';
import * as three from './engine/threeEngine';
import * as branding from './engine/brandingEngine';
import * as mockup from './engine/mockupEngine';
import * as video from './engine/videoEngine';

// Translations
import { translations } from './translations';
import type { Language } from './translations';

// Types
type StudioID =
  | 'privacy' | 'architecture' | 'font' | 'seo'
  | 'game' | 'automation' | 'code' | 'security'
  | 'math' | 'color' | 'visual' | 'ocr'
  | 'document' | 'data' | 'audio' | '3d' | 'branding' | 'mockup' | 'analytics' | 'cyber' | 'qr' | 'motion' | 'pdf' | 'bg-remover' | 'eraser' | 'screen' | 'icon' | 'super-res';

interface Studio {
  id: StudioID;
  icon: React.ReactNode;
}

const studios: Studio[] = [
  { id: 'motion', icon: <RefreshCcw size={16} /> },
  { id: 'pdf', icon: <FileText size={16} /> },
  { id: 'bg-remover', icon: <Scissors size={16} /> },
  { id: 'eraser', icon: <Eraser size={16} /> },
  { id: 'super-res', icon: <Maximize size={16} /> },
  { id: 'screen', icon: <MonitorPlay size={16} /> },
  { id: 'icon', icon: <ImageIcon size={16} /> },
  { id: 'analytics', icon: <LayoutDashboard size={16} /> },
  { id: 'qr', icon: <QrCode size={16} /> },
  { id: 'cyber', icon: <ShieldAlert size={16} /> },
  { id: 'mockup', icon: <Monitor size={16} /> },
  { id: 'branding', icon: <Sparkles size={16} /> },
  { id: 'privacy', icon: <Lock size={16} /> },
  { id: 'visual', icon: <ImageIcon size={16} /> },
  { id: 'ocr', icon: <ScanText size={16} /> },
  { id: 'document', icon: <FileText size={16} /> },
  { id: 'data', icon: <Table size={16} /> },
  { id: 'audio', icon: <Mic size={16} /> },
  { id: '3d', icon: <BoxIcon size={16} /> },
  { id: 'security', icon: <Lock size={16} /> },
  { id: 'code', icon: <Code2 size={16} /> },
  { id: 'architecture', icon: <Workflow size={16} /> },
  { id: 'font', icon: <Type size={16} /> },
  { id: 'seo', icon: <Search size={16} /> },
  { id: 'game', icon: <Gamepad2 size={16} /> },
  { id: 'math', icon: <Sigma size={16} /> },
  { id: 'color', icon: <Palette size={16} /> },
  { id: 'automation', icon: <Workflow size={16} /> },
];

export default function App() {
  const [activeStudio, setActiveStudio] = useState<StudioID>('privacy');
  const [language, setLanguage] = useState<Language>('en');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string, type: 'image' | 'text' | 'font' | 'svg' | '3d' | 'audio' | 'video' | 'branding' | 'pdf' | 'docx', data?: any, file?: File } | null>(null);
  const [inputText, setInputText] = useState('');
  const [password] = useState('admin123'); // For now, hardcoded
  const [selectedFilter, setSelectedFilter] = useState<visual.FilterType>('pencil');
  const [docFormat, setDocFormat] = useState<'pdf' | 'docx'>('pdf');
  const [brandingMode, setBrandingMode] = useState<'logo' | 'palette' | 'watermark' | 'icons' | 'social'>('logo');
  const [watermarkText, setWatermarkText] = useState('Brand Studio');
  const [invertLogo, setInvertLogo] = useState(false);
  const [mockupTemplate, setMockupTemplate] = useState<mockup.MockupTemplate>('iphone');
  const [analyticsMode, setAnalyticsMode] = useState<analytics.ChartType>('bar');
  const [cyberMode, setCyberMode] = useState<'ascii' | 'hash' | 'password'>('ascii');
  const [gameMode, setGameMode] = useState<'atlas' | 'simplify'>('atlas');
  const [qrText, setQrText] = useState('https://omni-studio.pro');
  const [qrColor, setQrColor] = useState('#007aff');
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const micRecorderRef = useRef<MediaRecorder | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showHistory, setShowHistory] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [screenCapture, setScreenCapture] = useState<{ stream: MediaStream, recorder: MediaRecorder } | null>(null);
  const [upscaleFactor, setUpscaleFactor] = useState(2);
  const [brushSize, setBrushSize] = useState(40);
  const eraserCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const audioCanvasRef = useRef<HTMLCanvasElement>(null);

  // Optimized studio switching
  const switchStudio = (id: StudioID, newResult: any = null) => {
    setActiveStudio(id);
    setResult(newResult);
  };

  const getDownloadFilename = (studio: string, type: string) => {
    const base = `omni_${studio}_result`;
    if (studio === 'pdf') return `${base}.pdf`;
    if (studio === 'ocr') return `${base}.txt`;
    if (studio === 'document') return docFormat === 'pdf' ? `${base}.pdf` : `${base}.docx`;
    if (studio === 'data') return `${base}.json`;
    if (studio === 'security') return `${base}.enc`;

    switch (type) {
      case 'image': return `${base}.png`;
      case 'video': return `${base}.webm`;
      case 'audio': return `${base}.webm`;
      case 'text': return `${base}.txt`;
      case 'svg': return `${base}.svg`;
      case '3d': return `${base}.obj`;
      case 'font': return `${base}.ttf`;
      default: return base;
    }
  };

  const t = translations[language];
  const s = t.studios[activeStudio];

  useEffect(() => {
    if (activeStudio === '3d' && result?.type === '3d' && threeContainerRef.current) {
      const cleanup = three.init3DPreview(threeContainerRef.current, result.file);
      return cleanup;
    }
  }, [activeStudio, result]);

  const handleMicRecord = async () => {
    if (!isRecordingMic) {
      try {
        const { stream, analyser } = await audiogram.captureMicStream();
        micStreamRef.current = stream;

        const canvas = document.createElement('canvas');
        canvas.width = 1200; canvas.height = 1200;
        const ctx = canvas.getContext('2d')!;
        const videoStream = canvas.captureStream(30);

        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : MediaRecorder.isTypeSupported('video/webm')
            ? 'video/webm'
            : 'video/mp4';

        const combinedStream = new MediaStream([
          ...videoStream.getVideoTracks(),
          ...stream.getAudioTracks()
        ]);

        const recorder = new MediaRecorder(combinedStream, { mimeType });
        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          setResult({ url: URL.createObjectURL(blob), type: 'video' });
          setIsProcessing(false);
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        };

        micRecorderRef.current = recorder;
        recorder.start();
        setIsRecordingMic(true);
        setIsProcessing(true);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const loop = () => {
          if (micRecorderRef.current?.state !== 'recording') return;
          analyser.getByteFrequencyData(dataArray);

          // Draw to recording canvas
          ctx.fillStyle = '#0a0a0a';
          ctx.fillRect(0, 0, 1200, 1200);
          audiogram.drawWaveform(ctx, dataArray, 1200, 1200);

          // Also draw to preview canvas if available
          if (audioCanvasRef.current) {
            const pCtx = audioCanvasRef.current.getContext('2d')!;
            pCtx.fillStyle = '#0a0a0a';
            pCtx.fillRect(0, 0, audioCanvasRef.current.width, audioCanvasRef.current.height);
            audiogram.drawWaveform(pCtx, dataArray, audioCanvasRef.current.width, audioCanvasRef.current.height);
          }

          requestAnimationFrame(loop);
        };
        loop();
      } catch (err) {
        console.error("Mic access denied or error", err);
        alert("Microphone access denied or unsupported browser feature.");
        setIsProcessing(false);
      }
    } else {
      micRecorderRef.current?.stop();
      micStreamRef.current?.getTracks().forEach(t => t.stop());
      setIsRecordingMic(false);
    }
  };

  const handleScreenCapture = async () => {
    if (!isRecording) {
      try {
        const { stream, recorder } = await video.startScreenCapture();
        setScreenCapture({ stream, recorder });
        setIsRecording(true);
        recorder.start();
      } catch (e) {
        console.error("Screen capture failed:", e);
      }
    } else if (screenCapture) {
      const blob = await video.stopScreenCapture(screenCapture.stream, screenCapture.recorder);
      const url = URL.createObjectURL(blob);
      setResult({ url, type: 'video' });
      setScreenCapture(null);
      setIsRecording(false);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  };

  const processFiles = async (files: File[]) => {
    if (files.length === 0 && activeStudio !== 'qr' && activeStudio !== '3d' && activeStudio !== 'screen') return;

    if (activeStudio === 'eraser' && files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setResult({ url, type: 'image', file: files[0] });
      return;
    }
    setIsProcessing(true);
    // Track local active studio to prevent race conditions
    const processingStudio = activeStudio;
    const file = files[0];

    try {
      let resultUrl = '';
      let type: 'image' | 'text' | 'font' | 'svg' | '3d' | 'audio' | 'video' | 'branding' | 'pdf' | 'docx' = 'image';

      switch (activeStudio) {
        case 'privacy':
          resultUrl = await privacy.detectAndBlurSensitiveData(file);
          break;
        case 'visual':
          resultUrl = await visual.applyFilter(file, selectedFilter);
          break;
        case 'branding':
          if (brandingMode === 'logo') {
            resultUrl = await branding.photoToLogo(file, invertLogo);
          } else if (brandingMode === 'palette') {
            const colors = await branding.extractPalette(file);
            setResult({ url: 'branding-palette', type: 'branding', data: { mode: 'palette', colors } });
            setIsProcessing(false);
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
            return;
          } else if (brandingMode === 'watermark') {
            resultUrl = await branding.addWatermark(file, watermarkText);
          } else if (brandingMode === 'icons') {
            const icons = await branding.generateAppIconSet(file);
            setResult({ url: 'branding-icons', type: 'branding', data: { mode: 'icons', icons } });
            setIsProcessing(false);
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
            return;
          } else if (brandingMode === 'social') {
            const kit = await branding.socialKit(file);
            setResult({ url: 'branding-social', type: 'branding', data: { mode: 'social', kit } });
            setIsProcessing(false);
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
            return;
          }
          break;
        case 'mockup':
          resultUrl = await mockup.generateMockup(file, mockupTemplate);
          break;
        case 'analytics':
          const data = await analytics.parseFileData(file);
          resultUrl = await analytics.renderChart(data, analyticsMode);
          break;
        case 'cyber':
          if (cyberMode === 'ascii') {
            const ascii = await cyber.imageToASCII(file);
            resultUrl = URL.createObjectURL(new Blob([ascii], { type: 'text/plain' }));
            type = 'text';
          } else if (cyberMode === 'hash') {
            const hash = await cyber.calculateHash(file);
            resultUrl = URL.createObjectURL(new Blob([hash], { type: 'text/plain' }));
            type = 'text';
          }
          break;
        case 'qr':
          const logoObjUrl = file ? URL.createObjectURL(file) : undefined;
          resultUrl = await qr.generateBrandedQR(qrText, qrColor, logoObjUrl);
          break;
        case 'motion':
          resultUrl = await audiogram.generateAudiogram(file);
          type = 'video';
          break;
        case 'pdf':
          resultUrl = await pdfEngine.mergeImagesToPDF(files);
          type = 'pdf';
          break;
        case 'ocr':
          const extractedText = await ocr.extractText(file);
          resultUrl = URL.createObjectURL(new Blob([extractedText], { type: 'text/plain' }));
          type = 'text';
          break;
        case 'document':
          if (docFormat === 'pdf') {
            resultUrl = await doc.imagesToPdf(files);
            type = 'pdf';
          } else {
            const txt = await file.text();
            resultUrl = await doc.textToDocx(txt);
            type = 'docx';
          }
          break;
        case 'data':
          const json = await dataEngine.excelToJson(file);
          resultUrl = URL.createObjectURL(new Blob([json], { type: 'text/plain' }));
          type = 'text';
          break;
        case 'audio':
          if (file.type.startsWith('audio/')) {
            if (audioCanvasRef.current) {
              audio.createVisualizer(file, audioCanvasRef.current);
              resultUrl = URL.createObjectURL(file);
              type = 'audio';
            }
          }
          break;
        case '3d':
          resultUrl = '3d-mode';
          type = '3d';
          break;
        case 'security':
          resultUrl = await security.encryptFile(file, password || 'admin123');
          break;
        case 'code':
          const codeText = await file.text();
          const transformed = await codeEngine.transformCode(codeText, 'json-ts');
          resultUrl = URL.createObjectURL(new Blob([transformed], { type: 'text/plain' }));
          type = 'text';
          break;
        case 'architecture':
          const archCode = await file.text();
          const diagram = await architecture.generateArchitectureDiagram(archCode);
          resultUrl = URL.createObjectURL(new Blob([diagram], { type: 'text/plain' }));
          type = 'text';
          break;
        case 'font':
          resultUrl = await fontEngine.svgToFont([{ name: file.name, path: 'M 10 10 L 90 90' }]);
          type = 'font';
          break;
        case 'seo':
          resultUrl = await seo.optimizeForSEO(file, { quality: 0.8, format: 'webp' });
          break;
        case 'math':
          const tex = await file.text();
          resultUrl = await mathModule.texToSvg(tex);
          type = 'svg';
          break;
        case 'bg-remover':
          resultUrl = await visual.applyFilter(file, 'remove-bg');
          break;
        case 'game':
          if (gameMode === 'atlas') {
            resultUrl = await game.createSpriteAtlas(files);
          } else {
            resultUrl = await game.simplifyTexture(file);
          }
          break;
        case 'eraser':
          // Handled manually via Magic Remove button
          return;
        case 'super-res':
          resultUrl = await visual.applyFilter(file, 'upscale');
          break;
        case 'icon':
          const icons = await branding.generateAppIconSet(file);
          setResult({ url: icons[icons.length - 1].url, type: 'image', data: icons });
          setHistory(prev => [{ url: icons[icons.length - 1].url, type: 'image', studio: activeStudio, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
          setIsProcessing(false);
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          return;
        default:
          resultUrl = URL.createObjectURL(file);
      }

      if (activeStudio === processingStudio) {
        setResult({ url: resultUrl, type, file: activeStudio === '3d' ? file : undefined });
        setHistory(prev => [{ url: resultUrl, type, studio: activeStudio, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
      }
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    } catch (e: any) {
      console.error(e);
      alert(`Error: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentStudio = studios.find(st => st.id === activeStudio);

  return (
    <div className={`app-container ${theme}-theme`} style={{ display: 'flex', height: '100vh', overflow: 'hidden', color: 'var(--text-main)' }}>
      {/* Optimized Sidebar */}
      <aside className={`sidebar glass ${isSidebarOpen ? '' : 'collapsed'}`} style={{
        width: isSidebarOpen ? 260 : 80,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10
      }}>
        <div style={{ padding: 24, paddingBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {isSidebarOpen && <h1 style={{ fontSize: 18, letterSpacing: -0.5, color: 'var(--text-main)' }}>OMNI STUDIO</h1>}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="glass" style={{ border: 'none', color: 'var(--text-main)', padding: 8, borderRadius: 8, cursor: 'pointer' }}>
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto', padding: '0 12px 24px' }}>
          {studios.map((studio) => (
            <div
              key={studio.id}
              onClick={() => switchStudio(studio.id)}
              className={`nav-item ${activeStudio === studio.id ? 'active' : ''}`}
            >
              <div className="icon-wrapper">{studio.icon}</div>
              {isSidebarOpen && (
                <div style={{ marginLeft: 12 }}>
                  <div className="nav-title">{t.studios[studio.id].name}</div>
                  <div className="nav-desc">{t.studios[studio.id].description}</div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Workspace */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)', position: 'relative' }}>
        <header className="workspace-header" style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ padding: 8, background: 'var(--accent-primary)', borderRadius: 10 }}>{currentStudio?.icon}</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)' }}>{s.name}</h2>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div className="glass" style={{ padding: '4px 8px', borderRadius: 100, display: 'flex', gap: 4 }}>
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="badge badge-blue" style={{ border: 'none', cursor: 'pointer', padding: '4px 8px' }}>
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`badge ${language === 'en' ? 'badge-blue' : ''}`}
                style={{ border: 'none', cursor: 'pointer', fontSize: 10, padding: '4px 10px', background: language === 'en' ? 'var(--accent-primary)' : 'transparent' }}
              >EN</button>
              <button
                onClick={() => setLanguage('fr')}
                className={`badge ${language === 'fr' ? 'badge-blue' : ''}`}
                style={{ border: 'none', cursor: 'pointer', fontSize: 10, padding: '4px 10px', background: language === 'fr' ? 'var(--accent-primary)' : 'transparent' }}
              >FR</button>
            </div>
            <button onClick={() => setShowHistory(!showHistory)} className="badge badge-blue" style={{ border: 'none', cursor: 'pointer' }}>
              <History size={14} />
            </button>
            <button className="badge badge-purple" style={{ border: 'none', cursor: 'pointer' }}><Sparkles size={14} /> {t.common.pro_badge}</button>
          </div>
        </header>

        <div style={{ flex: 1, padding: '0 40px 40px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Instructions Panel - Outside AnimatePresence for instant sync */}
          <div className="glass" style={{ padding: '16px 24px', borderRadius: 24, marginBottom: 20, borderLeft: '4px solid var(--accent-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <Eye size={16} color="var(--accent-primary)" />
              <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>How to Use</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.5 }}>{t.studios[activeStudio].howToUse}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStudio + language}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >

              {showHistory && history.length > 0 && (
                <div className="glass" style={{ padding: 16, borderRadius: 24, marginBottom: 20 }}>
                  <h4 style={{ color: '#fff', fontSize: 12, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Recent Results</h4>
                  <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 10 }}>
                    {history.map((h, i) => (
                      <div key={i} onClick={() => switchStudio(h.studio, h)} style={{ minWidth: 80, cursor: 'pointer', textAlign: 'center' }}>
                        <div style={{ width: 60, height: 60, background: 'rgba(255,255,255,0.05)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
                          {h.type === 'image' ? <img src={h.url} style={{ width: '80%', height: '80%', objectFit: 'cover' }} /> : <FileText size={24} color="var(--accent-primary)" />}
                        </div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>{h.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!result ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Contextual Utility Bars */}
                  {activeStudio === 'eraser' && (
                    <div className="glass" style={{ padding: 12, borderRadius: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Brush Size:</span>
                        <input type="range" min="10" max="100" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} style={{ width: 100 }} />
                      </div>
                      <button onClick={async () => {
                        if (!eraserCanvasRef.current) return;
                        setIsProcessing(true);
                        const canvas = eraserCanvasRef.current;
                        // Capture current canvas state
                        const blob = await new Promise<Blob>(r => canvas.toBlob(b => r(b!), 'image/png'));
                        const file = new File([blob], 'masked.png', { type: 'image/png' });
                        const resultUrl = await visual.applyFilter(file, 'eraser');

                        // Update state and history
                        setResult({ url: resultUrl, type: 'image' });
                        setHistory(prev => [{
                          id: Date.now(),
                          studio: 'eraser',
                          type: 'image',
                          url: resultUrl,
                          time: new Date().toLocaleTimeString()
                        }, ...prev].slice(0, 20));

                        setIsProcessing(false);
                        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                      }} className="badge badge-purple" style={{ border: 'none', cursor: 'pointer' }}>Magic Remove</button>
                      <button onClick={() => setResult(null)} className="badge badge-blue" style={{ border: 'none', cursor: 'pointer' }}>Reset</button>
                    </div>
                  )}
                  {activeStudio === 'visual' && (
                    <div className="glass" style={{ padding: 12, borderRadius: 16, display: 'flex', gap: 8 }}>
                      {['pencil', 'anime', 'pixel', 'vintage', 'blueprint'].map(f => (
                        <button key={f} onClick={() => setSelectedFilter(f as any)} className={`badge ${selectedFilter === f ? 'badge-purple' : 'badge-blue'}`} style={{ border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
                      ))}
                    </div>
                  )}
                  {activeStudio === 'mockup' && (
                    <div className="glass" style={{ padding: 12, borderRadius: 16, display: 'flex', gap: 8 }}>
                      {['iphone', 'macbook', 'billboard', 'shirt', 'mug', 'bag'].map(t => (
                        <button key={t} onClick={() => setMockupTemplate(t as mockup.MockupTemplate)} className={`badge ${mockupTemplate === t ? 'badge-purple' : 'badge-blue'}`} style={{ border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1, fontSize: 10 }}>{t}</button>
                      ))}
                    </div>
                  )}
                  {activeStudio === 'game' && (
                    <div className="glass" style={{ padding: 12, borderRadius: 16, display: 'flex', gap: 8 }}>
                      {['atlas', 'simplify'].map(m => (
                        <button key={m} onClick={() => setGameMode(m as any)} className={`badge ${gameMode === m ? 'badge-purple' : 'badge-blue'}`} style={{ border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}>{m}</button>
                      ))}
                    </div>
                  )}
                  {activeStudio === 'super-res' && (
                    <div className="glass" style={{ padding: 12, borderRadius: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-main)' }}>Upscale Factor:</span>
                      <select value={upscaleFactor} onChange={(e) => setUpscaleFactor(Number(e.target.value))} style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: 4, padding: '2px 8px' }}>
                        <option value={2}>2x (HD)</option>
                        <option value={4}>4x (4K)</option>
                      </select>
                    </div>
                  )}
                  {activeStudio === 'screen' && (
                    <div className="glass" style={{ padding: 12, borderRadius: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                      <button onClick={handleScreenCapture} className={`badge ${isRecording ? 'badge-purple' : 'badge-blue'}`} style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, background: 'red', borderRadius: '50%', animation: isRecording ? 'pulse 1s infinite' : 'none' }} />
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                      </button>
                    </div>
                  )}
                  {activeStudio === 'icon' && (
                    <div className="glass" style={{ padding: 12, borderRadius: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>UPLOAD LOGO TO GENERATE IOS/ANDROID SET</span>
                    </div>
                  )}
                  {activeStudio === 'document' && (
                    <div className="glass" style={{ padding: 12, borderRadius: 16, display: 'flex', gap: 12 }}>
                      <button onClick={() => setDocFormat('pdf')} className={`badge ${docFormat === 'pdf' ? 'badge-purple' : 'badge-blue'}`} style={{ border: 'none', cursor: 'pointer' }}>Images to PDF</button>
                      <button onClick={() => setDocFormat('docx')} className={`badge ${docFormat === 'docx' ? 'badge-purple' : 'badge-blue'}`} style={{ border: 'none', cursor: 'pointer' }}>Text to Word</button>
                    </div>
                  )}
                  {activeStudio === 'qr' && (
                    <div className="glass" style={{ padding: 12, borderRadius: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                      <input type="text" value={qrText} onChange={(e) => setQrText(e.target.value)} placeholder="QR Content..." style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-main)', fontSize: 12, outline: 'none', width: 250 }} />
                      <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} style={{ border: 'none', width: 30, height: 30, background: 'transparent', cursor: 'pointer' }} />
                      <button onClick={() => processFiles([])} className="badge badge-purple" style={{ border: 'none', cursor: 'pointer' }}>Generate QR</button>
                    </div>
                  )}
                  {activeStudio === '3d' && (
                    <div className="glass" style={{ padding: 12, borderRadius: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                      <button onClick={() => processFiles([])} className="badge badge-blue" style={{ border: 'none', cursor: 'pointer' }}>Start 3D Viewer</button>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>OR UPLOAD .OBJ BELOW</span>
                    </div>
                  )}
                  {activeStudio === 'analytics' && (
                    <div className="glass" style={{ padding: 12, borderRadius: 16, display: 'flex', gap: 8 }}>
                      {['bar', 'line', 'pie'].map(m => (
                        <button key={m} onClick={() => setAnalyticsMode(m as any)} className={`badge ${analyticsMode === m ? 'badge-purple' : 'badge-blue'}`} style={{ border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}>{m} Chart</button>
                      ))}
                    </div>
                  )}
                  {activeStudio === 'cyber' && (
                    <div className="glass" style={{ padding: 12, borderRadius: 16, display: 'flex', gap: 8 }}>
                      {['ascii', 'hash', 'password'].map(m => (
                        <button key={m} onClick={() => setCyberMode(m as any)} className={`badge ${cyberMode === m ? 'badge-purple' : 'badge-blue'}`} style={{ border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}>{m}</button>
                      ))}
                      {cyberMode === 'password' && (
                        <button onClick={async () => {
                          const { pass, entropy } = cyber.generatePassword();
                          const url = URL.createObjectURL(new Blob([`Password: ${pass}\nEntropy: ${Math.round(entropy)} bits`], { type: 'text/plain' }));
                          setResult({ url, type: 'text' });
                        }} className="badge badge-purple" style={{ border: 'none', cursor: 'pointer' }}>New Password</button>
                      )}
                    </div>
                  )}
                  {activeStudio === 'motion' && (
                    <div className="glass" style={{ padding: 12, borderRadius: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                      <button onClick={handleMicRecord} className={`badge ${isRecordingMic ? 'badge-purple' : 'badge-blue'}`} style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, animation: isRecordingMic ? 'pulse 1.5s infinite' : 'none' }}>
                        <Mic size={14} /> {isRecordingMic ? 'Stop Recording' : 'Start Mic Recording'}
                      </button>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>OR UPLOAD MP3 BELOW</span>
                    </div>
                  )}
                  {activeStudio === 'branding' && (
                    <div className="glass" style={{ padding: 12, borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {['logo', 'palette', 'watermark', 'icons', 'social'].map(m => (
                          <button key={m} onClick={() => setBrandingMode(m as any)} className={`badge ${brandingMode === m ? 'badge-purple' : 'badge-blue'}`} style={{ border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}>{m}</button>
                        ))}
                      </div>
                      {brandingMode === 'logo' && (
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Logo Tint:</span>
                          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.05)', padding: 4, borderRadius: 8 }}>
                            <button onClick={() => setInvertLogo(false)} className={`badge ${!invertLogo ? 'badge-purple' : ''}`} style={{ border: 'none', cursor: 'pointer', fontSize: 10, background: !invertLogo ? 'var(--accent-primary)' : 'transparent' }}>White</button>
                            <button onClick={() => setInvertLogo(true)} className={`badge ${invertLogo ? 'badge-purple' : ''}`} style={{ border: 'none', cursor: 'pointer', fontSize: 10, background: invertLogo ? 'var(--accent-primary)' : 'transparent' }}>Black</button>
                          </div>
                        </div>
                      )}
                      {brandingMode === 'watermark' && (
                        <input
                          type="text"
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          placeholder="Watermark text..."
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '8px 12px', borderRadius: 8, color: '#fff', outline: 'none' }}
                        />
                      )}
                    </div>
                  )}
                  {activeStudio === 'audio' && (
                    <div className="glass" style={{ padding: 12, borderRadius: 16 }}>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <Mic size={20} color="var(--accent-primary)" />
                        <input
                          type="text"
                          placeholder="Type to speak..."
                          style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none' }}
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                        />
                        <button onClick={() => audio.textToSpeech(inputText)} className="badge badge-blue" style={{ border: 'none', cursor: 'pointer' }}>Speak</button>
                      </div>
                    </div>
                  )}

                  <div className="drop-zone" style={{ flex: 1, cursor: 'pointer', position: 'relative' }} onClick={() => !isProcessing && fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); !isProcessing && processFiles(Array.from(e.dataTransfer.files)); }}>
                    {isProcessing && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 32, zIndex: 10, backdropFilter: 'blur(10px)' }}>
                        <div style={{ textAlign: 'center', width: '100%' }}>
                          {isRecordingMic ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                              <canvas ref={audioCanvasRef} width={600} height={300} style={{ width: '80%', height: 260, borderRadius: 24, background: '#000', border: '1px solid var(--accent-primary)', boxShadow: '0 0 30px rgba(0, 122, 255, 0.2)' }} />
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff453a', animation: 'pulse 1s infinite' }} />
                                <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', letterSpacing: 2 }}>RECORDING LIVE VOICE...</span>
                              </div>
                            </div>
                          ) : (
                            <>
                              <RefreshCcw size={32} className="spin" color="var(--accent-primary)" />
                              <p style={{ marginTop: 12, fontSize: 10, fontWeight: 900, color: 'var(--accent-primary)', letterSpacing: 1 }}>PROCESSING...</p>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    <input type="file" hidden ref={fileInputRef} onChange={(e) => e.target.files && processFiles(Array.from(e.target.files))} multiple />
                    <Upload size={48} color="var(--accent-primary)" style={{ marginBottom: 24 }} />
                    <h3 style={{ color: '#fff' }}>{t.common.upload_msg}</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Industrial grade processing active</p>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0, height: '100%', minHeight: 0 }}>
                  <div className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderRadius: '24px 24px 0 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                      <span style={{ color: 'var(--text-main)', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>{activeStudio} Result</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button onClick={() => setResult(null)} className="badge badge-blue" style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><X size={14} /> Close</button>
                      <button onClick={async () => {
                        if (activeStudio === 'eraser' && eraserCanvasRef.current) {
                          const blob = await new Promise<Blob>(r => eraserCanvasRef.current!.toBlob(b => r(b!), 'image/png'));
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = getDownloadFilename(activeStudio, result.type);
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        } else if (activeStudio === 'icon' && result.data && Array.isArray(result.data)) {
                          setIsProcessing(true);
                          const zip = new JSZip();
                          for (const icon of result.data) {
                             const response = await fetch(icon.url);
                             const blob = await response.blob();
                             zip.file(`icon-${icon.size}x${icon.size}.png`, blob);
                          }
                          const content = await zip.generateAsync({ type: 'blob' });
                          const url = URL.createObjectURL(content);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'omni_icons_set.zip';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                          setIsProcessing(false);
                        } else if (activeStudio === 'branding' && result.data?.mode === 'social') {
                          setIsProcessing(true);
                          const zip = new JSZip();
                          for (const asset of result.data.kit) {
                             const response = await fetch(asset.url);
                             const blob = await response.blob();
                             const ext = asset.type === 'Profile' ? 'png' : 'jpg';
                             zip.file(`brand_${asset.type.toLowerCase()}.${ext}`, blob);
                          }
                          const content = await zip.generateAsync({ type: 'blob' });
                          const url = URL.createObjectURL(content);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'omni_social_kit.zip';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                          setIsProcessing(false);
                        } else if (activeStudio === 'branding' && result.data?.mode === 'icons') {
                          setIsProcessing(true);
                          const zip = new JSZip();
                          for (const icon of result.data.icons) {
                             const response = await fetch(icon.url);
                             const blob = await response.blob();
                             zip.file(`brand_icon_${icon.size}x${icon.size}.png`, blob);
                          }
                          const content = await zip.generateAsync({ type: 'blob' });
                          const url = URL.createObjectURL(content);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'omni_brand_icons.zip';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                          setIsProcessing(false);
                        } else {
                          const a = document.createElement('a');
                          a.href = result.url;
                          a.download = getDownloadFilename(activeStudio, result.type);
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }
                      }} className="badge badge-purple" style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </div>

                  <div className="glass" style={{ flex: 1, borderRadius: '0 0 32px 32px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', position: 'relative', minHeight: 0 }}>
                    {result.type === 'image' && result.data && activeStudio === 'icon' ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 16 }}>
                        {result.data.map((icon: any, i: number) => (
                          <div key={i} className="glass" style={{ padding: 12, borderRadius: 16, textAlign: 'center' }}>
                            <img src={icon.url} style={{ width: 64, height: 64, borderRadius: 12, marginBottom: 8 }} />
                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{icon.size}x{icon.size}</div>
                            <a href={icon.url} download={`icon-${icon.size}.png`} className="badge badge-blue" style={{ textDecoration: 'none', fontSize: 8, marginTop: 4, display: 'inline-block' }}>DL</a>
                          </div>
                        ))}
                      </div>
                    ) : result.type === 'video' ? (
                      <video src={result.url} controls style={{ width: '100%', borderRadius: 16, maxHeight: '60vh' }} />
                    ) : result.type === '3d' ? (
                      <div ref={threeContainerRef} style={{ width: '100%', height: '100%' }} />
                    ) : result.type === 'audio' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
                        <canvas ref={audioCanvasRef} width={600} height={200} style={{ width: '80%', height: 200, borderRadius: 16 }} />
                        <audio src={result.url} controls style={{ width: '80%' }} />
                      </div>
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {result.type === 'image' && activeStudio === 'eraser' ? (
                          <div style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%' }}>
                            <canvas
                              ref={eraserCanvasRef}
                              onMouseDown={(e) => {
                                setIsDrawing(true);
                                const canvas = eraserCanvasRef.current!;
                                const ctx = canvas.getContext('2d')!;
                                const rect = canvas.getBoundingClientRect();
                                const x = (e.clientX - rect.left) * (canvas.width / rect.width);
                                const y = (e.clientY - rect.top) * (canvas.height / rect.height);
                                ctx.beginPath();
                                ctx.moveTo(x, y);
                              }}
                              onMouseMove={(e) => {
                                if (!isDrawing || !eraserCanvasRef.current) return;
                                const canvas = eraserCanvasRef.current;
                                const ctx = canvas.getContext('2d')!;
                                const rect = canvas.getBoundingClientRect();
                                const x = (e.clientX - rect.left) * (canvas.width / rect.width);
                                const y = (e.clientY - rect.top) * (canvas.height / rect.height);
                                ctx.lineCap = 'round';
                                ctx.lineJoin = 'round';
                                ctx.strokeStyle = 'white';
                                ctx.lineWidth = brushSize;
                                ctx.lineTo(x, y);
                                ctx.stroke();
                              }}
                              onMouseUp={() => setIsDrawing(false)}
                              onMouseLeave={() => setIsDrawing(false)}
                              style={{ maxWidth: '100%', maxHeight: '80vh', cursor: 'crosshair', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                            />
                            {/* Hidden Image for Initial Load */}
                            <img
                              src={result.url}
                              onLoad={(e) => {
                                const img = e.currentTarget;
                                const canvas = eraserCanvasRef.current!;
                                const ctx = canvas.getContext('2d')!;
                                canvas.width = img.naturalWidth;
                                canvas.height = img.naturalHeight;
                                ctx.drawImage(img, 0, 0);
                              }}
                              style={{ display: 'none' }}
                            />
                            <div style={{ position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: 'var(--text-muted)', fontWeight: 700 }}>BRUSH OVER OBJECTS AND CLICK MAGIC REMOVE</div>
                          </div>
                        ) : result.type === 'image' && (
                          <img src={result.url} style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain', filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))' }} alt="Result" />
                        )}
                        {result.type === 'svg' && <img src={result.url} style={{ maxWidth: '80%' }} alt="Result" />}
                        {result.type === 'text' && (
                          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                            <button onClick={() => { if (result) { fetch(result.url).then(r => r.text()).then(t => navigator.clipboard.writeText(t)); confetti({ particleCount: 20 }); } }} className="badge badge-blue" style={{ position: 'absolute', top: 20, right: 20, border: 'none', cursor: 'pointer', zIndex: 5 }}><Copy size={14} /> Copy</button>
                            <iframe src={result.url} style={{ width: '100%', height: '100%', border: 'none', padding: 20 }} title="Result" />
                          </div>
                        )}
                        {result.type === 'font' && <div style={{ textAlign: 'center', color: '#fff' }}><Type size={100} /><h3>Font Ready</h3></div>}
                        {result.type === 'branding' && result.data && (
                          <div style={{ width: '100%', height: '100%', padding: 40, overflowY: 'auto' }}>
                            {result.data.mode === 'palette' && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
                                {result.data.colors.map((c: string, i: number) => (
                                  <div key={i} style={{ textAlign: 'center' }}>
                                    <div style={{ width: 100, height: 100, background: c, borderRadius: 16, border: '4px solid rgba(255,255,255,0.1)', marginBottom: 8 }} />
                                    <code style={{ color: '#fff', fontSize: 12 }}>{c}</code>
                                  </div>
                                ))}
                              </div>
                            )}
                            {result.data.mode === 'icons' && (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 24 }}>
                                {result.data.icons.map((icon: any, i: number) => (
                                  <div key={i} style={{ padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 20, textAlign: 'center' }}>
                                    <img src={icon.url} style={{ width: Math.min(64, icon.size), height: Math.min(64, icon.size), borderRadius: 8, marginBottom: 8 }} alt={`Icon ${icon.size}`} />
                                    <div style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{icon.size}x{icon.size}</div>
                                    <a href={icon.url} download={`icon_${icon.size}.png`} style={{ fontSize: 10, color: 'var(--accent-primary)', textDecoration: 'none', display: 'block', marginTop: 4 }}>Download</a>
                                  </div>
                                ))}
                              </div>
                            )}
                            {result.data.mode === 'social' && (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                                {result.data.kit.map((asset: any, i: number) => (
                                  <div key={i} className="glass" style={{ padding: 16, borderRadius: 20, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                      <span style={{ color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>{asset.type}</span>
                                      <a href={asset.url} download={`brand_${asset.type.toLowerCase()}.png`} className="badge badge-purple" style={{ textDecoration: 'none', fontSize: 10 }}>Download</a>
                                    </div>
                                    <div style={{ flex: 1, background: '#111', borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
                                      <img src={asset.url} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt={asset.type} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', background: '#000' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: '#666' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#30d158' }}></div>
            <span>{t.common.secure_msg}</span>
          </div>
          <div style={{ fontSize: 11, color: '#444' }}>OmniConvert v2.1 Platinum</div>
        </footer>
      </main>

      <style>{`
        .sidebar-nav::-webkit-scrollbar { width: 4px; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .nav-item { display: flex; align-items: center; padding: 10px 12px; margin-bottom: 4px; border-radius: 12px; cursor: pointer; transition: 0.2s; color: rgba(255,255,255,0.6); }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .nav-item.active { background: var(--accent-primary); color: #fff; }
        .icon-wrapper { min-width: 28px; display: flex; align-items: center; justify-content: center; }
        .nav-title { font-size: 13px; font-weight: 700; }
        .nav-desc { font-size: 10px; opacity: 0.7; }
        .collapsed .nav-item { justify-content: center; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
