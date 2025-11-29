
import React, { useState } from 'react';
import { Trash2, GripVertical, Activity, PlayCircle, Music, FileText, Globe, BoxSelect, EyeOff, Pencil } from 'lucide-react';
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
      case ResourceType.VIDEO: return <PlayCircle size={20} className="text-pink-500" />;
      case ResourceType.AUDIO: return <Music size={20} className="text-purple-500" />;
      case ResourceType.DOCUMENT: return <FileText size={20} className="text-orange-500" />;
      case ResourceType.LINK: return <Globe size={20} className="text-blue-500" />;
      default: return <Activity size={20} className="text-green-500" />;
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

  if (resources.length === 0) return <div className="text-center py-10 text-slate-400"><BoxSelect size={32} className="opacity-50 mx-auto mb-3"/><p className="text-sm font-bold">No resources yet</p></div>;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
      {resources.map((res, idx) => (
        <div 
          key={res.id} draggable={isReordering}
          onDragStart={(e) => { setDraggedIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
          onDrop={(e) => handleDrop(e, idx)}
          onClick={() => !isReordering && onPlay(res)}
          className={`group relative bg-white border-2 rounded-2xl p-3 transition-all cursor-pointer hover:shadow-md ${activeResourceId === res.id ? 'border-violet-500 shadow-md ring-2 ring-violet-100' : 'border-slate-100'} ${isReordering ? 'cursor-move border-dashed border-slate-300' : ''} ${draggedIdx === idx ? 'opacity-50' : ''} ${res.isHiddenFromStudents ? 'bg-slate-50 border-slate-200' : ''}`}
        >
          <div className="flex gap-3 items-center">
            {isReordering && <GripVertical size={20} className="text-slate-300" />}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${activeResourceId === res.id ? 'bg-violet-100' : 'bg-slate-50'}`}>
               {res.thumbnail ? <img src={res.thumbnail} className="w-full h-full object-cover rounded-xl" alt=""/> : getIcon(res.type)}
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2">
                 <h4 className={`font-bold text-sm truncate ${activeResourceId === res.id ? 'text-violet-700' : 'text-slate-700'}`}>{res.title}</h4>
                 {res.isHiddenFromStudents && (
                    <span title="Hidden from students" className="bg-slate-200 text-slate-500 rounded p-0.5"><EyeOff size={12}/></span>
                 )}
               </div>
               <div className="flex items-center gap-2 mt-1">
                 <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{res.type}</span>
               </div>
            </div>
            {!isReordering && activeResourceId === res.id && <Activity size={16} className="text-violet-500 animate-pulse" />}
          </div>
          
          {/* Action Buttons */}
          {!isReordering && canEditOrDelete(res) && (
            <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
               <button 
                onClick={(e) => { e.stopPropagation(); onEdit(res); }}
                className="bg-white text-blue-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-full shadow-sm border border-slate-100"
                title="Edit"
              ><Pencil size={14} /></button>
              <button 
                onClick={(e) => { e.stopPropagation(); if(window.confirm("Delete this activity?")) onDelete(res.id); }}
                className="bg-white text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full shadow-sm border border-slate-100"
                title="Delete"
              ><Trash2 size={14} /></button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
