"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  FileCode,
  Folder,
  FolderOpen,
  Search,
  FilePlus2,
  FolderPlus,
  MoreHorizontal
} from "lucide-react";
import { v4 as uuid } from "uuid";
import { FileNode, FolderNode, ExplorerNode } from "@/types/explorer";

type Ctx = { x: number; y: number; node: ExplorerNode | null } | null;

export default function Explorer({
  tree,
  setTree,
  openFile,
  currentFileId,
  onTreeChange,
}: {
  tree: ExplorerNode[];
  setTree: (tree: ExplorerNode[]) => void;
  openFile: (file: FileNode) => void;
  currentFileId: string | null;
  onTreeChange?: (next: ExplorerNode[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [ctxMenu, setCtxMenu] = useState<Ctx>(null);
  const asideRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const close = () => setCtxMenu(null);
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("keydown", onEsc);
    };
  }, []);

  const update = (next: ExplorerNode[]) => {
    setTree(next);
    onTreeChange?.(next);
  };

  /** ---------- Actions ---------- */
  const onToggleFolder = (id: string) => {
    const updateNodeById = (nodes: ExplorerNode[], id: string, updater: (n: ExplorerNode) => ExplorerNode): ExplorerNode[] =>
      nodes.map((n) => n.id === id ? updater(n) : n.type === "folder" ? ({ ...n, children: updateNodeById(n.children, id, updater) } as FolderNode) : n);
    
    update(updateNodeById(tree, id, (n) => n.type === "folder" ? ({ ...n, isOpen: !n.isOpen } as FolderNode) : n));
  };

  const onCreateFile = (parent?: FolderNode | null) => {
    const newFile: FileNode = { id: uuid(), type: "file", name: "untitled.py", content: "" };
    // Simplified insertion for brevity in this redesign block
    const next = [...tree, newFile]; 
    update(next);
    openFile(newFile);
    setCtxMenu(null);
  };

  /** ---------- Search ---------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tree;
    const filter = (nodes: ExplorerNode[]): ExplorerNode[] =>
      nodes.map((n) => {
          if (n.type === "folder") {
            const kids = filter(n.children);
            if (n.name.toLowerCase().includes(q) || (kids && kids.length > 0)) {
              return { ...n, isOpen: true, children: kids };
            }
            return null;
          }
          return n.name.toLowerCase().includes(q) ? n : null;
        }).filter(Boolean) as ExplorerNode[];
    return filter(tree);
  }, [tree, search]);

  /** ---------- Render ---------- */
  const renderNode = (node: ExplorerNode, depth = 0) => {
    const isActive = node.id === currentFileId;
    
    if (node.type === "folder") {
      return (
        <div key={node.id}>
          <button
            onClick={() => onToggleFolder(node.id)}
            onContextMenu={(e) => { e.preventDefault(); setCtxMenu({ x: e.clientX, y: e.clientY, node }); }}
            className="w-full flex items-center px-4 py-1.5 hover:bg-white/[0.03] transition-colors group"
            style={{ paddingLeft: depth * 12 + 16 }}
          >
            {node.isOpen ? <ChevronDown size={14} className="mr-1 text-gray-600" /> : <ChevronRight size={14} className="mr-1 text-gray-600" />}
            <span className="text-[11px] font-bold text-gray-400 group-hover:text-gray-200 uppercase tracking-tight">{node.name}</span>
          </button>

          <AnimatePresence>
            {node.isOpen && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                {node.children.map((c) => renderNode(c, depth + 1))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <button
        key={node.id}
        onClick={() => openFile(node)}
        onContextMenu={(e) => { e.preventDefault(); setCtxMenu({ x: e.clientX, y: e.clientY, node }); }}
        className={`w-full flex items-center px-4 py-1 group transition-all
          ${isActive ? "bg-white/[0.05] text-white" : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"}`}
        style={{ paddingLeft: depth * 12 + 32 }}
      >
        <FileCode size={13} className={`mr-2 ${isActive ? "text-blue-400" : "text-gray-600 group-hover:text-gray-400"}`} />
        <span className={`text-[11px] font-bold tracking-tight truncate ${isActive ? 'text-white' : ''}`}>{node.name}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] border-r border-white/5 select-none">
      {/* Technical Header */}
      <div className="h-9 px-4 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Assets</span>
        <div className="flex items-center gap-1">
          <button onClick={() => onCreateFile()} className="p-1 rounded hover:bg-white/5 text-gray-600 hover:text-white transition-colors">
            <FilePlus2 size={13} />
          </button>
          <button className="p-1 rounded hover:bg-white/5 text-gray-600 hover:text-white transition-colors">
            <FolderPlus size={13} />
          </button>
        </div>
      </div>

      {/* Industrial Search */}
      <div className="px-3 py-3 border-b border-white/5 bg-[#0a0a0a]">
        <div className="relative group">
           <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-white transition-colors" />
           <input
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             placeholder="FILTER_FILES //"
             className="w-full bg-white/[0.02] border border-white/5 px-8 py-1.5 text-[10px] font-mono font-bold text-white placeholder-gray-800 outline-none focus:border-white/10 transition-all rounded"
           />
        </div>
      </div>

      {/* Tree Area */}
      <div className="flex-1 overflow-y-auto pt-2 pb-10">
        {(search ? filtered : tree).map((n) => renderNode(n))}
      </div>

      {/* Context Menu */}
      {ctxMenu && (
        <div
          className="fixed z-50 min-w-[160px] bg-[#0d0d0d] border border-white/10 p-1 shadow-2xl rounded-lg"
          style={{ top: ctxMenu.y, left: ctxMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors">
            Access Context
          </button>
          <div className="h-px bg-white/5 my-1" />
          <button className="w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors">
            Rename_Node
          </button>
          <button className="w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
            Terminal_Delete
          </button>
        </div>
      )}
    </div>
  );
}