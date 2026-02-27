import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldAlert, LayoutDashboard, Type, Search,
  Gamepad2, Workflow, Code2, Lock,
  Sigma, Palette, Upload, Download,
  Menu, X, Sparkles, Copy, RefreshCcw,
  Image as ImageIcon, ScanText, FileText, Table,
  Mic, Box as BoxIcon, Eye, Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as confetti from 'canvas-confetti';

// Engines
import * as privacy from './engine/privacyEngine';
import * as security from './engine/securityEngine';
import * as codeEngine from './engine/codeEngine';
import * as architecture from './engine/architectureEngine';
import * as fontEngine from './engine/fontEngine';
import * as seo from './engine/seoEngine';
// import * as game from './engine/gameEngine'; // Unused
import * as math from './engine/mathEngine';
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

// Translations
import { translations } from './translations';
import type { Language } from './translations';

// Types
type StudioID =
  | 'privacy' | 'architecture' | 'font' | 'seo'
  | 'game' | 'automation' | 'code' | 'security'
  | 'math' | 'color' | 'visual' | 'ocr'
  | 'document' | 'data' | 'audio' | '3d' | 'branding' | 'mockup' | 'analytics' | 'cyber' | 'qr' | 'motion' | 'pdf';

interface Studio {
  id: StudioID;
  icon: React.ReactNode;
}

