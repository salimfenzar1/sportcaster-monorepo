/* eslint-disable @typescript-eslint/no-empty-object-type */

// import { IEntity } from 'libs/share-a-meal/common/src/lib/entity/entity.model';
import { IToken, IUserRegistration } from './auth.interface';
import { Id } from './id.type';
import { Equipment, SportIntensity, SportType } from './sport.interface';

export enum UserRole {
    Guest = 'Guest',
    Admin = 'Admin',
    Unknown = 'Unknown'
}

export enum UserGender {
    Male = 'Male',
    Female = 'Female',
    None = 'None',
    Unknown = 'Unknown'
}

/**
 * Minimal user information
 */

export interface IUserIdentity {
    user_id?: string;
    results: any; // extends IEntity {
    name: string;
    emailAddress: string;
    profileImgUrl: string;
    role: UserRole;
    token?: string;
}

/**
 * All user information, excl. domain entities
 */
export interface IUserInfo extends IUserRegistration {
    _id: Id;
    profileImgUrl: string;
    role: UserRole;
    gender: UserGender;
    isActive: boolean;
    preferences?: {
        sportTypes: SportType[];
        isIndoor: boolean | null;
        equipment: Equipment[];
        intensity: SportIntensity;
    };
}


/**
 * All user information, incl. domain entities
 */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUser extends IUserInfo {
}

export type ICreateUser = Pick<IUser, 'name' | 'password' | 'emailAddress'>;
export type IUpdateUser = Partial<Omit<IUser, 'id'>>;
export type IUpsertUser = IUser;
