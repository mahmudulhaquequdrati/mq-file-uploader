import type { FilePreviewProps } from '../types';
import { formatFileSize, getFileExtension } from '../utils/validators';
import { ProgressBar } from './ProgressBar';

// File type icons as SVG
const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const LoadingSpinner = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
    <circle cx="12" cy="12" r="10" opacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </svg>
);

/**
 * File preview card component with real-time progress
 */
export function FilePreview({
  file,
  onRemove,
  className = '',
  showRemove = true,
}: FilePreviewProps) {
  const extension = getFileExtension(file.file.name).toUpperCase();
  const statusClass = file.status === 'success' || file.status === 'error'
    ? `mq-file-preview--${file.status}`
    : '';

  // Only show progress bar during actual upload
  const showProgressBar = file.status === 'uploading';

  return (
    <div className={`mq-file-preview ${statusClass} ${className}`}>
      {/* Thumbnail */}
      <div className="mq-file-preview__thumbnail">
        {file.preview ? (
          <img src={file.preview} alt={file.file.name} />
        ) : (
          <div className="mq-file-preview__icon">
            <FileIcon />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mq-file-preview__info">
        <p className="mq-file-preview__name" title={file.file.name}>
          {file.file.name}
        </p>

        <div className="mq-file-preview__meta">
          <span>{formatFileSize(file.file.size)}</span>
          {extension && <span>•</span>}
          {extension && <span>{extension}</span>}

          {/* Status indicators */}
          {file.status === 'pending' && (
            <>
              <span>•</span>
              <span style={{ color: 'var(--mq-gray-400)' }}>Ready</span>
            </>
          )}

          {file.status === 'uploading' && (
            <>
              <span>•</span>
              <span style={{ color: 'var(--mq-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <LoadingSpinner /> Uploading {file.progress}%
              </span>
            </>
          )}

          {file.status === 'success' && (
            <>
              <span>•</span>
              <span style={{ color: 'var(--mq-success)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <CheckIcon /> Uploaded
              </span>
            </>
          )}

          {file.status === 'error' && (
            <>
              <span>•</span>
              <span style={{ color: 'var(--mq-error)' }}>Failed</span>
            </>
          )}
        </div>

        {/* Progress bar - only show during upload */}
        {showProgressBar && (
          <div style={{ marginTop: '0.5rem' }}>
            <ProgressBar
              value={file.progress}
              status="uploading"
              showText={true}
            />
          </div>
        )}

        {/* Error message */}
        {file.error && (
          <p className="mq-file-preview__error">{file.error}</p>
        )}
      </div>

      {/* Remove button */}
      {showRemove && onRemove && (
        <button
          type="button"
          className="mq-file-preview__remove"
          onClick={() => onRemove(file.id)}
          aria-label={`Remove ${file.file.name}`}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
