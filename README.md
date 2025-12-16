# mq-file-uploader

> 📁 The easiest way to add file uploads to your React app

A simple, beautiful file uploader that just works. Drag files, click to upload, see progress - all in one tiny package (~7KB).

## ✨ What You Get

- **Drag & Drop** - Just drag files onto the upload area
- **Click to Upload** - Or click to open file picker
- **See Progress** - Watch your files upload in real-time
- **Image Previews** - Automatic thumbnails for images
- **Validation** - Limit file types, sizes, and counts
- **Beautiful UI** - Works great out of the box

---

## 📦 Install

```bash
npm install @mq/file-uploader
```

---

## 🚀 Use It (2 Steps)

### Step 1: Import

```tsx
import { FileUploader } from '@mq/file-uploader';
import '@mq/file-uploader/styles.css';
```

### Step 2: Add to Your App

```tsx
function App() {
  return (
    <FileUploader
      uploadUrl="/api/upload"
      onComplete={(results) => {
        console.log('Files uploaded!', results);
      }}
    />
  );
}
```

**That's it!** You now have a fully working file uploader. 🎉

---

## 📋 All Available Options

### FileUploader Component

```tsx
<FileUploader
  uploadUrl="/api/upload"              // Where to send files
  accept={['image/*', 'application/pdf']}  // Allowed file types
  maxFiles={5}                         // Max files allowed
  maxSize={10 * 1024 * 1024}          // Max size in bytes
  showPreview={true}                   // Show image thumbnails
  showProgress={true}                  // Show progress bar
  disabled={false}                     // Disable the uploader
  className=""                         // Custom CSS class
  onComplete={(results) => {}}         // Called when uploads finish
  onError={(error) => {}}              // Called on error
>
  {/* Optional: Custom content */}
</FileUploader>
```

### useFileUploader Hook

```tsx
const uploader = useFileUploader({
  uploadUrl: '/api/upload',            // Where to send files
  accept: ['image/*'],                 // Allowed file types
  maxFiles: 5,                         // Max files allowed
  maxSize: 10 * 1024 * 1024,          // Max size in bytes
  headers: { Authorization: 'Bearer token' }, // Custom headers
  fieldName: 'file',                   // Form field name
  onUploadComplete: (result) => {},    // Called per file
  onProgress: (id, progress) => {},    // Called on progress
  onError: (error) => {},              // Called on error
});

// What you get back:
uploader.files           // FileWithPreview[] - Current files
uploader.addFiles(files) // Add files to queue
uploader.removeFile(id)  // Remove a file
uploader.upload()        // Start uploading (returns Promise)
uploader.uploadProgress  // Record<string, number> - Progress per file
uploader.isUploading     // boolean
uploader.errors          // ValidationError[]
uploader.clearErrors()   // Clear all errors
uploader.reset()         // Reset everything
```

### DropZone Component

```tsx
<DropZone
  onFiles={(files) => {}}              // Called when files dropped
  accept={['image/*']}                 // Allowed file types
  disabled={false}                     // Disable the zone
  className=""                         // Custom CSS class
>
  {/* Optional: Custom content */}
</DropZone>
```

### FileList Component

```tsx
<FileList
  files={uploader.files}               // Files to display
  onRemove={(id) => {}}                // Called on remove click
  showPreview={true}                   // Show thumbnails
  showProgress={true}                  // Show progress bars
  className=""                         // Custom CSS class
/>
```

### ProgressBar Component

```tsx
<ProgressBar
  value={50}                           // Progress 0-100
  status="uploading"                   // pending | uploading | success | error
  showText={true}                      // Show percentage
  className=""                         // Custom CSS class
/>
```

---

## 📝 TypeScript Types

### FileWithPreview

```tsx
interface FileWithPreview {
  id: string;              // Unique file ID
  file: File;              // Original File object
  preview: string | null;  // Blob URL for images/videos
  progress: number;        // 0-100
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;          // Error message if failed
}
```

### UploadResult

```tsx
interface UploadResult {
  id: string;           // File ID
  success: boolean;     // Did it work?
  response?: unknown;   // Server response
  error?: string;       // Error message if failed
}
```

### ValidationError

```tsx
interface ValidationError {
  file: File;                       // The rejected file
  type: 'type' | 'size' | 'count';  // What failed
  message: string;                  // Human-readable message
}
```

---

## 🔧 Utility Functions

### Validation

```tsx
import { validateFile, validateFiles, formatFileSize, isImageFile, isVideoFile } from '@mq/file-uploader';

// Validate single file
const error = validateFile(file, { accept: ['image/*'], maxSize: 5000000 });

// Validate multiple files
const { valid, errors } = validateFiles(files, existingCount, {
  accept: ['image/*'],
  maxSize: 5000000,
  maxFiles: 10,
});

// Format bytes to readable string
formatFileSize(1048576); // "1 MB"

// Check file type
isImageFile(file); // true for image/*
isVideoFile(file); // true for video/*
```

### Image Compression

```tsx
import { compressImage, shouldCompress } from '@mq/file-uploader';

// Check if compression needed
if (shouldCompress(file, 500 * 1024)) { // > 500KB
  const result = await compressImage(file, {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
  });

  console.log(`Compressed to ${(result.compressionRatio * 100).toFixed(0)}%`);
}
```

### Chunked Upload

```tsx
import { uploadFileChunked, shouldUseChunkedUpload } from '@mq/file-uploader';

if (shouldUseChunkedUpload(file, 5 * 1024 * 1024)) { // > 5MB
  await uploadFileChunked({
    url: '/api/upload',
    file,
    chunkSize: 1024 * 1024, // 1MB chunks
    onProgress: (progress) => console.log(progress + '%'),
    onChunkComplete: (index, total) => console.log(`Chunk ${index}/${total}`),
  });
}
```

### Axios Upload (Optional)

```tsx
import axios from 'axios';
import { uploadWithAxios } from '@mq/file-uploader';

await uploadWithAxios(axios, {
  url: '/api/upload',
  file,
  headers: { Authorization: 'Bearer token' },
  onProgress: (progress) => console.log(progress + '%'),
});
```

---

## 🎨 Styling

### CSS Variables

```css
:root {
  --mq-primary: #6366f1;      /* Primary color */
  --mq-success: #22c55e;      /* Success color */
  --mq-error: #ef4444;        /* Error color */
  --mq-gray-100: #f3f4f6;
  --mq-gray-200: #e5e7eb;
  --mq-gray-400: #9ca3af;
  --mq-gray-500: #6b7280;
  --mq-gray-700: #374151;
  --mq-border-radius: 8px;
}
```

### Dark Mode

```css
.dark {
  --mq-gray-100: #1f2937;
  --mq-gray-200: #374151;
  --mq-gray-700: #f9fafb;
}
```

---

## 🔌 Server Examples

### Express.js

```js
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ success: true, file: req.file });
});
```

### Next.js

```ts
// app/api/upload/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  // Save file...
  return Response.json({ success: true });
}
```

---

## 📝 License

MIT

---

Made with ❤️ by [Mahmud Qudrati](https://github.com/mahmudqudrati)
