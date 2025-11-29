
import React, { useState } from 'react';
import { Trash2, GripVertical, PlayCircle, Music, FileText, Globe, BoxSelect, EyeOff, Pencil, Zap } from 'lucide-react';
import { Resource, ResourceType, UserRole } from '../../types';

interface ResourceListProps {
  resources: Resource[];
  activeResourceId: string | null;
  userRole: UserRole;
  isReordering: boolean;
  onPlay: (r: Resource) => void;
  onDelete: (id: string) => void;
  onEdit: (r: Resource) => void;
  onReorder: (ids: string[]) => void;
}

export const ResourceList: React.FC<ResourceListProps> = ({
  resources, activeResourceId, userRole, isReordering, onPlay, onDelete, onEdit, onReorder
}) => {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const getIcon = (type: ResourceType) => {
    switch(type) {
      case ResourceType.VIDEO: return <PlayCircle size={18} className="text-zinc-600" />;
      case ResourceType.AUDIO: return <Music size={18} className="text-zinc-600" />;
      case ResourceType.DOCUMENT: return <FileText size={18} className="text-zinc-600" />;
      case ResourceType.LINK: return <Globe size={18} className="text-zinc-600" />;
      default: return <Zap size={18} className="text-zinc-600" />;
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIndex) return;
    const newItems = [...resources];
    const [moved] = newItems.splice(draggedIdx, 1);
    newItems.splice(targetIndex, 0, moved);
    onReorder(newItems.map(r => r.id));
    setDraggedIdx(null);
  };

  const canEditOrDelete = (r: Resource) => {
    if (userRole === 'student') return false;
    if (userRole === 'admin') return true;
    return userRole === 'teacher' && r.id.startsWith('custom-');
  };

  if (resources.length === 0) return <div className="text-center py-12 text-zinc-400"><BoxSelect size={24} className="opacity-50 mx-auto mb-2"/><p className="text-xs font-medium">Empty</p></div>;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
      {resources.map((res, idx) => (
        <div 
          key={res.id} draggable={isReordering}
          onDragStart={(e) => { setDraggedIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
          onDrop={(e) => handleDrop(e, idx)}
          onClick={() => !isReordering && onPlay(res)}
          className={`group relative flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${activeResourceId === res.id ? 'bg-zinc-50 border-zinc-300 shadow-sm' : 'bg-white border-zinc-100 hover:border-zinc-200'} ${isReordering ? 'cursor-move border-dashed' : ''} ${draggedIdx === idx ? 'opacity-30' : ''}`}
        >
          {isReordering && <GripVertical size={16} className="text-zinc-300" />}
          
          <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 bg-zinc-50 border border-zinc-100 overflow-hidden`}>
             {res.thumbnail ? <img src={res.thumbnail} className="w-full h-full object-cover" alt=""/> : getIcon(res.type)}
          </div>
          
          <div className="flex-1 min-w-0">
             <div className="flex items-center gap-2">
               <h4 className={`font-medium text-sm truncate ${activeResourceId === res.id ? 'text-zinc-900' : 'text-zinc-700'}`}>{res.title}</h4>
               {res.isHiddenFromStudents && (
                  <EyeOff size={12} className="text-zinc-400" />
               )}
             </div>
             <p className="text-[10px] text-zinc-400 uppercase tracking-wide mt-0.5">{res.type}</p>
          </div>
          
          {!isReordering && canEditOrDelete(res) && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                onClick={(e) => { e.stopPropagation(); onEdit(res); }}
                className="text-zinc-400 hover:text-zinc-900 p-1.5 rounded-md hover:bg-zinc-100"
              ><Pencil size={14} /></button>
              <button 
                onClick={(e) => { e.stopPropagation(); if(window.confirm("Delete?")) onDelete(res.id); }}
                className="text-zinc-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50"
              ><Trash2 size={14} /></button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
