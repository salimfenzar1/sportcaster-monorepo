import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SportType, SportIntensity, ISport } from '../../../../../shared/api/src';
import { IsMongoId } from 'class-validator';

export type SportDocument = Sport & Document;

@Schema()
export class Sport implements ISport {
    @IsMongoId()
    _id!: string;

    @Prop({ required: true, type: String })
    name: string = '';

    @Prop({ required: true, enum: SportType, type: String })
    type: SportType = SportType.Extreme;

    @Prop({ required: true, type: Number })
    duration!: number;

    @Prop({ required: true, enum: SportIntensity, type: String })
    intensity!: SportIntensity;

    @Prop({ required: false, type: [String], default: [] })
    equipment!: string[];
}

export const SportSchema = SchemaFactory.createForClass(Sport);
