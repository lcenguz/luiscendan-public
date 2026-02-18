export interface Folder {
    id: string;
    name: string;
    description?: string;
    parentId?: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    color?: string;
    icon?: string;
}

export interface FolderTree extends Folder {
    children: FolderTree[];
    files: string[];
}
