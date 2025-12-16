/**
 * Chunked file upload utilities for handling large files
 */
export interface ChunkUploadOptions {
    url: string;
    file: File;
    chunkSize?: number;
    fieldName?: string;
    headers?: Record<string, string>;
    onProgress?: (progress: number) => void;
    onChunkComplete?: (chunkIndex: number, totalChunks: number) => void;
    signal?: AbortSignal;
}
export interface ChunkUploadResult {
    success: boolean;
    responses: unknown[];
    error?: string;
}
/**
 * Split a file into chunks
 */
export declare function splitFileIntoChunks(file: File, chunkSize?: number): Blob[];
/**
 * Upload a file in chunks
 */
export declare function uploadFileChunked(options: ChunkUploadOptions): Promise<ChunkUploadResult>;
/**
 * Check if a file should use chunked upload
 */
export declare function shouldUseChunkedUpload(file: File, threshold?: number): boolean;
