import { createContext } from "react";

export type Comment = {
  id: string;
  characterId: string;
  text: string;
  createdAt: string; // ISO string
};

export type CommentsContextType = {
  comments: Comment[];
  addComment: (characterId: string, text: string) => void;
};

export const CommentsContext = createContext<CommentsContextType>({
  comments: [],
  addComment: () => {},
});
