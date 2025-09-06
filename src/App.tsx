import "./App.css";

import {} from "@apollo/client";
import { client } from "./api/client";
import { ApolloProvider } from "@apollo/client/react";
import { AppRouter } from "./routes/AppRouter";

function App() {
  return (
    <ApolloProvider client={client}>
      <AppRouter />
    </ApolloProvider>
  );
}

export default App;
