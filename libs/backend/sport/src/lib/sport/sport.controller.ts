import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    UseGuards
} from '@nestjs/common';
import { SportService } from './sport.service';
import { ISport } from '../../../../../shared/api/src';
import { CreateSportDto, UpdateSportDto } from '../../../../dto/src/lib/sport.dto';

@Controller('sports')
export class SportController {
    constructor(private readonly sportService: SportService) {}

    @Get()
    async findAll(): Promise<ISport[]> {
        return this.sportService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ISport | null> {
        return this.sportService.findOne(id);
    }

    @Post()
    create(@Body() sport: CreateSportDto): Promise<ISport> {
        return this.sportService.create(sport);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const success = await this.sportService.deleteSportById(id);
        if (!success) {
            throw new HttpException('Sport not found', HttpStatus.NOT_FOUND);
        }
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() sport: UpdateSportDto
    ): Promise<ISport | null> {
        return this.sportService.update(id, sport);
    }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SportDocument = Sport & Document;