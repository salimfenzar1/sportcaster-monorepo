import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, IsArray, IsBoolean } from 'class-validator';
import { SportType, SportIntensity, Equipment } from '../../../../shared/api/src';

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

    @IsBoolean() 
    isIndoor!: boolean;

    @IsEnum(SportIntensity)
    @IsNotEmpty()
    intensity!: SportIntensity;
    
    @IsOptional()
    @IsEnum(Equipment, { each: true })
    equipment?: Equipment[];
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
    equipment?: Equipment[];
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
    equipment?: Equipment[];
}
