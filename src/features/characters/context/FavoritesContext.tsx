import { createContext } from "react";

export type FavoritesContextType = {
  favorites: string[];
  toggleFavorite: (id: string) => void;
};

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
});
