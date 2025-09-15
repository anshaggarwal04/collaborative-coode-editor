// src/types/index.d.ts
export interface Room {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  user?: {
    id: string;
    username: string;
  };
}