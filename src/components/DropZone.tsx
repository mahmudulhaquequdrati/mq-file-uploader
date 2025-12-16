import { useDropzone } from '../hooks/useDropzone';
import type { DropZoneProps } from '../types';

// Upload cloud icon
const UploadIcon = () => (
  <svg
    className="mq-dropzone__icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

/**
 * Drop zone component for drag-and-drop file uploads
 */
export function DropZone({
  onFiles,
  accept,
  disabled = false,
  className = '',
  children,
  isDragging: externalIsDragging,
}: DropZoneProps) {
  const dropzone = useDropzone({
    onDrop: (files) => {
      console.log('[DropZone] onDrop called with files:', files);
      onFiles?.(files);
    },
    accept,
    disabled,
  });

  const isDragging = externalIsDragging ?? dropzone.isDragging;

  const rootClassName = [
    'mq-dropzone',
    isDragging && 'mq-dropzone--dragging',
    disabled && 'mq-dropzone--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inputProps = dropzone.getInputProps();
  const inputRef = dropzone.getInputRef();

  return (
    <div className={rootClassName} {...dropzone.getRootProps()}>
      <input
        type={inputProps.type}
        multiple={inputProps.multiple}
        accept={inputProps.accept}
        onChange={inputProps.onChange}
        ref={inputRef}
        style={inputProps.style}
        tabIndex={inputProps.tabIndex}
      />
      {children || (
        <>
          <UploadIcon />
          <div className="mq-dropzone__text">
            <p className="mq-dropzone__title">
              Drag & drop files here, or{' '}
              <span className="mq-dropzone__browse">browse</span>
            </p>
            <p className="mq-dropzone__subtitle">
              {accept?.length
                ? `Supports: ${accept.join(', ')}`
                : 'All file types supported'}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
