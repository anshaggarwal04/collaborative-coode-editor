
// src/types/explorer.ts
export type FileNode = {
    id: string;
    type: "file";
    name: string;
    content: string;
  };
  
  export type FolderNode = {
    id: string;
    type: "folder";
    name: string;
    isOpen: boolean;
    children: ExplorerNode[];
  };
  
  export type ExplorerNode = FileNode | FolderNode;