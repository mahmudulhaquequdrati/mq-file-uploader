import { useCallback, useRef, useState } from 'react';
import type {
    FileWithPreview,
    UploadResult,
    UseFileUploaderOptions,
    UseFileUploaderReturn,
    ValidationError,
} from '../types';
import { uploadFiles } from '../utils/uploader';
import { generateFileId, isImageFile, isVideoFile, validateFiles } from '../utils/validators';

/**
 * Main hook for file upload management
 */
export function useFileUploader(options: UseFileUploaderOptions = {}): UseFileUploaderReturn {
  const {
    accept,
    maxFiles,
    maxSize,
    uploadUrl = '/api/upload',
    headers,
    fieldName = 'file',
    onUploadComplete,
    onProgress,
    onError,
  } = options;

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Generate preview for a file
   */
  const createPreview = useCallback((file: File): string | null => {
    if (isImageFile(file) || isVideoFile(file)) {
      return URL.createObjectURL(file);
    }
    return null;
  }, []);

  /**
   * Add files to the upload queue
   */
  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      console.log('[useFileUploader] addFiles called with:', newFiles);
      const fileArray = Array.from(newFiles);
      console.log('[useFileUploader] fileArray:', fileArray);

      // Validate files
      const { valid, errors: validationErrors } = validateFiles(fileArray, files.length, {
        accept,
        maxSize,
        maxFiles,
      });

      console.log('[useFileUploader] Validation result - valid:', valid.length, 'errors:', validationErrors.length);

      // Report validation errors
      if (validationErrors.length > 0) {
        setErrors((prev) => [...prev, ...validationErrors]);
        validationErrors.forEach((error) => onError?.(error));
      }

      // Add valid files
      if (valid.length > 0) {
        const newFileEntries: FileWithPreview[] = valid.map((file) => ({
          id: generateFileId(),
          file,
          preview: createPreview(file),
          progress: 0,
          status: 'pending' as const,
        }));

        console.log('[useFileUploader] Adding new file entries:', newFileEntries);
        setFiles((prev) => [...prev, ...newFileEntries]);
      }
    },
    [files.length, accept, maxSize, maxFiles, onError, createPreview]
  );

  /**
   * Remove a file from the queue
   */
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
    setUploadProgress((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  /**
   * Update file progress - syncs progress to both uploadProgress and files array
   */
  const updateFileProgress = useCallback((id: string, progress: number) => {
    // Update the uploadProgress state
    setUploadProgress((prev) => ({ ...prev, [id]: progress }));

    // Also update the progress in the files array so FilePreview shows it
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, progress } : f
      )
    );

    // Call external progress callback
    onProgress?.(id, progress);
  }, [onProgress]);

  /**
   * Upload all pending files
   */
  const upload = useCallback(async (): Promise<UploadResult[]> => {
    const pendingFiles = files.filter((f) => f.status === 'pending');
    if (pendingFiles.length === 0) return [];

    console.log('[useFileUploader] Starting upload for', pendingFiles.length, 'files');
    setIsUploading(true);
    abortControllerRef.current = new AbortController();

    // Mark files as uploading
    setFiles((prev) =>
      prev.map((f) =>
        f.status === 'pending' ? { ...f, status: 'uploading' as const, progress: 0 } : f
      )
    );

    try {
      const results = await uploadFiles(
        pendingFiles.map((f) => ({ id: f.id, file: f.file })),
        {
          url: uploadUrl,
          headers,
          fieldName,
          signal: abortControllerRef.current.signal,
          onFileProgress: (id, progress) => {
            console.log('[useFileUploader] Progress update:', id, progress);
            updateFileProgress(id, progress);
          },
        }
      );

      console.log('[useFileUploader] Upload results:', results);

      // Update file statuses based on results
      setFiles((prev) =>
        prev.map((f) => {
          const result = results.find((r) => r.id === f.id);
          if (result) {
            return {
              ...f,
              status: result.success ? ('success' as const) : ('error' as const),
              error: result.error,
              progress: result.success ? 100 : f.progress,
            };
          }
          return f;
        })
      );

      // Notify completions and errors
      results.forEach((result) => {
        if (result.success) {
          onUploadComplete?.(result);
        } else {
          onError?.(result);
        }
      });

      return results;
    } finally {
      setIsUploading(false);
      abortControllerRef.current = null;
    }
  }, [files, uploadUrl, headers, fieldName, updateFileProgress, onUploadComplete, onError]);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  /**
   * Reset everything to initial state
   */
  const reset = useCallback(() => {
    // Abort any ongoing uploads
    abortControllerRef.current?.abort();

    // Revoke all preview URLs
    files.forEach((f) => {
      if (f.preview) {
        URL.revokeObjectURL(f.preview);
      }
    });

    setFiles([]);
    setUploadProgress({});
    setIsUploading(false);
    setErrors([]);
  }, [files]);

  return {
    files,
    addFiles,
    removeFile,
    upload,
    uploadProgress,
    isUploading,
    errors,
    clearErrors,
    reset,
  };
}
