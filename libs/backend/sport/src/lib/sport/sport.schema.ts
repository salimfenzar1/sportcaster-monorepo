import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ISport } from '../../../../../shared/api/src';

export type SportDocument = Sport & Document;

@Schema()
export class Sport implements ISport {
    @Prop({ required: true, type: String })
    name!: string;

    @Prop({ required: true, type: String })
    type!: string;

    @Prop({ required: true, type: Number })
    duration!: number;

    @Prop({ required: true, type: String })
    intensity!: string;

    @Prop({ required: false, type: [String], default: [] })
    equipment!: string[];
}