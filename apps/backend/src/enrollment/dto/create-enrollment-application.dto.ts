import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateEnrollmentApplicationDto {
  @IsNumber()
  @IsNotEmpty()
  tutorId: number;

  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  grade: string;

  @IsString()
  @IsNotEmpty()
  preferredSchedule: string;

  @IsString()
  @IsNotEmpty()
  goals: string;

  @IsString()
  @IsOptional()
  experience?: string;

  @IsString()
  @IsOptional()
  additionalNotes?: string;
}