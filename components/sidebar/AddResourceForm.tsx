
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
      // Create temp URL for preview if needed, but for persistence we mostly care about the file object
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
      const newResource = { 
        id: initialData ? initialData.id : '', 
        title, 
        type, 
        url, // This is either a web URL or a temp blob URL. The App will handle the blob persistence if file is present.
        description: 'Custom',
        isHiddenFromStudents: isHidden
      };
      
      onAdd(newResource, selectedFile);
      
      // Reset
      setTitle(''); setUrl(''); setIsHidden(false); setSelectedFile(undefined);
    }
  };

  return (
    <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom-5">
       <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
         <div className="flex justify-between items-center mb-3">
           <span className="text-xs font-black text-slate-400 uppercase">{initialData ? 'Edit Item' : 'New Item'}</span>
           <button type="button" onClick={onCancel} className="text-slate-400 hover:text-red-500"><X size={16}/></button>
         </div>
         
         <input 
           type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required
           className="w-full mb-3 px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-violet-200"
         />
         
         <div className="flex gap-2 mb-3">
            {['url', 'file'].map(m => (
                <button key={m} type="button" onClick={() => setMode(m as any)} className={`flex-1 py-1.5 text-xs font-bold rounded-lg border capitalize ${mode === m ? 'bg-white border-violet-300 text-violet-600 shadow-sm' : 'border-transparent text-slate-400'}`}>
                    {m === 'url' ? <LinkIcon size={12} className="inline mr-1"/> : <Upload size={12} className="inline mr-1"/>} {m}
                </button>
            ))}
         </div>

         {mode === 'url' ? (
           <div className="mb-3">
             <input type="url" placeholder="https://..." value={url} onChange={e => { setUrl(e.target.value); setType(ResourceType.LINK); }} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none" />
             <div className="flex gap-1 overflow-x-auto mt-2 no-scrollbar">
                {[ResourceType.LINK, ResourceType.VIDEO, ResourceType.AUDIO, ResourceType.DOCUMENT, ResourceType.EMBED].map(t => (
                    <button key={t} type="button" onClick={() => setType(t)} className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${type === t ? 'bg-violet-100 text-violet-700 border-violet-200' : 'bg-white text-slate-400'}`}>{t}</button>
                ))}
             </div>
           </div>
         ) : (
           <div className="mb-3">
             <input type="file" ref={fileInputRef} className="hidden" onChange={handleFile} />
             <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full py-2 border border-slate-300 bg-white rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 truncate">
               <Paperclip size={14} /> {url ? (url.startsWith('blob:') ? 'File Selected' : 'File Ready') : 'Choose File'}
             </button>
           </div>
         )}
         
         <label className="flex items-center gap-2 mb-4 cursor-pointer group select-none">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isHidden ? 'bg-violet-500 border-violet-500' : 'bg-white border-slate-300 group-hover:border-violet-300'}`}>
                {isHidden && <EyeOff size={12} className="text-white" />}
            </div>
            <input type="checkbox" checked={isHidden} onChange={e => setIsHidden(e.target.checked)} className="hidden" />
            <span className={`text-xs font-bold ${isHidden ? 'text-violet-600' : 'text-slate-500'}`}>Hide for Students</span>
         </label>

         <Button type="submit" size="sm" className="w-full rounded-xl gap-2">
            {initialData ? <Save size={16}/> : <Plus size={16}/>} 
            {initialData ? 'Save Changes' : 'Add Item'}
         </Button>
       </form>
    </div>
  );
};
