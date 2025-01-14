import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISport } from '../../../../../shared/api/src';
import { SportDocument } from './sport.schema';

@Injectable()
export class SportService {
    constructor(
        @InjectModel('Sport') private readonly sportModel: Model<SportDocument>,
    ) {}

    async findAll(): Promise<ISport[]> {
        return this.sportModel.find().exec();
    }

    async findOne(id: string): Promise<ISport | null> {
        return this.sportModel.findById(id).exec();
    }

    async create(sport: ISport): Promise<ISport> {
        try {
            const createdSport = new this.sportModel(sport);
            return await createdSport.save();
        } catch (error) {
            console.error('Error while creating sport:', error);
            throw new InternalServerErrorException('Failed to create sport');
        }
    }
}
