import { IsEmail, IsString, MinLength, MaxLength, Matches, IsPhoneNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { Match } from '../validators/match.validator';

export class BaseRegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsPhoneNumber()
  @Transform(({ value }) => value?.trim())
  phoneNumber: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
    },
  )
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}