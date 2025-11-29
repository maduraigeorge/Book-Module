
import React from 'react';
import { X, ExternalLink, Download } from 'lucide-react';
import { Resource, ResourceType } from '../../types';

interface ResourcePlayerProps {
  resource: Resource;
  onClose: () => void;
}

export const ResourcePlayer: React.FC<ResourcePlayerProps> = ({ resource, onClose }) => {
  return (
    <div className="absolute inset-0 z-50 bg-black/95 animate-in fade-in duration-200 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
      <div className="w-full h-full flex flex-col relative overflow-hidden">
        
        {/* Minimal Header */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20 pointer-events-none">
          <div className="pointer-events-auto">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">
              {resource.type}
            </span>
            <h3 className="font-semibold text-white text-xl">{resource.title}</h3>
          </div>
          
          <div className="flex gap-4 pointer-events-auto">
            {resource.type === ResourceType.DOCUMENT && (
              <a 
                href={resource.url}
                download={resource.title}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
                title="Download"
              >
                <Download size={24} />
              </a>
            )}
            <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Media Content */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-12 w-full h-full">
          <div className="w-full h-full max-w-5xl max-h-[80vh] flex items-center justify-center rounded-lg overflow-hidden shadow-2xl bg-black">
              {resource.type === ResourceType.VIDEO && (
                <video controls autoPlay className="w-full h-full" src={resource.url} />
              )}

              {resource.type === ResourceType.AUDIO && (
                 <div className="w-full h-64 bg-zinc-900 rounded-lg flex flex-col items-center justify-center p-8 border border-zinc-800">
                    <div className="mb-8 w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center animate-pulse">
                         <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    </div>
                    <audio controls autoPlay className="w-full max-w-md" src={resource.url} />
                 </div>
              )}

              {(resource.type === ResourceType.DOCUMENT || resource.type === ResourceType.EMBED) && (
                <iframe 
                  src={resource.url} 
                  className="w-full h-full bg-white" 
                  title={resource.title}
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                />
              )}

              {resource.type === ResourceType.LINK && (
                <div className="text-center">
                  <ExternalLink size={48} className="text-zinc-600 mb-4 mx-auto" />
                  <a href={resource.url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 underline text-lg">
                    Open in new tab
                  </a>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
