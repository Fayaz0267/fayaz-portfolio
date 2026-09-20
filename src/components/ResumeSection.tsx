import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Upload, Trash2, ExternalLink, Sparkles, Check, 
  AlertCircle, FileUp, ShieldCheck, Heart, Lock, Unlock, Key, X
} from 'lucide-react';
import { playClick, playHover, playSuccessChime } from '../utils/sound';

export const ResumeSection: React.FC = () => {
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>("");
  const [pdfUrlInput, setPdfUrlInput] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Admin Access Control state
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [unlockError, setUnlockError] = useState("");

  // Load saved resume data on component mount
  useEffect(() => {
    const savedPdf = localStorage.getItem('shaik_resume_pdf');
    const savedName = localStorage.getItem('shaik_resume_filename');
    const savedUrl = localStorage.getItem('shaik_resume_url');
    const adminStatus = localStorage.getItem('shaik_portfolio_isAdmin');

    if (savedPdf) {
      setPdfBase64(savedPdf);
    }
    if (savedName) {
      setPdfFileName(savedName);
    }
    if (savedUrl) {
      setPdfUrlInput(savedUrl);
    }
    if (adminStatus === "true") {
      setIsAdmin(true);
    }
  }, []);

  const saveToStorage = (base64Data: string | null, fileName: string, remoteUrl: string = "") => {
    try {
      if (base64Data) {
        localStorage.setItem('shaik_resume_pdf', base64Data);
        localStorage.setItem('shaik_resume_filename', fileName);
        setPdfBase64(base64Data);
        setPdfFileName(fileName);
      } else {
        localStorage.removeItem('shaik_resume_pdf');
        localStorage.removeItem('shaik_resume_filename');
        setPdfBase64(null);
        setPdfFileName("");
      }

      if (remoteUrl) {
        localStorage.setItem('shaik_resume_url', remoteUrl);
        setPdfUrlInput(remoteUrl);
      } else {
        localStorage.removeItem('shaik_resume_url');
        setPdfUrlInput("");
      }

      setSavedSuccess(true);
      playSuccessChime();
      setTimeout(() => setSavedSuccess(false), 3000);
      setErrorMsg(null);
    } catch (err: any) {
      console.error(err);
      if (err.name === 'QuotaExceededError' || err.message?.includes('exceeded')) {
        setErrorMsg("The PDF is too large for LocalStorage. Please try a compressed PDF (under 2MB) or paste a custom PDF link below!");
      } else {
        setErrorMsg("Failed to store the PDF file. Please try a different document.");
      }
    }
  };

  // Convert File object to Base64 String
  const processFile = (file: File) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrorMsg("Invalid format. Please upload a standard PDF file.");
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      setErrorMsg("The file is too large (Max 2.5MB). Please optimize your PDF or use the remote URL input option below.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        saveToStorage(result, file.name, "");
      }
    };
    reader.onerror = () => {
      setErrorMsg("Error reading the file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  // Upload selectors
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    playClick();
    fileInputRef.current?.click();
  };

  const handleUrlSave = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    if (pdfUrlInput.trim()) {
      saveToStorage(null, "Remote PDF Document", pdfUrlInput.trim());
    } else {
      setErrorMsg("Please enter a valid URL link.");
    }
  };

  const handleClearResume = () => {
    playClick();
    if (window.confirm("Are you sure you want to clear your current uploaded resume?")) {
      saveToStorage(null, "", "");
      playSuccessChime();
    }
  };

  // Resolves the destination PDF source
  const getResumeUrl = () => {
    if (pdfBase64) return pdfBase64;
    if (pdfUrlInput) return pdfUrlInput;
    return "#";
  };

  const handleOpenResume = () => {
    playClick();
    const url = getResumeUrl();
    if (url === "#") {
      alert("No custom resume uploaded yet! Please check back later.");
      return;
    }

    const newTab = window.open();
    if (newTab) {
      if (url.startsWith('data:application/pdf;base64,')) {
        const html = `
          <html>
            <head>
              <title>${pdfFileName || 'Resume Dossier'}</title>
              <style>body { margin: 0; background: #0e0e12; display: flex; align-items: center; justify-content: center; }</style>
            </head>
            <body>
              <embed width="100%" height="100%" src="${url}" type="application/pdf" />
            </body>
          </html>
        `;
        newTab.document.write(html);
        newTab.document.close();
      } else {
        newTab.location.href = url;
      }
    }
  };

  // Admin access validation
  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    const cleanPass = passcode.trim();
    
    // Accept Shaik's customizable passcodes
    if (cleanPass === "Shaik!$0267") {
      setIsAdmin(true);
      setShowUnlockModal(false);
      localStorage.setItem('shaik_portfolio_isAdmin', 'true');
      setPasscode("");
      setUnlockError("");
      playSuccessChime();
    } else {
      setUnlockError("Incorrect owner key passcode. Access denied.");
    }
  };

  const handleLockAdmin = () => {
    playClick();
    setIsAdmin(false);
    localStorage.removeItem('shaik_portfolio_isAdmin');
    playSuccessChime();
  };

  return (
    <section id="resume" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20 relative select-none">
      
      {/* Structural visual background frame */}
      <div className="absolute inset-0 border border-black/[0.03] dark:border-white/[0.03] pointer-events-none rounded-3xl z-0" />

      {/* Header Container */}
      <div className="text-center space-y-4 mb-16 relative z-10">
        <h2 className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-bold">PROFESSIONAL CREDENTIALS</h2>
        <div className="flex items-center justify-center gap-3">
          <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-dark dark:text-white uppercase font-sans">
            My Resume
          </h3>
          <span className="px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 text-[8px] font-mono font-bold uppercase tracking-widest">
            AUTHENTICATED VAULT
          </span>
        </div>
        <p className="text-dark/60 dark:text-slate-300 text-sm max-w-lg mx-auto leading-relaxed font-sans">
          Welcome to my digital resume vault. Tap the button below to view or export my complete professional dossier in fluid PDF format.
        </p>
      </div>

      {/* Hub Layout depending on Admin state */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {!isAdmin ? (
            /* Visitor Mode Layout - Beautiful, Centered Presentation Card */
            <motion.div 
              key="visitor-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex flex-col justify-between p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-800/95 border border-black/15 dark:border-white/15 shadow-2xl relative overflow-hidden text-center min-h-[340px]">
                {/* Visual decorations */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-6 relative z-10 flex flex-col items-center">
                  <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                    <FileText className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-dark/40 dark:text-slate-400 uppercase font-bold tracking-[0.2em]">VERIFIED DOSSIER</span>
                    <h4 className="text-2xl font-black text-dark dark:text-white uppercase font-sans tracking-tight">Shaik Mahammad Fayaz</h4>
                  </div>

                  {/* Document details */}
                  <div className="p-3.5 px-6 rounded-2xl bg-black/[0.02] dark:bg-slate-900/60 border border-black/5 dark:border-white/10 inline-flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-dark/5 dark:bg-slate-800 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-accent" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-xs font-bold text-dark dark:text-white truncate max-w-[200px] sm:max-w-[300px]">
                        {pdfBase64 ? (pdfFileName || "Shaik_Fayaz_Resume.pdf") : pdfUrlInput ? "Shaik_Fayaz_Resume.pdf" : "Standard_Default_CV.pdf"}
                      </p>
                      <p className="text-[9px] text-dark/40 dark:text-slate-400 font-mono">
                        {(pdfBase64 || pdfUrlInput) ? "Uploaded & Authenticated Document" : "Demonstration / Fallback Document"}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-dark/60 dark:text-slate-300 max-w-md leading-relaxed font-sans">
                    Click the highlighted button below to view, download, or print the full professional PDF document in an isolated window instantly!
                  </p>
                </div>

                {/* Highlighted Launch Trigger */}
                <div className="pt-8 relative z-10">
                  <motion.button
                    onClick={handleOpenResume}
                    onMouseEnter={playHover}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto sm:px-12 py-4 rounded-2xl bg-gradient-to-r from-primary via-indigo-600 to-accent text-white font-black text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/10 group active:scale-95 mx-auto"
                  >
                    <Sparkles className="w-4 h-4 text-neon animate-pulse" />
                    <span>MY RESUME (OPEN PDF)</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </motion.button>
                </div>
              </div>

              {/* Subtle Secret Owner Access Trigger */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => { playClick(); setShowUnlockModal(true); }}
                  className="inline-flex items-center gap-1.5 text-[10px] font-mono text-dark/30 dark:text-slate-500 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
                  title="Portfolio Owner Authentication"
                >
                  <Lock className="w-3 h-3" />
                  <span>Dossier Management Gate</span>
                </button>
              </div>
            </motion.div>
          ) : (
            /* Admin Mode Layout - 2-Column Responsive Panel (Owners view) */
            <motion.div 
              key="admin-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              {/* Left Column: Interactive Launchpad */}
              <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-800/95 border border-black/15 dark:border-white/15 shadow-xl relative overflow-hidden text-left min-h-[380px]">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-dark/40 dark:text-slate-400 uppercase font-bold tracking-wider">ACTIVE CREDENTIALS</span>
                        <h4 className="text-lg font-black text-dark dark:text-white uppercase font-sans tracking-tight">Portfolio Presentation File</h4>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-slate-900/60 border border-black/5 dark:border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-dark/40 dark:text-slate-400 uppercase font-bold">STATUS</span>
                      <span className="text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        Admin Unlocked
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-dark/5 dark:bg-slate-800 flex items-center justify-center text-dark/40 dark:text-slate-400 shrink-0 border border-black/5 dark:border-white/10">
                        <FileText className="w-5 h-5 text-accent" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-xs font-bold text-dark dark:text-white truncate">
                          {pdfBase64 ? (pdfFileName || "Shaik_Fayaz_Resume.pdf") : pdfUrlInput ? "Remote Resume Link" : "Standard_Default_CV.pdf"}
                        </p>
                        <p className="text-[10px] text-dark/50 dark:text-slate-400 font-mono">
                          {pdfBase64 ? "Serialized Base64 Format" : pdfUrlInput ? "External Cloud URL Host" : "Fallback Demonstration Mode"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-dark/60 dark:text-slate-300 leading-relaxed font-sans">
                    As the owner, you can view the active live PDF file. Adjust, replace, or reset the file parameters on the right side panel anytime!
                  </p>
                </div>

                <div className="pt-6 relative z-10 space-y-3">
                  <motion.button
                    onClick={handleOpenResume}
                    onMouseEnter={playHover}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-primary via-indigo-600 to-accent text-white font-black text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/10 group active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-neon animate-pulse" />
                    <span>PREVIEW PORTAL</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </motion.button>

                  <button
                    onClick={handleLockAdmin}
                    className="w-full py-2.5 rounded-xl border border-black/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-slate-700/60 text-dark dark:text-white font-mono font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5 text-primary" />
                    <span>Lock Vault & Logout Admin</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Custom PDF Management/Uploader */}
              <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-800/95 border border-black/15 dark:border-white/15 shadow-xl text-left">
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-accent/10 text-accent rounded-xl">
                        <Upload className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-mono font-extrabold text-dark dark:text-white uppercase tracking-wider">Uploader Engine</h4>
                    </div>

                    {(pdfBase64 || pdfUrlInput) && (
                      <button
                        onClick={handleClearResume}
                        onMouseEnter={playHover}
                        className="inline-flex items-center gap-1 text-[9px] font-mono text-rose-500 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        title="Remove Current Custom Resume"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Reset Vault</span>
                      </button>
                    )}
                  </div>

                  {/* Drag & Drop File Upload Frame */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                      isDragging 
                        ? 'border-primary bg-primary/[0.03] scale-[0.99]' 
                        : 'border-black/15 dark:border-white/20 bg-black/[0.01] dark:bg-slate-900/40 hover:border-accent hover:bg-black/[0.02] dark:hover:bg-slate-900/60'
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="application/pdf" 
                      className="hidden" 
                    />
                    <div className="space-y-3">
                      <div className="mx-auto w-10 h-10 rounded-full bg-black/5 dark:bg-slate-800 flex items-center justify-center text-dark/60 dark:text-slate-300">
                        <FileUp className="w-5 h-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-dark dark:text-white">
                          Drag & Drop your Resume PDF here
                        </p>
                        <p className="text-[10px] text-dark/50 dark:text-slate-400">
                          or click to search file directory (Max 2.5MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Error Message notice */}
                  {errorMsg && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900 rounded-xl flex items-start gap-2 text-rose-700 dark:text-rose-300 text-xs font-sans">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Divider line */}
                  <div className="relative py-2 flex items-center justify-center">
                    <div className="absolute inset-x-0 h-[1px] bg-black/5 dark:bg-white/10" />
                    <span className="relative bg-white dark:bg-slate-800 px-3 text-[9px] font-mono text-dark/40 dark:text-slate-400 uppercase font-bold">OR PROVIDE REMOTE HOSTING LINK</span>
                  </div>

                  {/* Remote URL Form Input */}
                  <form onSubmit={handleUrlSave} className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-mono text-dark/40 dark:text-slate-400 uppercase font-bold">External Cloud PDF URL Link</label>
                      <input 
                        type="url" 
                        placeholder="e.g. https://drive.google.com/file/d/.../view" 
                        value={pdfUrlInput} 
                        onChange={(e) => setPdfUrlInput(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-black/10 dark:border-white/10 rounded-xl text-dark dark:text-white bg-black/[0.01] dark:bg-slate-900/60 focus:bg-white dark:focus:bg-slate-900 focus:border-accent focus:outline-none placeholder:text-dark/30 dark:placeholder:text-slate-500 transition-all font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      onMouseEnter={playHover}
                      className="w-full py-2.5 rounded-xl bg-dark dark:bg-primary hover:bg-accent text-white font-bold text-[10px] tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5 text-neon" />
                      <span>Save Remote Hosting URL</span>
                    </button>
                  </form>
                </div>

                {/* Secure vault notification */}
                <div className="pt-6 border-t border-black/5 dark:border-white/10 mt-6 flex items-center justify-between text-[9px] font-mono text-dark/45 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Offline Client-Side Sandbox</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Secure Vault</span>
                    <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Admin Unlock passcode modal pop-up */}
      <AnimatePresence>
        {showUnlockModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4 select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 border border-black/10 dark:border-white/15 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-left shadow-2xl relative"
            >
              <button
                onClick={() => { playClick(); setShowUnlockModal(false); }}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-slate-700 text-dark/40 dark:text-slate-400 hover:text-dark dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-mono font-extrabold uppercase text-dark dark:text-white tracking-wider">Owner Gateway</h4>
                    <p className="text-[10px] text-dark/50 dark:text-slate-400">Verify identity to upload/change portfolio credentials.</p>
                  </div>
                </div>

                <form onSubmit={handleUnlockAdmin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-mono text-dark/40 dark:text-slate-400 uppercase font-bold">Secret Passcode Key</label>
                    <input
                      type="password"
                      placeholder="Enter passcode..."
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 border border-black/10 dark:border-white/15 rounded-xl text-dark dark:text-white bg-white dark:bg-slate-900/80 focus:border-primary focus:outline-none placeholder:text-dark/35 dark:placeholder:text-slate-500 font-mono"
                      autoFocus
                    />
                  </div>

                  {unlockError && (
                    <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 text-[10px] font-mono leading-relaxed border border-rose-100 dark:border-rose-900 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{unlockError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-primary hover:bg-dark text-white font-mono font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-md"
                  >
                    <span>Authenticate Key</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Slide-down global toast alert */}
      <AnimatePresence>
        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-24 right-8 z-[999] px-5 py-3 rounded-full bg-accent text-white font-mono font-bold text-[10px] tracking-widest uppercase flex items-center gap-2.5 shadow-2xl border border-white/10"
          >
            <Check className="w-4 h-4 text-neon" />
            <span>Resume Vault Synced Successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ResumeSection;
