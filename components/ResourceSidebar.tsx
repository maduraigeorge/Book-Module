import React from 'react';
import { X, PlayCircle, Music, Link as LinkIcon, AlertCircle, Activity } from 'lucide-react';
import { Resource, ResourceType } from '../types';

interface ResourceSidebarProps {
  isOpen: boolean;
  resources: Resource[];
  activeResourceId: string | null;
  onPlayResource: (resource: Resource) => void;
  onToggleSidebar: () => void;
}

export const ResourceSidebar: React.FC<ResourceSidebarProps> = ({
  isOpen,
  resources,
  activeResourceId,
  onPlayResource,
  onToggleSidebar,
}) => {
  if (!isOpen) return null;

  return (
    <div className="w-full h-full flex flex-col z-20 shrink-0 bg-white">
      {/* Header - Playful Yellow */}
      <div className="h-16 px-6 bg-yellow-100 border-b-2 border-yellow-200 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 p-1.5 rounded-lg text-yellow-900">
             <Activity size={20} />
          </div>
          <div>
            <h2 className="font-bold text-yellow-900 leading-tight">Activities</h2>
            <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide">{resources.length} Fun Items</p>
          </div>
        </div>
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-2 -mr-2 text-yellow-800 hover:bg-yellow-200 rounded-xl transition-colors"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-slate-50 pb-20 md:pb-4">
        {resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-center px-6">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
               <AlertCircle size={40} className="text-slate-300" />
            </div>
            <p className="font-bold text-slate-500 text-lg">No activities here!</p>
            <p className="text-sm mt-1">Keep reading the book to find more fun stuff.</p>
          </div>
        ) : (
          resources.map((resource) => {
            // Determine styles based on type
            let typeColorClass = "bg-gray-100 text-gray-600";
            let typeIcon = <LinkIcon size={20} />;
            let borderColor = "border-slate-200";
            let hoverBorder = "hover:border-slate-400";

            if (resource.type === ResourceType.VIDEO) {
                typeColorClass = "bg-red-100 text-red-600";
                typeIcon = <PlayCircle size={20} fill="currentColor" className="text-red-200" />;
                borderColor = "border-red-100";
                hoverBorder = "hover:border-red-300";
            } else if (resource.type === ResourceType.AUDIO) {
                typeColorClass = "bg-purple-100 text-purple-600";
                typeIcon = <Music size={20} />;
                borderColor = "border-purple-100";
                hoverBorder = "hover:border-purple-300";
            } else if (resource.type === ResourceType.LINK) {
                typeColorClass = "bg-green-100 text-green-600";
                typeIcon = <LinkIcon size={20} />;
                borderColor = "border-green-100";
                hoverBorder = "hover:border-green-300";
            }

            const isActive = activeResourceId === resource.id;

            return (
              <div 
                key={resource.id}
                onClick={() => onPlayResource(resource)}
                className={`
                  group relative p-3 rounded-2xl border-2 transition-all cursor-pointer touch-manipulation
                  ${isActive 
                    ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-100 transform scale-[1.02]' 
                    : `bg-white ${borderColor} ${hoverBorder} hover:-translate-y-1 hover:shadow-lg`
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Icon / Thumbnail */}
                  <div className="shrink-0">
                    {resource.thumbnail ? (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-200 border-2 border-white shadow-sm">
                        <img src={resource.thumbnail} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/0 transition-colors">
                           <div className="bg-white/90 rounded-full p-1.5 shadow-sm">
                              {resource.type === ResourceType.VIDEO && <PlayCircle size={20} className="text-red-500 fill-current" />}
                              {resource.type === ResourceType.AUDIO && <Music size={20} className="text-purple-500" />}
                           </div>
                        </div>
                      </div>
                    ) : (
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${typeColorClass}`}>
                          {resource.type === ResourceType.AUDIO && <Music size={24} />}
                          {resource.type === ResourceType.LINK && <LinkIcon size={24} />}
                          {resource.type === ResourceType.VIDEO && <PlayCircle size={24} />}
                       </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 py-1">
                    <h4 className={`text-base font-bold leading-tight mb-1 ${isActive ? 'text-blue-700' : 'text-slate-800'}`}>
                      {resource.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${typeColorClass}`}>
                          {resource.type}
                      </span>
                      {resource.duration && (
                          <span className="text-xs text-slate-400 font-bold bg-slate-100 px-1.5 rounded">
                              {resource.duration}
                          </span>
                      )}
                    </div>
                  </div>
                </div>
                 
                {/* Description */}
                {resource.description && (
                    <div className={`mt-3 text-xs font-medium p-2 rounded-lg ${isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-50 text-slate-600'}`}>
                        {resource.description}
                    </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}