export interface FileWithPreview {
    id: string;
    file: File;
    preview: string | null;
    progress: number;
    status: 'pending' | 'uploading' | 'success' | 'error';
    error?: string;
}
export interface UploadResult {
    id: string;
    success: boolean;
    response?: unknown;
    error?: string;
}
export interface ValidationError {
    file: File;
    type: 'type' | 'size' | 'count';
    message: string;
}
export interface UseFileUploaderOptions {
    /** Accepted file types, e.g., ['image/*', 'application/pdf'] */
    accept?: string[];
    /** Maximum number of files allowed */
    maxFiles?: number;
    /** Maximum file size in bytes */
    maxSize?: number;
    /** Upload endpoint URL */
    uploadUrl?: string;
    /** Custom headers for upload request */
    headers?: Record<string, string>;
    /** Field name for the file in FormData */
    fieldName?: string;
    /** Enable chunked upload for large files */
    chunked?: boolean;
    /** Chunk size in bytes (default: 1MB) */
    chunkSize?: number;
    /** Callback when upload completes */
    onUploadComplete?: (result: UploadResult) => void;
    /** Callback on upload progress */
    onProgress?: (id: string, progress: number) => void;
    /** Callback on error */
    onError?: (error: ValidationError | UploadResult) => void;
}
export interface UseFileUploaderReturn {
    /** Current files with previews and status */
    files: FileWithPreview[];
    /** Add files to the upload queue */
    addFiles: (files: FileList | File[]) => void;
    /** Remove a file by ID */
    removeFile: (id: string) => void;
    /** Start uploading all pending files */
    upload: () => Promise<UploadResult[]>;
    /** Upload progress for each file */
    uploadProgress: Record<string, number>;
    /** Whether any files are currently uploading */
    isUploading: boolean;
    /** Validation errors */
    errors: ValidationError[];
    /** Clear all errors */
    clearErrors: () => void;
    /** Reset everything to initial state */
    reset: () => void;
}
export interface UseDropzoneOptions {
    /** Callback when files are dropped */
    onDrop?: (files: FileList) => void;
    /** Accepted file types */
    accept?: string[];
    /** Whether dropzone is disabled */
    disabled?: boolean;
    /** Prevent default drag behavior on document */
    noClick?: boolean;
}
export interface UseDropzoneReturn {
    /** Props to spread on the drop zone element */
    getRootProps: () => React.HTMLAttributes<HTMLDivElement>;
    /** Props to spread on the input element */
    getInputProps: () => Omit<React.InputHTMLAttributes<HTMLInputElement>, 'ref'>;
    /** Get the input ref for the hidden file input */
    getInputRef: () => React.RefObject<HTMLInputElement>;
    /** Whether files are being dragged over */
    isDragging: boolean;
    /** Open file picker programmatically */
    open: () => void;
}
export interface FileUploaderProps {
    /** Upload endpoint URL */
    uploadUrl?: string;
    /** Accepted file types */
    accept?: string[];
    /** Maximum files */
    maxFiles?: number;
    /** Maximum file size in bytes */
    maxSize?: number;
    /** Show file previews */
    showPreview?: boolean;
    /** Show progress bar */
    showProgress?: boolean;
    /** Auto upload on file add */
    autoUpload?: boolean;
    /** Custom class name */
    className?: string;
    /** Callback when files are uploaded */
    onComplete?: (results: UploadResult[]) => void;
    /** Callback on error */
    onError?: (error: ValidationError | UploadResult) => void;
    /** Custom drop zone content */
    children?: React.ReactNode;
    /** Disable the uploader */
    disabled?: boolean;
}
export interface DropZoneProps {
    /** Callback when files are dropped/selected */
    onFiles?: (files: FileList) => void;
    /** Accepted file types */
    accept?: string[];
    /** Whether zone is disabled */
    disabled?: boolean;
    /** Custom class name */
    className?: string;
    /** Custom content */
    children?: React.ReactNode;
    /** Whether files are being dragged over */
    isDragging?: boolean;
}
export interface FilePreviewProps {
    /** File to preview */
    file: FileWithPreview;
    /** Remove file callback */
    onRemove?: (id: string) => void;
    /** Custom class name */
    className?: string;
    /** Show remove button */
    showRemove?: boolean;
}
export interface ProgressBarProps {
    /** Progress value (0-100) */
    value: number;
    /** Custom class name */
    className?: string;
    /** Show percentage text */
    showText?: boolean;
    /** Status for styling */
    status?: 'pending' | 'uploading' | 'success' | 'error';
}
export interface FileListProps {
    /** Files to display */
    files: FileWithPreview[];
    /** Remove file callback */
    onRemove?: (id: string) => void;
    /** Show previews */
    showPreview?: boolean;
    /** Show progress */
    showProgress?: boolean;
    /** Custom class name */
    className?: string;
}
