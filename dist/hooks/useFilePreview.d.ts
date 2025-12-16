interface PreviewState {
    [id: string]: string | null;
}
/**
 * Hook for generating file previews (images/videos)
 */
export declare function useFilePreview(): {
    previews: PreviewState;
    generatePreview: (id: string, file: File) => Promise<string | null>;
    generatePreviews: (files: {
        id: string;
        file: File;
    }[]) => Promise<void>;
    removePreview: (id: string) => void;
    clearPreviews: () => void;
    getPreview: (id: string) => string | null;
};
export {};
