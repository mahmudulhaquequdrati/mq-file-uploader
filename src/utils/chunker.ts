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
export function splitFileIntoChunks(file: File, chunkSize: number = 1024 * 1024): Blob[] {
  const chunks: Blob[] = [];
  let offset = 0;

  while (offset < file.size) {
    const chunk = file.slice(offset, offset + chunkSize);
    chunks.push(chunk);
    offset += chunkSize;
  }

  return chunks;
}

/**
 * Upload a file in chunks
 */
export async function uploadFileChunked(options: ChunkUploadOptions): Promise<ChunkUploadResult> {
  const {
    url,
    file,
    chunkSize = 1024 * 1024, // 1MB default
    fieldName = 'file',
    headers = {},
    onProgress,
    onChunkComplete,
    signal,
  } = options;

  const chunks = splitFileIntoChunks(file, chunkSize);
  const totalChunks = chunks.length;
  const responses: unknown[] = [];
  let uploadedBytes = 0;

  console.log(`[Chunker] Starting chunked upload: ${file.name}, ${totalChunks} chunks`);

  for (let i = 0; i < chunks.length; i++) {
    if (signal?.aborted) {
      return {
        success: false,
        responses,
        error: 'Upload was cancelled',
      };
    }

    const chunk = chunks[i];
    const formData = new FormData();

    // Add chunk data
    formData.append(fieldName, chunk, file.name);
    formData.append('chunkIndex', String(i));
    formData.append('totalChunks', String(totalChunks));
    formData.append('fileName', file.name);
    formData.append('fileSize', String(file.size));

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
        signal,
      });

      if (!response.ok) {
        return {
          success: false,
          responses,
          error: `Chunk ${i + 1}/${totalChunks} failed: ${response.statusText}`,
        };
      }

      const result = await response.json().catch(() => ({}));
      responses.push(result);

      uploadedBytes += chunk.size;
      const progress = Math.round((uploadedBytes / file.size) * 100);
      onProgress?.(progress);
      onChunkComplete?.(i, totalChunks);

      console.log(`[Chunker] Chunk ${i + 1}/${totalChunks} uploaded (${progress}%)`);
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return {
          success: false,
          responses,
          error: 'Upload was cancelled',
        };
      }
      return {
        success: false,
        responses,
        error: `Chunk ${i + 1}/${totalChunks} failed: ${(error as Error).message}`,
      };
    }
  }

  return {
    success: true,
    responses,
  };
}

/**
 * Check if a file should use chunked upload
 */
export function shouldUseChunkedUpload(file: File, threshold: number = 5 * 1024 * 1024): boolean {
  return file.size > threshold;
}
