import { ValidationError } from '../types';

/**
 * Check if file type matches accepted types
 */
export declare function validateFileType(file: File, accept?: string[]): ValidationError | null;
/**
 * Check if file size is within limit
 */
export declare function validateFileSize(file: File, maxSize?: number): ValidationError | null;
/**
 * Check if file count is within limit
 */
export declare function validateFileCount(currentCount: number, newFilesCount: number, maxFiles?: number): ValidationError | null;
/**
 * Validate a single file against all rules
 */
export declare function validateFile(file: File, options: {
    accept?: string[];
    maxSize?: number;
}): ValidationError | null;
/**
 * Validate multiple files
 */
export declare function validateFiles(files: File[], currentCount: number, options: {
    accept?: string[];
    maxSize?: number;
    maxFiles?: number;
}): {
    valid: File[];
    errors: ValidationError[];
};
/**
 * Generate a unique file ID
 */
export declare function generateFileId(): string;
/**
 * Format file size for display
 */
export declare function formatFileSize(bytes: number): string;
/**
 * Get file extension from name
 */
export declare function getFileExtension(fileName: string): string;
/**
 * Check if file is an image
 */
export declare function isImageFile(file: File): boolean;
/**
 * Check if file is a video
 */
export declare function isVideoFile(file: File): boolean;
