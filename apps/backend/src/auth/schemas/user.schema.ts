import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole, UserStatus } from '../enums/user-role.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
    index: true 
  })
  email: string;

  @Prop({ 
    required: true, 
    unique: true, 
    trim: true,
    index: true 
  })
  phoneNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop({ 
    type: String, 
    enum: UserRole, 
    required: true 
  })
  role: UserRole;

  @Prop({ 
    type: String, 
    enum: UserStatus, 
    default: UserStatus.ACTIVE 
  })
  status: UserStatus;

  @Prop({ 
    required: function(this: User) { 
      return this.role === UserRole.STUDENT; 
    },
    min: 1,
    max: 120
  })
  age?: number;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);