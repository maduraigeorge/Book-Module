import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_PAGES, TOTAL_PAGES } from './constants';
import { DocumentViewer } from './components/DocumentViewer';
import { ResourceSidebar } from './components/ResourceSidebar';
import { Resource } from './types';
import { PanelRightOpen, PanelRightClose, BookOpen } from 'lucide-react';
import { Button } from './components/Button';

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Get current page data safely
  const currentPageData = useMemo(() => {
    return MOCK_PAGES.find(p => p.pageNumber === currentPage) || MOCK_PAGES[0];
  }, [currentPage]);

  // Effect to handle page changes - if page changes, resource list changes automatically
  useEffect(() => {
    setActiveResource(null);
  }, [currentPage]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50 overflow-hidden">
        {/* App Header */}
        <header className="h-14 bg-slate-900 text-white flex items-center justify-between px-4 md:px-6 shrink-0 z-30 shadow-md border-b border-slate-700">
            <div className="flex items-center gap-3 w-1/3 md:w-1/4">
                <div className="p-1.5 bg-green-600 rounded-lg shrink-0">
                    <BookOpen size={20} className="text-white" />
                </div>
                <div className="hidden md:flex items-center text-sm font-bold tracking-wide text-slate-300 whitespace-nowrap">
                    <span className="hover:text-white cursor-pointer transition-colors">G5</span>
                    <span className="mx-1.5 text-slate-600">/</span>
                    <span className="hover:text-white cursor-pointer transition-colors">EVS</span>
                    <span className="mx-1.5 text-slate-600">/</span>
                    <span className="text-green-400">NCERT</span>
                </div>
                {/* Mobile version of breadcrumb */}
                <div className="md:hidden text-xs font-bold text-green-400">
                    EVS
                </div>
            </div>

            {/* Center Title - The "Title Bar" */}
            <div className="flex-1 text-center truncate px-2 flex flex-col items-center justify-center">
                <h2 className="text-sm md:text-base font-semibold text-slate-100 truncate max-w-full">
                  {currentPageData.title}
                </h2>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                  Page {currentPage} of {TOTAL_PAGES}
                </span>
            </div>
            
            <div className="flex items-center justify-end gap-4 w-1/3 md:w-1/4">
                 <Button 
                    variant="ghost" 
                    className="text-slate-300 hover:text-white hover:bg-slate-800"
                    onClick={toggleSidebar}
                    title={isSidebarOpen ? "Hide Resources" : "Show Resources"}
                 >
                    {isSidebarOpen ? (
                         <span className="flex items-center gap-2">
                            <span className="hidden lg:inline text-xs">Activities</span>
                            <PanelRightClose size={20} />
                         </span>
                    ) : (
                        <span className="flex items-center gap-2">
                             <span className="hidden lg:inline text-xs">Activities</span>
                             <PanelRightOpen size={20} />
                        </span>
                    )}
                 </Button>
            </div>
        </header>

        {/* Main Workspace */}
        <div className="flex flex-1 overflow-hidden relative">
            
            {/* Left Column (PDF/Player) */}
            <main className="flex-1 transition-all duration-300 ease-in-out relative flex flex-col min-w-0 bg-slate-200">
                <DocumentViewer 
                    pageData={currentPageData}
                    currentPage={currentPage}
                    totalPages={TOTAL_PAGES}
                    activeResource={activeResource}
                    onPageChange={setCurrentPage}
                    onCloseResource={() => setActiveResource(null)}
                />
            </main>

            {/* Right Column (Sidebar) */}
            <div className={`${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 translate-x-full'} transition-all duration-300 ease-in-out border-l border-gray-200 bg-white relative`}>
               <div className="w-80 h-full"> 
                   <ResourceSidebar 
                        isOpen={true} 
                        resources={currentPageData.resources}
                        activeResourceId={activeResource?.id || null}
                        onPlayResource={setActiveResource}
                        onToggleSidebar={toggleSidebar}
                   />
               </div>
            </div>
        </div>
    </div>
  );
}