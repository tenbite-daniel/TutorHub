import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateEnrollmentApplicationDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['accepted', 'rejected'])
  status: 'accepted' | 'rejected';

  @IsString()
  @IsNotEmpty()
  tutorResponse: string;
}