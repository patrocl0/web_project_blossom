import "./App.css";

import {} from "@apollo/client";
import { client } from "./api/client";
import { ApolloProvider } from "@apollo/client/react";
import { AppRouter } from "./routes/AppRouter";
import { FavoritesProvider } from "./features/characters/context/FavoritesProvider";

function App() {
  return (
    <ApolloProvider client={client}>
      <FavoritesProvider>
        <AppRouter />
      </FavoritesProvider>
    </ApolloProvider>
  );
}

export default App;
