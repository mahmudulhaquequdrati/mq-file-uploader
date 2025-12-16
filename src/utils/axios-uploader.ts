/**
 * Axios-based file upload utilities (optional, for users who prefer axios)
 */

// Note: Axios needs to be installed separately: npm install axios
// import axios, { AxiosProgressEvent } from 'axios';

import type { UploadResult } from '../types';

export interface AxiosUploadOptions {
  url: string;
  file: File;
  fieldName?: string;
  headers?: Record<string, string>;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
  /** Additional form data fields */
  additionalData?: Record<string, string>;
}

/**
 * Upload a file using axios (requires axios to be installed)
 *
 * @example
 * ```tsx
 * import axios from 'axios';
 * import { uploadWithAxios } from '@mq/file-uploader';
 *
 * const result = await uploadWithAxios(axios, {
 *   url: '/api/upload',
 *   file: myFile,
 *   onProgress: (progress) => console.log(progress + '%'),
 * });
 * ```
 */
export async function uploadWithAxios(
  // Using any to avoid requiring axios as a peer dependency
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axiosInstance: any,
  options: AxiosUploadOptions
): Promise<UploadResult> {
  const {
    url,
    file,
    fieldName = 'file',
    headers = {},
    onProgress,
    signal,
    additionalData = {},
  } = options;

  const formData = new FormData();
  formData.append(fieldName, file);

  // Add any additional data
  Object.entries(additionalData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  try {
    const response = await axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...headers,
      },
      signal,
      onUploadProgress: (progressEvent: { loaded: number; total?: number }) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          console.log('[axios-uploader] Progress:', progress, '%');
          onProgress?.(progress);
        }
      },
    });

    return {
      id: '',
      success: true,
      response: response.data,
    };
  } catch (error) {
    const err = error as Error & { code?: string; response?: { status: number; statusText: string } };

    if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError') {
      return {
        id: '',
        success: false,
        error: 'Upload was cancelled',
      };
    }

    return {
      id: '',
      success: false,
      error: err.response
        ? `Upload failed with status ${err.response.status}: ${err.response.statusText}`
        : `Upload failed: ${err.message}`,
    };
  }
}

/**
 * Upload multiple files using axios
 */
export async function uploadFilesWithAxios(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axiosInstance: any,
  files: { id: string; file: File }[],
  options: Omit<AxiosUploadOptions, 'file'> & {
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

    const result = await uploadWithAxios(axiosInstance, {
      ...uploadOptions,
      file: item.file,
      onProgress: (progress) => {
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
