import { fetchData } from "../api/api";

export function mediaReducer(state: any, action: any) {
  let query: string = "",
    variables;

  switch (action.type) {
    case "SEARCH":
      query = `
            query ( $page: Int, $perPage: Int) {
              Page (page: $page, perPage: $perPage) {
                pageInfo {
                  total
                  currentPage
                  lastPage
                  hasNextPage
                  perPage
                }
                media( sort :SCORE_DESC, format : TV) {
                  id
                coverImage {
                   large
                   color
                 }
                 format
                 description
                 startDate {
                   year
                   month
                   day
                }
                 endDate {
                  year
                  month
                   day
                 }
                 tags {
                   name
                 }
                 relations {
                   nodes {
                     id
                   }
                  }
                  averageScore
                  title {
                    english
                    userPreferred
                  }
                }
              }
            }
            
            `;
      variables = {
        page: 1,
        perPage: 48,
      };
      return fetchData(query, variables);
    case "GET_GENRES":
      query = "{Media}";
      variables = {};
      return fetchData(query, variables);
    default:
      return state;
  }
}

export const getGenres = () => {
  const query = `
    {
        GenreCollection
     }
    `;
  return fetchData(query, {});
};

export const getTags = () => {
  const query = `
  { 
    MediaTagCollection (status :0) {
      name
    }
  }
    `;
  return fetchData(query, {});
};

export default mediaReducer;
