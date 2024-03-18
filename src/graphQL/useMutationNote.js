import { gql } from '@apollo/client';
export const CREATE_NOTE = gql`
  mutation createNote($content: NotesInput!) {
    createNote(content: $content) {
      _id
      description
      userId
    }
  }
`;