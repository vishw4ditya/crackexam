import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { Search, Plus, BookOpen, LogOut, GraduationCap, School, Layers, Calendar, Trash2, X, ExternalLink, Download, FileText, FileUp, AlertCircle, Target, Zap, ShieldCheck, ArrowRight, User, Instagram, Twitter, Linkedin, Facebook, Mail, MapPin, Github, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

// Use dynamic API URL: empty string in production (same domain), localhost in development
const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

// --- Components ---

const Footer = () => (
  <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-slate-900 p-2 rounded-xl">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tightest uppercase">CrackExam</span>
          </Link>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            The ultimate repository for university question papers. Empowering students with the tools they need to achieve academic excellence and crack every exam.
          </p>
          <div className="flex items-center space-x-4">
            <a href="https://www.instagram.com/webaura_3/" className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300">
              <Instagram className="h-5 w-5" />
            </a>
            
            <a href="#" className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300">
              <Linkedin className="h-5 w-5" />
            </a>
           
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] mb-8">Navigation</h4>
          <ul className="space-y-4">
            <li><Link to="/" className="text-slate-500 hover:text-indigo-600 text-sm font-semibold transition-colors">Digital Archive</Link></li>
            <li><Link to="/login" className="text-slate-500 hover:text-indigo-600 text-sm font-semibold transition-colors">Administrator Portal</Link></li>
            <li><Link to="/help" className="text-slate-500 hover:text-indigo-600 text-sm font-semibold transition-colors">Study Resources</Link></li>
            <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm font-semibold transition-colors">Exam Tips</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] mb-8">Resources</h4>
          <ul className="space-y-4">
            <li><Link to="/help" className="text-slate-500 hover:text-indigo-600 text-sm font-semibold transition-colors">Help Center</Link></li>
            <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm font-semibold transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm font-semibold transition-colors">Terms of Service</a></li>
            <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm font-semibold transition-colors">Cookie Policy</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h4 className="text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] mb-8">Connect with Us</h4>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-50 p-2 rounded-lg mt-0.5">
                <Mail className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Email Support</p>
                <a href="mailto:support@crackexam.com" className="text-slate-900 font-bold text-sm hover:text-indigo-600 transition-colors">webauracompany@gmail.com</a>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-50 p-2 rounded-lg mt-0.5">
                <MapPin className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Office Hub</p>
                <p className="text-slate-900 font-bold text-sm">Lucknow, Uttar Pradesh</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} CrackExam Technologies. All Rights Reserved.
        </p>
        <div className="flex items-center space-x-6 text-slate-400 text-[10px] font-black uppercase tracking-widest">
          <a href="#" className="hover:text-indigo-600 transition-colors">Status: Operational</a>
          <div className="h-1 w-1 bg-slate-200 rounded-full"></div>
          <a href="#" className="hover:text-indigo-600 transition-colors flex items-center">
            <Github className="h-3 w-3 mr-2" /> 
            v2.0.4-stable
          </a>
        </div>
      </div>
    </div>
  </footer>
);

