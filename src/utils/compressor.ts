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
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'image/jpeg',
  } = options;

  // Skip non-image files
  if (!file.type.startsWith('image/')) {
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      compressionRatio: 1,
    };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }

          // Create new file from blob
          const extension = format.split('/')[1];
          const newFileName = file.name.replace(/\.[^/.]+$/, `.${extension}`);
          const compressedFile = new File([blob], newFileName, { type: format });

          const originalSize = file.size;
          const compressedSize = compressedFile.size;

          console.log(
            `[Compression] ${file.name}: ${formatBytes(originalSize)} → ${formatBytes(compressedSize)} (${Math.round((1 - compressedSize / originalSize) * 100)}% reduction)`
          );

          resolve({
            file: compressedFile,
            originalSize,
            compressedSize,
            compressionRatio: compressedSize / originalSize,
          });
        },
        format,
        quality
      );

      // Revoke object URL
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image for compression'));
    };

    // Load image from file
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Compress multiple image files
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {}
): Promise<CompressionResult[]> {
  const results = await Promise.all(
    files.map((file) => compressImage(file, options))
  );
  return results;
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
}

/**
 * Check if compression would be beneficial for a file
 */
export function shouldCompress(file: File, threshold: number = 500 * 1024): boolean {
  // Only compress images larger than threshold (default 500KB)
  return file.type.startsWith('image/') && file.size > threshold;
}

/**
 * Get optimal compression settings based on file
 */
export function getOptimalCompressionOptions(file: File): CompressionOptions {
  // For very large images, use more aggressive compression
  if (file.size > 5 * 1024 * 1024) {
    return {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.7,
      format: 'image/jpeg',
    };
  }

  // For medium images
  if (file.size > 1 * 1024 * 1024) {
    return {
      maxWidth: 2560,
      maxHeight: 1440,
      quality: 0.8,
      format: 'image/jpeg',
    };
  }

  // For smaller images, preserve more quality
  return {
    maxWidth: 3840,
    maxHeight: 2160,
    quality: 0.9,
    format: 'image/webp',
  };
}
