"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import type { Room } from "@/types";
import { AxiosError } from "axios";

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/rooms");
      setRooms(res.data.rooms || []);
    }catch (err) {
        const error = err as Error;
        console.error(error);
        toast.error("Failed to load rooms");
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return { rooms, loading, fetchRooms };
}