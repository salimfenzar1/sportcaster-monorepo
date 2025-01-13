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
}
