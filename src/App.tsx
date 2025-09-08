import "./App.css";

import {} from "@apollo/client";
import { client } from "./api/client";
import { ApolloProvider } from "@apollo/client/react";
import { AppRouter } from "./routes/AppRouter";
import { FavoritesProvider } from "./features/characters/context/FavoritesProvider";
import { CommentsProvider } from "./features/characters/context/CommentsProvider";
import { FiltersProvider } from "./features/characters/context/FiltersProvider";

function App() {
  return (
    <ApolloProvider client={client}>
      <FavoritesProvider>
        <CommentsProvider>
          <FiltersProvider>
            <AppRouter />
          </FiltersProvider>
        </CommentsProvider>
      </FavoritesProvider>
    </ApolloProvider>
  );
}

export default App;
