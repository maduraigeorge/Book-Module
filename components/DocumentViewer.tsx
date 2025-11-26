import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Music, ExternalLink, ZoomIn, ZoomOut, RotateCcw, Move, Maximize2 } from 'lucide-react';
import { PageData, Resource, ResourceType } from '../types';
import { Button } from './Button';

interface DocumentViewerProps {
  pageData: PageData;
  activeResource: Resource | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onCloseResource: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  pageData,
  activeResource,
  currentPage,
  totalPages,
  onPageChange,
  onCloseResource,
}) => {
  // Zoom & Pan State
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Page Input State
  const [pageInput, setPageInput] = useState(currentPage.toString());

  // Animation State
  const [displayData, setDisplayData] = useState<PageData>(pageData);
  const [phantomData, setPhantomData] = useState<PageData | null>(null);
  const [animDirection, setAnimDirection] = useState<'next' | 'prev' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle Page Changes with Animation
  useEffect(() => {
    if (pageData.pageNumber !== displayData.pageNumber) {
        // Reset zoom before animating
        setScale(1);
        setPosition({ x: 0, y: 0 });
        
        const isNext = pageData.pageNumber > displayData.pageNumber;
        
        if (isNext) {
            // NEXT: Current page (displayData) becomes phantom and flips OUT. New page (pageData) becomes displayData (bottom layer)
            setPhantomData(displayData); 
            setDisplayData(pageData);
            setAnimDirection('next');
        } else {
            // PREV: New page (pageData) becomes phantom and flips IN. Current page (displayData) stays as bottom layer?
            // Actually: Bottom layer should be the "Old" page (displayData), Top layer is "New" page (pageData) arriving?
            // Let's stick to the visual metaphor:
            // NEXT: Top sheet (Old) flips Left to reveal Bottom Sheet (New).
            // PREV: Top sheet (New) flips Right from Left to cover Bottom Sheet (Old).
            
            // So for PREV: Bottom is displayData (Old). Top is pageData (New).
            setPhantomData(pageData);
            setAnimDirection('prev');
            // We wait to update displayData until animation finishes?
            // No, rendering logic below handles stacking.
        }

        setIsAnimating(true);
        setPageInput(pageData.pageNumber.toString());
        
        const timer = setTimeout(() => {
            setIsAnimating(false);
            setPhantomData(null);
            setAnimDirection(null);
            setDisplayData(pageData); // Ensure final state matches prop
        }, 800); // Match CSS animation duration

        return () => clearTimeout(timer);
    }
  }, [pageData, pageData.pageNumber]); // Depend on pageData changes

  const handlePrev = () => {
    if (!isAnimating && currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (!isAnimating && currentPage < totalPages) onPageChange(currentPage + 1);
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
  };

  // Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      e.preventDefault();
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
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

  // Helper component for Page Content
  const PageContent = ({ data, shadow = false }: { data: PageData, shadow?: boolean }) => (
    <div className="w-full h-full bg-white relative overflow-hidden flex flex-col items-center ring-1 ring-black/5 shadow-xl">
        <img 
            src={data.contentImage} 
            alt={`Page ${data.pageNumber}`} 
            className="w-full h-full object-contain select-none pointer-events-none"
            draggable={false}
        />
        {/* Inner Spine Shadow Gradient */}
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/10 to-transparent pointer-events-none mix-blend-multiply"></div>
        
        {/* Dynamic Shadow for animation */}
        {shadow && <div className="absolute inset-0 bg-black/10 animate-shadow pointer-events-none"></div>}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-800/50 relative overflow-hidden group">
      
      {/* Floating Navigation Arrows */}
      {!activeResource && !isAnimating && (
        <>
          <button 
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`
              absolute left-4 top-1/2 -translate-y-1/2 z-20 
              w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white 
              flex items-center justify-center transition-all duration-200
              hover:bg-white/20 hover:scale-110 active:scale-95 disabled:opacity-0 disabled:pointer-events-none
              shadow-lg
            `}
            title="Previous Page"
          >
            <ChevronLeft size={28} />
          </button>

          <button 
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`
              absolute right-4 top-1/2 -translate-y-1/2 z-20 
              w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white 
              flex items-center justify-center transition-all duration-200
              hover:bg-white/20 hover:scale-110 active:scale-95 disabled:opacity-0 disabled:pointer-events-none
              shadow-lg
            `}
            title="Next Page"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Main Content Area */}
      <div 
        ref={containerRef}
        className={`flex-1 overflow-hidden relative perspective-container flex items-center justify-center bg-slate-200/50 ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          background: 'radial-gradient(circle, #e2e8f0 0%, #cbd5e1 100%)'
        }}
      >
        
        {/* Document Container */}
        <div 
            className="relative preserve-3d"
            style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                maxWidth: '90%',
                maxHeight: '90%',
                aspectRatio: '1/1.414',
                width: 'auto',
                height: 'auto',
                // Keep the size constrained to viewport
                minHeight: '60%', 
                minWidth: '300px'
            }}
        >
            {/* 
               Layering Logic:
               We need absolute positioning to stack pages.
            */}

            {/* BASE LAYER (The one that stays or is revealed) */}
            <div className="absolute inset-0 z-0">
               {/* 
                  If going NEXT: Base is NEW page (displayData updated to new). 
                  If going PREV: Base is OLD page (displayData is NOT updated? Wait, logic says displayData IS old in prev?)
                  
                  Let's re-check the logic in useEffect:
                  Next: phantom=Old, display=New. Phantom is on top animating out. Base is New.
                  Prev: phantom=New, display=Old. Phantom is on top animating in. Base is Old.
                  
                  So Base is always `displayData`.
               */}
               <PageContent data={displayData} shadow={isAnimating && animDirection === 'next'} />
            </div>

            {/* ANIMATING LAYER (The one that moves) */}
            {isAnimating && phantomData && (
                <div 
                    className={`
                        absolute inset-0 z-10 origin-left-edge backface-hidden
                        ${animDirection === 'next' ? 'animate-turn-out' : ''}
                        ${animDirection === 'prev' ? 'animate-turn-in' : ''}
                    `}
                >
                    <PageContent data={phantomData} />
                    {/* Gloss Overlay for realism during turn */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 animate-pulse pointer-events-none"></div>
                </div>
            )}
        </div>

        {/* Overlay for Pan Hint */}
        {scale > 1 && !isDragging && (
             <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-4 py-2 rounded-full pointer-events-none flex items-center gap-2 backdrop-blur-md animate-pulse shadow-lg z-10">
                <Move size={12} />
                Click & Drag to pan
             </div>
        )}

        {/* Resource Overlay */}
        {activeResource && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-12 animate-in fade-in zoom-in duration-300 bg-slate-900/80 backdrop-blur-sm cursor-default"
               onClick={(e) => e.stopPropagation()} 
          >
             <div className="bg-black w-full max-w-4xl h-auto aspect-video rounded-2xl shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-white/10">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent p-4 flex justify-between items-start z-10 pointer-events-none">
                   <div className="text-white drop-shadow-md px-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold bg-blue-600 px-2 py-0.5 rounded text-white uppercase tracking-wider">
                           {activeResource.type}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg leading-tight">
                        {activeResource.title}
                      </h3>
                   </div>
                   <button 
                    onClick={onCloseResource}
                    className="pointer-events-auto text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all backdrop-blur-md"
                   >
                     <X size={20} />
                   </button>
                </div>

                {/* Content */}
                <div className="flex-1 bg-zinc-900 flex items-center justify-center relative">
                    {activeResource.type === ResourceType.VIDEO && (
                        <video 
                            controls 
                            autoPlay 
                            className="w-full h-full"
                            src={activeResource.url}
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}

                    {activeResource.type === ResourceType.AUDIO && (
                        <div className="flex flex-col items-center justify-center space-y-6 w-full px-12">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center shadow-2xl relative z-10">
                                    <Music size={48} className="text-blue-400" />
                                </div>
                            </div>
                            <div className="w-full max-w-md">
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
                        <div className="text-center text-white p-8">
                            <div className="w-20 h-20 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ExternalLink size={32} className="text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-3">External Resource</h3>
                            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                                This content is hosted on an external website. Click below to open it in a new tab.
                            </p>
                            <a 
                                href={activeResource.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-medium transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/20"
                            >
                                Open Resource <ExternalLink size={16} />
                            </a>
                        </div>
                    )}
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1.5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl transition-opacity duration-300 hover:bg-slate-900/90">
            {/* Page Navigation Input */}
            <div className="flex items-center gap-1.5 px-3 mr-1 border-r border-white/10">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider hidden sm:inline">Page</span>
                <div className="relative group/input">
                  <input 
                    className="w-8 bg-transparent text-center text-white font-bold text-sm focus:outline-none focus:bg-white/10 rounded border border-transparent focus:border-blue-500/50 transition-all py-0.5 placeholder-white/30"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    onKeyDown={handlePageKeyDown}
                    onBlur={handlePageInputSubmit}
                    title="Enter page number"
                  />
                </div>
                <span className="text-xs text-slate-500 font-medium">/</span>
                <span className="text-xs text-slate-400 font-medium">{totalPages}</span>
            </div>

            <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleZoomOut} 
                disabled={scale <= 1} 
                title="Zoom Out" 
                className="h-9 w-9 !p-0 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
            >
                <ZoomOut size={18} />
            </Button>
            
            <div className="px-2 min-w-[50px] text-center flex flex-col items-center justify-center cursor-default select-none">
                <span className="text-xs font-bold text-white tracking-wider">{Math.round(scale * 100)}%</span>
            </div>

            <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleZoomIn} 
                disabled={scale >= 3} 
                title="Zoom In" 
                className="h-9 w-9 !p-0 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
            >
                <ZoomIn size={18} />
            </Button>
            
            <div className="w-px h-5 bg-white/20 mx-1"></div>
            
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleResetZoom} 
                title="Fit to Page" 
                className="h-9 w-9 !p-0 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
            >
                {scale === 1 ? <Maximize2 size={18} /> : <RotateCcw size={18} />}
            </Button>
      </div>
    </div>
  );
};