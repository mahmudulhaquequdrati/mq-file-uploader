import { useCallback, useEffect, useState } from 'react';
import { isImageFile, isVideoFile } from '../utils/validators';

interface PreviewState {
  [id: string]: string | null;
}

/**
 * Hook for generating file previews (images/videos)
 */
export function useFilePreview() {
  const [previews, setPreviews] = useState<PreviewState>({});

  /**
   * Generate preview for a single file
   */
  const generatePreview = useCallback((id: string, file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      // Only generate previews for images and videos
      if (!isImageFile(file) && !isVideoFile(file)) {
        resolve(null);
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [id]: objectUrl }));
      resolve(objectUrl);
    });
  }, []);

  /**
   * Generate previews for multiple files
   */
  const generatePreviews = useCallback(
    async (files: { id: string; file: File }[]): Promise<void> => {
      const newPreviews: PreviewState = {};

      for (const { id, file } of files) {
        if (isImageFile(file) || isVideoFile(file)) {
          newPreviews[id] = URL.createObjectURL(file);
        } else {
          newPreviews[id] = null;
        }
      }

      setPreviews((prev) => ({ ...prev, ...newPreviews }));
    },
    []
  );

  /**
   * Remove a preview and revoke its URL
   */
  const removePreview = useCallback((id: string) => {
    setPreviews((prev) => {
      const preview = prev[id];
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  /**
   * Clear all previews and revoke URLs
   */
  const clearPreviews = useCallback(() => {
    setPreviews((prev) => {
      Object.values(prev).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      return {};
    });
  }, []);

  /**
   * Get preview URL for a file ID
   */
  const getPreview = useCallback(
    (id: string): string | null => {
      return previews[id] ?? null;
    },
    [previews]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    previews,
    generatePreview,
    generatePreviews,
    removePreview,
    clearPreviews,
    getPreview,
  };
}
