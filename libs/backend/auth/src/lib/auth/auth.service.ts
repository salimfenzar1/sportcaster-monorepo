import { Injectable, Logger } from '@nestjs/common';
import {
    ConflictException,
    UnauthorizedException
} from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import {
    User as UserModel,
    UserDocument
} from '@libs/backend/user/src/lib/user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { IUserCredentials, IUserIdentity } from '../../../../../shared/api/src';	
import { CreateUserDto } from '../../../../dto/src';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    //
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService
    ) {}

    async validateUser(credentials: IUserCredentials): Promise<any> {
        this.logger.log('validateUser');
        const user = await this.userModel.findOne({
            emailAddress: credentials.emailAddress
        });
        if (user && user.password === credentials.password) {
            return user;
        }
        return null;
    }

    async login(credentials: IUserCredentials): Promise<IUserIdentity> {
        this.logger.log('login ' + credentials.emailAddress);
        return await this.userModel
            .findOne({
                emailAddress: credentials.emailAddress
            })
            .select('+password')
            .exec()
            .then((user) => {
                if (user && user.password === credentials.password) {
                    const payload = {
                        user_id: user._id,
                        name: user.name,
                        emailAddress: user.emailAddress,
                    };
                    const token = this.jwtService.sign(payload);
                    this.logger.log('Generated JWT Token:', token);
                    return {
                        _id: user._id,
                        name: user.name,
                        emailAddress: user.emailAddress,
                        profileImgUrl: user.profileImgUrl,
                        token: this.jwtService.sign(payload)
                    };
                } else {
                    const errMsg = 'Email not found or password invalid';
                    this.logger.debug(errMsg);
                    throw new UnauthorizedException(errMsg);
                }
            })
            .catch((error) => {
                return error;
            });
    }

    async register(user: CreateUserDto): Promise<IUserIdentity> {
        this.logger.log(`Registering user: ${user.name}`);

        const existingUser = await this.userModel.findOne({ emailAddress: user.emailAddress });
        if (existingUser) {
            this.logger.debug('User already exists');
            throw new ConflictException('User already exists');
        }
    
        this.logger.debug('User not found, creating new user');
        const createdUser = await this.userModel.create(user);
    

        const payload = { 
            user_id: createdUser._id.toString(),
            name: createdUser.name,
            emailAddress: createdUser.emailAddress 
         }; 
        const token = this.jwtService.sign(payload);
    

        return {
            results: null, 
            name: createdUser.name,
            emailAddress: createdUser.emailAddress,
            profileImgUrl: createdUser.profileImgUrl,
            role: createdUser.role,
            token: token, 
        };
    }
    
}
