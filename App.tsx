
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { STUDIO_PAGES, COMPANION_PAGES, FHB_PAGES } from './constants';
import { DocumentViewer } from './components/DocumentViewer';
import { ResourceSidebar } from './components/ResourceSidebar';
import { ResourcePlayer } from './components/viewer/ResourcePlayer';
import { Resource, UserRole, BookCategory } from './types';
import { dbService } from './services/db';
import { BookOpen, Shield, GraduationCap, School, ChevronLeft, ChevronDown, Check } from 'lucide-react';

export default function App() {
  const [activeBook, setActiveBook] = useState<BookCategory>('Studio');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // User Role State
  const [userRole, setUserRole] = useState<UserRole>('teacher');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // State to store user-added resources. Key is `${bookName}-${pageNumber}`
  const [customResources, setCustomResources] = useState<Record<string, Resource[]>>({});

  // State to track deleted static resources (for Admin). Key is `${bookName}-${resourceID}`
  const [deletedStaticIds, setDeletedStaticIds] = useState<Set<string>>(new Set());

  // State to track modified static resources (Admin Edits). Map<ResourceID, Resource>
  const [modifiedStaticResources, setModifiedStaticResources] = useState<Map<string, Resource>>(new Map());

  // Resource Order State: Map<Key, ResourceID[]>
  const [resourceOrder, setResourceOrder] = useState<Record<string, string[]>>({});

  const appContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
    
    // Load persisted data
    const initData = async () => {
        try {
            // Load Resources
            const resources = await dbService.getAllCustomResources();
            const resMap: Record<string, Resource[]> = {};
            
            // Reconstruct resource map and object URLs
            resources.forEach(r => {
                const key = `${r.book}-${r.page}`;
                if (!resMap[key]) resMap[key] = [];
                
                const finalUrl = r.fileBlob ? URL.createObjectURL(r.fileBlob) : (r.urlStr || '');
                const res: Resource = {
                    id: r.id, title: r.title, type: r.type, description: r.description,
                    isHiddenFromStudents: r.isHiddenFromStudents,
                    url: finalUrl
                };
                resMap[key].push(res);
            });
            setCustomResources(resMap);

            // Load Settings
            const deleted = await dbService.getSetting<string[]>('deletedStaticIds');
            if (deleted) setDeletedStaticIds(new Set(deleted));
            
            const modified = await dbService.getSetting<[string, Resource][]>('modifiedStaticResources');
            if (modified) setModifiedStaticResources(new Map(modified));
            
            const orders = await dbService.getSetting<Record<string, string[]>>('resourceOrder');
            if (orders) setResourceOrder(orders);
            
        } catch (e) {
            console.error("Failed to load local DB", e);
        } finally {
            setIsLoading(false);
        }
    };
    initData();
  }, []);

  // Cleanup Blob URLs
  useEffect(() => {
    return () => {
        Object.values(customResources).flat().forEach(resource => {
            if (resource.url.startsWith('blob:')) URL.revokeObjectURL(resource.url);
        });
    };
  }, [customResources]);

  const currentBookPages = useMemo(() => {
      switch(activeBook) {
          case 'Companion': return COMPANION_PAGES;
          case 'FHB': return FHB_PAGES;
          case 'Studio': default: return STUDIO_PAGES;
      }
  }, [activeBook]);

  const currentPageData = useMemo(() => {
    return currentBookPages.find(p => p.pageNumber === currentPage) || currentBookPages[0];
  }, [currentPage, currentBookPages]);

  // Combined Resource Pipeline
  const currentDisplayResources = useMemo(() => {
    let staticRes = currentPageData.resources || [];
    const resourceKey = `${activeBook}-${currentPage}`; 
    const userRes = customResources[resourceKey] || [];
    
    // 1. Process Static Resources (Apply modifications & deletions)
    let processedStatic = staticRes.map(r => modifiedStaticResources.get(r.id) || r)
                                   .filter(r => !deletedStaticIds.has(r.id));

    // 2. Combine with Custom
    let combined = [...processedStatic, ...userRes];

    // 3. Filter Hidden for Students
    if (userRole === 'student') {
        combined = combined.filter(r => !r.isHiddenFromStudents);
    }

    // 4. Sort
    const order = resourceOrder[resourceKey];
    if (order && order.length > 0) {
        combined.sort((a, b) => {
            const indexA = order.indexOf(a.id);
            const indexB = order.indexOf(b.id);
            const safeIndexA = indexA === -1 ? 9999 : indexA;
            const safeIndexB = indexB === -1 ? 9999 : indexB;
            return safeIndexA - safeIndexB;
        });
    }

    return combined;
  }, [currentPageData, customResources, currentPage, deletedStaticIds, modifiedStaticResources, resourceOrder, userRole, activeBook]);

  useEffect(() => { setActiveResource(null); }, [currentPage, activeBook]);

  const handleBookChange = (newBook: BookCategory) => { setActiveBook(newBook); setCurrentPage(1); };
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleToggleFullscreen = () => {
    !document.fullscreenElement ? appContainerRef.current?.requestFullscreen() : document.exitFullscreen();
  };

  const handleReorderResources = async (newOrderIds: string[]) => {
      const resourceKey = `${activeBook}-${currentPage}`;
      const newOrderMap = { ...resourceOrder, [resourceKey]: newOrderIds };
      setResourceOrder(newOrderMap);
      await dbService.saveSetting('resourceOrder', newOrderMap);
  };

  const handleAddResource = async (newResource: Resource, file?: File) => {
    const uniqueResource = { ...newResource, id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
    const key = `${activeBook}-${currentPage}`;
    
    // Update State
    setCustomResources(prev => ({ ...prev, [key]: [...(prev[key] || []), uniqueResource] }));
    
    // Persist
    await dbService.saveCustomResource(uniqueResource, activeBook, currentPage, file);
  };

  const handleEditResource = async (updatedResource: Resource, file?: File) => {
    // If it's a Custom Resource
    if (updatedResource.id.startsWith('custom-')) {
        const key = `${activeBook}-${currentPage}`;
        
        // Update State
        setCustomResources(prev => ({
            ...prev,
            [key]: (prev[key] || []).map(r => r.id === updatedResource.id ? updatedResource : r)
        }));
        
        // Persist
        await dbService.saveCustomResource(updatedResource, activeBook, currentPage, file);

    } else {
        // If it's a Static Resource (Admin Override)
        const newMap = new Map(modifiedStaticResources).set(updatedResource.id, updatedResource);
        setModifiedStaticResources(newMap);
        await dbService.saveSetting('modifiedStaticResources', Array.from(newMap.entries()));
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
      if (activeResource?.id === resourceId) setActiveResource(null);

      if (!resourceId.startsWith('custom-')) {
          if (userRole === 'admin') {
              const newSet = new Set(deletedStaticIds).add(resourceId);
              setDeletedStaticIds(newSet);
              await dbService.saveSetting('deletedStaticIds', Array.from(newSet));
          }
          return;
      }

      // Delete Custom Resource
      setCustomResources(prev => {
          const newState = { ...prev };
          Object.keys(newState).forEach((key) => {
              const resList = newState[key];
              if (resList) {
                  const target = resList.find(r => r.id === resourceId);
                  if (target) {
                      if (target.url.startsWith('blob:')) URL.revokeObjectURL(target.url);
                      newState[key] = resList.filter(r => r.id !== resourceId);
                  }
              }
          });
          return newState;
      });

      await dbService.deleteCustomResource(resourceId);
  };

  if (isLoading) {
      return (
          <div className="h-screen w-screen flex items-center justify-center bg-violet-50 text-violet-600 font-bold gap-2">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
             Loading Library...
          </div>
      );
  }

  return (
    <div ref={appContainerRef} className="flex flex-col h-screen w-screen bg-pattern-dots overflow-hidden text-slate-800">
        <header className="h-16 bg-violet-600 text-white flex items-center justify-between px-3 md:px-6 shrink-0 z-50 shadow-bubbly border-b-4 border-violet-800 relative">
            <div className="flex items-center gap-2 md:gap-3 w-1/3 md:w-1/4 min-w-0">
                <div className="p-2 bg-white rounded-xl shadow-sm shrink-0 transform -rotate-3"><BookOpen size={24} className="text-violet-600" /></div>
                <div className="hidden md:flex items-center gap-2 text-sm font-bold tracking-wide">
                    <div className="bg-violet-500 border border-violet-400 px-3 py-1 rounded-full shadow-sm">G5</div><span className="text-violet-300 font-black">›</span>
                    <div className="bg-violet-500 border border-violet-400 px-3 py-1 rounded-full shadow-sm">EVS</div><span className="text-violet-300 font-black">›</span>
                    <div className="bg-green-400 text-green-900 border-b-2 border-green-600 px-3 py-1 rounded-full shadow-sm font-black transform rotate-2">NCERT</div>
                </div>
            </div>

            <div className="flex-1 text-center truncate px-2 flex flex-col items-center justify-center min-w-0">
                <div className="bg-violet-700/50 px-6 py-1 rounded-2xl border border-violet-500/50 backdrop-blur-sm">
                  <h2 className="text-sm md:text-lg font-bold text-white truncate">{currentPageData.title}</h2>
                </div>
            </div>
            
            <div className="flex items-center justify-end gap-2 md:gap-4 w-1/3 md:w-1/4 min-w-0">
                 <div className="relative z-[60]">
                    <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-700 border border-violet-500 hover:bg-violet-500 transition-colors">
                        {userRole === 'admin' ? <Shield size={16} className="text-yellow-300" /> : userRole === 'teacher' ? <School size={16} className="text-green-300" /> : <GraduationCap size={16} className="text-blue-300" />}
                        <div className="hidden md:flex flex-col items-start text-xs"><span className="font-bold uppercase tracking-wider text-[10px] opacity-70">Role</span><span className="font-bold capitalize">{userRole}</span></div>
                        <ChevronDown size={14} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isUserMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border-2 border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                            {[ { id: 'student', icon: GraduationCap, label: 'Student', color: 'text-blue-500' }, { id: 'teacher', icon: School, label: 'Teacher', color: 'text-green-500' }, { id: 'admin', icon: Shield, label: 'Admin', color: 'text-yellow-500' } ].map((role) => (
                                <button key={role.id} onClick={() => { setUserRole(role.id as UserRole); setIsUserMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left ${userRole === role.id ? 'bg-violet-50' : ''}`}>
                                    <role.icon size={18} className={role.color} /><span className={`font-bold text-sm ${userRole === role.id ? 'text-violet-700' : 'text-slate-600'}`}>{role.label}</span>{userRole === role.id && <Check size={16} className="ml-auto text-violet-600" />}
                                </button>
                            ))}
                        </div>
                    )}
                 </div>
            </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
            {!isSidebarOpen && (
                <button onClick={toggleSidebar} className="absolute top-6 right-0 z-30 bg-white border-l-4 border-y-2 border-violet-100 text-violet-600 pl-4 pr-3 py-2 rounded-l-2xl shadow-md hover:bg-violet-50 transition-all flex items-center gap-2 group animate-in slide-in-from-right-10 duration-300">
                    <div className="bg-violet-100 p-1 rounded-full group-hover:bg-violet-200 transition-colors"><ChevronLeft size={20} /></div><span className="text-xs font-black uppercase tracking-wider hidden md:block">Resources</span>
                </button>
            )}

            <main className="flex-1 transition-all duration-300 ease-in-out relative flex flex-col min-w-0 bg-transparent">
                <DocumentViewer 
                    pageData={currentPageData} allPages={currentBookPages} currentPage={currentPage} totalPages={currentBookPages.length} activeBook={activeBook}
                    activeResource={activeResource} onPageChange={setCurrentPage} onCloseResource={() => setActiveResource(null)} onToggleFullscreen={handleToggleFullscreen}
                />
            </main>

            {isSidebarOpen && <div className="absolute inset-0 bg-violet-900/60 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-200" onClick={() => setIsSidebarOpen(false)} />}

            <div className={`absolute inset-y-0 right-0 z-40 bg-white shadow-2xl transition-transform duration-300 ease-in-out md:relative md:shadow-none md:z-auto ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} ${isSidebarOpen ? 'md:w-80 lg:w-96' : 'md:w-0'} w-80`}>
               <div className="w-full h-full border-l-4 border-violet-100 overflow-hidden bg-white"> 
                   <ResourceSidebar 
                        isOpen={true} resources={currentDisplayResources} activeResourceId={activeResource?.id || null} userRole={userRole} activeBook={activeBook}
                        onBookChange={handleBookChange} onPlayResource={(r) => { setActiveResource(r); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                        onAddResource={handleAddResource} onEditResource={handleEditResource} onDeleteResource={handleDeleteResource} onToggleSidebar={toggleSidebar} onReorder={handleReorderResources}
                   />
               </div>
            </div>

            {/* Global Resource Player Overlay */}
            {activeResource && (
                <ResourcePlayer resource={activeResource} onClose={() => setActiveResource(null)} />
            )}
        </div>
    </div>
  );
}
