import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEnrollmentApplicationDto {
  @IsString()
  @IsNotEmpty()
  tutorId: string;

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