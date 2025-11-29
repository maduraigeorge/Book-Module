
export enum ResourceType {
  VIDEO = 'video',
  AUDIO = 'audio',
  LINK = 'link',
  DOCUMENT = 'document',
  EMBED = 'embed'
}

export type UserRole = 'student' | 'teacher' | 'admin';

export type BookCategory = 'Studio' | 'Companion' | 'FHB';

export interface Resource {
  id: string;
  title: string;
  description?: string;
  type: ResourceType;
  url: string; // For video/audio/image source
  duration?: string;
  thumbnail?: string;
  isHiddenFromStudents?: boolean;
}

export interface PageData {
  pageNumber: number;
  title: string;
  contentImage: string; // Fallback image
  htmlContent?: string; // Rich HTML content for the page
  textContent: string; // Plain text fallback/accessibility
  resources: Resource[];
  layout?: 'portrait' | 'landscape'; // New property for default orientation
}

export interface DocumentMetadata {
  title: string;
  author: string;
  totalPageCount: number;
}
