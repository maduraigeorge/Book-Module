
import React, { useState } from 'react';
import { LayoutGrid, ZoomIn, ZoomOut, Minimize2, RotateCw, Maximize2, Highlighter } from 'lucide-react';
import { Button } from '../Button';
import { PageData } from '../../types';

interface ViewerControlsProps {
  scale: number;
  totalPages: number;
  currentPage: number;
  rotation: number;
  isFullscreen: boolean;
  isAnnotating: boolean;
  allPages: PageData[];
  showBottomBar: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onRotate: () => void;
  onToggleFullscreen: () => void;
  onToggleAnnotation: () => void;
  onPageChange: (p: number) => void;
  onPageInput: (val: string) => void;
  pageInputValue: string;
}

export const ViewerControls: React.FC<ViewerControlsProps> = ({
  scale, totalPages, currentPage, rotation, isFullscreen, isAnnotating, allPages, showBottomBar,
  onZoomIn, onZoomOut, onResetZoom, onRotate, onToggleFullscreen, onToggleAnnotation, onPageChange, onPageInput, pageInputValue
}) => {
  const [showThumbnails, setShowThumbnails] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      let p = parseInt(pageInputValue);
      if (!isNaN(p)) onPageChange(Math.max(1, Math.min(p, totalPages)));
    }
  };

  return (
    <div 
      onClick={(e) => e.stopPropagation()} 
      className={`absolute bottom-6 left-0 right-0 z-30 flex flex-col items-center transition-transform duration-300 ${showBottomBar ? 'translate-y-0' : 'translate-y-32'}`}
    >
      <div className="flex items-center gap-1 p-1.5 rounded-full bg-zinc-900/90 backdrop-blur text-zinc-400 shadow-2xl mb-4 max-w-[90vw] overflow-x-auto no-scrollbar pointer-events-auto">
          
          <Button variant="ghost" size="icon" onClick={() => setShowThumbnails(!showThumbnails)} active={showThumbnails} className="hover:text-white hover:bg-zinc-800">
            <LayoutGrid size={18} />
          </Button>

          <div className="h-4 w-px bg-zinc-700 mx-1"></div>

          <div className="flex items-center gap-2 px-2">
            <input 
              className="w-8 bg-transparent text-center text-white font-medium text-sm border-b border-zinc-700 focus:border-white outline-none"
              value={pageInputValue}
              onChange={(e) => onPageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              inputMode="numeric"
            />
            <span className="text-xs text-zinc-500">/ {totalPages}</span>
          </div>

          <div className="h-4 w-px bg-zinc-700 mx-1"></div>

          <Button variant="ghost" size="icon" onClick={onZoomOut} disabled={scale <= 1} className="hover:text-white hover:bg-zinc-800"><ZoomOut size={18} /></Button>
          <span className="text-[10px] font-medium min-w-[30px] text-center">{Math.round(scale * 100)}%</span>
          <Button variant="ghost" size="icon" onClick={onZoomIn} disabled={scale >= 4} className="hover:text-white hover:bg-zinc-800"><ZoomIn size={18} /></Button>
          
          <div className="h-4 w-px bg-zinc-700 mx-1"></div>
          
          <Button variant="ghost" size="icon" onClick={onResetZoom} className="hover:text-white hover:bg-zinc-800"><Minimize2 size={18} /></Button>
          <Button variant="ghost" size="icon" onClick={onToggleAnnotation} active={isAnnotating} className={isAnnotating ? 'text-white bg-zinc-700' : 'hover:text-white hover:bg-zinc-800'}>
            <Highlighter size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={onRotate} className="hover:text-white hover:bg-zinc-800">
            <RotateCw size={18} style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.3s' }} />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleFullscreen} className="hover:text-white hover:bg-zinc-800">
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </Button>
      </div>

      {showThumbnails && (
        <div className="absolute bottom-16 w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-xl border border-zinc-200 shadow-xl z-20 p-2 animate-in slide-in-from-bottom-5">
          <div className="flex overflow-x-auto custom-scrollbar gap-2 p-2">
            {allPages.map((page) => (
              <div 
                key={page.pageNumber} 
                onClick={() => onPageChange(page.pageNumber)}
                className={`flex-shrink-0 cursor-pointer transition-all ${currentPage === page.pageNumber ? 'ring-2 ring-zinc-900 rounded-lg' : 'opacity-70 hover:opacity-100'}`}
              >
                <img src={page.contentImage} className="h-20 w-auto rounded-md object-cover border border-zinc-200" alt="" />
                <div className="text-[10px] text-center mt-1 text-zinc-500 font-medium">{page.pageNumber}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
