import React from "react";
import "./GridItem.scss";
import {  MediaSchema } from "../services/dbEntity";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faStar,
  faFilm,
  faTv,
} from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/free-regular-svg-icons";

export default function GridItem(item: MediaSchema) {
  const renderFormat = (): JSX.Element => {
    switch (item.format) {
      case "TV":
      case "TV_SHORT":
        return <FontAwesomeIcon icon={faTv} size="xs" />;
      case "MOVIE":
      case "ONA":
      case "OVA":
        return <FontAwesomeIcon icon={faFilm} size="sm" />;
      case "MANGA":
      case "NOVEL":
        return <FontAwesomeIcon icon={faBookOpen} size="sm" />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <li
        className="item-wrapper"
        style={{
          backgroundImage: `linear-gradient(${item.coverImage.color} , #e5e5e5 )`,
        }}
      >
        <a href="#!" className="item">
          <div className="item-image">
            <img
              src={
                item.coverImage.large ||
                "https://img.mreadercdn.com/_r/300x400/100/9b/2c/9b2c36913045d072fbfebb4261997d61/9b2c36913045d072fbfebb4261997d61.jpg"
              }
              alt=""
            />
            <div className="item-rating">
              <FontAwesomeIcon icon={faStar} size="sm" />{" "}
              {item.averageScore / 10}
            </div>
            <div className="item-format">{renderFormat()}</div>
          </div>
          <div className="item-desc">
            <h2 className="item-title">
              {item.title.english || item.title.userPreferred}
            </h2>

            <div className="title-label">
              {item.title.english || item.title.userPreferred}
            </div>
            
          </div>
          <div className="item-run">Published: {item.startDate.year}</div>
        </a>
      </li>
    </>
  );
}
