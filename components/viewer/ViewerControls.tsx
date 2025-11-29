
import React, { useState } from 'react';
import { LayoutGrid, ZoomIn, ZoomOut, Minimize2, RotateCw, BookOpen, Maximize2, Highlighter } from 'lucide-react';
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
      className={`absolute bottom-0 left-0 right-0 z-30 flex flex-col items-center transition-transform duration-300 ${showBottomBar ? 'translate-y-0' : 'translate-y-full'}`}
    >
      {/* Toolbar */}
      <div className="w-full flex justify-center pointer-events-none">
        <div className={`pointer-events-auto flex items-center gap-1 p-2 rounded-2xl bg-white shadow-xl border-2 border-slate-100 transition-all duration-300 mb-6 max-w-[95vw] overflow-x-auto no-scrollbar ${showThumbnails ? 'mb-40' : 'mb-6'}`}>
          
          <Button variant="icon" size="sm" onClick={() => setShowThumbnails(!showThumbnails)} active={showThumbnails} className="mr-1 border-r border-slate-100 rounded-r-none pr-3">
            <LayoutGrid size={20} />
          </Button>

          <div className="flex items-center gap-2 px-3 mr-1 border-r-2 border-slate-100 whitespace-nowrap">
            <BookOpen size={16} className="text-violet-500" />
            <input 
              className="w-10 bg-slate-100 text-center text-violet-700 font-bold rounded-lg border-2 border-transparent focus:border-violet-300 outline-none"
              value={pageInputValue}
              onChange={(e) => onPageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              inputMode="numeric"
            />
            <span className="text-slate-500 font-bold">/ {totalPages}</span>
          </div>

          <Button variant="icon" size="sm" onClick={onZoomOut} disabled={scale <= 1}><ZoomOut size={20} /></Button>
          <span className="text-xs font-bold text-slate-700 min-w-[40px] text-center">{Math.round(scale * 100)}%</span>
          <Button variant="icon" size="sm" onClick={onZoomIn} disabled={scale >= 4}><ZoomIn size={20} /></Button>
          
          <div className="w-0.5 h-6 bg-slate-200 mx-1"></div>
          <Button variant="icon" size="sm" onClick={onResetZoom}><Minimize2 size={20} /></Button>
          <div className="w-0.5 h-6 bg-slate-200 mx-1"></div>
          
          <Button variant="icon" size="sm" onClick={onToggleAnnotation} active={isAnnotating} className={isAnnotating ? 'bg-pink-100 text-pink-600' : ''}>
            <Highlighter size={20} />
          </Button>

          <Button variant="icon" size="sm" onClick={onRotate}>
            <RotateCw size={20} style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.3s' }} />
          </Button>

          <div className="w-0.5 h-6 bg-slate-200 mx-1"></div>
          <Button variant="icon" size="sm" onClick={onToggleFullscreen}>
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </Button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className={`absolute bottom-0 left-0 right-0 h-32 bg-white/95 backdrop-blur-md border-t-4 border-violet-200 shadow-xl z-20 transition-transform duration-300 flex flex-col pointer-events-auto ${showThumbnails ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex-1 overflow-x-auto custom-scrollbar flex items-center px-6 gap-4 py-4">
          {allPages.map((page) => (
            <div 
              key={page.pageNumber} 
              onClick={() => onPageChange(page.pageNumber)}
              className={`relative flex-shrink-0 cursor-pointer transition-all duration-200 ${currentPage === page.pageNumber ? 'scale-110 -translate-y-2' : 'hover:-translate-y-1'}`}
            >
              <div className={`absolute -top-3 -right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${currentPage === page.pageNumber ? 'bg-violet-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {page.pageNumber}
              </div>
              <div className={`h-20 w-14 rounded-lg overflow-hidden border-2 shadow-sm ${currentPage === page.pageNumber ? 'border-violet-500 ring-2 ring-violet-200' : 'border-slate-200'}`}>
                <img src={page.contentImage} className="w-full h-full object-cover" alt="" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
