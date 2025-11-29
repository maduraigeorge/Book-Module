
import React, { useState, useMemo } from 'react';
import { X, Shuffle, Plus, ChevronDown, Layers, Check } from 'lucide-react';
import { Resource, UserRole, BookCategory } from '../types';
import { Button } from './Button';
import { ResourceList } from './sidebar/ResourceList';
import { AddResourceForm } from './sidebar/AddResourceForm';

interface ResourceSidebarProps {
  isOpen: boolean;
  resources: Resource[];
  activeResourceId: string | null;
  userRole: UserRole;
  activeBook: BookCategory;
  onBookChange: (book: BookCategory) => void;
  onPlayResource: (resource: Resource) => void;
  onToggleSidebar: () => void;
  onAddResource: (resource: Resource, file?: File) => void;
  onEditResource: (resource: Resource, file?: File) => void;
  onDeleteResource: (resourceId: string) => void;
  onReorder: (newOrderIds: string[]) => void;
}

export const ResourceSidebar: React.FC<ResourceSidebarProps> = ({
  resources, activeResourceId, userRole, activeBook, onBookChange, onPlayResource, onToggleSidebar, onAddResource, onEditResource, onDeleteResource, onReorder
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [isCatMenuOpen, setIsCatMenuOpen] = useState(false);

  // Filter categories based on user role
  const availableBooks = useMemo(() => {
    const allBooks: BookCategory[] = ['Studio', 'Companion', 'FHB'];
    if (userRole === 'student') return allBooks.filter(c => c !== 'FHB');
    return allBooks;
  }, [userRole]);

  const handleEditStart = (r: Resource) => {
    setEditingResource(r);
    setIsAdding(true);
  };

  const handleFormSubmit = (r: Resource, file?: File) => {
    if (editingResource) {
        onEditResource(r, file);
    } else {
        onAddResource(r, file);
    }
    setIsAdding(false);
    setEditingResource(null);
  };

  const handleFormCancel = () => {
    setIsAdding(false);
    setEditingResource(null);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 relative">
      {/* Absolute Close Button */}
      <button onClick={onToggleSidebar} className="absolute top-2 right-2 z-50 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
         <X size={20} />
      </button>

      {/* Header */}
      <div className="p-5 pb-2 bg-white border-b-2 border-slate-100 flex flex-col gap-4 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] z-20">
         <div className="relative z-40 pr-8">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block pl-1">Select Book</label>
            <button 
               onClick={() => setIsCatMenuOpen(!isCatMenuOpen)}
               className={`w-full flex justify-between items-center px-4 py-3.5 rounded-2xl font-black text-base transition-all duration-200 group border-2 ${isCatMenuOpen ? 'bg-violet-600 text-white border-violet-600 shadow-lg scale-[1.02]' : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300 hover:shadow-md'}`}
            >
               <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${isCatMenuOpen ? 'bg-white/20 text-white' : 'bg-violet-100 text-violet-600'}`}>
                    <Layers size={18} />
                  </div>
                  <span>{activeBook}</span>
               </div>
               <ChevronDown size={20} className={`transition-transform duration-300 ${isCatMenuOpen ? 'rotate-180 text-white' : 'text-slate-400 group-hover:text-violet-500'}`} />
            </button>
            
            {isCatMenuOpen && (
               <>
                 <div className="fixed inset-0 z-30" onClick={() => setIsCatMenuOpen(false)} />
                 <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-violet-100 overflow-hidden animate-in fade-in zoom-in-95 origin-top z-50 p-1.5">
                    {availableBooks.map(b => (
                       <button key={b} onClick={() => { onBookChange(b); setIsCatMenuOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all mb-1 last:mb-0 ${activeBook === b ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                          <span>{b}</span>
                          {activeBook === b && <Check size={16} className="text-violet-600" />}
                       </button>
                    ))}
                 </div>
               </>
            )}
         </div>

         <div className="flex justify-between items-end border-t border-slate-100 pt-3">
            <div>
               <h3 className="font-black text-2xl text-slate-800 tracking-tight">Resources</h3>
               <div className="flex items-center gap-2 mt-1">
                 <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">{activeBook}</span>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Materials</p>
               </div>
            </div>
            {userRole === 'admin' && (
                <Button variant={isReordering ? "primary" : "secondary"} size="sm" onClick={() => setIsReordering(!isReordering)} title="Reorder Items" className="!p-2 rounded-xl">
                    <Shuffle size={18} className={isReordering ? "text-white" : "text-slate-500"} />
                </Button>
            )}
         </div>
      </div>

      <ResourceList 
        resources={resources} activeResourceId={activeResourceId} userRole={userRole} isReordering={isReordering}
        onPlay={onPlayResource} onDelete={onDeleteResource} onEdit={handleEditStart} onReorder={onReorder}
      />

      {/* Footer Area - Add Button */}
      {userRole !== 'student' && (
          isAdding ? (
             <AddResourceForm initialData={editingResource} onAdd={handleFormSubmit} onCancel={handleFormCancel} />
          ) : (
            <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
               <button onClick={() => { setEditingResource(null); setIsAdding(true); }} className="w-full py-3.5 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 font-bold flex items-center justify-center gap-2 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-all group active:scale-[0.99]">
                  <div className="bg-slate-100 group-hover:bg-violet-200 rounded-full p-1 text-slate-400 group-hover:text-violet-600 transition-colors"><Plus size={18} strokeWidth={3} /></div> 
                  <span>Add New Resource</span>
               </button>
            </div>
          )
      )}
    </div>
  );
};
