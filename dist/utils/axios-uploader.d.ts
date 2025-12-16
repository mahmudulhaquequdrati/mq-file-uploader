import { UploadResult } from '../types';

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
export declare function uploadWithAxios(axiosInstance: any, options: AxiosUploadOptions): Promise<UploadResult>;
/**
 * Upload multiple files using axios
 */
export declare function uploadFilesWithAxios(axiosInstance: any, files: {
    id: string;
    file: File;
}[], options: Omit<AxiosUploadOptions, 'file'> & {
    onFileProgress?: (id: string, progress: number) => void;
    concurrent?: number;
}): Promise<UploadResult[]>;
