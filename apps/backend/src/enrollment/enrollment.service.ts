import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateEnrollmentApplicationDto } from './dto/create-enrollment-application.dto';
import { UpdateEnrollmentApplicationDto } from './dto/update-enrollment-application.dto';
import { EnrollmentApplication, EnrollmentApplicationDocument } from './schemas/enrollment-application.schema';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectModel(EnrollmentApplication.name)
    private enrollmentApplicationModel: Model<EnrollmentApplicationDocument>,
  ) {}

  async create(createEnrollmentApplicationDto: CreateEnrollmentApplicationDto) {
    const createdApplication = new this.enrollmentApplicationModel(createEnrollmentApplicationDto);
    return createdApplication.save();
  }

  async findByStudent(studentId: string) {
    return this.enrollmentApplicationModel
      .find({ studentId: new Types.ObjectId(studentId) })
      .populate('tutorId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByTutor(tutorId: string, options: { page: number; limit: number; status?: string }) {
    const { page, limit, status } = options;
    const skip = (page - 1) * limit;
    
    const filter: any = { tutorId: new Types.ObjectId(tutorId) };
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    const [applications, total] = await Promise.all([
      this.enrollmentApplicationModel
        .find(filter)
        .populate('studentId', 'firstName lastName email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.enrollmentApplicationModel.countDocuments(filter).exec(),
    ]);
    
    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, updateEnrollmentApplicationDto: UpdateEnrollmentApplicationDto) {
    return this.enrollmentApplicationModel.findByIdAndUpdate(
      id,
      updateEnrollmentApplicationDto,
      { new: true }
    ).exec();
  }
}