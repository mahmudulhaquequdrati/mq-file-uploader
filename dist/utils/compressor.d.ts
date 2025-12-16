/**
 * Image compression utilities for reducing file size before upload
 */
export interface CompressionOptions {
    /** Maximum width in pixels */
    maxWidth?: number;
    /** Maximum height in pixels */
    maxHeight?: number;
    /** Quality from 0 to 1 (for JPEG/WebP) */
    quality?: number;
    /** Output format */
    format?: 'image/jpeg' | 'image/png' | 'image/webp';
}
export interface CompressionResult {
    file: File;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
}
/**
 * Compress an image file using canvas
 */
export declare function compressImage(file: File, options?: CompressionOptions): Promise<CompressionResult>;
/**
 * Compress multiple image files
 */
export declare function compressImages(files: File[], options?: CompressionOptions): Promise<CompressionResult[]>;
/**
 * Check if compression would be beneficial for a file
 */
export declare function shouldCompress(file: File, threshold?: number): boolean;
/**
 * Get optimal compression settings based on file
 */
export declare function getOptimalCompressionOptions(file: File): CompressionOptions;
