import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { Character } from "../../../interfaces/Character.interface";

interface GetCharactersResponse {
  characters: {
    results: Character[];
  };
}

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $name: String) {
    characters(page: $page, filter: { name: $name }) {
      results {
        id
        name
        image
        species
        status
      }
    }
  }
`;

export function useCharacters(page: number, name: string) {
  const { data, loading, error } = useQuery<GetCharactersResponse>(
    GET_CHARACTERS,
    {
      variables: { page, name },
    }
  );

  return {
    characters: data?.characters.results || [],
    loading,
    error,
  };
}
