import { useState } from "react";
import { useComments } from "../hooks/useComments";

export const CommentBox = ({ characterId }: { characterId: string }) => {
  const { comments, addComment } = useComments();
  const [text, setText] = useState("");

  const characterComments = comments.filter(
    (c) => c.characterId === characterId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === "") return;
    addComment(characterId, text.trim());
    setText("");
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Comentarios</h3>
      <form onSubmit={handleSubmit} className="flex gap-4 flex-col md:flex-row">
        <textarea
          name=""
          id=""
          value={text}
          placeholder="Escribe un comentario..."
          onChange={(e) => setText(e.target.value)}
          className="flex-1  rounded-lg px-3 py-2"
        ></textarea>
        <button
          type="submit"
          className="bg-[#8054C7] text-white px-4 py-2 rounded-lg"
        >
          Guardar
        </button>
      </form>

      <ul className="mt-4 space-y-2">
        {characterComments.map((c) => (
          <li key={c.id} className="p-2 ">
            <p className="text-sm">{c.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
