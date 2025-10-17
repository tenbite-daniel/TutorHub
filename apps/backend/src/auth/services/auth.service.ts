import { Injectable, ConflictException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../schemas/user.schema';
import { Otp } from '../schemas/otp.schema';
import { RegisterStudentDto, RegisterTutorDto, LoginDto, ForgotPasswordDto, VerifyOtpDto, ResetPasswordDto, ChangePasswordDto } from '../dto';
import { EmailService } from './email.service';
import { UserRole } from '../enums/user-role.enum';
import { IUserResponse } from '../interfaces/user.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
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

  async generateTokens(user: IUserResponse): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '30d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;
    
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    
    await this.otpModel.deleteMany({ email, type: 'password-reset' });
    
    const otpDoc = new this.otpModel({
      email,
      otp,
      type: 'password-reset',
    });
    await otpDoc.save();
    
    await this.emailService.sendOtpEmail(email, otp);
    
    return { message: 'OTP sent to your email' };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> {
    const { email, otp } = verifyOtpDto;
    
    const otpDoc = await this.otpModel.findOne({ 
      email, 
      otp, 
      type: 'password-reset' 
    });
    
    if (!otpDoc) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    
    return { message: 'OTP verified successfully' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { email, password, confirmPassword } = resetPasswordDto;
    
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const hashedPassword = await this.hashPassword(password);
    user.password = hashedPassword;
    await user.save();
    
    await this.otpModel.deleteMany({ email, type: 'password-reset' });
    
    return { message: 'Password reset successfully' };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;
    
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    
    const user = await this.userModel.findById(userId).select('+password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const isCurrentPasswordValid = await this.comparePasswords(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }
    
    const hashedPassword = await this.hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    
    return { message: 'Password changed successfully' };
  }

  private transformUserResponse(user: any): IUserResponse {
    return {
      id: user._id?.toString() || user.id,
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