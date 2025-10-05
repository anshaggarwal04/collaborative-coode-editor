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
  /** optional callback if you also persist to backend */
  onTreeChange?: (next: ExplorerNode[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [ctxMenu, setCtxMenu] = useState<Ctx>(null);
  const asideRef = useRef<HTMLDivElement | null>(null);

  /** Close context menu on click-away / ESC / scroll */
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

  /** ---------- Helpers (immutable) ---------- */

  const mapTree = (
    nodes: ExplorerNode[],
    fn: (n: ExplorerNode) => ExplorerNode
  ): ExplorerNode[] =>
    nodes.map((n) =>
      n.type === "folder"
        ? fn({ ...n, children: mapTree(n.children, fn) } as FolderNode)
        : fn(n)
    );

  const findNode = (
    nodes: ExplorerNode[],
    id: string
  ): ExplorerNode | undefined => {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.type === "folder") {
        const f = findNode(n.children, id);
        if (f) return f;
      }
    }
    return undefined;
  };

  const updateNodeById = (
    nodes: ExplorerNode[],
    id: string,
    updater: (n: ExplorerNode) => ExplorerNode
  ): ExplorerNode[] =>
    nodes.map((n) =>
      n.id === id
        ? updater(n)
        : n.type === "folder"
        ? ({ ...n, children: updateNodeById(n.children, id, updater) } as FolderNode)
        : n
    );

  const deleteNodeById = (nodes: ExplorerNode[], id: string): ExplorerNode[] =>
    nodes
      .filter((n) => n.id !== id)
      .map((n) =>
        n.type === "folder"
          ? ({ ...n, children: deleteNodeById(n.children, id) } as FolderNode)
          : n
      );

  const insertChild = (
    nodes: ExplorerNode[],
    parentId: string | null,
    child: ExplorerNode
  ): ExplorerNode[] => {
    if (!parentId) return [...nodes, child];
    return updateNodeById(nodes, parentId, (n) => {
      if (n.type !== "folder") return n;
      return { ...n, isOpen: true, children: [...n.children, child] };
    });
  };

  /** Build path like src/utils/file.ts */
  const buildPath = (nodes: ExplorerNode[], id: string): string | null => {
    const path: string[] = [];
    const dfs = (arr: ExplorerNode[], segs: string[]): boolean => {
      for (const n of arr) {
        const next = [...segs, n.name];
        if (n.id === id) {
          path.push(...next);
          return true;
        }
        if (n.type === "folder" && dfs(n.children, next)) return true;
      }
      return false;
    };
    const found = dfs(nodes, []);
    return found ? path.join("/") : null;
    // (We don’t prepend a leading slash to keep it IDE-like)
  };

  /** ---------- Actions ---------- */

  const onToggleFolder = (id: string) => {
    update(
      updateNodeById(tree, id, (n) =>
        n.type === "folder" ? ({ ...n, isOpen: !n.isOpen } as FolderNode) : n
      )
    );
  };

  const onCreateFile = (parent?: FolderNode | null) => {
    const newFile: FileNode = {
      id: uuid(),
      type: "file",
      name: "untitled.txt",
      content: "",
    };
    const next = insertChild(tree, parent?.id ?? null, newFile);
    update(next);
    openFile(newFile);
    setCtxMenu(null);
  };

  const onCreateFolder = (parent?: FolderNode | null) => {
    const newFolder: FolderNode = {
      id: uuid(),
      type: "folder",
      name: "NewFolder",
      isOpen: true,
      children: [],
    };
    update(insertChild(tree, parent?.id ?? null, newFolder));
    setCtxMenu(null);
  };

  const onRename = (node: ExplorerNode) => {
    const name = prompt("Rename to:", node.name);
    if (!name || name.trim() === node.name) return;
    update(
      updateNodeById(tree, node.id, (n) => ({ ...n, name: name.trim() }))
    );
    setCtxMenu(null);
  };

  const onDelete = (node: ExplorerNode) => {
    if (
      !confirm(
        `Delete “${node.name}”${node.type === "folder" ? " and its contents" : ""}?`
      )
    )
      return;
    update(deleteNodeById(tree, node.id));
    setCtxMenu(null);
  };

  const onCopyPath = async (node: ExplorerNode) => {
    const p = buildPath(tree, node.id);
    if (!p) return;
    try {
      await navigator.clipboard.writeText(p);
    } catch {}
    setCtxMenu(null);
  };

  /** ---------- Search ---------- */

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tree;
    const filter = (nodes: ExplorerNode[]): ExplorerNode[] =>
      nodes
        .map((n) => {
          if (n.type === "folder") {
            const kids = filter(n.children);
            if (
              n.name.toLowerCase().includes(q) ||
              (kids && kids.length > 0)
            ) {
              return { ...n, isOpen: true, children: kids };
            }
            return null;
          }
          return n.name.toLowerCase().includes(q) ? n : null;
        })
        .filter(Boolean) as ExplorerNode[];
    return filter(tree);
  }, [tree, search]);

  /** ---------- Render ---------- */

  const renderNode = (node: ExplorerNode, depth = 0) => {
    if (node.type === "folder") {
      return (
        <div key={node.id}>
          <motion.div
            whileHover={{ backgroundColor: "rgba(30,41,59,0.45)" }}
            className="flex items-center px-3 py-1 cursor-pointer select-none text-[13px] font-semibold text-gray-200 rounded-sm"
            style={{ paddingLeft: depth * 14 + 8 }}
            onClick={() => onToggleFolder(node.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              setCtxMenu({
                x: e.clientX,
                y: e.clientY,
                node,
              });
            }}
          >
            {node.isOpen ? (
              <ChevronDown size={14} className="mr-1 text-gray-400" />
            ) : (
              <ChevronRight size={14} className="mr-1 text-gray-400" />
            )}
            {node.isOpen ? (
              <FolderOpen size={14} className="mr-2 text-yellow-400" />
            ) : (
              <Folder size={14} className="mr-2 text-yellow-600" />
            )}
            <span>{node.name}</span>
          </motion.div>

          <AnimatePresence initial={false}>
            {node.isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {node.children.map((c) => renderNode(c, depth + 1))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <motion.div
        key={node.id}
        whileHover={{ backgroundColor: "rgba(30,41,59,0.35)" }}
        className={`flex items-center px-3 py-0.5 cursor-pointer select-none text-[12px] rounded-sm
          ${
            node.id === currentFileId
              ? "bg-[#1f2937]/80 text-blue-300 border-l-2 border-blue-500"
              : "text-gray-400"
          }`}
        style={{ paddingLeft: depth * 14 + 30 }}
        onClick={() => openFile(node)}
        onContextMenu={(e) => {
          e.preventDefault();
          setCtxMenu({ x: e.clientX, y: e.clientY, node });
        }}
      >
        <FileCode size={13} className="mr-2 text-gray-400" />
        <span className="truncate">{node.name}</span>
      </motion.div>
    );
  };

  return (
    <aside
      ref={asideRef}
      className="relative border-r border-[#1e293b] bg-[#0b0f16]/80 backdrop-blur-md h-full w-64 flex flex-col text-gray-300"
      onContextMenu={(e) => {
        // Right-click on blank explorer area
        if (e.target === asideRef.current) {
          e.preventDefault();
          setCtxMenu({ x: e.clientX, y: e.clientY, node: null });
        }
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1e293b]">
        <span className="text-[11px] uppercase tracking-wider text-gray-400">
          Explorer
        </span>
        <div className="flex items-center gap-2">
          <button
            title="New File"
            className="p-1 rounded hover:bg-white/5"
            onClick={() => onCreateFile(null)}
          >
            <FilePlus2 size={14} className="text-blue-300" />
          </button>
          <button
            title="New Folder"
            className="p-1 rounded hover:bg-white/5"
            onClick={() => onCreateFolder(null)}
          >
            <FolderPlus size={14} className="text-yellow-300" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative px-3 py-2">
        <Search
          size={14}
          className="absolute left-5 top-[50%] -translate-y-1/2 text-gray-500"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search files…"
          className="w-full pl-8 pr-3 py-1.5 rounded-md text-xs bg-[#111827]/60 border border-[#1e293b] text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
        />
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto px-1 pb-2">
        {(search ? filtered : tree).map((n) => renderNode(n))}
      </div>

      {/* Context Menu */}
      {ctxMenu && (
        <ul
          className="absolute z-50 min-w-[180px] rounded-md overflow-hidden border border-[#1f2937] bg-[#111827]/95 text-sm shadow-xl backdrop-blur"
          style={{ top: ctxMenu.y, left: ctxMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* When right-clicking a File */}
          {ctxMenu.node?.type === "file" && (
            <>
              <MenuItem onClick={() => openFile(ctxMenu.node as FileNode)}>
                Open
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => onRename(ctxMenu.node!)}>Rename</MenuItem>
              <MenuItem danger onClick={() => onDelete(ctxMenu.node!)}>
                Delete
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => onCopyPath(ctxMenu.node!)}>
                Copy Path
              </MenuItem>
            </>
          )}

          {/* When right-clicking a Folder */}
          {ctxMenu.node?.type === "folder" && (
            <>
              <MenuItem onClick={() => onCreateFile(ctxMenu.node as FolderNode)}>
                New File
              </MenuItem>
              <MenuItem onClick={() => onCreateFolder(ctxMenu.node as FolderNode)}>
                New Folder
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => onRename(ctxMenu.node!)}>Rename</MenuItem>
              <MenuItem danger onClick={() => onDelete(ctxMenu.node!)}>
                Delete
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => onCopyPath(ctxMenu.node!)}>
                Copy Path
              </MenuItem>
            </>
          )}

          {/* Right-clicking on empty whitespace */}
          {!ctxMenu.node && (
            <>
              <MenuItem onClick={() => onCreateFile(null)}>New File</MenuItem>
              <MenuItem onClick={() => onCreateFolder(null)}>
                New Folder
              </MenuItem>
            </>
          )}
        </ul>
      )}
    </aside>
  );
}

/** ---------- Small Menu Components ---------- */

function MenuItem({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <li
      onClick={onClick}
      className={`px-3 py-2 cursor-pointer select-none hover:bg-white/5 ${
        danger ? "text-red-400 hover:bg-red-500/10" : "text-gray-200"
      }`}
    >
      {children}
    </li>
  );
}

function Divider() {
  return <li className="h-px bg-[#1f2937]" />;
}