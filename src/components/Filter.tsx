import React, { useEffect, useState } from "react";
import "./Filter.scss";
import { getGenres, getTags } from "../actions/media";
import { faAngleDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Scrollbars } from "react-custom-scrollbars-2";
import { FilterSchema } from "../services/dbEntity";
import ReactSlider from "react-slider";

interface FilterProps {
  filter: FilterSchema;
  dispatch: React.Dispatch<any>;
}

export default function Filter({ filter, dispatch }: FilterProps) {
  const [genresList, setGenresList] = useState<string[]>([]);
  const [tagList, setTagList] = useState<string[]>([]);

  const [showFormat, setShowFormat] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showGenres, setShowGenres] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      let response = await getGenres();
      setGenresList(response.GenreCollection ?? []);
    };
    const fetchTags = async () => {
      let response = await getTags();
      setTagList(response.MediaTagCollection.map((e: any) => e.name) || []);
    };

    if (genresList.length === 0) {
      fetchGenres();
    }
    if (tagList.length === 0) {
      fetchTags();
    }
  });

  const handleFormat = (e: any) => {
    if (filter.format.includes(e.target.name)) {
      dispatch({
        type: "FORMAT",
        payload: filter.format.filter((f: string) => f !== e.target.name),
      });
    } else {
      dispatch({ type: "FORMAT", payload: [...filter.format, e.target.name] });
    }
  };
  const handleGenres = (e: any) => {
    if (filter.genre.includes(e.target.name)) {
      dispatch({
        type: "GENRE",
        payload: filter.genre.filter((f: string) => f !== e.target.name),
      });
    } else {
      dispatch({ type: "GENRE", payload: [...filter.genre, e.target.name] });
    }
  };
  const handleTags = (e: any) => {
    if (filter.tag.includes(e.target.name)) {
      dispatch({
        type: "TAG",
        payload: filter.tag.filter((f: string) => f !== e.target.name),
      });
    } else {
      dispatch({ type: "TAG", payload: [...filter.tag, e.target.name] });
    }
  };

  const handleYear = (e: any) => {
    dispatch({ type: "YEAR", payload: e.target.value || e.target.innerHTML });
  };

  return (
    <div className="filter-wrapper">
      <div className="filter-section">
        <div className="filter-section__header">
          <label onClick={() => setShowFormat(!showFormat)}>Format</label>
          <span>
            <FontAwesomeIcon
              icon={faAngleDown}
              size="lg"
              style={{
                transition: "0.25s all ease-in-out",
                transform: showFormat ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </span>
        </div>
        {showFormat ? (
          <ul className="filter-section__items">
            <li className="section-item">
              <input
                type="checkbox"
                name="TV Show"
                id="tv"
                onClick={handleFormat}
                checked={filter.format.includes("TV Show")}
              />
              <label htmlFor="tv" style={{}}>
                TV Show
              </label>
            </li>
            <li className="section-item">
              <input
                type="checkbox"
                name="TV Short"
                id="tv_short"
                onClick={handleFormat}
                checked={filter.format.includes("TV Short")}
              />
              <label htmlFor="tv_short">TV Short</label>
            </li>
            <li className="section-item">
              <input
                type="checkbox"
                name="Movie"
                id="movie"
                onClick={handleFormat}
                checked={filter.format.includes("Movie")}
              />
              <label htmlFor="movie">Movie</label>
            </li>
            <li className="section-item">
              <input
                type="checkbox"
                name="Manga"
                id="manga"
                onClick={handleFormat}
                checked={filter.format.includes("Manga")}
              />
              <label htmlFor="manga">Manga</label>
            </li>
            <li className="section-item">
              <input
                type="checkbox"
                name="Novel"
                id="novel"
                onClick={handleFormat}
                checked={filter.format.includes("Novel")}
              />
              <label htmlFor="novel">Novel</label>
            </li>
            <li className="section-item">
              <input
                type="checkbox"
                name="ONA"
                id="ona"
                onClick={handleFormat}
                checked={filter.format.includes("ONA")}
              />
              <label htmlFor="ona">ONA</label>
            </li>
            <li className="section-item">
              <input
                type="checkbox"
                name="OVA"
                id="ova"
                onClick={handleFormat}
                checked={filter.format.includes("OVA")}
              />
              <label htmlFor="ova">OVA</label>
            </li>
          </ul>
        ) : (
          ""
        )}
      </div>
      <div className="filter-section">
        <div className="filter-section__header">
          <label onClick={() => setShowDate(!showDate)}>Year</label>
          <span>
            <FontAwesomeIcon
              icon={faAngleDown}
              size="lg"
              style={{
                transition: "0.25s all ease-in-out",
                transform: showDate ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </span>
        </div>
        {showDate ? (
          <>
            <div className="year-select">
              <span
                onClick={() =>
                  dispatch({
                    type: "year" in filter ? "YEAR_REMOVE" : "",
                    payload: {},
                  })
                }
              >
                {"year" in filter ? (
                  <FontAwesomeIcon icon={faXmark} size="lg" />
                ) : (
                  <FontAwesomeIcon icon={faAngleDown} size="lg" />
                )}
              </span>
              <input
                type="text"
                placeholder="Any"
                value={filter.year || ""}
                onChange={handleYear}
                style={{
                  fontWeight: filter.year ? 600 : 400,
                  color: filter.year ? "#3db4f2" : "rgb(116,136,153)",
                }}
              />
              <div className="dropdown">
                <ul className="dropdown__items">
                  <Scrollbars
                    style={{}}
                    autoHeightMax={"450px"}
                    autoHeight={true}
                    autoHide={true}
                    autoHeightMin={"6px"}
                  >
                    {[...new Array(53)].map((elem, index) =>
                      "year" in filter ? (
                        `${2022 - index}`.includes(filter.year || "") && (
                          <li key={index} onClick={(e) => handleYear(e)}>
                            {2022 - index}
                          </li>
                        )
                      ) : (
                        <li key={index} onClick={(e) => handleYear(e)}>
                          {2022 - index}
                        </li>
                      )
                    )}
                  </Scrollbars>
                </ul>
              </div>
            </div>
            <div className="slider-header">
              <label>Range</label>
              {!("after" in filter && "before" in filter) ? (
                ""
              ) : (
                <span>
                  {`${filter.after} - ${filter.before}`}
                  <button
                    onClick={() => {
                      dispatch({ type: "RANGE_REMOVE" });
                    }}
                  >
                    <FontAwesomeIcon icon={faXmark} size="sm" />
                  </button>
                </span>
              )}
            </div>
            <ReactSlider
              className="horizontal-slider"
              thumbClassName="example-thumb"
              trackClassName="example-track"
              min={1970}
              max={2022}
              value={
                "after" in filter && "before" in filter
                  ? [Number(filter.after), Number(filter.before)]
                  : [1970, 2022]
              }
              ariaLabel={["Lower thumb", "Upper thumb"]}
              onAfterChange={(value, index) => {
                dispatch({
                  type: "RANGE",
                  payload: { after: value[0], before: value[1] },
                });
              }}
              renderThumb={(props, state) => (
                <div {...props}>
                  <div>
                    <span>{state.valueNow}</span>
                  </div>
                </div>
              )}
              pearling
              minDistance={1}
            />
          </>
        ) : (
          ""
        )}
      </div>
      <div className="filter-section">
        <div className="filter-section__header">
          <label onClick={() => setShowGenres(!showGenres)}>Genres</label>
          <span>
            <FontAwesomeIcon
              icon={faAngleDown}
              size="lg"
              style={{
                transition: "0.25s all ease-in-out",
                transform: showGenres ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </span>
        </div>
        {showGenres ? (
          <>
            <ul className="filter-section__items">
              {genresList.map((e, index) => (
                <li className="section-item">
                  <input
                    type="checkbox"
                    name={e}
                    id={e}
                    onClick={handleGenres}
                    checked={filter.genre.includes(e)}
                  />
                  <label htmlFor={e}>{e}</label>
                </li>
              ))}
            </ul>
          </>
        ) : (
          ""
        )}
      </div>
      <div className="filter-section" style={{ border: "none" }}>
        <div className="filter-section__header">
          <label onClick={() => setShowTags(!showTags)}>Tags</label>
          <span>
            <FontAwesomeIcon
              icon={faAngleDown}
              size="lg"
              style={{
                transition: "0.25s all ease-in-out",
                transform: showGenres ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </span>
        </div>
        {showTags && (
          <>
            <ul className="filter-section__items">
              {!showAllTags ? (
                <>
                  {tagList
                    .reduce((acc: string[], tag: string, index: number) => {
                      if (index <= 15) return [...acc, tag];
                      return acc;
                    }, [])
                    .map((e, index) => (
                      <>
                        <li className="section-item">
                          <input
                            type="checkbox"
                            name={e}
                            id={e}
                            onClick={handleTags}
                            checked={filter.tag.includes(e)}
                          />
                          <label htmlFor={e}>{e}</label>
                        </li>
                      </>
                    ))}
                    <span onClick = {() => setShowAllTags(!showAllTags)} className = "tags-expand">
                      Show all({tagList.length})
                    </span>
                </>
              ) : (
                tagList.map((e, index) => (
                  <li className="section-item">
                    <input
                      type="checkbox"
                      name={e}
                      id={e}
                      onClick={handleTags}
                      checked={filter.tag.includes(e)}
                    />
                    <label htmlFor={e}>{e}</label>
                  </li>
                ))
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
