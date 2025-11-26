import React from 'react';
import { X, PlayCircle, Music, Link as LinkIcon, AlertCircle } from 'lucide-react';
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
    <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col shadow-xl z-20 shrink-0 absolute right-0 top-0 bottom-0 md:static transition-all">
      {/* Header */}
      <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
        <div>
          <h2 className="font-semibold text-gray-800">Classroom Activities</h2>
          <p className="text-xs text-gray-500">{resources.length} items available</p>
        </div>
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md"
        >
          <X size={20} />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-gray-50">
        {resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-center px-4">
            <AlertCircle size={48} className="mb-4 text-gray-300" />
            <p className="font-medium">No activities found</p>
            <p className="text-sm mt-1">There are no additional activities or topics for this page.</p>
          </div>
        ) : (
          resources.map((resource) => (
            <div 
              key={resource.id}
              onClick={() => onPlayResource(resource)}
              className={`
                group relative p-3 rounded-xl border transition-all cursor-pointer hover:shadow-md
                ${activeResourceId === resource.id 
                  ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300' 
                  : 'bg-white border-gray-200 hover:border-blue-300'
                }
              `}
            >
              <div className="flex items-start gap-3">
                {/* Icon / Thumbnail */}
                <div className="shrink-0">
                  {resource.thumbnail ? (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                      <img src={resource.thumbnail} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10">
                        {resource.type === ResourceType.VIDEO && <PlayCircle size={20} className="text-white drop-shadow-md" />}
                        {resource.type === ResourceType.AUDIO && <Music size={20} className="text-white drop-shadow-md" />}
                      </div>
                    </div>
                  ) : (
                     <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                         resource.type === ResourceType.AUDIO ? 'bg-purple-100 text-purple-600' : 
                         resource.type === ResourceType.LINK ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                     }`}>
                        {resource.type === ResourceType.AUDIO && <Music size={20} />}
                        {resource.type === ResourceType.LINK && <LinkIcon size={20} />}
                        {resource.type === ResourceType.VIDEO && <PlayCircle size={20} />}
                     </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-semibold truncate pr-2 ${activeResourceId === resource.id ? 'text-blue-700' : 'text-gray-900'}`}>
                    {resource.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                        {resource.type}
                    </span>
                    {resource.duration && (
                        <span className="text-xs text-gray-400 font-mono">
                            {resource.duration}
                        </span>
                    )}
                  </div>
                </div>
              </div>
               
              {/* Description Tooltip-ish (rendered inline for simplicity) */}
              {resource.description && (
                  <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                      {resource.description}
                  </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}