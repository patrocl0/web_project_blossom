import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { Character } from "../../../interfaces/Character.interface";
import { useParams } from "react-router-dom";

interface GetCharacterDetailResponse {
  character: Character;
}

const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      species
      status
      image
      gender
      origin {
        name
      }
    }
  }
`;

export function useCharacterDetail() {
  const { id } = useParams();

  const { data, loading, error } = useQuery<GetCharacterDetailResponse>(
    GET_CHARACTER,
    {
      variables: { id },
    }
  );

  return {
    character: data?.character,
    loading,
    error,
  };
}
