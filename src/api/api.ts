import axios from "axios";

export const fetchData = async (query: string, variables: any) => {
  const url = "https://graphql.anilist.co",
    options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };

  const response = await fetch(url, options);
  const data = await response.json();
  return data.data;
};
