import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Request,
    Put,
    UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { IUserInfo, IUser, SportType, Equipment, SportIntensity } from '../../../../../shared/api/src';
import { CreateUserDto, UpdateUserDto } from '../../../../dto/src/lib/user.dto';
import { UserExistGuard } from './user-exists.guard';
import { AuthGuard } from 'libs/backend/auth/src/lib/auth/auth.guards';

@Controller('user')
export class UserController {
    logger: any;
    constructor(private readonly userService: UserService) {}

    @Get()
    async findAll(): Promise<IUserInfo[]> {
        return this.userService.findAll();
    }

    // this method should precede the general getOne method, otherwise it never matches
    // @Get('self')
    // async getSelf(@InjectToken() token: Token): Promise<IUser> {
    //     const result = await this.userService.getOne(token.id);
    //     return result;
    // }

    @Get('me')
    @UseGuards(AuthGuard)
    async getMe(@Request() req: any): Promise<any> {
        const userId = req.user.user_id;
        return this.userService.findById(userId); // Zorg dat je de correcte service methode gebruikt
    }
    
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<IUser | null> {
        return this.userService.findOne(id);
    }

    @Post('')
    @UseGuards(UserExistGuard)
    create(@Body() user: CreateUserDto): Promise<IUserInfo> {
        return this.userService.create(user);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const success = await this.userService.deleteUserById(id);
        if (!success) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() user: UpdateUserDto
    ): Promise<IUserInfo | null> {
        return this.userService.update(id, user);
    }

     // ✅ Voeg GET /user/:id/preferences toe om voorkeuren op te halen
     @Get(':id/preferences')
     async getUserPreferences(@Param('id') id: string): Promise<{ sportTypes: SportType[]; isIndoor: boolean; equipment: Equipment[]; intensity: SportIntensity }> {
         return this.userService.getUserPreferences(id);
     }
 
     // ✅ Voeg PUT /user/:id/preferences toe om voorkeuren te updaten
     @Put(':id/preferences')
     async updateUserPreferences(
         @Param('id') id: string,
         @Body() preferences: { sportTypes: SportType[]; isIndoor: boolean; equipment: Equipment[]; intensity: SportIntensity }
     ): Promise<IUserInfo | null> {
         return this.userService.updatePreferences(id, preferences);
     }

    

   
}
