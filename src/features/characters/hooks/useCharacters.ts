import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { Character } from "../../../interfaces/Character.interface";
import type { Filters } from "../../../interfaces/Filters.interface";

interface GetCharactersResponse {
  characters: {
    results: Character[];
  };
}

const GET_CHARACTERS = gql`
  query GetCharacters(
    $page: Int
    $name: String
    $status: String
    $species: String
    $gender: String
  ) {
    characters(
      page: $page
      filter: {
        name: $name
        status: $status
        species: $species
        gender: $gender
      }
    ) {
      results {
        id
        name
        image
        species
        status
        gender
      }
    }
  }
`;

export function useCharacters(page: number, filters: Filters) {
  const { data, loading, error } = useQuery<GetCharactersResponse>(
    GET_CHARACTERS,
    {
      variables: {
        page,
        name: filters.name || "",
        status:
          filters.status && filters.status !== "All"
            ? filters.status.toLowerCase()
            : undefined,
        species:
          filters.species && filters.species !== "All"
            ? filters.species
            : undefined,
        gender:
          filters.gender && filters.gender !== "All"
            ? filters.gender.toLowerCase()
            : undefined,
      },
    }
  );

  console.log(filters);

  return {
    characters: data?.characters.results || [],
    loading,
    error,
  };
}
