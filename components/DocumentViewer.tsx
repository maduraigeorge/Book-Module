
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Music, ExternalLink, ZoomIn, ZoomOut, Move, Maximize2, Minimize2, BookOpen, LayoutGrid, RotateCw, PenTool, Eraser, Minimize, MousePointer2, Type, Trash2, Palette } from 'lucide-react';
import { PageData, Resource, ResourceType } from '../types';
import { Button } from './Button';

interface DocumentViewerProps {
  pageData: PageData;
  allPages: PageData[]; // Added for thumbnails
  activeResource: Resource | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onCloseResource: () => void;
  onToggleFullscreen?: () => void;
}

interface TextNote {
  id: string;
  x: number; // Percentage relative to width
  y: number; // Percentage relative to height
  text: string;
  color: string;
}

// Helper component for Page Content
const PageContent = ({ data }: { data: PageData }) => (
  <div className="w-full h-full bg-white relative overflow-hidden flex flex-col rounded-l-md ring-1 ring-black/5 origin-left select-none">
      {data.htmlContent ? (
          // Render Rich HTML Content
          <div 
              className="w-full h-full overflow-hidden" 
              dangerouslySetInnerHTML={{ __html: data.htmlContent }} 
          />
      ) : (
          // Fallback to Image
          <img 
              src={data.contentImage} 
              alt={`Page ${data.pageNumber}`} 
              className="w-full h-full object-contain pointer-events-none"
              draggable={false}
          />
      )}
  </div>
);

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  pageData,
  allPages,
  activeResource,
  currentPage,
  totalPages,
  onPageChange,
  onCloseResource,
  onToggleFullscreen,
}) => {
  // Zoom & Pan State
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // UI State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  // Rotation State (0, 90, 180, 270)
  const [rotation, setRotation] = useState(0);

  // --- ANNOTATION STATE ---
  const [interactionMode, setInteractionMode] = useState<'view' | 'draw' | 'type'>('view');
  const [selectedColor, setSelectedColor] = useState('#ef4444'); // Default Red
  const [isEraser, setIsEraser] = useState(false);
  
  // Text Annotation State
  const [textNotes, setTextNotes] = useState<TextNote[]>([]);
  const savedTextNotes = useRef<Map<number, TextNote[]>>(new Map());

  // Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const savedDrawings = useRef<Map<number, string>>(new Map()); 
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null); // For drag events
  const viewerRootRef = useRef<HTMLDivElement>(null); // For fallback fullscreen
  const touchStartRef = useRef<{x: number, y: number} | null>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Page Input State
  const [pageInput, setPageInput] = useState(currentPage.toString());

  // --- PERSISTENCE LOGIC ---

  const saveAnnotations = () => {
    // Save Canvas
    const canvas = canvasRef.current;
    if (canvas) {
        const dataUrl = canvas.toDataURL();
        savedDrawings.current.set(currentPage, dataUrl);
    }
    // Save Text
    savedTextNotes.current.set(currentPage, textNotes);
  };

  const loadAnnotations = (page: number) => {
    // Load Canvas
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear existing
            const savedData = savedDrawings.current.get(page);
            if (savedData) {
                const img = new Image();
                img.src = savedData;
                img.onload = () => {
                    ctx.drawImage(img, 0, 0);
                };
            }
        }
    }
    // Load Text
    const savedNotes = savedTextNotes.current.get(page);
    setTextNotes(savedNotes || []);
  };

  const clearAllDrawings = () => {
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            savedDrawings.current.delete(currentPage);
        }
    }
  };

  // Handle Page Changes
  useEffect(() => {
    saveAnnotations(); // Save old page data
    
    // Standard Reset
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
    setPageInput(currentPage.toString());

    // Restore new page
    setTimeout(() => loadAnnotations(currentPage), 0);
  }, [currentPage]); 


  // --- DRAWING HANDLERS ---
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (interactionMode !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = isEraser ? 30 : 4;
    ctx.strokeStyle = selectedColor;
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (interactionMode !== 'draw') return;
    if (e.buttons !== 1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (canvas) canvas.releasePointerCapture(e.pointerId);
  };

  // --- TEXT ANNOTATION HANDLERS ---
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
      // Logic for adding text
      if (interactionMode === 'type') {
          // If we clicked on an existing input, don't create new one (handled by propagation stop)
          const rect = e.currentTarget.getBoundingClientRect();
          const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
          const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
          
          const newNote: TextNote = {
              id: Date.now().toString(),
              x: xPercent,
              y: yPercent,
              text: '',
              color: selectedColor
          };
          setTextNotes([...textNotes, newNote]);
          
          // Switch to view mode temporarily or keep in type mode? Keep in type mode.
      } else {
        toggleControls(e);
      }
  };

  const updateTextNote = (id: string, newText: string) => {
      setTextNotes(prev => prev.map(note => note.id === id ? { ...note, text: newText } : note));
  };

  const deleteTextNote = (id: string) => {
      setTextNotes(prev => prev.filter(note => note.id !== id));
  };


  // --- CONTROLS VISIBILITY LOGIC ---
  const resetControlsTimeout = () => {
      if (!showControls) setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      
      // Auto hide after 3 seconds of inactivity
      controlsTimeoutRef.current = setTimeout(() => {
          if (!activeResource) { 
            setShowControls(false);
            if (showThumbnails) setShowThumbnails(false);
          }
      }, 3000);
  };

  const toggleControls = (e: React.MouseEvent) => {
      if (isDragging || interactionMode !== 'view') return; 
      e.stopPropagation();
      setShowControls(prev => !prev);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
  };

  useEffect(() => {
      window.addEventListener('mousemove', resetControlsTimeout);
      window.addEventListener('touchstart', resetControlsTimeout);
      resetControlsTimeout(); // init

      return () => {
          window.removeEventListener('mousemove', resetControlsTimeout);
          window.removeEventListener('touchstart', resetControlsTimeout);
          if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      };
  }, [activeResource, showThumbnails]); 


  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Zoom Handlers
  const handleZoomIn = () => setScale(s => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale(s => {
    const newScale = Math.max(s - 0.25, 1);
    if (newScale === 1) setPosition({ x: 0, y: 0 }); 
    return newScale;
  });
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  // Rotation Handler
  const handleRotate = () => {
    setRotation(r => (r + 90) % 360);
  };

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (onToggleFullscreen) {
        onToggleFullscreen();
    } else {
        if (!document.fullscreenElement) {
            viewerRootRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // --- MOUSE Events (Desktop) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (interactionMode !== 'view') return; 
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (interactionMode !== 'view') return;
    if (isDragging && scale > 1) {
      e.preventDefault();
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  // --- TOUCH Events (Mobile) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    if (interactionMode !== 'view') return;
    if (e.touches.length === 1) {
       touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
       if (scale > 1) {
          setIsDragging(true);
          setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
       }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
     if (interactionMode !== 'view') return;
     if (!touchStartRef.current) return;
     
     if (scale > 1 && isDragging) {
        e.preventDefault(); 
        setPosition({
           x: e.touches[0].clientX - dragStart.x,
           y: e.touches[0].clientY - dragStart.y
        });
     }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
     if (interactionMode !== 'view') return;
     if (scale === 1 && touchStartRef.current && !activeResource) {
        const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
        const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
        
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
           if (deltaX > 0) handlePrev(); 
           else handleNext(); 
        }
     }
     setIsDragging(false);
     touchStartRef.current = null;
  };

  // Page Input Handlers
  const handlePageInputSubmit = () => {
    let newPage = parseInt(pageInput);
    if (isNaN(newPage)) {
      setPageInput(currentPage.toString());
      return;
    }
    newPage = Math.max(1, Math.min(newPage, totalPages));
    if (newPage !== currentPage) {
      onPageChange(newPage);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const handlePageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePageInputSubmit();
      (e.target as HTMLInputElement).blur();
    }
  };

  const baseIsLandscape = pageData.layout === 'landscape';
  const intrinsicAspectRatio = baseIsLandscape ? '297/210' : '210/297';
  const isRotatedSideways = rotation === 90 || rotation === 270;

  return (
    <div 
        ref={viewerRootRef}
        className="flex flex-col h-full relative overflow-hidden group touch-none bg-pattern-dots"
    >
      
      {/* --- TOP ANNOTATION BAR --- */}
      <div className={`absolute top-0 left-0 right-0 z-40 flex justify-center p-4 pointer-events-none transition-transform duration-300 ${showControls ? 'translate-y-0' : '-translate-y-20'}`}>
          <div className="bg-white/95 backdrop-blur shadow-xl border-b-4 border-violet-100 rounded-2xl p-2 flex gap-3 pointer-events-auto items-center">
              
              {/* Mode Toggles */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                  <Button 
                    variant={interactionMode === 'view' ? 'primary' : 'ghost'} 
                    size="sm" 
                    onClick={() => {
                        setInteractionMode('view');
                        // Optional: clear eraser if it was on
                        setIsEraser(false);
                    }}
                    title="Read Mode"
                    className="rounded-lg"
                  >
                     <MousePointer2 size={20} />
                  </Button>
                  <Button 
                    variant={interactionMode === 'draw' ? 'primary' : 'ghost'} 
                    size="sm" 
                    onClick={() => setInteractionMode('draw')}
                    title="Draw Mode"
                    className="rounded-lg"
                  >
                     <PenTool size={20} />
                  </Button>
                  <Button 
                    variant={interactionMode === 'type' ? 'primary' : 'ghost'} 
                    size="sm" 
                    onClick={() => setInteractionMode('type')}
                    title="Type Mode"
                    className="rounded-lg"
                  >
                     <Type size={20} />
                  </Button>
              </div>

              {/* Tools (Visible only if Draw or Type) */}
              {(interactionMode === 'draw' || interactionMode === 'type') && (
                 <>
                    <div className="w-px h-8 bg-slate-200"></div>
                    
                    {/* Colors */}
                    <div className="flex gap-1.5">
                        {[
                            { color: '#ef4444', name: 'Red' }, 
                            { color: '#3b82f6', name: 'Blue' },
                            { color: '#22c55e', name: 'Green' }, 
                            { color: '#1e293b', name: 'Black' }
                        ].map((c) => (
                            <button
                                key={c.name}
                                onClick={() => {
                                    setSelectedColor(c.color);
                                    setIsEraser(false);
                                }}
                                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${selectedColor === c.color && !isEraser ? 'ring-2 ring-offset-2 ring-violet-400 scale-110' : 'border-white'} shadow-sm`}
                                style={{ backgroundColor: c.color }}
                                title={c.name}
                            />
                        ))}
                    </div>

                    {/* Eraser and Clear (Only for Draw) */}
                    {interactionMode === 'draw' && (
                        <>
                            <Button 
                                variant={isEraser ? 'primary' : 'icon'}
                                size="sm"
                                onClick={() => setIsEraser(!isEraser)}
                                title="Eraser"
                                className={isEraser ? 'bg-pink-500 border-pink-700 hover:bg-pink-600' : ''}
                            >
                                <Eraser size={18} />
                            </Button>

                            <Button 
                                variant="icon"
                                size="sm"
                                onClick={clearAllDrawings}
                                title="Clear All Drawings"
                                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                                <Trash2 size={18} />
                            </Button>
                        </>
                    )}
                 </>
              )}
          </div>
      </div>

      {/* Floating Navigation Arrows (Desktop) */}
      {!activeResource && (
        <>
          <button 
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`
              hidden md:flex
              absolute left-6 top-1/2 -translate-y-1/2 z-20 
              w-16 h-16 rounded-full bg-white text-violet-500 border-4 border-violet-100
              items-center justify-center transition-all duration-200
              hover:scale-110 active:scale-95 disabled:opacity-0 disabled:pointer-events-none
              shadow-lg hover:shadow-xl hover:border-violet-200
            `}
            title="Previous Page"
          >
            <ChevronLeft size={40} strokeWidth={3} />
          </button>

          <button 
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`
              hidden md:flex
              absolute right-6 top-1/2 -translate-y-1/2 z-20 
              w-16 h-16 rounded-full bg-white text-violet-500 border-4 border-violet-100
              items-center justify-center transition-all duration-200
              hover:scale-110 active:scale-95 disabled:opacity-0 disabled:pointer-events-none
              shadow-lg hover:shadow-xl hover:border-violet-200
            `}
            title="Next Page"
          >
            <ChevronRight size={40} strokeWidth={3} />
          </button>
        </>
      )}

      {/* Main Content Area */}
      <div 
        ref={containerRef}
        className={`flex-1 overflow-hidden relative flex items-center justify-center 
            ${interactionMode === 'view' && scale > 1 ? 'cursor-grab active:cursor-grabbing' : ''}
            ${interactionMode === 'type' ? 'cursor-text' : ''}
            ${showThumbnails ? 'pb-32' : ''} 
            transition-all duration-300
        `}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Document Container */}
        <div 
            className="relative transition-all duration-300 ease-out shadow-2xl bg-white select-none"
            onClick={handleContainerClick}
            style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                aspectRatio: intrinsicAspectRatio,
                ...(isRotatedSideways ? {
                    width: isFullscreen ? '90vh' : '80vh', 
                    maxWidth: '1000vh',
                    height: 'auto', 
                    maxHeight: isFullscreen ? '95vw' : '90vw'
                } : {
                    height: isFullscreen ? '95vh' : '85vh',
                    width: 'auto',
                    maxWidth: '95vw'
                })
            }}
        >
            {/* 1. Page Content */}
            <div className="absolute inset-0 z-10 bg-white shadow-lg">
               <PageContent data={pageData} />
            </div>

            {/* 2. Text Annotation Layer */}
            <div className={`absolute inset-0 z-30 w-full h-full ${interactionMode === 'type' ? 'pointer-events-auto' : 'pointer-events-none'}`}>
               {textNotes.map((note) => (
                   <div 
                       key={note.id}
                       className="absolute pointer-events-auto group"
                       style={{ 
                           left: `${note.x}%`, 
                           top: `${note.y}%`,
                           transform: 'translate(-50%, -50%)' // Center on click
                       }}
                       onClick={(e) => e.stopPropagation()}
                   >
                       <div className="relative">
                           <textarea
                               value={note.text}
                               placeholder="Type..."
                               onChange={(e) => updateTextNote(note.id, e.target.value)}
                               className="bg-transparent text-lg font-bold border-2 border-transparent hover:border-violet-300 focus:border-violet-500 focus:bg-white/80 rounded-lg p-2 outline-none resize-none overflow-hidden min-w-[100px]"
                               style={{ color: note.color, height: 'auto', fieldSizing: 'content' } as any}
                               autoFocus={!note.text}
                           />
                           <button 
                              onClick={() => deleteTextNote(note.id)}
                              className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                              title="Delete Note"
                           >
                               <Trash2 size={12} />
                           </button>
                       </div>
                   </div>
               ))}
            </div>

            {/* 3. Canvas Layer */}
            <canvas
                ref={canvasRef}
                width={1000} 
                height={baseIsLandscape ? 707 : 1414} 
                className={`
                    absolute inset-0 z-20 w-full h-full touch-none
                    ${interactionMode === 'draw' ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'}
                `}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
            />
        </div>

        {/* Overlay for Pan Hint */}
        {scale > 1 && !isDragging && interactionMode === 'view' && (
             <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-violet-600 text-white font-bold text-sm px-6 py-2 rounded-full pointer-events-none flex items-center gap-2 shadow-lg z-10 whitespace-nowrap animate-bounce">
                <Move size={16} />
                Drag to move around!
             </div>
        )}

        {/* Resource Overlay */}
        {activeResource && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-0 md:p-12 animate-in fade-in zoom-in duration-300 bg-violet-900/80 backdrop-blur-sm cursor-default"
               onClick={(e) => e.stopPropagation()} 
          >
             <div className="bg-white w-full h-full md:h-auto md:max-w-4xl md:aspect-video md:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative ring-8 ring-white/20">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 flex justify-between items-start z-10 pointer-events-none">
                   <div className="text-white drop-shadow-md px-2 pointer-events-auto">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                           {activeResource.type}
                        </span>
                      </div>
                      <h3 className="font-bold text-xl leading-tight line-clamp-2">
                        {activeResource.title}
                      </h3>
                   </div>
                   <button 
                    onClick={onCloseResource}
                    className="pointer-events-auto text-white bg-white/20 hover:bg-white/40 hover:scale-110 rounded-full p-2 transition-all backdrop-blur-md border-2 border-white/30"
                   >
                     <X size={28} />
                   </button>
                </div>

                {/* Content */}
                <div className="flex-1 bg-slate-900 flex items-center justify-center relative">
                    {activeResource.type === ResourceType.VIDEO && (
                        <video 
                            controls 
                            autoPlay 
                            className="w-full h-full max-h-[80vh]"
                            src={activeResource.url}
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}

                    {activeResource.type === ResourceType.AUDIO && (
                        <div className="flex flex-col items-center justify-center space-y-6 w-full px-8 bg-pattern-dots bg-violet-50 h-full">
                            <div className="relative">
                                <div className="absolute inset-0 bg-violet-400 blur-3xl opacity-30 rounded-full animate-pulse"></div>
                                <div className="w-40 h-40 rounded-full bg-white border-8 border-violet-200 flex items-center justify-center shadow-xl relative z-10">
                                    <Music size={64} className="text-violet-500" />
                                </div>
                            </div>
                            <div className="w-full max-w-md bg-white p-4 rounded-2xl shadow-lg border border-violet-100">
                                <h4 className="text-center font-bold text-violet-900 mb-4">Now Playing</h4>
                                <audio 
                                    controls 
                                    autoPlay 
                                    className="w-full" 
                                    src={activeResource.url}
                                />
                            </div>
                        </div>
                    )}

                    {activeResource.type === ResourceType.LINK && (
                        <div className="text-center text-slate-800 p-8 bg-white h-full flex flex-col items-center justify-center w-full">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                <ExternalLink size={40} className="text-green-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-3">Time to Explore!</h3>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
                                We are taking you to a fun website to learn more!
                            </p>
                            <a 
                                href={activeResource.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 border-b-4 border-green-700 rounded-2xl text-white font-bold text-lg transition-all transform hover:-translate-y-1 hover:shadow-xl"
                            >
                                Let's Go! <ExternalLink size={20} />
                            </a>
                        </div>
                    )}
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Toolbar */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className={`absolute left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4 transition-all duration-500 ease-out 
            ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'} 
            ${showThumbnails ? 'bottom-36' : 'bottom-6'}
        `}
      >
        <div className="flex items-center gap-1 p-2 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-slate-100 transition-all hover:scale-105 max-w-[95vw] overflow-x-auto no-scrollbar">
            
            {/* Show Thumbnails Toggle */}
             <Button 
                variant="icon" 
                size="sm" 
                onClick={() => setShowThumbnails(!showThumbnails)} 
                title="Page Preview" 
                active={showThumbnails}
                className="mr-1 border-r border-slate-100 rounded-r-none pr-3"
            >
                <LayoutGrid size={20} strokeWidth={2.5} />
            </Button>

            {/* Page Navigation Input */}
            <div className="flex items-center gap-2 px-3 mr-1 border-r-2 border-slate-100 whitespace-nowrap">
                <BookOpen size={16} className="text-violet-500" />
                <div className="relative">
                  <input 
                    className="w-10 bg-slate-100 text-center text-violet-700 font-black text-lg focus:outline-none focus:bg-violet-50 rounded-lg border-2 border-transparent focus:border-violet-300 transition-all py-1"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    onKeyDown={handlePageKeyDown}
                    onBlur={handlePageInputSubmit}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>
                <span className="text-lg text-slate-300 font-bold">/</span>
                <span className="text-lg text-slate-500 font-bold">{totalPages}</span>
            </div>

            <Button 
                variant="icon" 
                size="sm" 
                onClick={handleZoomOut} 
                disabled={scale <= 1 || interactionMode !== 'view'} 
                title="Zoom Out" 
                className="hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
            >
                <ZoomOut size={20} strokeWidth={2.5} />
            </Button>
            
            <div className="px-2 min-w-[50px] text-center flex flex-col items-center justify-center cursor-default select-none">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Zoom</span>
                <span className="text-sm font-black text-slate-700">{Math.round(scale * 100)}%</span>
            </div>

            <Button 
                variant="icon" 
                size="sm" 
                onClick={handleZoomIn} 
                disabled={scale >= 3 || interactionMode !== 'view'} 
                title="Zoom In" 
                className="hover:bg-green-50 hover:text-green-500 disabled:opacity-30"
            >
                <ZoomIn size={20} strokeWidth={2.5} />
            </Button>
            
            <div className="w-0.5 h-6 bg-slate-200 mx-1 rounded-full"></div>
            
            <Button 
                variant="icon" 
                size="sm" 
                onClick={handleResetZoom} 
                title="Fit to Page" 
                className="hover:bg-blue-50 hover:text-blue-500"
            >
                <Minimize2 size={20} strokeWidth={2.5} />
            </Button>
            
             <div className="w-0.5 h-6 bg-slate-200 mx-1 rounded-full"></div>

             {/* Rotate Button */}
             <Button
                variant="icon"
                size="sm"
                onClick={handleRotate}
                title="Rotate Page"
                className="hover:bg-orange-50 hover:text-orange-500"
             >
                 <RotateCw size={20} strokeWidth={2.5} style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.3s' }} />
             </Button>

            <div className="w-0.5 h-6 bg-slate-200 mx-1 rounded-full"></div>
            
            <Button 
                variant="icon" 
                size="sm" 
                onClick={toggleFullscreen} 
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                className="hover:bg-yellow-50 hover:text-yellow-600"
            >
                {isFullscreen ? <Minimize2 size={20} strokeWidth={2.5} /> : <Maximize2 size={20} strokeWidth={2.5} />}
            </Button>
        </div>
      </div>

      {/* Thumbnail Peek Preview Strip */}
      <div 
        className={`
            absolute bottom-0 left-0 right-0 h-32 bg-white/95 backdrop-blur-md border-t-4 border-violet-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20
            transform transition-transform duration-300 ease-out flex flex-col
            ${showThumbnails ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
          <div className="flex-1 overflow-x-auto custom-scrollbar flex items-center px-6 gap-4 py-4">
              {allPages.map((page) => (
                  <div 
                    key={page.pageNumber}
                    onClick={() => {
                        onPageChange(page.pageNumber);
                    }}
                    className={`
                        relative flex-shrink-0 cursor-pointer group transition-all duration-200
                        ${currentPage === page.pageNumber ? 'scale-110 -translate-y-2' : 'hover:-translate-y-1 hover:scale-105'}
                    `}
                  >
                      {/* Page Number Badge */}
                      <div className={`
                          absolute -top-3 -right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-sm
                          ${currentPage === page.pageNumber ? 'bg-violet-500 text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-violet-200'}
                      `}>
                          {page.pageNumber}
                      </div>

                      {/* Thumbnail Image */}
                      <div className={`
                          h-20 w-14 rounded-lg overflow-hidden border-2 shadow-sm
                          ${currentPage === page.pageNumber ? 'border-violet-500 ring-2 ring-violet-200' : 'border-slate-200 group-hover:border-violet-300'}
                      `}>
                         {/* We can use the contentImage as thumbnail */}
                         <img src={page.contentImage} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" alt="" />
                      </div>
                  </div>
              ))}
          </div>
          <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-1">
              Page Preview
          </div>
      </div>

    </div>
  );
}
