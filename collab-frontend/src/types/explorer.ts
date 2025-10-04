// src/types/explorer.ts
export type FileNode = {
    id: string;
    name: string;
    type: "file";
    content: string;
  };
  
  export type FolderNode = {
    id: string;
    name: string;
    type: "folder";
    children: (FileNode | FolderNode)[];
    isOpen?: boolean;
  };
  
  export type ExplorerNode = FileNode | FolderNode;