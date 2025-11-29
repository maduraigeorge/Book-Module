
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
  onPageChange, onCloseResource, onToggleFullscreen
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRootRef = useRef<HTMLDivElement>(null);
  const [showTopBar, setShowTopBar] = useState(false);
  const [showBottomBar, setShowBottomBar] = useState(true);
  const [pageInput, setPageInput] = useState(currentPage.toString());
  const { canvasRef, textNotes, setTextNotes, clearCanvas, triggerSave } = useCanvas(activeBook, currentPage, rotation);
  const [interactionMode, setInteractionMode] = useState<'view' | 'draw' | 'type'>('view');
  const [selectedColor, setSelectedColor] = useState('#ef4444');
  const [isEraser, setIsEraser] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const touchStartRef = useRef<{x: number, y: number} | null>(null);
  const lastTapRef = useRef<number>(0);
  const pinchStartDist = useRef<number | null>(null);
  const pinchStartScale = useRef<number>(1);

  useEffect(() => setPageInput(currentPage.toString()), [currentPage]);
  useEffect(() => {
    const handleFull = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFull);
    return () => document.removeEventListener('fullscreenchange', handleFull);
  }, []);

  const handleResetZoom = () => { setScale(1); setPosition({ x: 0, y: 0 }); setRotation(0); };
  const toggleFull = () => { if (onToggleFullscreen) onToggleFullscreen(); };

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
    ctx.lineWidth = isEraser ? 60 : 6;
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
  
  const endDrawing = () => { canvasRef.current?.releasePointerCapture(1); if (interactionMode === 'draw') triggerSave(); };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactionMode === 'type') {
      const rect = e.currentTarget.getBoundingClientRect();
      const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
      setTextNotes(prev => [...prev, { id: Date.now().toString(), x: xPercent, y: yPercent, text: '', color: selectedColor }]);
    } else if (interactionMode === 'view' && !activeResource) {
      setShowBottomBar(!showBottomBar); if (showBottomBar) setShowTopBar(false);
    }
  };
  
  const handleUpdateText = (id: string, val: string) => { setTextNotes(prev => prev.map(n => n.id === id ? { ...n, text: val } : n)); triggerSave(); };
  const handleDeleteText = (id: string) => { setTextNotes(prev => prev.filter(n => n.id !== id)); triggerSave(); };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (interactionMode !== 'view') return;
    if (e.touches.length === 2) { pinchStartDist.current = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); pinchStartScale.current = scale; return; }
    if (Date.now() - lastTapRef.current < 300) { scale > 1 ? handleResetZoom() : setScale(Math.min(scale + 0.5, 4)); return; }
    lastTapRef.current = Date.now();
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    if (scale > 1) { setIsDragging(true); dragStart.current = { x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y }; }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (interactionMode !== 'view') return;
    if (e.touches.length === 2 && pinchStartDist.current) { e.preventDefault(); const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); setScale(Math.min(Math.max(pinchStartScale.current * (dist / pinchStartDist.current), 1), 4)); }
    if (scale > 1 && isDragging && touchStartRef.current) { e.preventDefault(); setPosition({ x: e.touches[0].clientX - dragStart.current.x, y: e.touches[0].clientY - dragStart.current.y }); }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) pinchStartDist.current = null;
    if (scale === 1 && touchStartRef.current && !activeResource && !pinchStartDist.current) { const dx = e.changedTouches[0].clientX - touchStartRef.current.x; if (Math.abs(dx) > 50) dx > 0 ? (currentPage > 1 && onPageChange(currentPage - 1)) : (currentPage < totalPages && onPageChange(currentPage + 1)); }
    setIsDragging(false);
  };

  const isLandscape = pageData.layout === 'landscape';
  const isRotated = rotation === 90 || rotation === 270;
  
  return (
    <div ref={viewerRootRef} className="flex flex-col h-full relative overflow-hidden touch-none select-none group bg-zinc-100">
      
      {/* Sleek Top Annotation Bar */}
      <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${showTopBar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-zinc-900/90 backdrop-blur text-white shadow-lg rounded-full p-1.5 flex gap-2 items-center" onClick={e => e.stopPropagation()}>
             <Button variant={interactionMode === 'view' ? 'primary' : 'ghost'} size="icon" onClick={() => setInteractionMode('view')} className={interactionMode === 'view' ? 'bg-zinc-700' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}><MousePointer2 size={18}/></Button>
             <Button variant={interactionMode === 'draw' ? 'primary' : 'ghost'} size="icon" onClick={() => setInteractionMode('draw')} className={interactionMode === 'draw' ? 'bg-zinc-700' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}><PenTool size={18}/></Button>
             <Button variant={interactionMode === 'type' ? 'primary' : 'ghost'} size="icon" onClick={() => setInteractionMode('type')} className={interactionMode === 'type' ? 'bg-zinc-700' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}><Type size={18}/></Button>
             
             {(interactionMode === 'draw' || interactionMode === 'type') && (
               <>
                 <div className="w-px h-5 bg-zinc-700 mx-1"></div>
                 {['#ef4444', '#3b82f6', '#22c55e', '#1e293b'].map(c => (
                   <button key={c} onClick={() => { setSelectedColor(c); setIsEraser(false); }} className={`w-5 h-5 rounded-full border border-zinc-700 transition-transform ${selectedColor === c && !isEraser ? 'scale-125 ring-2 ring-white' : ''}`} style={{ backgroundColor: c }} />
                 ))}
                 {interactionMode === 'draw' && (
                   <>
                     <div className="w-px h-5 bg-zinc-700 mx-1"></div>
                     <Button variant="ghost" size="icon" onClick={() => setIsEraser(!isEraser)} className={isEraser ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}><Eraser size={18}/></Button>
                     <Button variant="ghost" size="icon" onClick={clearCanvas} className="text-zinc-400 hover:text-red-400"><Trash2 size={18}/></Button>
                   </>
                 )}
               </>
             )}
        </div>
      </div>

      {/* Minimalist Nav Arrows */}
      {!activeResource && showBottomBar && (
        <>
          <button onClick={(e) => { e.stopPropagation(); if(currentPage > 1) onPageChange(currentPage-1); }} disabled={currentPage === 1} className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 hover:bg-white text-zinc-900 shadow-sm border border-zinc-200 transition-all hover:scale-105 disabled:opacity-0"><ChevronLeft size={24}/></button>
          <button onClick={(e) => { e.stopPropagation(); if(currentPage < totalPages) onPageChange(currentPage+1); }} disabled={currentPage === totalPages} className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 hover:bg-white text-zinc-900 shadow-sm border border-zinc-200 transition-all hover:scale-105 disabled:opacity-0"><ChevronRight size={24}/></button>
        </>
      )}

      {/* Canvas */}
      <div 
        ref={containerRef} onClick={handleContainerClick} 
        className={`flex-1 overflow-hidden relative flex items-center justify-center bg-zinc-100 ${interactionMode === 'view' && scale > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
        onMouseDown={e => { if(interactionMode === 'view' && scale > 1) { setIsDragging(true); dragStart.current = {x: e.clientX - position.x, y: e.clientY - position.y}; } }}
        onMouseMove={e => { if(isDragging && scale > 1) setPosition({x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y}); }}
        onMouseUp={() => setIsDragging(false)}
      >
        <div 
          className="relative transition-all duration-300 ease-out shadow-soft bg-white"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            aspectRatio: isLandscape ? '297/210' : '210/297',
            ...(isRotated ? { width: isFullscreen ? '90vh' : '80vh', maxHeight: '90vw' } : { height: isFullscreen ? '95vh' : '85vh', maxWidth: '95vw' })
          }}
        >
          <div className="absolute inset-0 z-10 bg-white overflow-hidden">
             {pageData.htmlContent ? <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: pageData.htmlContent }} /> : <img src={pageData.contentImage} className="w-full h-full object-contain" alt="" />}
          </div>
          <AnnotationLayer 
            canvasRef={canvasRef} textNotes={textNotes} rotation={rotation} scale={scale} 
            interactionMode={interactionMode} width={2000} height={isLandscape ? 1414 : 2828}
            onPointerDown={startDrawing} onPointerMove={draw} onPointerUp={endDrawing}
            onUpdateText={handleUpdateText} onDeleteText={handleDeleteText}
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
