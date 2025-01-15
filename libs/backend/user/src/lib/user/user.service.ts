import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserModel, UserDocument } from './user.schema';
import { Equipment, IUser, IUserInfo, SportIntensity, SportType } from '../../../../../shared/api/src';
import { CreateUserDto, UpdateUserDto } from '../../../../dto/src/lib/user.dto';

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>
    ) {}

    async findAll(): Promise<IUserInfo[]> {
        this.logger.log(`Finding all users`);
        return this.userModel.find().exec();
    }

    async findOne(_id: string): Promise<IUser | null> {
        if (!Types.ObjectId.isValid(_id)) {
            throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
        }
        return this.userModel.findById(new Types.ObjectId(_id)).exec();
    }

    async findOneByEmail(email: string): Promise<IUserInfo | null> {
        return this.userModel
            .findOne({ emailAddress: email })
            .select('-password')
            .exec();
    }

    async create(user: CreateUserDto): Promise<IUserInfo> {
        return this.userModel.create(user);
    }

    async deleteUserById(id: string): Promise<boolean> {
        const result = await this.userModel.deleteOne({ _id: id }).exec();
        return result.deletedCount > 0;
    }

    async update(_id: string, user: UpdateUserDto): Promise<IUserInfo | null> {
        if (!Types.ObjectId.isValid(_id)) {
            throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
        }

        return this.userModel.findByIdAndUpdate(_id, user, { new: true }).exec();
    }

    async findById(id: string): Promise<IUserInfo | null> {
        if (!Types.ObjectId.isValid(id)) {
            throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
        }

        return this.userModel.findById(new Types.ObjectId(id)).select('-password').exec();
    }

    async updatePreferences(
        userId: string,
        preferences: { sportTypes: SportType[]; isIndoor: boolean; equipment: Equipment[]; intensity: SportIntensity }
    ): Promise<IUserInfo | null> {
        if (!Types.ObjectId.isValid(userId)) {
            throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
        }
    
        return this.userModel.findByIdAndUpdate(
            userId,
            { $set: { preferences } }, // ✅ Zorgt ervoor dat het hele preferences-object wordt geüpdatet
            { new: true }
        ).exec();
    }
    
    async getUserPreferences(userId: string): Promise<IUser['preferences']> {
        if (!Types.ObjectId.isValid(userId)) {
          throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
        }
      
        const user = await this.userModel.findById(userId).select('preferences').exec();
        return (
          user?.preferences || {
            sportTypes: [],
            isIndoor: null,
            equipment: [],
            intensity: SportIntensity.Medium,
          }
        );
      }
}
