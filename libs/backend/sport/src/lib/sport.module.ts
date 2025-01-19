import { Module } from '@nestjs/common';
import { SportController } from './sport/sport.controller';
import { SportService } from './sport/sport.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Sport, SportSchema } from './sport/sport.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Sport.name, schema: SportSchema }]),
    ],
    controllers: [SportController],
    providers: [SportService],
    exports: [SportService]
})
export class SportModule {}