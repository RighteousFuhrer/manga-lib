

  export interface MediaSchema {
    averageScore : number,
    id : number,
    coverImage : {large : string, color: string}, 
    format : string,
    description : string,
    endDate : {year : number, month : number, day : number},
    startDate : {year : number, month : number, day : number},
    tags : {name: string}[],
    title : { english : string, userPreferred : string}
    relations : {nodes : {title:string}[]}
  }

  export interface FilterSchema {
    sort ?: string,
    format : string[],
    genre : string[],
    tag : string[],
    after ?: string,
    before ?: string,
    year ?: string
  }


