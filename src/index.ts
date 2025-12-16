// Hooks
export { useDropzone } from './hooks/useDropzone';
export { useFilePreview } from './hooks/useFilePreview';
export { useFileUploader } from './hooks/useFileUploader';

// Components
export { DropZone } from './components/DropZone';
export { FileList } from './components/FileList';
export { FilePreview } from './components/FilePreview';
export { FileUploader } from './components/FileUploader';
export { ProgressBar } from './components/ProgressBar';

// Utils - Validators
export {
    formatFileSize, getFileExtension, isImageFile,
    isVideoFile, validateFile,
    validateFiles
} from './utils/validators';

// Utils - Upload (XHR-based)
export {
    uploadFile,
    uploadFiles,
    uploadWithRetry
} from './utils/uploader';

// Utils - Axios Upload (optional - requires axios)
export {
    uploadFilesWithAxios, uploadWithAxios
} from './utils/axios-uploader';

// Utils - Chunked Upload
export {
    shouldUseChunkedUpload, splitFileIntoChunks,
    uploadFileChunked
} from './utils/chunker';

// Utils - Image Compression
export {
    compressImage,
    compressImages, getOptimalCompressionOptions, shouldCompress
} from './utils/compressor';

// Types
export type {
    DropZoneProps, FileListProps, FilePreviewProps, FileUploaderProps, FileWithPreview, ProgressBarProps, UploadResult, UseDropzoneOptions,
    UseDropzoneReturn, UseFileUploaderOptions,
    UseFileUploaderReturn, ValidationError
} from './types';

// Styles - users should import: import '@mq/file-uploader/styles.css'
import './styles/default.css';
