import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentApplicationDto } from './dto/create-enrollment-application.dto';
import { UpdateEnrollmentApplicationDto } from './dto/update-enrollment-application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';

@Controller('enrollment-applications')
@UseGuards(JwtAuthGuard)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @Roles(UserRole.STUDENT)
  @UseGuards(RolesGuard)
  create(@Body() createEnrollmentApplicationDto: CreateEnrollmentApplicationDto) {
    return this.enrollmentService.create(createEnrollmentApplicationDto);
  }

  @Get('student')
  @Roles(UserRole.STUDENT)
  @UseGuards(RolesGuard)
  findByStudent(@Request() req) {
    return this.enrollmentService.findByStudent(req.user.userId);
  }

  @Get('tutor/:tutorId')
  @Roles(UserRole.TUTOR)
  @UseGuards(RolesGuard)
  findByTutor(
    @Param('tutorId', ParseIntPipe) tutorId: number,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: string,
  ) {
    if (isNaN(tutorId) || !Number.isInteger(tutorId)) {
      throw new BadRequestException('Invalid tutorId: must be a valid integer');
    }
    
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    
    if (isNaN(parsedPage) || parsedPage < 1) {
      throw new BadRequestException('Invalid page: must be a positive number');
    }
    if (isNaN(parsedLimit) || parsedLimit < 1) {
      throw new BadRequestException('Invalid limit: must be a positive number');
    }
    
    return this.enrollmentService.findByTutor(tutorId, {
      page: parsedPage,
      limit: parsedLimit,
      status,
    });
  }

  @Patch(':id')
  @Roles(UserRole.TUTOR)
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateEnrollmentApplicationDto: UpdateEnrollmentApplicationDto,
  ) {
    return this.enrollmentService.update(id, updateEnrollmentApplicationDto);
  }
}