import { Injectable, Logger, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Sport, SportDocument } from './sport.schema';
import { ISport } from '../../../../../shared/api/src';
import { CreateSportDto, UpdateSportDto } from '../../../../dto/src/lib/sport.dto';

@Injectable()
export class SportService {
    private readonly logger: Logger = new Logger(SportService.name);

    constructor(
        @InjectModel(Sport.name) private sportModel: Model<SportDocument>
    ) {}

    async findAll(): Promise<ISport[]> {
        return this.sportModel.find().exec();
    }

    async findOne(id: string): Promise<ISport | null> {
        return this.sportModel.findById(id).exec();
    }

    async create(Sport: CreateSportDto): Promise<ISport> {
        const createdItem = this.sportModel.create(Sport);
        return createdItem;
    }

}