const studios: Studio[] = [
  { id: 'motion', icon: <RefreshCcw size={16} /> },
  { id: 'pdf', icon: <FileText size={16} /> },
  { id: 'analytics', icon: <LayoutDashboard size={16} /> },
  { id: 'qr', icon: <Gamepad2 size={16} /> },
  { id: 'cyber', icon: <ShieldAlert size={16} /> },
  { id: 'mockup', icon: <Monitor size={16} /> },
  { id: 'branding', icon: <Sparkles size={16} /> },
  { id: 'privacy', icon: <ShieldAlert size={16} /> },
  { id: 'visual', icon: <ImageIcon size={16} /> },
  { id: 'ocr', icon: <ScanText size={16} /> },
  { id: 'document', icon: <FileText size={16} /> },
  { id: 'data', icon: <Table size={16} /> },
  { id: 'audio', icon: <Mic size={16} /> },
  { id: '3d', icon: <BoxIcon size={16} /> },
  { id: 'security', icon: <Lock size={16} /> },
  { id: 'code', icon: <Code2 size={16} /> },
  { id: 'architecture', icon: <LayoutDashboard size={16} /> },
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
  const [result, setResult] = useState<{ url: string, type: 'image' | 'text' | 'font' | 'svg' | '3d' | 'audio' | 'video' | 'branding', data?: any, file?: File } | null>(null);
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
  const [qrText, setQrText] = useState('https://omni-studio.pro');
  const [qrColor, setQrColor] = useState('#007aff');
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const micRecorderRef = useRef<MediaRecorder | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const audioCanvasRef = useRef<HTMLCanvasElement>(null);

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

  const processFiles = async (files: File[]) => {
    if (files.length === 0 && activeStudio !== 'qr' && activeStudio !== '3d') return;
    setIsProcessing(true);
    const file = files[0];

    try {
      let resultUrl = '';
      let type: 'image' | 'text' | 'font' | 'svg' | '3d' | 'audio' | 'video' | 'branding' = 'image';

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
          resultUrl = await qr.generateBrandedQR(qrText, qrColor);
          break;
        case 'motion':
          resultUrl = await audiogram.generateAudiogram(file);
          type = 'video';
          break;
        case 'pdf':
          resultUrl = await pdfEngine.mergeImagesToPDF(files);
          break;
        case 'ocr':
          const extractedText = await ocr.extractText(file);
          resultUrl = URL.createObjectURL(new Blob([extractedText], { type: 'text/plain' }));
          type = 'text';
          break;
        case 'document':
          if (docFormat === 'pdf') {
            resultUrl = await doc.imagesToPdf(files);
          } else {
            const txt = await file.text();
            resultUrl = await doc.textToDocx(txt);
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
          resultUrl = await math.texToSvg(tex);
          type = 'svg';
          break;
        default:
          resultUrl = URL.createObjectURL(file);
      }

      setResult({ url: resultUrl, type, file: activeStudio === '3d' ? file : undefined });
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
    <div className="app-container" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
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
            {isSidebarOpen && <h1 style={{ fontSize: 18, letterSpacing: -0.5, color: '#fff' }}>OMNI STUDIO</h1>}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="glass" style={{ border: 'none', color: '#fff', padding: 8, borderRadius: 8, cursor: 'pointer' }}>
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto', padding: '0 12px 24px' }}>
          {studios.map((studio) => (
            <div
              key={studio.id}
              onClick={() => { setActiveStudio(studio.id); setResult(null); }}
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
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#050505', position: 'relative' }}>
        <header className="workspace-header" style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ padding: 8, background: 'var(--accent-primary)', borderRadius: 10 }}>{currentStudio?.icon}</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{s.name}</h2>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div className="glass" style={{ padding: '4px 8px', borderRadius: 100, display: 'flex', gap: 4 }}>
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
            <button className="badge badge-purple" style={{ border: 'none', cursor: 'pointer' }}><Sparkles size={14} /> {t.common.pro_badge}</button>
          </div>
        </header>

        <div style={{ flex: 1, padding: '0 40px 40px', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStudio + language}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              {/* Instructions Panel */}
              <div className="glass" style={{ padding: '16px 24px', borderRadius: 24, marginBottom: 20, borderLeft: '4px solid var(--accent-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <Eye size={16} color="var(--accent-primary)" />
                  <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>How to Use</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.5 }}>{s.howToUse}</p>
              </div>

              {!result ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Contextual Utility Bars */}
                  {activeStudio === 'visual' && (
                    <div className="glass" style={{ padding: 12, borderRadius: 16, display: 'flex', gap: 8 }}>
                      {['pencil', 'anime', 'pixel', 'vintage', 'blueprint'].map(f => (
                        <button key={f} onClick={() => setSelectedFilter(f as any)} className={`badge ${selectedFilter === f ? 'badge-purple' : 'badge-blue'}`} style={{ border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
                      ))}
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
                      <input type="text" value={qrText} onChange={(e) => setQrText(e.target.value)} placeholder="QR Content..." style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--glass-border)', color: '#fff', fontSize: 12, outline: 'none', width: 250 }} />
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
                  {activeStudio === 'mockup' && (
                    <div className="glass" style={{ padding: 12, borderRadius: 16, display: 'flex', gap: 8 }}>
                      {(['iphone', 'macbook', 'billboard', 'shirt', 'mug', 'bag'] as mockup.MockupTemplate[]).map(t => (
                        <button key={t} onClick={() => setMockupTemplate(t)} className={`badge ${mockupTemplate === t ? 'badge-purple' : 'badge-blue'}`} style={{ border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1, fontSize: 10 }}>{t}</button>
                      ))}
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
                          style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid var(--glass-border)', color: '#fff', outline: 'none' }}
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
                      <span style={{ color: '#fff', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>{activeStudio} Result</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button onClick={() => setResult(null)} className="badge badge-blue" style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><X size={14} /> Close</button>
                      <a href={result.url} download={`omni_${activeStudio}_result`} className="badge badge-purple" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Download size={14} /> Download
                      </a>
                    </div>
                  </div>

                  <div className="glass" style={{ flex: 1, borderRadius: '0 0 32px 32px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', position: 'relative', minHeight: 0 }}>
                    {result.type === '3d' ? (
                      <div ref={threeContainerRef} style={{ width: '100%', height: '100%' }} />
                    ) : result.type === 'video' ? (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <video src={result.url} controls autoPlay loop style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 20 }} />
                      </div>
                    ) : result.type === 'audio' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
                        <canvas ref={audioCanvasRef} width={600} height={200} style={{ width: '80%', height: 200, borderRadius: 16 }} />
                        <audio src={result.url} controls style={{ width: '80%' }} />
                      </div>
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {result.type === 'image' && <img src={result.url} style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain', filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))' }} alt="Result" />}
                        {result.type === 'svg' && <img src={result.url} style={{ maxWidth: '80%' }} alt="Result" />}
                        {result.type === 'text' && (
                          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                            <button onClick={() => { fetch(result.url).then(r => r.text()).then(t => navigator.clipboard.writeText(t)); confetti({ particleCount: 20 }); }} className="badge badge-blue" style={{ position: 'absolute', top: 20, right: 20, border: 'none', cursor: 'pointer', zIndex: 5 }}><Copy size={14} /> Copy</button>
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
