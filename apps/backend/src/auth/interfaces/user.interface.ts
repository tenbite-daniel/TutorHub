import { Document } from 'mongoose';
import { UserRole, UserStatus } from '../enums/user-role.enum';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  age?: number; // Optional - only for students
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  age?: number;
  createdAt: Date;
  updatedAt: Date;
}