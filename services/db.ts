
import { Resource, BookCategory } from '../types';
import { TextNote } from '../hooks/useCanvas';

const DB_NAME = 'SmartDocViewerDB';
const DB_VERSION = 1;

interface AnnotationRecord {
  book: string;
  page: number;
  canvasData: string | null;
  textNotes: TextNote[];
}

interface CustomResourceRecord extends Omit<Resource, 'url'> {
  fileBlob?: Blob; // Store binary if it's a file
  urlStr?: string; // Store string if it's a link
  book: string;
  page: number;
}

export const dbService = {
  open: (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Store for Custom Resources
        if (!db.objectStoreNames.contains('resources')) {
          db.createObjectStore('resources', { keyPath: 'id' });
        }
        
        // Store for Annotations (Drawings + Text)
        if (!db.objectStoreNames.contains('annotations')) {
          db.createObjectStore('annotations', { keyPath: ['book', 'page'] });
        }

        // Store for App Settings (Orders, Deleted Static IDs, Modified Static Resources)
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // --- Resources ---

  getAllCustomResources: async (): Promise<CustomResourceRecord[]> => {
    const db = await dbService.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('resources', 'readonly');
      const store = tx.objectStore('resources');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  saveCustomResource: async (resource: Resource, book: string, page: number, file?: File): Promise<void> => {
    const db = await dbService.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('resources', 'readwrite');
      const store = tx.objectStore('resources');
      
      const record: CustomResourceRecord = {
        id: resource.id,
        title: resource.title,
        type: resource.type,
        description: resource.description,
        isHiddenFromStudents: resource.isHiddenFromStudents,
        book,
        page,
        // If it's a blob URL, we assume the File object was passed separately to be stored
        fileBlob: file, 
        urlStr: !file ? resource.url : undefined
      };

      const request = store.put(record);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  deleteCustomResource: async (id: string): Promise<void> => {
    const db = await dbService.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('resources', 'readwrite');
      const store = tx.objectStore('resources');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  // --- Annotations ---

  getAnnotation: async (book: string, page: number): Promise<AnnotationRecord | undefined> => {
    const db = await dbService.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('annotations', 'readonly');
      const store = tx.objectStore('annotations');
      const request = store.get([book, page]);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  saveAnnotation: async (book: string, page: number, canvasData: string | null, textNotes: TextNote[]): Promise<void> => {
    const db = await dbService.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('annotations', 'readwrite');
      const store = tx.objectStore('annotations');
      const request = store.put({ book, page, canvasData, textNotes });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  // --- Settings (Static Edits, Order, Deletions) ---

  getSetting: async <T>(key: string): Promise<T | null> => {
    const db = await dbService.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('settings', 'readonly');
      const store = tx.objectStore('settings');
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result ? request.result.value : null);
      request.onerror = () => reject(request.error);
    });
  },

  saveSetting: async (key: string, value: any): Promise<void> => {
    const db = await dbService.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      const request = store.put({ key, value });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
};
