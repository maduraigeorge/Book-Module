
import React from 'react';
import { X, Music, ExternalLink, Download } from 'lucide-react';
import { Resource, ResourceType } from '../../types';

interface ResourcePlayerProps {
  resource: Resource;
  onClose: () => void;
}

export const ResourcePlayer: React.FC<ResourcePlayerProps> = ({ resource, onClose }) => {
  return (
    <div className="absolute inset-0 z-50 bg-black animate-in fade-in duration-300" onClick={(e) => e.stopPropagation()}>
      <div className="w-full h-full flex flex-col relative overflow-hidden bg-slate-900">
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 flex justify-between items-start z-20 pointer-events-none">
          <div className="text-white drop-shadow-md px-2 pointer-events-auto">
            <span className="text-[10px] font-black bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm">
              {resource.type}
            </span>
            <h3 className="font-bold text-xl leading-tight line-clamp-2 max-w-xl mt-1">{resource.title}</h3>
          </div>
          
          <div className="flex gap-3 pointer-events-auto">
            {resource.type === ResourceType.DOCUMENT && (
              <a 
                href={resource.url}
                download={resource.title}
                target="_blank"
                rel="noreferrer"
                className="text-white bg-white/20 hover:bg-white/40 hover:scale-110 rounded-full p-2 transition-all backdrop-blur-md border-2 border-white/30 flex items-center justify-center"
                title="Download Document"
              >
                <Download size={24} />
              </a>
            )}
            <button 
              onClick={onClose}
              className="text-white bg-white/20 hover:bg-white/40 hover:scale-110 rounded-full p-2 transition-all backdrop-blur-md border-2 border-white/30 flex items-center justify-center"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Media Content */}
        <div className="flex-1 bg-slate-900 flex items-center justify-center relative w-full h-full">
          {resource.type === ResourceType.VIDEO && (
            <video controls autoPlay className="w-full h-full object-contain" src={resource.url} />
          )}

          {resource.type === ResourceType.AUDIO && (
            <div className="flex flex-col items-center justify-center space-y-6 w-full px-8 bg-violet-50 h-full">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-400 blur-3xl opacity-30 rounded-full animate-pulse"></div>
                <div className="w-40 h-40 rounded-full bg-white border-8 border-violet-200 flex items-center justify-center shadow-xl relative z-10">
                  <Music size={64} className="text-violet-500" />
                </div>
              </div>
              <div className="w-full max-w-md bg-white p-4 rounded-2xl shadow-lg border border-violet-100">
                <audio controls autoPlay className="w-full" src={resource.url} />
              </div>
            </div>
          )}

          {(resource.type === ResourceType.DOCUMENT || resource.type === ResourceType.EMBED) && (
            <div className="w-full h-full bg-white">
              <iframe 
                src={resource.url} 
                className="w-full h-full border-none" 
                title={resource.title}
                sandbox="allow-scripts allow-same-origin allow-presentation"
              />
            </div>
          )}

          {resource.type === ResourceType.LINK && (
            <div className="text-center text-slate-800 p-8 bg-white h-full flex flex-col items-center justify-center w-full">
              <ExternalLink size={60} className="text-green-500 mb-4" />
              <h3 className="text-2xl font-black mb-3">Time to Explore!</h3>
              <a 
                href={resource.url} target="_blank" rel="noreferrer"
                className="px-8 py-3 bg-green-500 hover:bg-green-600 rounded-2xl text-white font-bold transition-all shadow-lg"
              >
                Open Link
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
