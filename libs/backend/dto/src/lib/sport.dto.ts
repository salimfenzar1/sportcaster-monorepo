import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, IsArray } from 'class-validator';
import { SportType, SportIntensity } from '../../../../shared/api/src';

export class CreateSportDto {

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsEnum(SportType)
    @IsNotEmpty()
    type!: SportType;

    @IsNumber()
    @IsNotEmpty()
    duration!: number;

    @IsEnum(SportIntensity)
    @IsNotEmpty()
    intensity!: SportIntensity;

    @IsArray()
    @IsOptional()
    equipment?: string[];
}

export class UpsertSportDto {
    @IsString()
    @IsNotEmpty()
    _id!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsEnum(SportType)
    @IsNotEmpty()
    type!: SportType;

    @IsNumber()
    @IsNotEmpty()
    duration!: number;

    @IsEnum(SportIntensity)
    @IsNotEmpty()
    intensity!: SportIntensity;

    @IsArray()
    @IsOptional()
    equipment?: string[];
}

export class UpdateSportDto {
    @IsString()
    @IsNotEmpty()
    _id!: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsEnum(SportType)
    @IsOptional()
    type?: SportType;

    @IsNumber()
    @IsOptional()
    duration?: number;

    @IsEnum(SportIntensity)
    @IsOptional()
    intensity?: SportIntensity;

    @IsArray()
    @IsOptional()
    equipment?: string[];
}
