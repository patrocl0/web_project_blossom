import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CharactersPage } from "../features/characters/pages/CharactersPage";
import { CharacterDetailPage } from "../features/characters/pages/CharacterDetailPage";
import { FiltersPage } from "../features/characters/pages/FiltersPage";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CharactersPage />}>
          <Route path="character/:id" element={<CharacterDetailPage />} />
          <Route path="/filters" element={<FiltersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
