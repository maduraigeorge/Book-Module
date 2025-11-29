
import { useRef, useState, useEffect, useCallback } from 'react';
import { dbService } from '../services/db';

export interface TextNote {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

export const useCanvas = (activeBook: string, currentPage: number, rotation: number) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Local state for immediate rendering
  const [textNotes, setTextNotes] = useState<TextNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load data from DB when page/book changes
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      
      // Clear current canvas first
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setTextNotes([]);

      try {
        const record = await dbService.getAnnotation(activeBook, currentPage);
        if (isMounted && record) {
           // Restore Text
           setTextNotes(record.textNotes || []);
           
           // Restore Canvas Image
           if (record.canvasData && canvas && ctx) {
               const img = new Image();
               img.src = record.canvasData;
               img.onload = () => {
                   // Ensure we are still on the same page before drawing
                   if (isMounted) ctx.drawImage(img, 0, 0);
               };
           }
        }
      } catch (e) {
        console.error("Failed to load annotations", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [activeBook, currentPage]);

  // Save data to DB
  const savePageData = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // We only save if there is content to save to avoid DB bloat, 
    // but for simplicity we overwrite with current state (even if empty) to handle clears.
    const canvasData = canvas.toDataURL();
    await dbService.saveAnnotation(activeBook, currentPage, canvasData, textNotes);
  }, [activeBook, currentPage, textNotes]);

  // Auto-save debouncer could go here, but for now we rely on explicit triggers 
  // or simple effect-based saving on unmount/change is tricky with async DB.
  // Instead, we will expose savePageData and call it when 'drawing ends' or 'text changes'.

  // Helper to trigger save manually (e.g. after mouseUp)
  const triggerSave = () => {
      savePageData();
  };

  const clearCanvas = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setTextNotes([]);
    // Clear in DB
    await dbService.saveAnnotation(activeBook, currentPage, null, []);
  };

  return {
    canvasRef,
    textNotes,
    setTextNotes,
    clearCanvas,
    triggerSave,
    isLoading
  };
};
