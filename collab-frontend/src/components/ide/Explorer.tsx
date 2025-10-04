"use client";

import { useState } from "react";
import { FileNode, FolderNode, ExplorerNode } from "@/types/explorer";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
} from "lucide-react";
import { v4 as uuid } from "uuid";

export default function Explorer({
  tree,
  openFile,
  currentFileId,
  setTree,
}: {
  tree: ExplorerNode[];
  openFile: (file: FileNode) => void;
  currentFileId: string | null;
  setTree: (tree: ExplorerNode[]) => void;
}) {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    node: ExplorerNode | null;
  } | null>(null);

  const toggleFolder = (id: string) => {
    const toggle = (arr: ExplorerNode[]): ExplorerNode[] =>
      arr.map((n) => {
        if (n.type === "folder") {
          if (n.id === id) return { ...n, isOpen: !n.isOpen };
          return { ...n, children: toggle(n.children) };
        }
        return n;
      });
    setTree(toggle(tree));
  };

  const handleContextMenu = (
    e: React.MouseEvent,
    node: ExplorerNode | null
  ) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, node });
  };

  // Context actions
  const addFile = (parent?: FolderNode) => {
    const newFile: FileNode = {
      id: uuid(),
      name: "untitled.py",
      type: "file",
      content: "",
    };
    if (!parent) setTree([...tree, newFile]);
    else parent.children.push(newFile);
    setTree([...tree]);
    setContextMenu(null);
  };

  const addFolder = (parent?: FolderNode) => {
    const newFolder: FolderNode = {
      id: uuid(),
      name: "NewFolder",
      type: "folder",
      children: [],
      isOpen: true,
    };
    if (!parent) setTree([...tree, newFolder]);
    else parent.children.push(newFolder);
    setTree([...tree]);
    setContextMenu(null);
  };

  const deleteNode = (id: string, nodes = tree): ExplorerNode[] => {
    return nodes
      .filter((n) => n.id !== id)
      .map((n) =>
        n.type === "folder"
          ? { ...n, children: deleteNode(id, n.children) }
          : n
      );
  };

  const renameNode = (node: ExplorerNode) => {
    const newName = prompt("Enter new name:", node.name);
    if (!newName) return;
    const update = (nodes: ExplorerNode[]): ExplorerNode[] =>
      nodes.map((n) =>
        n.id === node.id ? { ...n, name: newName } : n.type === "folder"
        ? { ...n, children: update(n.children) }
        : n
      );
    setTree(update(tree));
    setContextMenu(null);
  };

  const renderNode = (node: ExplorerNode, depth = 0) => {
    if (node.type === "folder") {
      return (
        <div key={node.id}>
          <div
            className="flex items-center px-3 py-1 cursor-pointer hover:bg-[#1a1f26] text-sm"
            style={{ paddingLeft: depth * 12 + 8 }}
            onClick={() => toggleFolder(node.id)}
            onContextMenu={(e) => handleContextMenu(e, node)}
          >
            {node.isOpen ? (
              <ChevronDown size={14} className="mr-1 text-gray-400" />
            ) : (
              <ChevronRight size={14} className="mr-1 text-gray-400" />
            )}
            {node.isOpen ? (
              <FolderOpen size={14} className="mr-2 text-yellow-500" />
            ) : (
              <Folder size={14} className="mr-2 text-yellow-600" />
            )}
            <span>{node.name}</span>
          </div>
          {node.isOpen && (
            <div>{node.children.map((c) => renderNode(c, depth + 1))}</div>
          )}
        </div>
      );
    }
    return (
      <div
        key={node.id}
        className={`flex items-center px-3 py-1 cursor-pointer hover:bg-[#1a1f26] text-sm ${
          node.id === currentFileId
            ? "bg-[#1f2937] text-blue-300"
            : "text-gray-300"
        }`}
        style={{ paddingLeft: depth * 12 + 28 }}
        onClick={() => openFile(node)}
        onContextMenu={(e) => handleContextMenu(e, node)}
      >
        <File size={14} className="mr-2 text-gray-400" />
        <span>{node.name}</span>
      </div>
    );
  };

  return (
    <aside
      className="border-r border-[#1c2430] bg-[#0e131a]/70 backdrop-blur-sm h-full overflow-y-auto w-60"
      onContextMenu={(e) => handleContextMenu(e, null)}
    >
      <div className="px-4 py-2 text-[11px] tracking-wider text-gray-400 border-b border-[#1c2430]">
        EXPLORER
      </div>
      <div className="mt-2">{tree.map((n) => renderNode(n))}</div>

      {/* Context Menu */}
      {contextMenu && (
        <ul
          className="absolute bg-[#2a2f38] text-white rounded shadow-lg text-xs py-1 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <li
            className="px-3 py-1 hover:bg-blue-600 cursor-pointer"
            onClick={() =>
              addFile(
                contextMenu.node?.type === "folder"
                  ? (contextMenu.node as FolderNode)
                  : undefined
              )
            }
          >
            New File
          </li>
          <li
            className="px-3 py-1 hover:bg-blue-600 cursor-pointer"
            onClick={() =>
              addFolder(
                contextMenu.node?.type === "folder"
                  ? (contextMenu.node as FolderNode)
                  : undefined
              )
            }
          >
            New Folder
          </li>
          {contextMenu.node && (
            <>
              <li
                className="px-3 py-1 hover:bg-yellow-600 cursor-pointer"
                onClick={() => renameNode(contextMenu.node!)}
              >
                Rename
              </li>
              <li
                className="px-3 py-1 hover:bg-red-600 cursor-pointer"
                onClick={() =>
                  setTree(deleteNode(contextMenu.node!.id, tree))
                }
              >
                Delete
              </li>
            </>
          )}
        </ul>
      )}
    </aside>
  );
}