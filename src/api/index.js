import axios from "axios";
import { print } from "graphql";

class API {
  failedResponse = (error) => {
    const data =
      error.response && error.response.data ? error.response.data : {};
    return Promise.reject(data);
  };

  fetch = (query, variables) => {
    return axios
      .post("http://localhost:7071/api/m1graph", {
        query: print(query),
        variables: variables,
      })
      .catch((error) => {
        return this.failedResponse(error);
      });
  };
}

export default new API();
