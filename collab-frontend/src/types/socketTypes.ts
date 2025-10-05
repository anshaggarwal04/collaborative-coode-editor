// ---------------- Shared Socket Types ----------------

// Represents result of executed code (Judge0-like API)
export interface CodeResult {
    stdout?: string;
    stderr?: string;
    compile_output?: string;
  }
  
  // Represents a file in the collaborative explorer
  export interface FileData {
    id: string;
    name: string;
    content: string;
  }
  
  // Server → Client events
  export interface ServerToClientEvents {
    roomState: (state: FileData[]) => void;
    fileCreated: (file: FileData) => void;
    fileDeleted: (id: string) => void;
    fileUpdated: (data: { id: string; content: string }) => void;
    codeResult: (result: CodeResult) => void;
  }
  
  // Client → Server events
  export interface ClientToServerEvents {
    joinRoom: (data: { roomId: string }) => void;
    leaveRoom: (data: { roomId: string }) => void;
    codeChange: (data: { roomId: string; code: string }) => void;
    runCode: (data: {
      roomId: string;
      language_id: number;
      source_code: string;
    }) => void;
  }