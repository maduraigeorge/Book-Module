
import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Link as LinkIcon, Upload, Paperclip, EyeOff, Save } from 'lucide-react';
import { Resource, ResourceType } from '../../types';
import { Button } from '../Button';

interface AddResourceFormProps {
  initialData?: Resource | null;
  onAdd: (r: Resource, file?: File) => void;
  onCancel: () => void;
}

export const AddResourceForm: React.FC<AddResourceFormProps> = ({ initialData, onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<ResourceType>(ResourceType.LINK);
  const [mode, setMode] = useState<'url' | 'file'>('url');
  const [isHidden, setIsHidden] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setUrl(initialData.url);
      setType(initialData.type);
      setIsHidden(!!initialData.isHiddenFromStudents);
      setMode(initialData.url.startsWith('blob:') ? 'file' : 'url');
    }
  }, [initialData]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUrl(URL.createObjectURL(file)); 
      if (file.type.startsWith('video')) setType(ResourceType.VIDEO);
      else if (file.type.startsWith('audio')) setType(ResourceType.AUDIO);
      else if (file.type === 'application/pdf') setType(ResourceType.DOCUMENT);
      if (!title) setTitle(file.name);
      e.target.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && url) {
      onAdd({ 
        id: initialData ? initialData.id : '', 
        title, type, url, description: 'Custom', isHiddenFromStudents: isHidden
      }, selectedFile);
      setTitle(''); setUrl(''); setIsHidden(false); setSelectedFile(undefined);
    }
  };

  return (
    <div className="p-4 bg-white border-t border-zinc-100 shadow-soft">
       <form onSubmit={handleSubmit} className="flex flex-col gap-3">
         <div className="flex justify-between items-center">
           <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">{initialData ? 'Edit Resource' : 'New Resource'}</span>
           <button type="button" onClick={onCancel} className="text-zinc-400 hover:text-zinc-900"><X size={16}/></button>
         </div>
         
         <input 
           type="text" placeholder="Resource Title" value={title} onChange={e => setTitle(e.target.value)} required
           className="w-full px-3 py-2 bg-zinc-50 rounded-md border border-zinc-200 text-sm focus:outline-none focus:bg-white focus:border-zinc-400 transition-colors"
         />
         
         <div className="flex bg-zinc-50 p-1 rounded-md border border-zinc-200">
            {['url', 'file'].map(m => (
                <button key={m} type="button" onClick={() => setMode(m as any)} className={`flex-1 py-1 text-xs font-medium rounded capitalize transition-all ${mode === m ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}>
                    {m}
                </button>
            ))}
         </div>

         {mode === 'url' ? (
           <div className="space-y-2">
             <input type="url" placeholder="https://..." value={url} onChange={e => { setUrl(e.target.value); setType(ResourceType.LINK); }} className="w-full px-3 py-2 bg-zinc-50 rounded-md border border-zinc-200 text-sm focus:outline-none focus:bg-white focus:border-zinc-400" />
             <div className="flex gap-1 overflow-x-auto no-scrollbar py-1">
                {[ResourceType.LINK, ResourceType.VIDEO, ResourceType.AUDIO, ResourceType.DOCUMENT, ResourceType.EMBED].map(t => (
                    <button key={t} type="button" onClick={() => setType(t)} className={`px-2 py-1 rounded text-[10px] font-semibold uppercase border transition-colors ${type === t ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300'}`}>{t}</button>
                ))}
             </div>
           </div>
         ) : (
           <div>
             <input type="file" ref={fileInputRef} className="hidden" onChange={handleFile} />
             <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full py-2 border border-zinc-200 bg-zinc-50 rounded-md text-xs font-medium text-zinc-600 hover:bg-zinc-100 flex items-center justify-center gap-2 truncate">
               <Paperclip size={14} /> {url ? (url.startsWith('blob:') ? 'Selected' : 'Ready') : 'Choose File'}
             </button>
           </div>
         )}
         
         <div className="flex items-center justify-between">
             <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={isHidden} onChange={e => setIsHidden(e.target.checked)} className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500" />
                <span className="text-xs text-zinc-600">Hide for Students</span>
             </label>
             
             <Button type="submit" size="sm" variant="primary" className="gap-2 px-4">
                {initialData ? <Save size={14}/> : <Plus size={14}/>} 
                {initialData ? 'Save' : 'Add'}
             </Button>
         </div>
       </form>
    </div>
  );
};
