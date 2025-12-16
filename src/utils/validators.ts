import type { ValidationError } from '../types';

/**
 * Check if file type matches accepted types
 */
export function validateFileType(file: File, accept?: string[]): ValidationError | null {
  if (!accept || accept.length === 0) return null;

  const fileType = file.type;
  const fileName = file.name;
  const fileExtension = fileName.split('.').pop()?.toLowerCase();

  const isValid = accept.some((acceptedType) => {
    // Handle wildcards like 'image/*'
    if (acceptedType.endsWith('/*')) {
      const baseType = acceptedType.replace('/*', '');
      return fileType.startsWith(baseType);
    }
    // Handle MIME types
    if (acceptedType.includes('/')) {
      return fileType === acceptedType;
    }
    // Handle extensions like '.pdf'
    if (acceptedType.startsWith('.')) {
      return `.${fileExtension}` === acceptedType.toLowerCase();
    }
    return false;
  });

  if (!isValid) {
    return {
      file,
      type: 'type',
      message: `File type "${fileType || fileExtension}" is not allowed. Accepted: ${accept.join(', ')}`,
    };
  }

  return null;
}

/**
 * Check if file size is within limit
 */
export function validateFileSize(file: File, maxSize?: number): ValidationError | null {
  if (!maxSize) return null;

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      file,
      type: 'size',
      message: `File "${file.name}" (${fileSizeMB}MB) exceeds maximum size of ${maxSizeMB}MB`,
    };
  }

  return null;
}

/**
 * Check if file count is within limit
 */
export function validateFileCount(
  currentCount: number,
  newFilesCount: number,
  maxFiles?: number
): ValidationError | null {
  if (!maxFiles) return null;

  const totalCount = currentCount + newFilesCount;
  if (totalCount > maxFiles) {
    return {
      file: new File([], ''),
      type: 'count',
      message: `Cannot add ${newFilesCount} files. Maximum allowed: ${maxFiles}, current: ${currentCount}`,
    };
  }

  return null;
}

/**
 * Validate a single file against all rules
 */
export function validateFile(
  file: File,
  options: {
    accept?: string[];
    maxSize?: number;
  }
): ValidationError | null {
  const typeError = validateFileType(file, options.accept);
  if (typeError) return typeError;

  const sizeError = validateFileSize(file, options.maxSize);
  if (sizeError) return sizeError;

  return null;
}

/**
 * Validate multiple files
 */
export function validateFiles(
  files: File[],
  currentCount: number,
  options: {
    accept?: string[];
    maxSize?: number;
    maxFiles?: number;
  }
): { valid: File[]; errors: ValidationError[] } {
  const valid: File[] = [];
  const errors: ValidationError[] = [];

  // Check count first
  const countError = validateFileCount(currentCount, files.length, options.maxFiles);
  if (countError) {
    errors.push(countError);
  }

  // Then validate each file
  const maxToProcess = options.maxFiles
    ? Math.min(files.length, options.maxFiles - currentCount)
    : files.length;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (i < maxToProcess) {
      const error = validateFile(file, options);
      if (error) {
        errors.push(error);
      } else {
        valid.push(file);
      }
    }
  }

  return { valid, errors };
}

/**
 * Generate a unique file ID
 */
export function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
}

/**
 * Get file extension from name
 */
export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Check if file is a video
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}
