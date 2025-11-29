
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { STUDIO_PAGES, COMPANION_PAGES, FHB_PAGES } from './constants';
import { DocumentViewer } from './components/DocumentViewer';
import { ResourceSidebar } from './components/ResourceSidebar';
import { ResourcePlayer } from './components/viewer/ResourcePlayer';
import { Resource, UserRole, BookCategory } from './types';
import { dbService } from './services/db';
import { Shield, GraduationCap, School, ChevronDown, Check, ChevronLeft, FolderOpen } from 'lucide-react';

export default function App() {
  const [activeBook, setActiveBook] = useState<BookCategory>('Studio');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // User Role State
  const [userRole, setUserRole] = useState<UserRole>('teacher');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const [customResources, setCustomResources] = useState<Record<string, Resource[]>>({});
  const [deletedStaticIds, setDeletedStaticIds] = useState<Set<string>>(new Set());
  const [modifiedStaticResources, setModifiedStaticResources] = useState<Map<string, Resource>>(new Map());
  const [resourceOrder, setResourceOrder] = useState<Record<string, string[]>>({});

  const appContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
    
    // Load persisted data
    const initData = async () => {
        try {
            const resources = await dbService.getAllCustomResources();
            const resMap: Record<string, Resource[]> = {};
            
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

  const currentDisplayResources = useMemo(() => {
    let staticRes = currentPageData.resources || [];
    const resourceKey = `${activeBook}-${currentPage}`; 
    const userRes = customResources[resourceKey] || [];
    
    let processedStatic = staticRes.map(r => modifiedStaticResources.get(r.id) || r)
                                   .filter(r => !deletedStaticIds.has(r.id));

    let combined = [...processedStatic, ...userRes];

    if (userRole === 'student') {
        combined = combined.filter(r => !r.isHiddenFromStudents);
    }

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
    setCustomResources(prev => ({ ...prev, [key]: [...(prev[key] || []), uniqueResource] }));
    await dbService.saveCustomResource(uniqueResource, activeBook, currentPage, file);
  };

  const handleEditResource = async (updatedResource: Resource, file?: File) => {
    if (updatedResource.id.startsWith('custom-')) {
        const key = `${activeBook}-${currentPage}`;
        setCustomResources(prev => ({
            ...prev,
            [key]: (prev[key] || []).map(r => r.id === updatedResource.id ? updatedResource : r)
        }));
        await dbService.saveCustomResource(updatedResource, activeBook, currentPage, file);
    } else {
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
          <div className="h-screen w-screen flex items-center justify-center bg-zinc-50 text-zinc-500 font-medium gap-2">
             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-zinc-800"></div>
             Loading...
          </div>
      );
  }

  return (
    <div ref={appContainerRef} className="flex flex-col h-screen w-screen bg-zinc-50 overflow-hidden text-zinc-900 font-sans">
        {/* Sleek Header */}
        <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0 z-50">
            <div className="flex items-center gap-4 w-1/3 min-w-0">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <span className="font-semibold text-zinc-900">Grade 5</span>
                    <span className="text-zinc-300">/</span>
                    <span className="font-semibold text-zinc-900">EVS</span>
                    <span className="text-zinc-300">/</span>
                    <span className="text-zinc-500">NCERT</span>
                </div>
            </div>

            <div className="flex-1 text-center truncate px-2">
                <h2 className="text-sm font-semibold text-zinc-800 truncate">{currentPageData.title}</h2>
            </div>
            
            <div className="flex items-center justify-end gap-3 w-1/3 min-w-0">
                 {/* User Role - Minimalist */}
                 <div className="relative z-[60]">
                    <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-50 transition-colors">
                        <div className={`w-2 h-2 rounded-full ${userRole === 'admin' ? 'bg-amber-500' : userRole === 'teacher' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                        <span className="text-xs font-medium capitalize text-zinc-700">{userRole}</span>
                        <ChevronDown size={12} className="text-zinc-400" />
                    </button>
                    {isUserMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-soft border border-zinc-100 overflow-hidden z-50 py-1">
                            {[ { id: 'student', icon: GraduationCap, label: 'Student' }, { id: 'teacher', icon: School, label: 'Teacher' }, { id: 'admin', icon: Shield, label: 'Admin' } ].map((role) => (
                                <button key={role.id} onClick={() => { setUserRole(role.id as UserRole); setIsUserMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 transition-colors text-left`}>
                                    <role.icon size={14} className="text-zinc-400" />
                                    <span className={`text-xs font-medium ${userRole === role.id ? 'text-zinc-900' : 'text-zinc-600'}`}>{role.label}</span>
                                    {userRole === role.id && <Check size={14} className="ml-auto text-zinc-900" />}
                                </button>
                            ))}
                        </div>
                    )}
                 </div>
            </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
            {/* Floating Resource Button - Mobile Friendly, Minimalist */}
            {!isSidebarOpen && (
              <button 
                onClick={toggleSidebar}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-40 bg-white/90 backdrop-blur-md text-zinc-800 px-4 py-2.5 rounded-full shadow-sm hover:shadow-md border border-zinc-200/60 flex items-center gap-2 text-sm font-semibold hover:bg-white hover:scale-105 transition-all group"
              >
                <FolderOpen size={18} className="text-indigo-600" />
                <span>Resources</span>
                <ChevronLeft size={16} className="text-zinc-400 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            )}

            <main className="flex-1 transition-all duration-300 ease-in-out relative flex flex-col min-w-0 bg-zinc-100/50">
                <DocumentViewer 
                    pageData={currentPageData} allPages={currentBookPages} currentPage={currentPage} totalPages={currentBookPages.length} activeBook={activeBook}
                    activeResource={activeResource} onPageChange={setCurrentPage} onCloseResource={() => setActiveResource(null)} onToggleFullscreen={handleToggleFullscreen}
                />
            </main>

            {isSidebarOpen && <div className="absolute inset-0 bg-black/5 z-30 md:hidden backdrop-blur-[1px]" onClick={() => setIsSidebarOpen(false)} />}

            <div className={`absolute inset-y-0 right-0 z-40 bg-white border-l border-zinc-200 transition-transform duration-300 ease-in-out md:relative md:z-auto ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} ${isSidebarOpen ? 'md:w-80 lg:w-96' : 'md:w-0'} w-80 shadow-soft md:shadow-none`}>
               <div className="w-full h-full overflow-hidden bg-white"> 
                   <ResourceSidebar 
                        isOpen={true} resources={currentDisplayResources} activeResourceId={activeResource?.id || null} userRole={userRole} activeBook={activeBook}
                        onBookChange={handleBookChange} onPlayResource={(r) => { setActiveResource(r); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                        onAddResource={handleAddResource} onEditResource={handleEditResource} onDeleteResource={handleDeleteResource} onToggleSidebar={toggleSidebar} onReorder={handleReorderResources}
                   />
               </div>
            </div>

            {activeResource && (
                <ResourcePlayer resource={activeResource} onClose={() => setActiveResource(null)} />
            )}
        </div>
    </div>
  );
}
