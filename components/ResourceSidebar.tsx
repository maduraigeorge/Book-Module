import React, { useState, useRef } from 'react';
import { X, PlayCircle, Music, Link as LinkIcon, AlertCircle, Activity, Plus, FileText, Globe, BoxSelect, Check, ChevronDown, Upload, Paperclip, Trash2 } from 'lucide-react';
import { Resource, ResourceType } from '../types';
import { Button } from './Button';

interface ResourceSidebarProps {
  isOpen: boolean;
  resources: Resource[];
  activeResourceId: string | null;
  onPlayResource: (resource: Resource) => void;
  onToggleSidebar: () => void;
  onAddResource: (resource: Resource) => void;
  onDeleteResource: (resourceId: string) => void;
}

export const ResourceSidebar: React.FC<ResourceSidebarProps> = ({
  isOpen,
  resources,
  activeResourceId,
  onPlayResource,
  onToggleSidebar,
  onAddResource,
  onDeleteResource,
}) => {
  // State for Adding New Resource
  const [isAdding, setIsAdding] = useState(false);
  const [newResTitle, setNewResTitle] = useState('');
  
  // Input Mode: 'url' or 'file'
  const [inputMode, setInputMode] = useState<'url' | 'file'>('url');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResType, setNewResType] = useState<ResourceType>(ResourceType.LINK);
  
  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getIconForType = (type: ResourceType) => {
    switch (type) {
      case ResourceType.VIDEO: return <PlayCircle size={20} className="text-pink-500" />;
      case ResourceType.AUDIO: return <Music size={20} className="text-purple-500" />;
      case ResourceType.DOCUMENT: return <FileText size={20} className="text-orange-500" />;
      case ResourceType.LINK: return <Globe size={20} className="text-blue-500" />;
      default: return <Activity size={20} className="text-green-500" />;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setNewResUrl(objectUrl);
      // Auto-detect type roughly
      if (file.type.startsWith('video')) setNewResType(ResourceType.VIDEO);
      else if (file.type.startsWith('audio')) setNewResType(ResourceType.AUDIO);
      else if (file.type === 'application/pdf') setNewResType(ResourceType.DOCUMENT);
      
      if (!newResTitle) {
          setNewResTitle(file.name);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitle || !newResUrl) return;

    const newResource: Resource = {
      id: '', // App will assign ID
      title: newResTitle,
      type: newResType,
      url: newResUrl,
      description: 'Custom resource',
    };

    onAddResource(newResource);
    
    // Reset
    setIsAdding(false);
    setNewResTitle('');
    setNewResUrl('');
    setNewResType(ResourceType.LINK);
    setInputMode('url');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="p-4 bg-white border-b-2 border-slate-100 flex justify-between items-center shadow-sm z-10">
         <div>
            <h3 className="font-black text-xl text-slate-800">Resources</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Chapter Materials</p>
         </div>
         <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="md:hidden">
            <X size={20} />
         </Button>
      </div>

      {/* Add New Section */}
      <div className="p-4 bg-white border-b border-slate-100">
         {!isAdding ? (
             <button 
                onClick={() => setIsAdding(true)}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 font-bold flex items-center justify-center gap-2 hover:border-violet-400 hover:text-violet-500 hover:bg-violet-50 transition-all group"
             >
                <div className="bg-slate-100 group-hover:bg-violet-200 rounded-full p-1 text-slate-400 group-hover:text-violet-600 transition-colors">
                    <Plus size={16} strokeWidth={3} />
                </div>
                Add Resource
             </button>
         ) : (
             <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
                 <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-black text-slate-400 uppercase">New Item</span>
                    <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                 </div>

                 <input 
                    type="text" 
                    placeholder="Title (e.g. My Notes)"
                    className="w-full mb-3 px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-violet-200"
                    value={newResTitle}
                    onChange={e => setNewResTitle(e.target.value)}
                    required
                 />

                 <div className="flex gap-2 mb-3">
                    <button 
                        type="button"
                        onClick={() => setInputMode('url')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border flex items-center justify-center gap-1 ${inputMode === 'url' ? 'bg-white border-violet-300 text-violet-600 shadow-sm' : 'bg-transparent border-transparent text-slate-400'}`}
                    >
                        <LinkIcon size={12} /> Link
                    </button>
                    <button 
                        type="button"
                        onClick={() => setInputMode('file')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border flex items-center justify-center gap-1 ${inputMode === 'file' ? 'bg-white border-violet-300 text-violet-600 shadow-sm' : 'bg-transparent border-transparent text-slate-400'}`}
                    >
                        <Upload size={12} /> File
                    </button>
                 </div>

                 {inputMode === 'url' ? (
                     <div className="mb-3">
                        <input 
                            type="url" 
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-200"
                            value={newResUrl}
                            onChange={e => {
                                setNewResUrl(e.target.value);
                                setNewResType(ResourceType.LINK);
                            }}
                        />
                     </div>
                 ) : (
                     <div className="mb-3">
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-2 border border-slate-300 bg-white rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 truncate"
                        >
                            <Paperclip size={14} />
                            {newResUrl ? (newResUrl.startsWith('blob:') ? 'File Selected' : 'File Ready') : 'Choose File'}
                        </button>
                     </div>
                 )}

                 {/* Type Selector (if URL) */}
                 {inputMode === 'url' && (
                     <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar mb-3">
                        {[ResourceType.LINK, ResourceType.VIDEO, ResourceType.AUDIO, ResourceType.DOCUMENT].map(t => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setNewResType(t)}
                                className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase whitespace-nowrap border ${newResType === t ? 'bg-violet-100 text-violet-700 border-violet-200' : 'bg-white text-slate-400 border-slate-200'}`}
                            >
                                {t}
                            </button>
                        ))}
                     </div>
                 )}

                 <Button type="submit" variant="primary" size="sm" className="w-full rounded-xl">
                    Add Item
                 </Button>
             </form>
         )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
         {resources.length === 0 ? (
             <div className="text-center py-10 text-slate-400">
                 <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BoxSelect size={32} className="opacity-50" />
                 </div>
                 <p className="text-sm font-bold">No resources yet</p>
                 <p className="text-xs mt-1">Add links or files to help students.</p>
             </div>
         ) : (
             resources.map((resource) => (
                 <div 
                    key={resource.id}
                    className={`
                        group relative bg-white border-2 rounded-2xl p-3 transition-all cursor-pointer hover:shadow-md
                        ${activeResourceId === resource.id ? 'border-violet-500 shadow-md ring-2 ring-violet-100' : 'border-slate-100 hover:border-violet-200'}
                    `}
                    onClick={() => onPlayResource(resource)}
                 >
                    <div className="flex gap-3">
                        {/* Thumbnail / Icon */}
                        <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border
                            ${activeResourceId === resource.id ? 'bg-violet-100 border-violet-200' : 'bg-slate-50 border-slate-100'}
                        `}>
                            {resource.thumbnail ? (
                                <img src={resource.thumbnail} className="w-full h-full object-cover rounded-xl" alt="" />
                            ) : (
                                getIconForType(resource.type)
                            )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <h4 className={`font-bold text-sm truncate ${activeResourceId === resource.id ? 'text-violet-700' : 'text-slate-700'}`}>
                                {resource.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                    {resource.type}
                                </span>
                                {resource.duration && (
                                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-0.5">
                                        <Activity size={8} /> {resource.duration}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Active Indicator or Play Button */}
                        <div className="flex flex-col items-end justify-between">
                            {activeResourceId === resource.id && (
                                <div className="text-violet-500 animate-pulse">
                                    <Activity size={16} />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Delete Button (Visible on Hover) - Only for custom resources */}
                    {resource.id.startsWith('custom-') && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteResource(resource.id);
                            }}
                            className="absolute -top-2 -right-2 bg-white text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                 </div>
             ))
         )}
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-slate-100 border-t border-slate-200 text-center">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {resources.length} Resources Available
         </p>
      </div>
    </div>
  );
};
