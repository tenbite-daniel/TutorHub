import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentApplication, EnrollmentApplicationSchema } from './schemas/enrollment-application.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EnrollmentApplication.name, schema: EnrollmentApplicationSchema },
    ]),
  ],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
})
export class EnrollmentModule {}