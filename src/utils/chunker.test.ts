import { describe, expect, it } from 'vitest';
import { shouldUseChunkedUpload, splitFileIntoChunks } from '../utils/chunker';

// Helper to create mock files
function createMockFile(name: string, size: number, type: string): File {
  const content = new ArrayBuffer(size);
  return new File([content], name, { type });
}

describe('chunker', () => {
  describe('splitFileIntoChunks', () => {
    it('should split file into correct number of chunks', () => {
      const file = createMockFile('test.bin', 3000, 'application/octet-stream');
      const chunks = splitFileIntoChunks(file, 1000);

      expect(chunks).toHaveLength(3);
    });

    it('should handle files smaller than chunk size', () => {
      const file = createMockFile('test.bin', 500, 'application/octet-stream');
      const chunks = splitFileIntoChunks(file, 1000);

      expect(chunks).toHaveLength(1);
    });

    it('should handle files with remainder', () => {
      const file = createMockFile('test.bin', 2500, 'application/octet-stream');
      const chunks = splitFileIntoChunks(file, 1000);

      expect(chunks).toHaveLength(3);
    });

    it('should use default chunk size of 1MB', () => {
      const file = createMockFile('test.bin', 2 * 1024 * 1024, 'application/octet-stream');
      const chunks = splitFileIntoChunks(file);

      expect(chunks).toHaveLength(2);
    });
  });

  describe('shouldUseChunkedUpload', () => {
    it('should return true for files larger than threshold', () => {
      const largeFile = createMockFile('test.bin', 10 * 1024 * 1024, 'application/octet-stream');
      expect(shouldUseChunkedUpload(largeFile)).toBe(true);
    });

    it('should return false for files smaller than threshold', () => {
      const smallFile = createMockFile('test.bin', 1 * 1024 * 1024, 'application/octet-stream');
      expect(shouldUseChunkedUpload(smallFile)).toBe(false);
    });

    it('should respect custom threshold', () => {
      const file = createMockFile('test.bin', 2 * 1024 * 1024, 'application/octet-stream');
      expect(shouldUseChunkedUpload(file, 1 * 1024 * 1024)).toBe(true);
      expect(shouldUseChunkedUpload(file, 3 * 1024 * 1024)).toBe(false);
    });
  });
});
