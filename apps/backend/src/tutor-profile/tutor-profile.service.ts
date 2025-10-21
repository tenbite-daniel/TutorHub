import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTutorProfileDto } from './dto/create-tutor-profile.dto';
import { TutorProfile, TutorProfileDocument } from './schemas/tutor-profile.schema';

@Injectable()
export class TutorProfileService {
  constructor(
    @InjectModel(TutorProfile.name)
    private tutorProfileModel: Model<TutorProfileDocument>,
  ) {}

  async create(userId: string, createTutorProfileDto: CreateTutorProfileDto) {
    const profile = new this.tutorProfileModel({
      userId,
      ...createTutorProfileDto,
    });
    return profile.save();
  }

  async findByUserId(userId: string) {
    return this.tutorProfileModel.findOne({ userId }).exec();
  }

  async update(userId: string, updateData: Partial<CreateTutorProfileDto>) {
    return this.tutorProfileModel.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, upsert: true }
    ).exec();
  }

  async findAll() {
    return this.tutorProfileModel.find().exec();
  }
}