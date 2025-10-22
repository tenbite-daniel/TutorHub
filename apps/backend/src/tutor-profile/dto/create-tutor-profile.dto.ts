import { IsString, IsNotEmpty, IsArray, IsOptional, IsNumber } from 'class-validator';

export class CreateTutorProfileDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsString()
  @IsNotEmpty()
  experience: string;

  @IsString()
  @IsOptional()
  profileImage?: string;

  @IsArray()
  @IsNotEmpty()
  subjects: string[];

  @IsArray()
  @IsNotEmpty()
  grades: string[];

  @IsArray()
  @IsOptional()
  certificates?: { subject: string; certificateUrl: string }[];


  @IsArray()
  @IsOptional()
  availability?: string[];

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  location?: string;
}