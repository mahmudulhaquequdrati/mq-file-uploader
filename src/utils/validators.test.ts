import { describe, expect, it } from 'vitest';
import {
    formatFileSize,
    getFileExtension,
    isImageFile,
    isVideoFile,
    validateFile,
    validateFileCount,
    validateFiles,
    validateFileSize,
    validateFileType,
} from '../utils/validators';

// Helper to create mock files
function createMockFile(name: string, size: number, type: string): File {
  const content = new Array(size).fill('a').join('');
  return new File([content], name, { type });
}

describe('validators', () => {
  describe('validateFileType', () => {
    it('should return null for valid file types', () => {
      const file = createMockFile('test.jpg', 100, 'image/jpeg');
      expect(validateFileType(file, ['image/*'])).toBeNull();
    });

    it('should return null when no accept types specified', () => {
      const file = createMockFile('test.exe', 100, 'application/octet-stream');
      expect(validateFileType(file)).toBeNull();
      expect(validateFileType(file, [])).toBeNull();
    });

    it('should return error for invalid file type', () => {
      const file = createMockFile('test.exe', 100, 'application/octet-stream');
      const error = validateFileType(file, ['image/*']);
      expect(error).not.toBeNull();
      expect(error?.type).toBe('type');
    });

    it('should handle MIME type wildcards', () => {
      const jpegFile = createMockFile('test.jpg', 100, 'image/jpeg');
      const pngFile = createMockFile('test.png', 100, 'image/png');

      expect(validateFileType(jpegFile, ['image/*'])).toBeNull();
      expect(validateFileType(pngFile, ['image/*'])).toBeNull();
    });

    it('should handle specific MIME types', () => {
      const file = createMockFile('test.pdf', 100, 'application/pdf');
      expect(validateFileType(file, ['application/pdf'])).toBeNull();
      expect(validateFileType(file, ['image/jpeg'])).not.toBeNull();
    });

    it('should handle file extensions', () => {
      const file = createMockFile('document.pdf', 100, 'application/pdf');
      expect(validateFileType(file, ['.pdf'])).toBeNull();
      expect(validateFileType(file, ['.doc'])).not.toBeNull();
    });
  });

  describe('validateFileSize', () => {
    it('should return null for files within size limit', () => {
      const file = createMockFile('test.jpg', 100, 'image/jpeg');
      expect(validateFileSize(file, 1000)).toBeNull();
    });

    it('should return null when no maxSize specified', () => {
      const file = createMockFile('test.jpg', 1000000, 'image/jpeg');
      expect(validateFileSize(file)).toBeNull();
    });

    it('should return error for files exceeding size limit', () => {
      const file = createMockFile('test.jpg', 2000000, 'image/jpeg');
      const error = validateFileSize(file, 1000000);
      expect(error).not.toBeNull();
      expect(error?.type).toBe('size');
    });
  });

  describe('validateFileCount', () => {
    it('should return null when count is within limit', () => {
      expect(validateFileCount(2, 2, 5)).toBeNull();
    });

    it('should return null when no maxFiles specified', () => {
      expect(validateFileCount(100, 100)).toBeNull();
    });

    it('should return error when count exceeds limit', () => {
      const error = validateFileCount(3, 3, 5);
      expect(error).not.toBeNull();
      expect(error?.type).toBe('count');
    });
  });

  describe('validateFile', () => {
    it('should return null for valid file', () => {
      const file = createMockFile('test.jpg', 100, 'image/jpeg');
      expect(validateFile(file, { accept: ['image/*'], maxSize: 1000 })).toBeNull();
    });

    it('should return type error first', () => {
      const file = createMockFile('test.exe', 100, 'application/octet-stream');
      const error = validateFile(file, { accept: ['image/*'], maxSize: 50 });
      expect(error?.type).toBe('type');
    });

    it('should return size error when type is valid but size exceeds', () => {
      const file = createMockFile('test.jpg', 1000, 'image/jpeg');
      const error = validateFile(file, { accept: ['image/*'], maxSize: 500 });
      expect(error?.type).toBe('size');
    });
  });

  describe('validateFiles', () => {
    it('should return valid files and errors separately', () => {
      const validFile = createMockFile('test.jpg', 100, 'image/jpeg');
      const invalidFile = createMockFile('test.exe', 100, 'application/octet-stream');

      const { valid, errors } = validateFiles(
        [validFile, invalidFile],
        0,
        { accept: ['image/*'] }
      );

      expect(valid).toHaveLength(1);
      expect(errors).toHaveLength(1);
    });

    it('should respect maxFiles limit', () => {
      const files = [
        createMockFile('test1.jpg', 100, 'image/jpeg'),
        createMockFile('test2.jpg', 100, 'image/jpeg'),
        createMockFile('test3.jpg', 100, 'image/jpeg'),
      ];

      const { valid, errors } = validateFiles(files, 0, { maxFiles: 2 });

      expect(valid).toHaveLength(2);
      expect(errors.some(e => e.type === 'count')).toBe(true);
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });
  });

  describe('isImageFile', () => {
    it('should return true for image files', () => {
      expect(isImageFile(createMockFile('test.jpg', 100, 'image/jpeg'))).toBe(true);
      expect(isImageFile(createMockFile('test.png', 100, 'image/png'))).toBe(true);
      expect(isImageFile(createMockFile('test.gif', 100, 'image/gif'))).toBe(true);
    });

    it('should return false for non-image files', () => {
      expect(isImageFile(createMockFile('test.pdf', 100, 'application/pdf'))).toBe(false);
      expect(isImageFile(createMockFile('test.mp4', 100, 'video/mp4'))).toBe(false);
    });
  });

  describe('isVideoFile', () => {
    it('should return true for video files', () => {
      expect(isVideoFile(createMockFile('test.mp4', 100, 'video/mp4'))).toBe(true);
      expect(isVideoFile(createMockFile('test.webm', 100, 'video/webm'))).toBe(true);
    });

    it('should return false for non-video files', () => {
      expect(isVideoFile(createMockFile('test.jpg', 100, 'image/jpeg'))).toBe(false);
    });
  });

  describe('getFileExtension', () => {
    it('should return file extension', () => {
      expect(getFileExtension('test.jpg')).toBe('jpg');
      expect(getFileExtension('document.pdf')).toBe('pdf');
      expect(getFileExtension('file.name.with.dots.txt')).toBe('txt');
    });

    it('should return empty string for files without extension', () => {
      expect(getFileExtension('noextension')).toBe('noextension');
    });
  });
});
