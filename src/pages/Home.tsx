import React, { useEffect, useState, useReducer } from "react";
import "./Home.scss";
import Grid from "../components/Grid";
import Filter from "../components/Filter";
import { fetchData } from "../api/api";
import { FilterSchema } from "../services/dbEntity";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags, faXmark, faSort } from "@fortawesome/free-solid-svg-icons";

const query = `
query ( $perPage: Int, $formats : [MediaFormat], $genres : [String],$tags : [String], $sort : [MediaSort], $search :String, $yearStart : FuzzyDateInt, $yearEnd : FuzzyDateInt ) {
  Page (page: 1, perPage: $perPage) {
    media( sort : $sort, format_in : $formats, genre_in : $genres,tag_in :$tags, search : $search, startDate_greater : $yearStart, startDate_lesser : $yearEnd) {
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

const FormatMap = {
  TV: "TV Show",
  TV_SHORT: "TV Short",
  MOVIE: "Movie",
  MANGA: "Manga",
  NOVEL: "Novel",
  OVA: "OVA",
  ONA: "ONA",
};

const SortMap = {
  POPULARITY_DESC: "Popularity",
  SCORE_DESC: "Avg Score",
  UPDATED_AT_DESC: "Update Date",
  START_DATE_DESC: "Release Date",
};

const getKeyByValue = (object: any, value: any) => {
  const keys = Object.keys(object);
  return keys.find((key) => {
    if (object[key] === value) return key;
  });
};

const filterReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SORT":
      return { ...state, sort: action.payload };
    case "FORMAT":
      return { ...state, format: action.payload || [] };
    case "TAG":
      return { ...state, tag: action.payload || [] };
    case "GENRE":
      return { ...state, genre: action.payload || [] };
    case "RANGE": {
      let { year, ...rest } = state;
      return {
        ...rest,
        after: action.payload.after,
        before: action.payload.before,
      };
    }
    case "RANGE_REMOVE": {
      let { year, after, before, ...rest } = state;
      return rest;
    }
    case "YEAR": {
      let { after, before, ...rest } = state;
      return { ...rest, year: action.payload };
    }
    case "YEAR_REMOVE": {
      let { after, before, year, ...rest } = state;
      return rest;
    }
    case "CLEAR": {
      return {
        tag: [],
        format: [],
        genre: [],
        sort: state.sort,
      };
    }
    default:
      return state;
  }
};

export default function Home() {
  const [mediaList, setMediaList] = useState<any>([]);

  const [tags, setTags] = useState<string[]>([]);
  const [filter, dispatch] = useReducer<
    (state: FilterSchema, action: any) => FilterSchema
  >(filterReducer, {
    tag: [],
    format: [],
    genre: [],
    sort: "Popularity",
  });
  const [showSort, setShowSort] = useState(false);

  const [perPage, setPerPage] = useState(60);

  const fetchList = async () => {
    let variables: { [key: string]: string | string[] | number } = {
      perPage: perPage,
      sort: getKeyByValue(SortMap, filter.sort) || "SCORE_DESC",
    };

    if (filter.format.length > 0) {
      variables["formats"] = filter.format.map((e) => {
        let res = getKeyByValue(FormatMap, e) || "";
        console.log(res);
        return res;
      });
    }
    if (filter.genre.length > 0) {
      variables["genres"] = filter.genre;
    }
    if (filter.tag.length > 0) {
      variables["tags"] = filter.tag;
    }
    if ("year" in filter) {
      variables["yearStart"] = Number(filter.year) * 10000 || 19700000;
      variables["yearEnd"] = (Number(filter.year) + 1) * 10000 || 20220000;
    }
    if ("before" in filter && "after" in filter) {
      variables["yearStart"] = Number(filter.after) * 10000 || 19700000;
      variables["yearEnd"] = Number(filter.before) * 10000 || 20220000;
    }

    let res = await fetchData(query, variables);
    setMediaList(res?.Page?.media ?? []);
  };

  const handleSort = (e: any) => {
    setShowSort(false);
    dispatch({ type: "SORT", payload: e.target.dataset.id });
  };

  const removeTag = (e: any) => {
    if (filter.genre.includes(e.target.dataset.content)) {
      dispatch({
        type: "GENRE",
        payload: filter.genre.filter((f) => f !== e.target.dataset.content),
      });
    } else if (filter.format.includes(e.target.dataset.content)) {
      dispatch({
        type: "FORMAT",
        payload: filter.format.filter((f) => f !== e.target.dataset.content),
      });
    } else if (filter.tag.includes(e.target.dataset.content)) {
      dispatch({
        type: "TAG",
        payload: filter.tag.filter((f) => f !== e.target.dataset.content),
      });
    } else if (filter.year === e.target.dataset.content) {
      dispatch({ type: "YEAR_REMOVE" });
    } else {
      dispatch({ type: "RANGE_REMOVE" });
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => console.log(filter), [filter]);

  useEffect(() => {
    if ("year" in filter)
      setTags([
        ...filter.format,
        ...filter.genre,
        ...filter.tag,
        filter.year || "",
      ]);
    else if ("after" in filter && "before" in filter)
      setTags([
        ...filter.format,
        ...filter.genre,
        ...filter.tag,
        `${filter.after} - ${filter.before}`,
      ]);
    else setTags([...filter.format, ...filter.genre, ...filter.tag]);
    fetchList();
  }, [filter]);

  return (
    <div className="page-content">
      <div className="search-section">
        <div className="sort">
          {tags.length > 0 && (
            <div className="tags">
              <span className="tags__icon">
                <FontAwesomeIcon icon={faTags} size="lg" />
              </span>
              <div className="tags__container">
                {tags.map((tag: any) => (
                  <button
                    type="button"
                    className="tag"
                    onClick={removeTag}
                    data-content={tag}
                  >
                    {tag}
                    <span className="tag-icon">
                      <FontAwesomeIcon icon={faXmark} size="sm" />
                    </span>
                  </button>
                ))}
                {tags.length > 1 && (
                  <button
                    type="button"
                    className="tag-remover"
                    onClick={() => dispatch({ type: "CLEAR" })}
                  >
                    Clear All
                    <span className="tag-icon">
                      <FontAwesomeIcon icon={faXmark} size="sm" />
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="sort-button" onClick={() => setShowSort(!showSort)}>
            <FontAwesomeIcon icon={faSort} />
            {filter.sort}
            <div
              className="sort-dropdown"
              style={{
                visibility: showSort ? "visible" : "hidden",
                opacity: showSort ? 1 : 0,
              }}
            >
              <div
                className="dropdown-item"
                id="popularity"
                data-id="Popularity"
                onClick={handleSort}
              >
                Popularity
              </div>
              <div
                className="dropdown-item"
                data-id="Avg Score"
                id="score"
                onClick={handleSort}
              >
                Avg Score
              </div>
              <div
                className="dropdown-item"
                id="date-release"
                data-id="Release Date"
                onClick={handleSort}
              >
                Release Date
              </div>
              <div
                className="dropdown-item"
                id="date-update"
                data-id="Update Date"
                onClick={handleSort}
              >
                Update Date
              </div>
            </div>
          </div>
        </div>
        <Grid list={mediaList} />
      </div>
      <Filter filter={filter} dispatch={dispatch} />
    </div>
  );
}
