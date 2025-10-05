"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { File, FolderPlus, FilePlus, Trash2 } from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  content: string;
}

interface Props {
  files: FileItem[];
  activeFileId: string | null;
  onOpen: (file: FileItem) => void;
  onCreate: (name: string) => void;
  onDelete: (id: string) => void;
}

export default function FileExplorer({ files, activeFileId, onOpen, onCreate, onDelete }: Props) {
  const [newFile, setNewFile] = useState("");

  return (
    <div className="border-r border-white/10 bg-[#0d1117]/70 backdrop-blur-sm flex flex-col">
      <div className="px-4 py-3 flex items-center justify-between text-xs uppercase tracking-wider text-gray-400 border-b border-white/5">
        <span>Explorer</span>
        <button
          onClick={() => {
            if (!newFile.trim()) return;
            onCreate(newFile.trim());
            setNewFile("");
          }}
          className="text-gray-400 hover:text-white transition"
          title="Add file"
        >
          <FilePlus size={14} />
        </button>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 text-sm space-y-1">
        {files.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onOpen(f)}
            className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition
              ${activeFileId === f.id ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5"}`}
          >
            <div className="flex items-center gap-2 truncate">
              <File size={14} className="text-gray-400" />
              <span className="truncate">{f.name}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(f.id);
              }}
              className="text-gray-400 hover:text-red-400 transition"
            >
              <Trash2 size={12} />
            </button>
          </motion.div>
        ))}

        {/* Input to create new file */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="newFile.js"
            value={newFile}
            onChange={(e) => setNewFile(e.target.value)}
            className="w-full px-2 py-1 rounded bg-[#111317] border border-white/10 text-gray-300 text-xs"
          />
        </div>
      </div>
    </div>
  );
}