import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MOCK_PAGES, TOTAL_PAGES } from './constants';
import { DocumentViewer } from './components/DocumentViewer';
import { ResourceSidebar } from './components/ResourceSidebar';
import { Resource } from './types';
import { PanelRightClose, BookOpen, Maximize } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  
  // Ref for the entire app container (Root) so Header stays visible in fullscreen
  const appContainerRef = useRef<HTMLDivElement>(null);

  // Auto-collapse sidebar on mobile on initial load
  useEffect(() => {
    if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
    }
  }, []);

  // Get current page data safely
  const currentPageData = useMemo(() => {
    return MOCK_PAGES.find(p => p.pageNumber === currentPage) || MOCK_PAGES[0];
  }, [currentPage]);

  // Effect to handle page changes - if page changes, resource list changes automatically
  useEffect(() => {
    setActiveResource(null);
  }, [currentPage]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
        appContainerRef.current?.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
  };

  return (
    <div 
        ref={appContainerRef}
        className="flex flex-col h-screen w-screen bg-pattern-dots overflow-hidden text-slate-800"
    >
        {/* App Header - Playful Style */}
        <header className="h-16 bg-violet-600 text-white flex items-center justify-between px-3 md:px-6 shrink-0 z-30 shadow-bubbly border-b-4 border-violet-800 relative">
            
            {/* Left: Navigation Breadcrumbs */}
            <div className="flex items-center gap-2 md:gap-3 w-1/3 md:w-1/4 min-w-0">
                <div className="p-2 bg-white rounded-xl shadow-sm shrink-0 transform -rotate-3">
                    <BookOpen size={24} className="text-violet-600" />
                </div>
                
                {/* Desktop Breadcrumbs as Badges */}
                <div className="hidden md:flex items-center gap-2 text-sm font-bold tracking-wide">
                    <div className="bg-violet-500 border border-violet-400 px-3 py-1 rounded-full shadow-sm hover:scale-105 transition-transform cursor-pointer">
                      G5
                    </div>
                    <span className="text-violet-300 font-black">›</span>
                    <div className="bg-violet-500 border border-violet-400 px-3 py-1 rounded-full shadow-sm hover:scale-105 transition-transform cursor-pointer">
                      EVS
                    </div>
                    <span className="text-violet-300 font-black">›</span>
                    <div className="bg-green-400 text-green-900 border-b-2 border-green-600 px-3 py-1 rounded-full shadow-sm font-black transform rotate-2">
                      NCERT
                    </div>
                </div>

                {/* Mobile version */}
                <div className="md:hidden flex flex-col">
                    <span className="text-xs font-bold text-violet-200">Class 5 EVS</span>
                    <span className="text-sm font-black leading-none">Ch. {currentPage}</span>
                </div>
            </div>

            {/* Center Title - The "Title Bar" */}
            <div className="flex-1 text-center truncate px-2 flex flex-col items-center justify-center min-w-0">
                <div className="bg-violet-700/50 px-6 py-1 rounded-2xl border border-violet-500/50 backdrop-blur-sm">
                  <h2 className="text-sm md:text-lg font-bold text-white truncate max-w-full drop-shadow-md">
                    {currentPageData.title}
                  </h2>
                </div>
            </div>
            
            {/* Right: Toggle Sidebar */}
            <div className="flex items-center justify-end gap-2 md:gap-4 w-1/3 md:w-1/4 min-w-0">
                 <button 
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all
                      ${isSidebarOpen 
                        ? 'bg-white text-violet-600 border-b-4 border-violet-200' 
                        : 'bg-yellow-400 text-yellow-900 border-b-4 border-yellow-600 hover:scale-105'}
                    `}
                    onClick={toggleSidebar}
                    title={isSidebarOpen ? "Close Activity Panel" : "Open Activity Panel"}
                 >
                    {isSidebarOpen ? (
                         <>
                            <span className="hidden lg:inline">Close</span>
                            <PanelRightClose size={20} />
                         </>
                    ) : (
                        <>
                             <Maximize size={20} className="animate-pulse" />
                             <span className="hidden lg:inline">Activities</span>
                        </>
                    )}
                 </button>
            </div>
        </header>

        {/* Main Workspace */}
        <div className="flex flex-1 overflow-hidden relative">
            
            {/* Left Column (PDF/Player) */}
            <main className="flex-1 transition-all duration-300 ease-in-out relative flex flex-col min-w-0 bg-transparent">
                <DocumentViewer 
                    pageData={currentPageData}
                    allPages={MOCK_PAGES}
                    currentPage={currentPage}
                    totalPages={TOTAL_PAGES}
                    activeResource={activeResource}
                    onPageChange={setCurrentPage}
                    onCloseResource={() => setActiveResource(null)}
                    onToggleFullscreen={handleToggleFullscreen}
                />
            </main>

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div 
                    className="absolute inset-0 bg-violet-900/60 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-200"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Right Column (Sidebar) */}
            <div 
                className={`
                    absolute inset-y-0 right-0 z-40 bg-white shadow-2xl transition-transform duration-300 ease-in-out
                    md:relative md:shadow-none md:z-auto
                    ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
                    ${isSidebarOpen ? 'md:w-80 lg:w-96' : 'md:w-0'} 
                    w-80
                `}
            >
               <div className="w-full h-full border-l-4 border-violet-100 overflow-hidden bg-white"> 
                   <ResourceSidebar 
                        isOpen={true} 
                        resources={currentPageData.resources}
                        activeResourceId={activeResource?.id || null}
                        onPlayResource={(r) => {
                            setActiveResource(r);
                            if (window.innerWidth < 768) setIsSidebarOpen(false);
                        }}
                        onToggleSidebar={toggleSidebar}
                   />
               </div>
            </div>
        </div>
    </div>
  );
}