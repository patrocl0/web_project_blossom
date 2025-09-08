import { useState, useEffect } from "react";
import { CommentsContext, type Comment } from "./CommentsContext";

export const CommentsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [comments, setComments] = useState<Comment[]>(() => {
    const stored = localStorage.getItem("comments");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  const addComment = (characterId: string, text: string) => {
    const newComment: Comment = {
      id: crypto.randomUUID(),
      characterId,
      text,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
  };

  return (
    <CommentsContext.Provider value={{ comments, addComment }}>
      {children}
    </CommentsContext.Provider>
  );
};