const Modal = ({ isOpen, onClose, paper }) => {
  const [isFocused, setIsFocused] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const iframeRef = useRef(null);

  // Reset error state and zoom when paper changes
  useEffect(() => {
    setPdfError(false);
    setZoomLevel(100);
  }, [paper]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleZoomReset = () => {
    setZoomLevel(100);
  };

  // Auto-configure PDF view settings
  useEffect(() => {
    if (isOpen && iframeRef.current) {
      // Auto-adjust PDF view after iframe loads
      const timer = setTimeout(() => {
        try {
          const iframe = iframeRef.current;
          if (iframe && iframe.contentWindow) {
            // Try to auto-fit PDF to page width
            iframe.contentWindow.postMessage({
              type: 'zoom',
              value: 'page-width'
            }, '*');
          }
        } catch (err) {
          // Silently handle cross-origin restrictions
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, paper]);

  useEffect(() => {
    if (isOpen) {
      const handleBlur = () => setIsFocused(false);
      const handleFocus = () => setIsFocused(true);
      
      const preventDefaults = (e) => {
        // Prevent Right Click
        if (e.type === 'contextmenu') {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        
        // Prevent Print, Save, Copy, Inspect, and other shortcuts
        if (e.ctrlKey || e.metaKey) {
          const blockedKeys = ['p', 's', 'u', 'c', 'a', 'i', 'j', 'k', 'o'];
          if (blockedKeys.includes(e.key.toLowerCase())) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
          }
        }
        
        // Prevent PrintScreen and F12 (DevTools)
        if (e.key === 'PrintScreen' || e.key === 'F12') {
          e.preventDefault();
          e.stopPropagation();
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('Screenshots and downloads are disabled for security.');
          }
          return false;
        }
        
        // Prevent Alt+Tab detection (when window loses focus)
        if (e.altKey && e.key === 'Tab') {
          setIsFocused(false);
        }
      };

      // Prevent text selection
      const preventSelect = (e) => {
        e.preventDefault();
        return false;
      };

      // Detect screenshot attempts via clipboard
      const handleCopy = (e) => {
        e.preventDefault();
        e.clipboardData.setData('text/plain', 'Content copying is disabled for security.');
        return false;
      };

      // Mobile-specific: Prevent long-press context menu
      const handleTouchStart = (e) => {
        if (e.touches.length > 1) {
          e.preventDefault(); // Prevent pinch zoom
        }
      };

      const handleTouchMove = (e) => {
        if (e.touches.length > 1) {
          e.preventDefault(); // Prevent pinch zoom
        }
      };

      // Prevent mobile screenshot gestures
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setIsFocused(false);
        } else {
          setIsFocused(true);
        }
      };

      window.addEventListener('blur', handleBlur);
      window.addEventListener('focus', handleFocus);
      window.addEventListener('contextmenu', preventDefaults, true);
      window.addEventListener('keydown', preventDefaults, true);
      window.addEventListener('keyup', preventDefaults, true);
      document.addEventListener('selectstart', preventSelect);
      document.addEventListener('copy', handleCopy, true);
      document.addEventListener('cut', handleCopy, true);
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        window.removeEventListener('blur', handleBlur);
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('contextmenu', preventDefaults, true);
        window.removeEventListener('keydown', preventDefaults, true);
        window.removeEventListener('keyup', preventDefaults, true);
        document.removeEventListener('selectstart', preventSelect);
        document.removeEventListener('copy', handleCopy, true);
        document.removeEventListener('cut', handleCopy, true);
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [isOpen]);

  if (!isOpen || !paper) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300 select-none ${!isFocused ? 'brightness-50 grayscale' : ''}`}>
      <div className={`bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl w-full max-w-7xl overflow-hidden animate-in zoom-in-95 border border-white/20 flex flex-col h-[98vh] sm:h-[95vh] relative transition-all duration-500 ${!isFocused ? 'blur-2xl scale-95 opacity-50' : ''}`}>
        
        {/* Anti-Screenshot Overlay message when blurred */}
        {!isFocused && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none">
            <div className="bg-slate-900/80 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-sm backdrop-blur-md border border-white/10 shadow-2xl">
              Content Hidden for Security
            </div>
          </div>
        )}

        {/* Anti-Screenshot Watermark Layers */}
        <div className="absolute inset-0 z-[60] pointer-events-none overflow-hidden opacity-[0.03] sm:opacity-[0.04] flex items-center justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 sm:gap-20 -rotate-12 scale-100 sm:scale-150">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="text-lg sm:text-4xl font-black whitespace-nowrap uppercase tracking-[0.3em] sm:tracking-[0.5em] text-slate-400">
                CrackExam Protected • {new Date().toLocaleDateString()} • View Only
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 z-[61] pointer-events-none overflow-hidden opacity-[0.015] sm:opacity-[0.02] flex items-center justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 sm:gap-32 rotate-12 scale-75 sm:scale-125">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="text-base sm:text-3xl font-black whitespace-nowrap uppercase tracking-[0.2em] sm:tracking-[0.4em] text-indigo-300">
                No Download • No Screenshot • Secure View
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white shrink-0 relative z-[70]">
          <div className="flex items-center space-x-3 sm:space-x-5 flex-1 min-w-0">
            <div className="bg-red-500 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl shadow-red-100 ring-4 ring-red-50 shrink-0">
              <FileText className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-1 flex-wrap">
                <span className="px-2 sm:px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] sm:text-[10px] font-black uppercase rounded-lg tracking-wider">Year {paper.year}</span>
                <span className="text-slate-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em]">{paper.degree}</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight truncate">{paper.subject}</h2>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold flex items-center mt-0.5 uppercase tracking-wider truncate">
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-indigo-400 shrink-0" /> <span className="truncate">{paper.stream} • {paper.college}</span>
              </p>
            </div>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <div className="flex items-center bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 overflow-hidden">
              <button 
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
                className="p-2 sm:p-3 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button 
                onClick={handleZoomReset}
                className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-black text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 border-x border-slate-100"
                title="Reset Zoom"
              >
                {zoomLevel}%
              </button>
              <button 
                onClick={handleZoomIn}
                disabled={zoomLevel >= 200}
                className="p-2 sm:p-3 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
            <button onClick={onClose} className="p-2 sm:p-3 bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-xl sm:rounded-2xl transition-all duration-300 border border-slate-100 group shrink-0">
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>
        
        <div className="flex-grow bg-slate-50 relative overflow-hidden group/viewer">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
            <Target className="w-96 h-96 text-indigo-900 rotate-12" />
          </div>
          
          {/* Transparent click-blocker to prevent right-click on PDF internal UI */}
          <div className="absolute inset-0 z-50 bg-transparent" onContextMenu={(e) => e.preventDefault()}></div>

          {pdfError ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
              <div className="text-center p-10">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-2">PDF Loading Error</p>
                <p className="text-slate-400 text-xs">Unable to display the document. Please try again.</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full overflow-auto relative" style={{ zoom: `${zoomLevel}%` }}>
              <iframe 
                ref={iframeRef}
                src={(() => {
                  let pdfUrl = paper.content;
                  
                  // Handle both relative paths and full URLs
                  if (pdfUrl.startsWith('/')) {
                    const baseUrl = API_BASE_URL || window.location.origin;
                    pdfUrl = baseUrl + pdfUrl;
                  }
                  
                  // Ensure URL is properly encoded for mobile browsers
                  try {
                    // Add PDF viewer parameters
                    const urlObj = new URL(pdfUrl);
                    urlObj.hash = 'toolbar=0&navpanes=0&scrollbar=1&view=FitV&zoom=page-width&page=1';
                    return urlObj.toString();
                  } catch (e) {
                    // Fallback if URL parsing fails
                    return `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitV&zoom=page-width&page=1`;
                  }
                })()}
                className="w-full h-full border-none relative z-10 pointer-events-auto"
                title={paper.fileName || 'PDF Document'}
                style={{ 
                  userSelect: 'none', 
                  WebkitUserSelect: 'none',
                  touchAction: 'pan-x pan-y pinch-zoom',
                  minHeight: '100%',
                  minWidth: '100%'
                }}
                allow="fullscreen"
                loading="lazy"
                onError={(e) => {
                  console.error('PDF iframe error for:', paper.content, e);
                  setPdfError(true);
                }}
                onLoad={() => {
                  setPdfError(false);
                  // Auto-adjust PDF view on load
                  setTimeout(() => {
                    try {
                      if (iframeRef.current?.contentWindow) {
                        // Auto-fit to page width
                        iframeRef.current.contentWindow.postMessage({
                          type: 'zoom',
                          value: 'page-width'
                        }, '*');
                      }
                    } catch (err) {
                      // Silently handle cross-origin restrictions
                    }
                  }, 800);
                }}
              />
            </div>
          )}
        </div>

        <div className="p-4 sm:p-8 border-t border-slate-100 bg-white flex justify-end items-center shrink-0">
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-slate-900 text-white rounded-xl sm:rounded-[1.2rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all duration-300 shadow-2xl shadow-slate-200 active:scale-[0.98]"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ admin, onLogout }) => (
  <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-20 items-center">
        <Link to="/" className="flex items-center space-x-3.5 group">
          <div className="bg-slate-900 p-2.5 rounded-[1.2rem] group-hover:bg-indigo-600 group-hover:rotate-[15deg] transition-all duration-500 shadow-xl shadow-slate-200 group-hover:shadow-indigo-100">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-2xl font-[900] tracking-tightest bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-600 bg-clip-text text-transparent">
              CrackExam
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Smart Prep</span>
          </div>
        </Link>
        <div className="flex items-center space-x-3 sm:space-x-6">
          {admin ? (
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="text-slate-500 hover:text-indigo-600 font-bold px-4 py-2.5 transition-colors rounded-xl hover:bg-indigo-50/50 text-sm">Dashboard</Link>
              <div className="h-4 w-px bg-slate-200"></div>
              <button 
                onClick={onLogout}
                className="flex items-center space-x-2.5 bg-slate-900 hover:bg-red-600 text-white px-6 py-3 rounded-[1rem] transition-all duration-300 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-100 active:scale-95"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Terminate Session</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-indigo-50/50 hover:bg-indigo-100 text-indigo-600 font-black px-7 py-3.5 rounded-[1.2rem] transition-all duration-300 text-[10px] uppercase tracking-widest border border-indigo-100/50 group flex items-center">
              <span>Admin Access</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  </nav>
);

const Home = () => {
  const [papers, setPapers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ college: '', degree: '', stream: '', subject: '', year: '' });
  const [selectedPaper, setSelectedPaper] = useState(null);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/papers`);
      const data = await response.json();
      setPapers(data);
    } catch (error) {
      console.error('Error fetching papers:', error);
    }
  };

  const filteredPapers = papers.filter(p => {
    const matchesSearch = p.college.toLowerCase().includes(search.toLowerCase()) || 
                          p.degree.toLowerCase().includes(search.toLowerCase()) ||
                          p.subject?.toLowerCase().includes(search.toLowerCase()) ||
                          p.stream.toLowerCase().includes(search.toLowerCase());
    const matchesCollege = !filter.college || p.college === filter.college;
    const matchesDegree = !filter.degree || p.degree === filter.degree;
    const matchesStream = !filter.stream || p.stream === filter.stream;
    const matchesSubject = !filter.subject || p.subject === filter.subject;
    const matchesYear = !filter.year || p.year === filter.year;
    return matchesSearch && matchesCollege && matchesDegree && matchesStream && matchesSubject && matchesYear;
  });

  const uniqueColleges = [...new Set(papers.map(p => p.college))];
  const uniqueDegrees = [...new Set(papers.map(p => p.degree))];
  const uniqueStreams = [...new Set(papers.map(p => p.stream))];
  const uniqueSubjects = [...new Set(papers.map(p => p.subject).filter(Boolean))];

  return (
    <div className="min-h-screen pb-32">
      {/* Hero Section */}
      <div className="bg-white py-28 sm:py-36 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-50 rounded-full blur-[140px] opacity-60"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2.5 px-5 py-2.5 mb-10 text-[10px] font-black tracking-[0.25em] text-indigo-600 uppercase bg-indigo-50/50 rounded-full border border-indigo-100/50 backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 fill-indigo-600" />
            <span>Smart Exam Preparation Platform</span>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 mb-8 tracking-tightest leading-[0.85] uppercase">
            Crack Your <br/>
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-900 to-slate-900 bg-clip-text text-transparent italic">
              Exams Fast.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-14 leading-relaxed font-medium">
            Access a high-performance repository of university question papers. 
            Engineered for students who value speed and academic precision.
          </p>
          
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-violet-600 to-indigo-500 rounded-[2.2rem] blur-2xl opacity-10 group-focus-within:opacity-25 transition duration-700 animate-pulse"></div>
            <div className="relative">
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400 h-6 w-6 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by institution, subject, or degree type..."
                className="w-full pl-16 pr-8 py-7 rounded-[2.2rem] bg-white border-2 border-slate-100/50 text-slate-900 text-lg sm:text-xl focus:ring-0 focus:border-indigo-600/20 outline-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] focus:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.1)] transition-all duration-500 font-bold placeholder:text-slate-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden sm:block mr-2">Press enter to search</span>
                <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-xl shadow-slate-200">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white p-2 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-slate-100 mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            <div className="relative group">
              <div className="absolute left-5 top-5 pointer-events-none text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                <School className="h-4 w-4" />
              </div>
              <select 
                className="w-full pl-12 pr-4 pt-9 pb-3.5 rounded-[1.8rem] border-0 bg-slate-50 text-slate-900 font-bold focus:ring-0 outline-none transition-all appearance-none cursor-pointer hover:bg-slate-100/50"
                value={filter.college}
                onChange={(e) => setFilter({...filter, college: e.target.value})}
              >
                <option value="">All Institutions</option>
                {uniqueColleges.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <label className="text-[9px] font-black text-slate-400 uppercase absolute left-12 top-4.5 pointer-events-none tracking-[0.2em]">Institution</label>
            </div>

            <div className="relative group">
              <div className="absolute left-5 top-5 pointer-events-none text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                <GraduationCap className="h-4 w-4" />
              </div>
              <select 
                className="w-full pl-12 pr-4 pt-9 pb-3.5 rounded-[1.8rem] border-0 bg-slate-50 text-slate-900 font-bold focus:ring-0 outline-none transition-all appearance-none cursor-pointer hover:bg-slate-100/50"
                value={filter.degree}
                onChange={(e) => setFilter({...filter, degree: e.target.value})}
              >
                <option value="">All Degrees</option>
                {uniqueDegrees.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <label className="text-[9px] font-black text-slate-400 uppercase absolute left-12 top-4.5 pointer-events-none tracking-[0.2em]">Degree Type</label>
            </div>

            <div className="relative group">
              <div className="absolute left-5 top-5 pointer-events-none text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                <Layers className="h-4 w-4" />
              </div>
              <select 
                className="w-full pl-12 pr-4 pt-9 pb-3.5 rounded-[1.8rem] border-0 bg-slate-50 text-slate-900 font-bold focus:ring-0 outline-none transition-all appearance-none cursor-pointer hover:bg-slate-100/50"
                value={filter.stream}
                onChange={(e) => setFilter({...filter, stream: e.target.value})}
              >
                <option value="">All Streams</option>
                {uniqueStreams.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <label className="text-[9px] font-black text-slate-400 uppercase absolute left-12 top-4.5 pointer-events-none tracking-[0.2em]">Course Stream</label>
            </div>

            <div className="relative group">
              <div className="absolute left-5 top-5 pointer-events-none text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                <BookOpen className="h-4 w-4" />
              </div>
              <select 
                className="w-full pl-12 pr-4 pt-9 pb-3.5 rounded-[1.8rem] border-0 bg-slate-50 text-slate-900 font-bold focus:ring-0 outline-none transition-all appearance-none cursor-pointer hover:bg-slate-100/50"
                value={filter.subject}
                onChange={(e) => setFilter({...filter, subject: e.target.value})}
              >
                <option value="">All Subjects</option>
                {uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <label className="text-[9px] font-black text-slate-400 uppercase absolute left-12 top-4.5 pointer-events-none tracking-[0.2em]">Subject</label>
            </div>

            <div className="relative group">
              <div className="absolute left-5 top-5 pointer-events-none text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                <Calendar className="h-4 w-4" />
              </div>
              <select 
                className="w-full pl-12 pr-4 pt-9 pb-3.5 rounded-[1.8rem] border-0 bg-slate-50 text-slate-900 font-bold focus:ring-0 outline-none transition-all appearance-none cursor-pointer hover:bg-slate-100/50"
                value={filter.year}
                onChange={(e) => setFilter({...filter, year: e.target.value})}
              >
                <option value="">All Years</option>
                {[1, 2, 3, 4].map(y => <option key={y} value={y.toString()}>Year {y}</option>)}
              </select>
              <label className="text-[9px] font-black text-slate-400 uppercase absolute left-12 top-4.5 pointer-events-none tracking-[0.2em]">Academic Year</label>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-14 gap-6">
          <div className="flex items-center space-x-6">
            <h2 className="text-4xl font-black text-slate-900 tracking-tightest uppercase">Archive</h2>
            <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex flex-col">
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] leading-none mb-1">{filteredPapers.length} Records</p>
              <p className="text-slate-900 font-bold text-xs uppercase tracking-widest leading-none">Smart Library</p>
            </div>
          </div>
          <button 
            onClick={() => {setSearch(''); setFilter({ college: '', degree: '', stream: '', subject: '', year: '' });}}
            className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-indigo-600 transition-colors py-3 px-8 rounded-2xl bg-slate-50 active:scale-95 border border-slate-100"
          >
            Clear All Selections
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPapers.length > 0 ? (
            filteredPapers.map(paper => (
              <div key={paper.id} className="group bg-white rounded-[3rem] p-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.02)] border border-slate-100 hover:border-indigo-100 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.08)] hover:-translate-y-2 transition-all duration-500 relative flex flex-col h-full">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/30 rounded-bl-[6rem] -mr-12 -mt-12 group-hover:bg-indigo-600 group-hover:rotate-6 transition-all duration-700 pointer-events-none opacity-50 group-hover:opacity-100"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-10">
                    <div className="p-5 bg-slate-50 rounded-[1.8rem] text-slate-300 group-hover:bg-white group-hover:text-indigo-600 group-hover:rotate-12 transition-all duration-500 shadow-sm ring-1 ring-slate-100">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest mb-3 group-hover:bg-indigo-600 transition-colors shadow-xl shadow-slate-100 group-hover:shadow-indigo-100">
                        Year {paper.year}
                      </div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-indigo-900/40 transition-colors">{paper.degree}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-black text-slate-900 mb-5 leading-[1.05] tracking-tightest uppercase group-hover:text-indigo-600 transition-colors">{paper.subject}</h3>
                  
                  <div className="space-y-4 mb-12 flex-grow">
                    <div className="flex items-center text-slate-500 font-bold text-[13px] bg-slate-50/50 py-3 px-5 rounded-2xl border border-slate-100 group-hover:bg-indigo-50/30 group-hover:border-indigo-100 transition-all duration-500">
                      <School className="h-4.5 w-4.5 mr-3.5 text-indigo-400 group-hover:scale-110 transition-transform" /> 
                      <span className="truncate">{paper.college}</span>
                    </div>
                    <div className="flex items-center text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] px-5 transition-all duration-500 group-hover:text-indigo-900/60">
                      <Layers className="h-3.5 w-3.5 mr-2.5" /> 
                      <span className="truncate">{paper.stream}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full py-5.5 bg-slate-900 text-white rounded-[1.6rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all duration-500 flex items-center justify-center space-x-4 group/btn shadow-2xl shadow-slate-200 group-hover:shadow-indigo-200 active:scale-[0.98]"
                    onClick={() => setSelectedPaper(paper)}
                  >
                    <span>Analyze Document</span>
                    <ArrowRight className="h-4.5 w-4.5 group-hover/btn:translate-x-1.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-48 bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-100">
              <div className="bg-white inline-flex p-10 rounded-[3rem] shadow-2xl shadow-slate-200 mb-10 animate-bounce">
                <Target className="h-14 w-14 text-indigo-100" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tightest uppercase">Zero Matches</h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.4em] max-w-sm mx-auto leading-loose mb-10">The requested resource could not be located in our verified database.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => {setSearch(''); setFilter({ college: '', degree: '', stream: '', subject: '', year: '' });}}
                  className="px-10 py-5 bg-white text-indigo-600 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-xl shadow-indigo-100/10 active:scale-95"
                >
                  Reset Search Index
                </button>
                <Link 
                  to="/help"
                  className="px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-slate-200 active:scale-95 flex items-center"
                >
                  Request Missing Paper <ArrowRight className="h-4 w-4 ml-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal 
        isOpen={!!selectedPaper} 
        onClose={() => setSelectedPaper(null)} 
        paper={selectedPaper} 
      />
    </div>
  );
};

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin__abc__123' && password === '201admin102') {
      onLogin();
      navigate('/admin');
    } else {
      setError('AUTHENTICATION FAILED: INVALID SECURITY KEY');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-14 sm:p-20 rounded-[4.5rem] shadow-[0_50px_150px_-30px_rgba(0,0,0,0.08)] border border-slate-100 w-full max-w-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-bl-full -mr-32 -mt-32 pointer-events-none opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-50/50 rounded-tr-full -ml-24 -mb-24 pointer-events-none opacity-40"></div>
        
        <div className="text-center mb-16 relative z-10">
          <Link to="/" className="inline-flex p-7 bg-slate-900 rounded-[2.2rem] mb-10 shadow-2xl shadow-slate-200 animate-in zoom-in hover:rotate-[360deg] transition-all duration-1000">
            <Target className="h-12 w-12 text-white" />
          </Link>
          <h2 className="text-5xl font-black text-slate-900 tracking-tightest uppercase mb-4 leading-none">Terminal Access</h2>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.4em] mt-3">Level 1 Administrator Authorization</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-6">Admin Identifier</label>
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                className="w-full pl-16 pr-8 py-6 rounded-[1.8rem] bg-slate-50 border border-slate-100 outline-none focus:ring-0 focus:border-indigo-600/20 focus:bg-white transition-all duration-500 font-black text-slate-900 placeholder:text-slate-300 tracking-wide shadow-inner"
                placeholder="USERNAME"
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-6">Encryption Key</label>
            <div className="relative group">
              <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="password" 
                className="w-full pl-16 pr-8 py-6 rounded-[1.8rem] bg-slate-50 border border-slate-100 outline-none focus:ring-0 focus:border-indigo-600/20 focus:bg-white transition-all duration-500 font-black text-slate-900 placeholder:text-slate-300 tracking-[0.5em] shadow-inner"
                placeholder="••••••••"
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && (
            <div className="p-6 bg-red-50 rounded-3xl border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-[0.25em] animate-pulse flex items-center justify-center space-x-3">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
          <button 
            type="submit" 
            className="w-full py-7 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-indigo-600 transition-all duration-500 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] group active:scale-[0.98]"
          >
            <span>Initialize Secure Login</span>
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = ({ admin }) => {
  const [papers, setPapers] = useState([]);
  const [formData, setFormData] = useState({ college: '', degree: '', stream: '', subject: '', year: '1', content: '', fileName: '' });
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) navigate('/login');
    fetchPapers();
  }, [admin]);

  const fetchPapers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/papers`);
      const data = await response.json();
      setPapers(data);
    } catch (error) {
      console.error('Error fetching papers:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        alert('Please upload a PDF file only.');
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
      setFormData(prev => ({ ...prev, fileName: selectedFile.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !formData.content) {
      alert('Please upload a PDF file or provide a URL.');
      return;
    }

    setIsUploading(true);
    const data = new FormData();
    data.append('college', formData.college);
    data.append('degree', formData.degree);
    data.append('stream', formData.stream);
    data.append('subject', formData.subject);
    data.append('year', formData.year);
    
    if (file) {
      data.append('pdf', file);
    } else {
      data.append('content', formData.content);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/papers`, {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        alert('SYSTEM NOTIFICATION: ARCHIVE SEQUENCE COMPLETE. RECORD SECURED.');
        setFormData({ college: '', degree: '', stream: '', subject: '', year: '1', content: '', fileName: '' });
        setFile(null);
        if (document.getElementById('pdf-upload')) document.getElementById('pdf-upload').value = '';
        fetchPapers();
      } else {
        const err = await response.json();
        alert('System Error: ' + err.error);
      }
    } catch (error) {
      alert('Network transmission failed. Verify server status.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('CRITICAL ACTION: This will permanently purge the record. Proceed?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/papers/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchPapers();
        }
      } catch (error) {
        console.error('Delete operation failed:', error);
      }
    }
  };

  if (!admin) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
        <div className="flex-grow">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-3.5 h-3.5 bg-green-500 rounded-full animate-ping absolute inset-0"></div>
              <div className="w-3.5 h-3.5 bg-green-500 rounded-full relative"></div>
            </div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Mainframe Status: Active</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-black text-slate-900 tracking-tightest leading-[0.85] uppercase">Command <br/><span className="bg-gradient-to-r from-indigo-600 via-indigo-900 to-slate-900 bg-clip-text text-transparent">Console.</span></h1>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.25em] mt-8 flex items-center">
            <Layers className="h-5 w-5 mr-3 text-indigo-200" />
            Synchronized Repository: {papers.length} Valid Records
          </p>
        </div>
        <div className="flex items-center p-6 bg-white rounded-[2.5rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.06)] border border-slate-100 group hover:border-indigo-100 transition-colors duration-500">
          <div className="w-16 h-16 bg-slate-900 rounded-[1.4rem] flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-slate-200 group-hover:bg-indigo-600 transition-all duration-500 group-hover:rotate-6">AD</div>
          <div className="px-8 border-l border-slate-100 ml-6">
            <p className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none mb-1.5">Master Administrator</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Unlimited Access Rights</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-1">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.08)] border border-slate-100 sticky top-32 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-600 via-indigo-900 to-slate-900"></div>
            <div className="flex items-center space-x-5 mb-12">
              <div className="p-4 bg-slate-50 rounded-2xl text-slate-900 shadow-sm ring-1 ring-slate-100">
                <FileUp className="h-6.5 w-6.5" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tightest uppercase">New Index</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Institution</label>
                <input 
                  className="w-full p-5.5 rounded-[1.4rem] bg-slate-50 border border-slate-100 outline-none focus:ring-0 focus:border-indigo-600/20 focus:bg-white transition-all duration-500 font-bold text-slate-900 placeholder:text-slate-300"
                  required 
                  value={formData.college}
                  onChange={(e) => setFormData(prev => ({...prev, college: e.target.value}))}
                  placeholder="E.G. CAMBRIDGE"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Degree</label>
                  <input 
                    className="w-full p-5.5 rounded-[1.4rem] bg-slate-50 border border-slate-100 outline-none focus:ring-0 focus:border-indigo-600/20 focus:bg-white transition-all duration-500 font-bold text-slate-900 placeholder:text-slate-300"
                    required 
                    value={formData.degree}
                    onChange={(e) => setFormData(prev => ({...prev, degree: e.target.value}))}
                    placeholder="B.S"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Year</label>
                  <select 
                    className="w-full p-5.5 rounded-[1.4rem] bg-slate-50 border border-slate-100 outline-none focus:ring-0 focus:border-indigo-600/20 focus:bg-white transition-all duration-500 font-black text-slate-900 appearance-none cursor-pointer"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({...prev, year: e.target.value}))}
                  >
                    <option value="1">Y-1</option>
                    <option value="2">Y-2</option>
                    <option value="3">Y-3</option>
                    <option value="4">Y-4</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Course Stream</label>
                <input 
                  className="w-full p-5.5 rounded-[1.4rem] bg-slate-50 border border-slate-100 outline-none focus:ring-0 focus:border-indigo-600/20 focus:bg-white transition-all duration-500 font-bold text-slate-900 placeholder:text-slate-300"
                  required 
                  value={formData.stream}
                  onChange={(e) => setFormData(prev => ({...prev, stream: e.target.value}))}
                  placeholder="E.G. QUANTUM PHYSICS"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Subject Name</label>
                <input 
                  className="w-full p-5.5 rounded-[1.4rem] bg-slate-50 border border-slate-100 outline-none focus:ring-0 focus:border-indigo-600/20 focus:bg-white transition-all duration-500 font-bold text-slate-900 placeholder:text-slate-300"
                  required 
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({...prev, subject: e.target.value}))}
                  placeholder="E.G. ADVANCED CALCULUS"
                />
              </div>
              
              <div className="space-y-6 pt-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Source Selection</label>
                  <div className="relative group/upload">
                    <input 
                      id="pdf-upload"
                      type="file" 
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full p-10 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center transition-all duration-500 group-hover/upload:border-indigo-400 group-hover/upload:bg-indigo-50/30 group-hover/upload:scale-[1.02]">
                      <div className="bg-white p-4 rounded-2xl shadow-sm mb-5 group-hover/upload:shadow-xl group-hover/upload:shadow-indigo-100 transition-all duration-500 ring-1 ring-slate-100">
                        <FileUp className={`h-8 w-8 ${isUploading ? 'animate-bounce text-indigo-600' : 'text-slate-400'}`} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-4 text-center break-all leading-relaxed">
                        {formData.fileName || 'DRAG & DROP PDF ARCHIVE'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center px-4">
                  <div className="flex-grow h-px bg-slate-100"></div>
                  <span className="flex-shrink mx-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">OR</span>
                  <div className="flex-grow h-px bg-slate-100"></div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Document Link</label>
                  <input 
                    className="w-full p-5.5 rounded-[1.4rem] bg-slate-50 border border-slate-100 outline-none focus:ring-0 focus:border-indigo-600/20 focus:bg-white transition-all duration-500 font-bold text-slate-900 placeholder:text-slate-300 disabled:opacity-30"
                    value={formData.fileName ? '' : formData.content}
                    onChange={(e) => setFormData(prev => ({...prev, content: e.target.value, fileName: ''}))}
                    placeholder="HTTP://EXTERNAL-URL.PDF"
                    disabled={!!formData.fileName}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isUploading}
                className={`w-full py-7 mt-6 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all duration-500 shadow-2xl shadow-slate-200 active:scale-[0.98] ${isUploading ? 'opacity-40 cursor-not-allowed' : 'hover:bg-indigo-600 hover:shadow-indigo-200'}`}
              >
                {isUploading ? 'PROCESSING TRANSMISSION...' : 'EXECUTE ARCHIVE'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-12 px-6">
            <div className="flex items-center space-x-5">
              <h2 className="text-3xl font-black text-slate-900 tracking-tightest uppercase">Console Logs</h2>
              <div className="h-2 w-2 bg-indigo-600 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-3 text-indigo-600 bg-indigo-50/50 px-6 py-2.5 rounded-full border border-indigo-100/50 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Smart Database</span>
            </div>
          </div>
          
          <div className="space-y-8">
            {papers.map(p => (
              <div key={p.id} className="bg-white p-10 rounded-[3.5rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.03)] border border-slate-100 flex justify-between items-center group hover:border-indigo-200 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.06)] transition-all duration-500 overflow-hidden relative">
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-slate-50 group-hover:bg-indigo-600 transition-all duration-500"></div>
                <div className="flex items-center space-x-8">
                  <div className="p-6 bg-slate-50 rounded-[2rem] text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-500 ring-1 ring-slate-100 group-hover:ring-indigo-100 group-hover:rotate-6">
                    <FileText className="h-8 w-8" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-3xl font-black text-slate-900 leading-none group-hover:text-indigo-600 transition-colors tracking-tightest uppercase">{p.subject}</h3>
                      <span className="text-slate-300 font-bold text-[13px] uppercase tracking-widest leading-none">[{p.degree}]</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.35em] mt-3 flex items-center">
                      <Target className="h-3 w-3 mr-2 text-indigo-200 group-hover:text-indigo-400 transition-colors" />
                      {p.stream} • {p.college} • YEAR {p.year}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(p.id)}
                  className="p-5 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-[1.6rem] transition-all duration-300 border border-transparent hover:border-red-100 group-hover:scale-110"
                  title="Purge Record"
                >
                  <Trash2 className="h-7 w-7" />
                </button>
              </div>
            ))}
            {papers.length === 0 && (
              <div className="text-center py-40 bg-slate-50/30 rounded-[4.5rem] border-4 border-dashed border-slate-100 flex flex-col items-center">
                <div className="inline-flex p-10 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-100 mb-8 ring-1 ring-slate-100">
                  <Layers className="h-14 w-14 text-slate-100" />
                </div>
                <p className="text-slate-400 font-black text-xs uppercase tracking-[0.5em]">System Ready: Awaiting Data Input</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [admin, setAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');

  const login = () => {
    setAdmin(true);
    localStorage.setItem('isAdmin', 'true');
  };

  const logout = () => {
    setAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 selection:bg-indigo-600/10 selection:text-indigo-900 font-sans antialiased text-slate-900">
        <Navbar admin={admin} onLogout={logout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/admin" element={<AdminDashboard admin={admin} />} />
          <Route path="/help" element={<HelpCenter />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

const HelpCenter = () => {
  const [formData, setFormData] = useState({
    college: '',
    degree: '',
    stream: '',
    subject: '',
    year: '1',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const subject = `New Paper Request: ${formData.subject}`;
    const body = `
New Resource Request Details:
----------------------------
Institution: ${formData.college}
Degree: ${formData.degree}
Course Stream: ${formData.stream}
Subject: ${formData.subject}
Academic Year: ${formData.year}
Student Email: ${formData.email}

Additional Details:
${formData.message || 'No additional details provided.'}
    `.trim();

    const mailtoUrl = `mailto:webauracomapny@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open the user's email client
    window.location.href = mailtoUrl;

    // Show the success screen after a short delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ college: '', degree: '', stream: '', subject: '', year: '1', email: '', message: '' });
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-14 sm:p-20 rounded-[4.5rem] shadow-[0_50px_150px_-30px_rgba(0,0,0,0.08)] border border-slate-100 w-full max-w-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-bl-full -mr-32 -mt-32 pointer-events-none opacity-40"></div>
          
          <div className="bg-green-500/10 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-10">
            <ShieldCheck className="h-12 w-12 text-green-600" />
          </div>
          
          <h2 className="text-5xl font-black text-slate-900 tracking-tightest uppercase mb-6">Request Transmitted</h2>
          <p className="text-slate-500 font-medium text-lg mb-12 leading-relaxed">
            Your request has been prepared for delivery to our curators. 
            If your email client didn't open automatically, please contact us at <b>webauracomapny@gmail.com</b>.
          </p>
          
          <button 
            onClick={() => setSubmitted(false)}
            className="px-12 py-6 bg-slate-900 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all duration-500 shadow-2xl shadow-slate-200 active:scale-95"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* Info Section */}
          <div className="space-y-12">
            <div>
              <div className="inline-flex items-center space-x-2.5 px-5 py-2.5 mb-10 text-[10px] font-black tracking-[0.25em] text-indigo-600 uppercase bg-indigo-50/50 rounded-full border border-indigo-100/50 backdrop-blur-md">
                <AlertCircle className="w-3.5 h-3.5 fill-indigo-600" />
                <span>Student Support & Resource Request</span>
              </div>
              <h1 className="text-7xl md:text-8xl font-black text-slate-900 tracking-tightest leading-[0.85] uppercase mb-8">
                Help <br/>
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-900 to-slate-900 bg-clip-text text-transparent">Center.</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                Can't find a specific paper? Tell us what you need. Our team actively sources missing archives to help you prepare better.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="bg-indigo-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-3">Fast Turnaround</h4>
                <p className="text-slate-400 text-xs font-bold leading-relaxed">Requests are typically processed within 24-48 business hours.</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="bg-indigo-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="h-6 w-6 text-indigo-600" />
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-3">Verified Content</h4>
                <p className="text-slate-400 text-xs font-bold leading-relaxed">All requested papers undergo strict quality and accuracy checks.</p>
              </div>
            </div>

            <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <h3 className="text-2xl font-black uppercase tracking-tightest mb-4">Direct Support</h3>
              <p className="text-slate-400 font-medium text-sm mb-8">Need immediate assistance or have a technical issue?</p>
              <div className="flex items-center space-x-6">
                <a href="mailto:support@crackexam.com" className="flex items-center text-xs font-black uppercase tracking-[0.2em] hover:text-indigo-400 transition-colors">
                  <Mail className="h-4 w-4 mr-2" /> Email Us
                </a>
                <div className="h-4 w-px bg-white/20"></div>
                <span className="flex items-center text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  <MapPin className="h-4 w-4 mr-2" /> Global Office
                </span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white p-12 sm:p-16 rounded-[4rem] shadow-[0_50px_150px_-30px_rgba(0,0,0,0.06)] border border-slate-100 relative">
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tightest mb-10">Request a Paper</h3>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Institution</label>
                  <input 
                    className="w-full p-5.5 rounded-[1.4rem] bg-slate-50 border border-slate-100 outline-none focus:ring-0 focus:border-indigo-600/20 focus:bg-white transition-all duration-500 font-bold text-slate-900 placeholder:text-slate-300"
                    required 
                    value={formData.college}
                    onChange={(e) => setFormData({...formData, college: e.target.value})}
                    placeholder="E.G. HARVARD"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Degree Type</label>
                  <input 
                    className="w-full p-5.5 rounded-[1.4rem] bg-slate-50 border border-slate-100 outline-none focus:ring-0 focus:border-indigo-600/20 focus:bg-white transition-all duration-500 font-bold text-slate-900 placeholder:text-slate-300"
                    required 
                    value={formData.degree}
                    onChange={(e) => setFormData({...formData, degree: e.target.value})}
                    placeholder="E.G. B.SC"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Course Stream</label>
                  <input 
                    className="w-full p-5.5 rounded-[1.4rem] bg-slate-50 border border-slate-100 outline-none focus:ring-0 focus:border-indigo-600/20 focus:bg-white transition-all duration-500 font-bold text-slate-900 placeholder:text-slate-300"
                    required 
                    value={formData.stream}
                    onChange={(e) => setFormData({...formData, stream: e.target.value})}
                    placeholder="E.G. COMPUTER SCIENCE"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Subject Name</label>
                  <input 
                    className="w-full p-5.5 rounded-[1.4rem] bg-slate-50 border border-slate-100 outline-none focus:ring-0 focus:border-indigo-600/20 focus:bg-white transition-all duration-500 font-bold text-slate-900 placeholder:text-slate-300"
                    required 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="E.G. DATA STRUCTURES"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Academic Year</label>
                  <select 
                    className="w-full p-5.5 rounded-[1.4rem] bg-slate-50 border border-slate-100 outline-none focus:ring-0 focus:border-indigo-600/20 focus:bg-white transition-all duration-500 font-black text-slate-900 appearance-none cursor-pointer"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                  >
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Your Email</label>
                  <input 
                    type="email"
                    className="w-full p-5.5 rounded-[1.4rem] bg-slate-50 border border-slate-100 outline-none focus:ring-0 focus:border-indigo-600/20 focus:bg-white transition-all duration-500 font-bold text-slate-900 placeholder:text-slate-300"
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="STUDENT@EXAMPLE.COM"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Additional Details (Optional)</label>
                <textarea 
                  className="w-full p-6 rounded-[2rem] bg-slate-50 border border-slate-100 outline-none focus:ring-0 focus:border-indigo-600/20 focus:bg-white transition-all duration-500 font-medium text-slate-900 placeholder:text-slate-300 h-32 resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Tell us more about the specific year or variant of the paper..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-6 bg-slate-900 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all duration-500 flex items-center justify-center space-x-4 shadow-2xl shadow-slate-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Transmit Request</span>
                    <ArrowRight className="h-4.5 w-4.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
