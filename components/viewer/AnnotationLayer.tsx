
import React from 'react';
import { Trash2 } from 'lucide-react';
import { TextNote } from '../../hooks/useCanvas';

interface AnnotationLayerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  textNotes: TextNote[];
  rotation: number;
  scale: number;
  interactionMode: 'view' | 'draw' | 'type';
  width: number;
  height: number;
  onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onUpdateText: (id: string, val: string) => void;
  onDeleteText: (id: string) => void;
}

export const AnnotationLayer: React.FC<AnnotationLayerProps> = ({
  canvasRef, textNotes, rotation, scale, interactionMode, width, height,
  onPointerDown, onPointerMove, onPointerUp, onUpdateText, onDeleteText
}) => {
  return (
    <div 
      className="absolute inset-0 z-30 w-full h-full transition-transform duration-300"
      style={{ transform: `rotate(${-rotation}deg)` }}
    >
      {/* Text Layer */}
      <div className={`absolute inset-0 w-full h-full ${interactionMode === 'type' ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {textNotes.map((note) => (
          <div 
            key={note.id}
            className="absolute pointer-events-auto group"
            style={{ left: `${note.x}%`, top: `${note.y}%`, transform: 'translate(-50%, -50%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <textarea
                value={note.text}
                placeholder="Type..."
                onChange={(e) => onUpdateText(note.id, e.target.value)}
                className="bg-transparent text-lg font-bold border-2 border-transparent hover:border-violet-300 focus:border-violet-500 focus:bg-white/80 rounded-lg p-2 outline-none resize-none overflow-hidden min-w-[100px]"
                style={{ color: note.color, height: 'auto', fieldSizing: 'content' } as any}
                autoFocus={!note.text}
              />
              <button onClick={() => onDeleteText(note.id)} className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Canvas Layer */}
      <canvas
        ref={canvasRef}
        width={width} 
        height={height} 
        className={`absolute inset-0 w-full h-full touch-none ${interactionMode === 'draw' ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />
    </div>
  );
};
