export interface FileVersion {
    id: string;
    fileId: string;
    version: number;
    displayName: string;
    description: string;
    tags: string[];
    createdAt: string;
    createdBy: string;
    createdByName: string;
    changeDescription: string; // Descripción de qué cambió
    metadata: Record<string, any>;
}

export interface VersionMetadata {
    displayName?: string;
    description?: string;
    tags?: string[];
    [key: string]: any;
}
