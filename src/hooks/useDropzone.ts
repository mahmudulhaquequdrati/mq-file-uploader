import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { UseDropzoneOptions, UseDropzoneReturn } from '../types';

/**
 * Hook for handling drag-and-drop file uploads
 */
export function useDropzone(options: UseDropzoneOptions = {}): UseDropzoneReturn {
  const { onDrop, accept, disabled = false, noClick = false } = options;
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;

      dragCounter.current++;
      if (e.dataTransfer?.items?.length) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;

      dragCounter.current--;
      if (dragCounter.current === 0) {
        setIsDragging(false);
      }
    },
    [disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      e.dataTransfer.dropEffect = 'copy';
    },
    [disabled]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;

      dragCounter.current = 0;
      setIsDragging(false);

      const files = e.dataTransfer?.files;
      console.log('[useDropzone] Files dropped:', files?.length, files);
      if (files?.length && onDrop) {
        onDrop(files);
      }
    },
    [disabled, onDrop]
  );

  const handleClick = useCallback(() => {
    if (disabled || noClick) return;
    inputRef.current?.click();
  }, [disabled, noClick]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      console.log('[useDropzone] Files selected via input:', files?.length, files);
      if (files?.length && onDrop) {
        onDrop(files);
      }
      // Reset input so same file can be selected again
      e.target.value = '';
    },
    [onDrop]
  );

  const open = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const getRootProps = useCallback(
    (): React.HTMLAttributes<HTMLDivElement> => ({
      onDragEnter: handleDragEnter as React.DragEventHandler<HTMLDivElement>,
      onDragLeave: handleDragLeave as React.DragEventHandler<HTMLDivElement>,
      onDragOver: handleDragOver as React.DragEventHandler<HTMLDivElement>,
      onDrop: handleDrop as React.DragEventHandler<HTMLDivElement>,
      onClick: handleClick,
      role: 'button' as const,
      tabIndex: disabled ? -1 : 0,
      'aria-disabled': disabled,
    }),
    [handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleClick, disabled]
  );

  const getInputProps = useCallback(
    () => ({
      type: 'file' as const,
      multiple: true,
      accept: accept?.join(','),
      onChange: handleChange,
      style: { display: 'none' } as React.CSSProperties,
      tabIndex: -1,
    }),
    [accept, handleChange]
  );

  // Expose the ref for the component to use
  const getInputRef = useCallback(() => inputRef, []);

  // Cleanup drag state on unmount
  useEffect(() => {
    return () => {
      dragCounter.current = 0;
    };
  }, []);

  return {
    getRootProps,
    getInputProps,
    getInputRef,
    isDragging,
    open,
  };
}
