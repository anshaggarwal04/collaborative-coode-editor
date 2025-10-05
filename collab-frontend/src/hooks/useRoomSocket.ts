"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket, initSocket } from "@/lib/socket";
import { AxiosError } from "axios";

interface UseRoomSocketProps {
  roomId: string;
}

export function useRoomSocket({ roomId }: UseRoomSocketProps) {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("⚡ Run your code to see output...");
  const [connected, setConnected] = useState(false);
  const latestCodeRef = useRef(code);

  // keep latest code synced in ref
  useEffect(() => {
    latestCodeRef.current = code;
  }, [code]);

  // initialize socket & listeners
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = initSocket(token);

    socket.emit("joinRoom", { roomId });
    setConnected(true);

    socket.on("roomHistory", (history) => {
      const last = [...history].reverse().find((h: any) => h.event === "codeChange");
      if (last?.payload) setCode(last.payload);
    });

    socket.on("codeUpdate", (incoming: string) => {
      if (incoming !== latestCodeRef.current) setCode(incoming);
    });

    socket.on("codeResult", (result) => {
      let out = "";
      if (result.stdout) out += result.stdout;
      if (result.stderr) out += (out ? "\n" : "") + `‼️ Error:\n${result.stderr}`;
      if (result.compile_output)
        out += (out ? "\n" : "") + `ℹ️ Compile Output:\n${result.compile_output}`;
      setOutput(out || "No output.");
    });

    socket.on("disconnect", () => setConnected(false));

    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.off();
    };
  }, [roomId]);

  // function to send code
  const sendCode = (newCode: string) => {
    try {
      const socket = getSocket();
      socket.emit("codeChange", { roomId, code: newCode });
    } catch (err) {
      console.error("Socket not connected:", err);
    }
  };

  // function to run code
  const runCode = (language_id: number) => {
    try {
      const s = getSocket();
      setOutput("⏳ Running…");
      s.emit("runCode", {
        roomId,
        language_id,
        source_code: latestCodeRef.current,
        stdin: "",
      });
    } catch {
      setOutput("Socket not connected.");
    }
  };

  return { code, setCode, output, setOutput, sendCode, runCode, connected };
}