import React, { useEffect } from "react";
import GridItem from "./GridItem";
import { MediaSchema } from "../services/dbEntity";
import "./Grid.scss";

export default function Grid({list}:any) {
  return (
    <>
      <div className="grid-wrapper">
        {list.map((elem: MediaSchema) => {
          return (
            <>
              <GridItem {...elem}></GridItem>
            </>
          );
        })}
      </div>
    </>
  );
}
