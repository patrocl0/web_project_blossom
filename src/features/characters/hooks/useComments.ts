import { useContext } from "react";
import { CommentsContext } from "../context/CommentsContext";

export const useComments = () => {
  return useContext(CommentsContext);
};
