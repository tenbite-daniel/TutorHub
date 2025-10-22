import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TutorProfileService } from './tutor-profile.service';
import { CreateTutorProfileDto } from './dto/create-tutor-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';
import { UploadService } from '../upload/upload.service';

@Controller('tutor-profile')
export class TutorProfileController {
  constructor(
    private readonly tutorProfileService: TutorProfileService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @Roles(UserRole.TUTOR)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createTutorProfileDto: CreateTutorProfileDto) {
    return this.tutorProfileService.create(req.user.id, createTutorProfileDto);
  }

  @Get()
  @Roles(UserRole.TUTOR)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  findProfile(@Request() req) {
    return this.tutorProfileService.findByUserId(req.user.id);
  }

  @Patch()
  @Roles(UserRole.TUTOR)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  update(@Request() req, @Body() updateData: Partial<CreateTutorProfileDto>) {
    return this.tutorProfileService.update(req.user.id, updateData);
  }

  @Post('upload-profile-image')
  @Roles(UserRole.TUTOR)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG files are allowed');
    }

    const url = await this.uploadService.uploadFile(file, 'profile-images');
    await this.tutorProfileService.update(req.user.id, { profileImage: url });
    return { profileImage: url };
  }

  @Post('upload-certificate')
  @Roles(UserRole.TUTOR)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadCertificate(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('subject') subject: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!subject) {
      throw new BadRequestException('Subject is required');
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only PDF, JPEG, PNG files are allowed');
    }

    const url = await this.uploadService.uploadFile(file, 'certificates');
    return { certificateUrl: url, subject };
  }

  @Get('all')
  findAll() {
    return this.tutorProfileService.findAll();
  }
}