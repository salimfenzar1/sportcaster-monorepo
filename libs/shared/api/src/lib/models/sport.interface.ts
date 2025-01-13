 

export enum SportType {
    Outdoor = 'Outdoor',
    Indoor = 'Indoor',
    Water = 'Water',
    Extreme = 'Extreme'
}

export enum SportIntensity {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}

export interface ISport {
    _id: string;
    name: string;
    type: SportType;
    duration: number;
    intensity: SportIntensity;
    equipment?: string[];
}



export type IUpsertSport = ISport;
