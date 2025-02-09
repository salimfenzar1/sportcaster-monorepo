import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
// import { v4 as uuid } from 'uuid';
import { Equipment, IUser, SportIntensity, SportType, UserGender, UserRole } from '../../../../../shared/api/src';
import { IsMongoId } from 'class-validator';

export type UserDocument = User & Document;

@Schema()
export class User implements IUser {
  @IsMongoId()
  _id!: string;

  @Prop({
    required: true,
    type: String,
  })
  name!: string;

  @Prop({
    required: true,
    select: false, // do not return password in select statements
    type: String,
  })
  password = '';

  @Prop({
    required: true,
    type: String,
    select: true,
    unique: true,
    // validate: {
    //     validator: isEmail,
    //     message: 'should be a valid email address'
    // }
  })
  emailAddress = '';

  @Prop({
    required: false,
    select: true,
    default: 'https://cdn-icons-png.flaticon.com/512/219/219969.png',
  })
  profileImgUrl!: string;

  @Prop({
    required: false,
    enum: UserRole,
    type: String,
    default: UserRole.Guest,
  })
  role: UserRole = UserRole.Guest;

  @Prop({
    required: false,
    type: String,
    enum: UserGender,
    default: UserGender.Unknown,
  })
  gender: UserGender = UserGender.Unknown;

  @Prop({
    required: false,
    type: Boolean,
    default: true,
  })
  isActive = true;

  @Prop({
    type: {
      sportTypes: { type: [String], enum: Object.values(SportType), default: [] },
      isIndoor: { type: Boolean, default: false },
      equipment: { type: [String], enum: Object.values(Equipment), default: [] },
      intensity: { type: String, enum: Object.values(SportIntensity), default: SportIntensity.Medium },
    },
    default: {}
  })
  preferences!: {
    sportTypes: SportType[];
    isIndoor: boolean;
    equipment: Equipment[];
    intensity: SportIntensity;
  };


}

export const UserSchema = SchemaFactory.createForClass(User);
