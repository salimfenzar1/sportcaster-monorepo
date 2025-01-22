 

export enum SportType {
    Water = 'Water',         // Voor watersporten zoals zwemmen of surfen
    Extreme = 'Extreme',     // Voor extreme sporten zoals bungeejumpen of skydiven
    Combat = 'Combat',       // Voor vechtsporten zoals boksen of judo
    Team = 'Team',           // Voor teamsporten zoals hockey of volleybal
    Solo = 'Solo',           // Voor individuele sporten zoals hardlopen of gewichtheffen
    Fitness = 'Fitness',     // Voor fitness- en trainingsactiviteiten zoals krachttraining
    Recreational = 'Recreational', // Voor recreatieve activiteiten zoals bowlen of wandelen
    Winter = 'Winter',       // Voor wintersporten zoals skiën of snowboarden
    Adventure = 'Adventure', // Voor avontuurlijke sporten zoals rotsklimmen of bergbeklimmen
    Racquet = 'Racquet',     // Voor racketsporten zoals tennis of squash
    Dance = 'Dance',         // Voor dansactiviteiten zoals zumba of ballet
}

export enum Equipment {
    Mat = 'Mat',
    Fiets = 'Fiets',
    Halter = 'Halter',
    Basketbal = 'Basketbal',
    Springtouw = 'Springtouw',
    Schoenen = 'Schoenen',
    Kajak = 'Kajak',
    Peddel = 'Peddel',
    Zwemvest = 'Zwemvest',
    Racket = 'Racket',
    Bal = 'Bal',
    Helm = 'Helm',
    Bokshandschoenen = 'Bokshandschoenen',
  }
  

export enum SportIntensity {
    Low = 'Laag',
    Medium = 'Gemiddeld',
    High = 'Hoog'
}

export interface ISport {
    name: string;
    type: SportType;
    duration: number;
    isIndoor: boolean;
    intensity: SportIntensity;
    equipment?: Equipment[];
}



export type IUpsertSport = ISport;
