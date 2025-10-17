import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { RegisterStudentDto, RegisterTutorDto, LoginDto } from '../dto';
import { UserRole, IUserResponse } from '../index';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).lean();
    return !!user;
  }

  async checkPhoneExists(phoneNumber: string): Promise<boolean> {
    const user = await this.userModel.findOne({ phoneNumber }).lean();
    return !!user;
  }

  async validateUniqueFields(email: string, phoneNumber: string): Promise<void> {
    const [emailExists, phoneExists] = await Promise.all([
      this.checkEmailExists(email),
      this.checkPhoneExists(phoneNumber),
    ]);

    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    if (phoneExists) {
      throw new ConflictException('Phone number already exists');
    }
  }

  async registerStudent(registerStudentDto: RegisterStudentDto): Promise<IUserResponse> {
    const { email, phoneNumber, password, confirmPassword, ...userData } = registerStudentDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    await this.validateUniqueFields(email, phoneNumber);

    const hashedPassword = await this.hashPassword(password);

    const user = new this.userModel({
      ...userData,
      email,
      phoneNumber,
      password: hashedPassword,
      role: UserRole.STUDENT,
    });

    const savedUser = await user.save();
    return this.transformUserResponse(savedUser);
  }

  async registerTutor(registerTutorDto: RegisterTutorDto): Promise<IUserResponse> {
    const { email, phoneNumber, password, confirmPassword, ...userData } = registerTutorDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    await this.validateUniqueFields(email, phoneNumber);

    const hashedPassword = await this.hashPassword(password);

    const user = new this.userModel({
      ...userData,
      email,
      phoneNumber,
      password: hashedPassword,
      role: UserRole.TUTOR,
    });

    const savedUser = await user.save();
    return this.transformUserResponse(savedUser);
  }

  async validateUser(email: string, password: string): Promise<IUserResponse | null> {
    const user = await this.userModel.findOne({ email }).select('+password');
    
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.comparePasswords(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }

    return this.transformUserResponse(user);
  }

  async login(loginDto: LoginDto): Promise<IUserResponse> {
    const { email, password } = loginDto;
    
    const user = await this.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async findUserById(id: string): Promise<IUserResponse | null> {
    const user = await this.userModel.findById(id).lean();
    
    if (!user) {
      return null;
    }

    return this.transformUserResponse(user);
  }

  private transformUserResponse(user: User): IUserResponse {
    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      status: user.status,
      age: user.age,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}