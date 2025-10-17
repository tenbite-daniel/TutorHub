import { IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { BaseRegisterDto } from './base-register.dto';

export class RegisterStudentDto extends BaseRegisterDto {
  @IsInt()
  @Min(5, { message: 'Age must be at least 5 years old' })
  @Max(100, { message: 'Age must be less than 100 years old' })
  @Transform(({ value }) => parseInt(value))
  age: number;
}