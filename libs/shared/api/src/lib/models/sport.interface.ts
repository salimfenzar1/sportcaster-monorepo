 

export enum SportType {
    Water = 'Water',
    Extreme = 'Extreme'
}

export enum SportIntensity {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}

export interface ISport {
    name: string;
    type: SportType;
    duration: number;
    isIndoor: boolean;
    intensity: SportIntensity;
    equipment?: string[];
}



export type IUpsertSport = ISport;
