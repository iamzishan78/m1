
import axios from 'axios';
import { print } from 'graphql';

const fetch = (query, variables) => {
    return axios.post('http://localhost:7071/api/m1graph', {
        query: print(query),
        variables: variables,
      }).catch(error => {
        return this.failedResponse(error);
      });
}

class API {
    testSaga = (query, variables) => {
    return fetch(query, variables);
  };
}

export default new API();
