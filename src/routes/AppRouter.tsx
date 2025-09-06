import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CharactersPage } from "../features/characters/pages/CharactersPage";
import { CharacterDetailPage } from "../features/characters/pages/CharacterDetailPage";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CharactersPage />}>
          <Route path="character/:id" element={<CharacterDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
