import React from 'react';
import { useFileUploader } from '../hooks/useFileUploader';
import type { FileUploaderProps, UploadResult, ValidationError } from '../types';
import { DropZone } from './DropZone';
import { FileList } from './FileList';

// Error icon
const ErrorIcon = () => (
  <svg className="mq-error-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/**
 * Complete file uploader component
 */
export function FileUploader({
  uploadUrl = '/api/upload',
  accept,
  maxFiles,
  maxSize,
  showPreview = true,
  showProgress = true,
  autoUpload = false,
  className = '',
  onComplete,
  onError,
  children,
  disabled = false,
}: FileUploaderProps) {
  const uploader = useFileUploader({
    accept,
    maxFiles,
    maxSize,
    uploadUrl,
    onError: (error) => {
      onError?.(error as ValidationError | UploadResult);
    },
  });

  // Auto upload when files are added
  React.useEffect(() => {
    if (autoUpload && uploader.files.some((f) => f.status === 'pending')) {
      uploader.upload().then((results) => {
        onComplete?.(results);
      });
    }
  }, [autoUpload, uploader.files]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUploadClick = async () => {
    const results = await uploader.upload();
    onComplete?.(results);
  };

  const hasPendingFiles = uploader.files.some((f) => f.status === 'pending');
  const hasErrors = uploader.errors.length > 0;

  return (
    <div className={`mq-uploader ${className}`}>
      {/* Drop Zone */}
      <DropZone
        onFiles={uploader.addFiles}
        accept={accept}
        disabled={disabled || uploader.isUploading}
      >
        {children}
      </DropZone>

      {/* Error List */}
      {hasErrors && (
        <div className="mq-error-list">
          {uploader.errors.map((error, index) => (
            <div key={index} className="mq-error-item">
              <ErrorIcon />
              <span>{error.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* File List */}
      <FileList
        files={uploader.files}
        onRemove={uploader.removeFile}
        showPreview={showPreview}
        showProgress={showProgress}
      />

      {/* Upload Button */}
      {hasPendingFiles && !autoUpload && (
        <button
          type="button"
          className={`mq-upload-btn ${uploader.isUploading ? 'mq-upload-btn--loading' : ''}`}
          onClick={handleUploadClick}
          disabled={uploader.isUploading || disabled}
        >
          {uploader.isUploading ? 'Uploading...' : `Upload ${uploader.files.filter((f) => f.status === 'pending').length} file(s)`}
        </button>
      )}
    </div>
  );
}
