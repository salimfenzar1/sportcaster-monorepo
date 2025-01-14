import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SportType, SportIntensity, ISport, Equipment } from '../../../../../shared/api/src';
import { IsMongoId } from 'class-validator';

export type SportDocument = Sport & Document;

@Schema()
export class Sport implements ISport {
    @Prop({ required: true, type: String })
    name = '';

    @Prop({ required: true, enum: SportType, type: String })
    type: SportType = SportType.Extreme;

    @Prop({ required: true, type: Number })
    duration!: number;

    @Prop({ required: true, type: Boolean })
    isIndoor!: boolean;

    @Prop({ required: true, enum: SportIntensity, type: String })
    intensity!: SportIntensity;

    @Prop({ required: false, enum: Equipment, default: [] })
    equipment!: Equipment[];
}

export const SportSchema = SchemaFactory.createForClass(Sport);
