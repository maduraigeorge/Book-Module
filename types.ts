export enum ResourceType {
  VIDEO = 'video',
  AUDIO = 'audio',
  LINK = 'link',
  DOCUMENT = 'document'
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  type: ResourceType;
  url: string; // For video/audio/image source
  duration?: string;
  thumbnail?: string;
}

export interface PageData {
  pageNumber: number;
  title: string;
  contentImage: string; // URL to an image representing the PDF page
  textContent: string; // Mock text for accessibility/fallback
  resources: Resource[];
}

export interface DocumentMetadata {
  title: string;
  author: string;
  totalPageCount: number;
}