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
    @Param('tutorId') tutorId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: string,
  ) {
    return this.enrollmentService.findByTutor(+tutorId, {
      page: +page,
      limit: +limit,
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