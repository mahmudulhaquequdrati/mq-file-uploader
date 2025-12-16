import type { FileListProps } from '../types';
import { FilePreview } from './FilePreview';

/**
 * File list component displaying all uploaded files
 */
export function FileList({
  files,
  onRemove,
  showPreview: _showPreview = true,
  showProgress = true,
  className = '',
}: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className={`mq-file-list ${className}`}>
      {files.map((file) => (
        <FilePreview
          key={file.id}
          file={{
            ...file,
            progress: showProgress ? file.progress : 0,
          }}
          onRemove={onRemove}
          showRemove={true}
        />
      ))}
    </div>
  );
}
