import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TutorProfileController } from './tutor-profile.controller';
import { TutorProfileService } from './tutor-profile.service';
import { TutorProfile, TutorProfileSchema } from './schemas/tutor-profile.schema';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TutorProfile.name, schema: TutorProfileSchema },
    ]),
    UploadModule,
  ],
  controllers: [TutorProfileController],
  providers: [TutorProfileService],
  exports: [TutorProfileService],
})
export class TutorProfileModule {}