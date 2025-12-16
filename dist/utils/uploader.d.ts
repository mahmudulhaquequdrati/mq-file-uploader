import { UploadResult } from '../types';

export interface UploadOptions {
    url: string;
    file: File;
    fieldName?: string;
    headers?: Record<string, string>;
    onProgress?: (progress: number) => void;
    signal?: AbortSignal;
}
/**
 * Upload a single file with progress tracking using XHR
 */
export declare function uploadFile(options: UploadOptions): Promise<UploadResult>;
/**
 * Upload multiple files with progress tracking
 */
export declare function uploadFiles(files: {
    id: string;
    file: File;
}[], options: Omit<UploadOptions, 'file'> & {
    onFileProgress?: (id: string, progress: number) => void;
    concurrent?: number;
}): Promise<UploadResult[]>;
/**
 * Retry upload with exponential backoff
 */
export declare function uploadWithRetry(options: UploadOptions, maxRetries?: number, baseDelay?: number): Promise<UploadResult>;
