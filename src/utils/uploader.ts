import type { UploadResult } from '../types';

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
export function uploadFile(options: UploadOptions): Promise<UploadResult> {
  const { url, file, fieldName = 'file', headers = {}, onProgress, signal } = options;

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append(fieldName, file);

    // Track progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        console.log('[uploader] XHR progress:', progress, '%');
        onProgress(progress);
      }
    });

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let response;
        try {
          response = JSON.parse(xhr.responseText);
        } catch {
          response = xhr.responseText;
        }
        resolve({
          id: '',
          success: true,
          response,
        });
      } else {
        resolve({
          id: '',
          success: false,
          error: `Upload failed with status ${xhr.status}: ${xhr.statusText}`,
        });
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      resolve({
        id: '',
        success: false,
        error: 'Network error occurred during upload',
      });
    });

    xhr.addEventListener('abort', () => {
      resolve({
        id: '',
        success: false,
        error: 'Upload was cancelled',
      });
    });

    // Handle abort signal
    if (signal) {
      signal.addEventListener('abort', () => {
        xhr.abort();
      });
    }

    // Send request
    xhr.open('POST', url, true);

    // Set headers
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    xhr.send(formData);
  });
}

/**
 * Upload multiple files with progress tracking
 */
export async function uploadFiles(
  files: { id: string; file: File }[],
  options: Omit<UploadOptions, 'file'> & {
    onFileProgress?: (id: string, progress: number) => void;
    concurrent?: number;
  }
): Promise<UploadResult[]> {
  const { concurrent = 3, onFileProgress, ...uploadOptions } = options;
  const results: UploadResult[] = [];
  const queue = [...files];

  async function processNext(): Promise<void> {
    const item = queue.shift();
    if (!item) return;

    console.log('[uploader] Starting upload for:', item.file.name);

    const result = await uploadFile({
      ...uploadOptions,
      file: item.file,
      onProgress: (progress) => {
        console.log('[uploader] Progress for', item.id, ':', progress, '%');
        onFileProgress?.(item.id, progress);
      },
    });

    results.push({ ...result, id: item.id });
    await processNext();
  }

  // Start concurrent uploads
  const workers = Array(Math.min(concurrent, files.length))
    .fill(null)
    .map(() => processNext());

  await Promise.all(workers);

  return results;
}

/**
 * Retry upload with exponential backoff
 */
export async function uploadWithRetry(
  options: UploadOptions,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<UploadResult> {
  let lastError: string | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await uploadFile(options);

    if (result.success) {
      return result;
    }

    lastError = result.error;

    // Don't retry on abort
    if (result.error === 'Upload was cancelled') {
      return result;
    }

    // Wait before retry (exponential backoff)
    if (attempt < maxRetries) {
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return {
    id: '',
    success: false,
    error: `Upload failed after ${maxRetries + 1} attempts: ${lastError}`,
  };
}
