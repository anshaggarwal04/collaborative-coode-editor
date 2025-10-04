"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import type { Room } from "@/types";
import { AxiosError } from "axios";

interface RoomsResponse {
  rooms: Room[];
}

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/rooms/my"); // 🔹 make sure endpoint exists
      setRooms(res.data.rooms || []);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError<{ error?: string }>;
      const message =
        axiosError.response?.data?.error || axiosError.message || "Failed to load rooms";
      console.error("❌ useRooms error:", message);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { rooms, loading, error, fetchRooms };
}