
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, PenTool, Eraser, Trash2, MousePointer2, Type } from 'lucide-react';
import { PageData, Resource, BookCategory } from '../types';
import { Button } from './Button';
import { useCanvas } from '../hooks/useCanvas';
import { ViewerControls } from './viewer/ViewerControls';
import { AnnotationLayer } from './viewer/AnnotationLayer';

interface DocumentViewerProps {
  pageData: PageData;
  allPages: PageData[];
  activeBook: BookCategory;
  activeResource: Resource | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onCloseResource: () => void;
  onToggleFullscreen?: () => void;
  onCategoryChange?: (cat: BookCategory) => void; 
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  pageData, allPages, activeBook, activeResource, currentPage, totalPages,
  onPageChange, onCloseResource, onToggleFullscreen, onCategoryChange
}) => {
  // --- View State ---
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRootRef = useRef<HTMLDivElement>(null);

  // --- UI State ---
  const [showTopBar, setShowTopBar] = useState(false);
  const [showBottomBar, setShowBottomBar] = useState(true);
  const [pageInput, setPageInput] = useState(currentPage.toString());

  // --- Annotation State (DB Persisted) ---
  const { canvasRef, textNotes, setTextNotes, clearCanvas, triggerSave } = useCanvas(activeBook, currentPage, rotation);
  
  const [interactionMode, setInteractionMode] = useState<'view' | 'draw' | 'type'>('view');
  const [selectedColor, setSelectedColor] = useState('#ef4444');
  const [isEraser, setIsEraser] = useState(false);

  // --- Refs for Interactions ---
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const touchStartRef = useRef<{x: number, y: number} | null>(null);
  const lastTapRef = useRef<number>(0);
  const pinchStartDist = useRef<number | null>(null);
  const pinchStartScale = useRef<number>(1);

  // Sync Input
  useEffect(() => setPageInput(currentPage.toString()), [currentPage]);
  useEffect(() => {
    const handleFull = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFull);
    return () => document.removeEventListener('fullscreenchange', handleFull);
  }, []);

  // --- Logic Helpers ---
  const handleResetZoom = () => { setScale(1); setPosition({ x: 0, y: 0 }); setRotation(0); };
  const toggleFull = () => {
    if (onToggleFullscreen) onToggleFullscreen();
    else {
      if (!document.fullscreenElement) viewerRootRef.current?.requestFullscreen();
      else document.exitFullscreen();
    }
  };

  // --- Drawing Handlers ---
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (interactionMode !== 'draw' || !canvasRef.current) return;
    canvasRef.current.setPointerCapture(e.pointerId);
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = isEraser ? 60 : 8;
    ctx.strokeStyle = selectedColor;
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (interactionMode !== 'draw' || e.buttons !== 1 || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height);
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  const endDrawing = () => {
      canvasRef.current?.releasePointerCapture(1);
      // Trigger save to DB
      if (interactionMode === 'draw') triggerSave();
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactionMode === 'type') {
      const rect = e.currentTarget.getBoundingClientRect();
      const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
      setTextNotes(prev => {
          const newState = [...prev, { id: Date.now().toString(), x: xPercent, y: yPercent, text: '', color: selectedColor }];
          // We don't save immediately here, we save when text is updated
          return newState;
      });
    } else if (interactionMode === 'view' && !activeResource) {
      setShowBottomBar(!showBottomBar);
      if (showBottomBar) setShowTopBar(false);
    }
  };
  
  const handleUpdateText = (id: string, val: string) => {
      setTextNotes(prev => prev.map(n => n.id === id ? { ...n, text: val } : n));
      // In a real app we might debounce this save
      triggerSave();
  };

  const handleDeleteText = (id: string) => {
      setTextNotes(prev => prev.filter(n => n.id !== id));
      triggerSave();
  };

  // --- Touch/Mouse Logic ---
  const handleTouchStart = (e: React.TouchEvent) => {
    if (interactionMode !== 'view') return;
    if (e.touches.length === 2) {
      pinchStartDist.current = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      pinchStartScale.current = scale;
      return;
    }
    // Double Tap
    if (Date.now() - lastTapRef.current < 300) { scale > 1 ? handleResetZoom() : setScale(Math.min(scale + 0.5, 4)); return; }
    lastTapRef.current = Date.now();
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    if (scale > 1) { setIsDragging(true); dragStart.current = { x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y }; }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (interactionMode !== 'view') return;
    if (e.touches.length === 2 && pinchStartDist.current) {
      e.preventDefault();
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      setScale(Math.min(Math.max(pinchStartScale.current * (dist / pinchStartDist.current), 1), 4));
    }
    if (scale > 1 && isDragging && touchStartRef.current) {
      e.preventDefault();
      setPosition({ x: e.touches[0].clientX - dragStart.current.x, y: e.touches[0].clientY - dragStart.current.y });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) pinchStartDist.current = null;
    if (scale === 1 && touchStartRef.current && !activeResource && !pinchStartDist.current) {
      const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
      if (Math.abs(dx) > 50) dx > 0 ? (currentPage > 1 && onPageChange(currentPage - 1)) : (currentPage < totalPages && onPageChange(currentPage + 1));
    }
    setIsDragging(false);
  };

  // --- Render ---
  const isLandscape = pageData.layout === 'landscape';
  const isRotated = rotation === 90 || rotation === 270;
  
  return (
    <div ref={viewerRootRef} className="flex flex-col h-full relative overflow-hidden bg-pattern-dots touch-none select-none group">
      
      {/* Top Annotation Bar */}
      <div className={`absolute top-0 left-0 right-0 z-40 flex justify-center transition-transform duration-300 ${showTopBar ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-white/95 backdrop-blur shadow-xl border-b-4 border-violet-100 rounded-b-3xl p-2 px-6 flex gap-3 pointer-events-auto items-center" onClick={e => e.stopPropagation()}>
           <div className="flex bg-slate-100 p-1 rounded-xl">
             <Button variant={interactionMode === 'view' ? 'primary' : 'ghost'} size="sm" onClick={() => setInteractionMode('view')} className="rounded-lg"><MousePointer2 size={20}/></Button>
             <Button variant={interactionMode === 'draw' ? 'primary' : 'ghost'} size="sm" onClick={() => setInteractionMode('draw')} className="rounded-lg"><PenTool size={20}/></Button>
             <Button variant={interactionMode === 'type' ? 'primary' : 'ghost'} size="sm" onClick={() => setInteractionMode('type')} className="rounded-lg"><Type size={20}/></Button>
           </div>
           {(interactionMode === 'draw' || interactionMode === 'type') && (
             <>
               <div className="w-px h-8 bg-slate-200"></div>
               {['#ef4444', '#3b82f6', '#22c55e', '#1e293b'].map(c => (
                 <button key={c} onClick={() => { setSelectedColor(c); setIsEraser(false); }} className={`w-8 h-8 rounded-full border-2 ${selectedColor === c && !isEraser ? 'ring-2 ring-violet-400 scale-110' : 'border-white'}`} style={{ backgroundColor: c }} />
               ))}
               {interactionMode === 'draw' && (
                 <>
                   <Button variant={isEraser ? 'primary' : 'icon'} size="sm" onClick={() => setIsEraser(!isEraser)} className={isEraser ? 'bg-pink-500' : ''}><Eraser size={18}/></Button>
                   <Button variant="icon" size="sm" onClick={clearCanvas} className="text-red-500"><Trash2 size={18}/></Button>
                 </>
               )}
             </>
           )}
        </div>
      </div>

      {/* Nav Arrows */}
      {!activeResource && showBottomBar && (
        <>
          <button onClick={(e) => { e.stopPropagation(); if(currentPage > 1) onPageChange(currentPage-1); }} disabled={currentPage === 1} className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white text-violet-500 border-4 border-violet-100 items-center justify-center shadow-lg hover:scale-110 disabled:opacity-0"><ChevronLeft size={40}/></button>
          <button onClick={(e) => { e.stopPropagation(); if(currentPage < totalPages) onPageChange(currentPage+1); }} disabled={currentPage === totalPages} className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white text-violet-500 border-4 border-violet-100 items-center justify-center shadow-lg hover:scale-110 disabled:opacity-0"><ChevronRight size={40}/></button>
        </>
      )}

      {/* Content Container */}
      <div 
        ref={containerRef} onClick={handleContainerClick} 
        className={`flex-1 overflow-hidden relative flex items-center justify-center transition-all duration-300 ${showBottomBar ? 'pb-32' : ''} ${interactionMode === 'view' && scale > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
        onMouseDown={e => { if(interactionMode === 'view' && scale > 1) { setIsDragging(true); dragStart.current = {x: e.clientX - position.x, y: e.clientY - position.y}; } }}
        onMouseMove={e => { if(isDragging && scale > 1) setPosition({x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y}); }}
        onMouseUp={() => setIsDragging(false)}
      >
        <div 
          className="relative transition-all duration-300 ease-out shadow-2xl bg-white"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            aspectRatio: isLandscape ? '297/210' : '210/297',
            ...(isRotated ? { width: isFullscreen ? '90vh' : '80vh', maxHeight: '90vw' } : { height: isFullscreen ? '95vh' : '85vh', maxWidth: '95vw' })
          }}
        >
          {/* Page HTML/Image */}
          <div className="absolute inset-0 z-10 bg-white shadow-lg overflow-hidden">
             {pageData.htmlContent ? <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: pageData.htmlContent }} /> : <img src={pageData.contentImage} className="w-full h-full object-contain" alt="" />}
          </div>

          {/* Annotation Layer */}
          <AnnotationLayer 
            canvasRef={canvasRef} textNotes={textNotes} rotation={rotation} scale={scale} 
            interactionMode={interactionMode} width={2000} height={isLandscape ? 1414 : 2828}
            onPointerDown={startDrawing} onPointerMove={draw} onPointerUp={endDrawing}
            onUpdateText={handleUpdateText}
            onDeleteText={handleDeleteText}
          />
        </div>
      </div>

      <ViewerControls 
        scale={scale} currentPage={currentPage} totalPages={totalPages} rotation={rotation} isFullscreen={isFullscreen} isAnnotating={showTopBar}
        allPages={allPages} showBottomBar={showBottomBar} pageInputValue={pageInput}
        onZoomIn={() => setScale(Math.min(scale + 0.25, 4))}
        onZoomOut={() => setScale(Math.max(scale - 0.25, 1))}
        onResetZoom={handleResetZoom}
        onRotate={() => setRotation((r) => (r + 90) % 360)}
        onToggleFullscreen={toggleFull}
        onToggleAnnotation={() => setShowTopBar(!showTopBar)}
        onPageChange={onPageChange}
        onPageInput={setPageInput}
      />
    </div>
  );
};
