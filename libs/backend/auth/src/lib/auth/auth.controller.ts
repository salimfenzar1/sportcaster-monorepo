import {
    Controller,
    Request,
    Post,
    UseGuards,
    Logger,
    Body
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../decorators/decorators';
import {
    IUserCredentials,
    IUserIdentity,
    IUserRegistration
} from '../../../../../shared/api/src';
import { CreateUserDto } from '../../../../dto/src';
import { UserExistGuard } from '../../../../user/src/lib/user/user-exists.guard';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private authService: AuthService) {}

    @Public()
    @Post('login')
    async login(@Body() credentials: IUserCredentials): Promise<IUserIdentity> {
        this.logger.log('Login');
        return await this.authService.login(credentials);
    }

    @Public()
    @UseGuards(UserExistGuard)
    @Post('register')
    async register(@Body() user: CreateUserDto): Promise<IUserIdentity> {
        this.logger.log('Register');
        return await this.authService.register(user);
    }
}
