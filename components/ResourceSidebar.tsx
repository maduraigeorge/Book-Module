
import React, { useState, useMemo } from 'react';
import { X, Shuffle, Plus, ChevronDown, Check } from 'lucide-react';
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
    <div className="h-full flex flex-col bg-white relative">
      <button onClick={onToggleSidebar} className="absolute top-3 right-3 z-50 text-zinc-400 hover:text-zinc-900 transition-colors">
         <X size={18} />
      </button>

      <div className="px-5 pt-6 pb-4 border-b border-zinc-100 flex flex-col gap-4 z-20">
         <div className="relative z-40 pr-8">
            <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">Current Book</label>
            <button 
               onClick={() => setIsCatMenuOpen(!isCatMenuOpen)}
               className="w-full flex justify-between items-center px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
               <span>{activeBook}</span>
               <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isCatMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isCatMenuOpen && (
               <>
                 <div className="fixed inset-0 z-30" onClick={() => setIsCatMenuOpen(false)} />
                 <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-zinc-100 overflow-hidden z-50 py-1">
                    {availableBooks.map(b => (
                       <button key={b} onClick={() => { onBookChange(b); setIsCatMenuOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${activeBook === b ? 'bg-zinc-50 text-zinc-900 font-medium' : 'text-zinc-600 hover:bg-zinc-50'}`}>
                          <span>{b}</span>
                          {activeBook === b && <Check size={14} className="text-zinc-900" />}
                       </button>
                    ))}
                 </div>
               </>
            )}
         </div>

         <div className="flex justify-between items-end">
            <div>
               <h3 className="font-semibold text-lg text-zinc-900">Chapter Materials</h3>
               <p className="text-xs text-zinc-500 mt-0.5">{resources.length} items available</p>
            </div>
            {userRole === 'admin' && (
                <Button variant={isReordering ? "primary" : "ghost"} size="sm" onClick={() => setIsReordering(!isReordering)} title="Reorder Items" className="h-8 w-8 !p-0 rounded-md">
                    <Shuffle size={16} />
                </Button>
            )}
         </div>
      </div>

      <ResourceList 
        resources={resources} activeResourceId={activeResourceId} userRole={userRole} isReordering={isReordering}
        onPlay={onPlayResource} onDelete={onDeleteResource} onEdit={handleEditStart} onReorder={onReorder}
      />

      {userRole !== 'student' && (
          isAdding ? (
             <AddResourceForm initialData={editingResource} onAdd={handleFormSubmit} onCancel={handleFormCancel} />
          ) : (
            <div className="p-4 bg-white border-t border-zinc-100 z-10">
               <button onClick={() => { setEditingResource(null); setIsAdding(true); }} className="w-full py-3 border border-dashed border-zinc-300 rounded-lg text-zinc-500 text-sm font-medium flex items-center justify-center gap-2 hover:border-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 transition-all">
                  <Plus size={16} />
                  <span>Add Resource</span>
               </button>
            </div>
          )
      )}
    </div>
  );
};
