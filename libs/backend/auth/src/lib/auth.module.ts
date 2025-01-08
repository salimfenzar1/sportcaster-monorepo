import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema, UsersModule } from '@libs/backend/user/src';
import { AuthService } from './auth/auth.service';
import { UserService } from '../../../user/src/lib/user/user.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        UsersModule,
        JwtModule.register({
            secret: process.env['JWT_SECRET'] || 'secretstring',
            signOptions: { expiresIn: '12 days' }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService],
    exports: [AuthService, UserService],
})
export class AuthModule {}
