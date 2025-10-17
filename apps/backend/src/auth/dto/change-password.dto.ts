import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { Match } from '../validators/match.validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(1, { message: 'Current password is required' })
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
    },
  )
  newPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Match('newPassword', { message: 'Passwords do not match' })
  confirmPassword: string;
}