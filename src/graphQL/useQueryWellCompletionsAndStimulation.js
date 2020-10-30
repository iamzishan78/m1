import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

export function useQueryWellCompletions(id) {
    const QUERY = gql`query {
        wellCompletions(wellID:"${id}")
      }`
    const { data,loading, error} = useQuery(QUERY);
    return {data, loading, error}
}

export function useQueryWellStimulation(id) {
    const QUERY = gql`query {
      wellStimulation(wellID:"${id}")
    }`
    const { data,loading, error} = useQuery(QUERY);
    return {data, loading, error}
  }

  
export function useQueryWellFormation(id) {
  const QUERY = gql`query {
    wellFormation(wellID:"${id}")
  }`
  const { data,loading, error} = useQuery(QUERY);
  return {data, loading, error}
}