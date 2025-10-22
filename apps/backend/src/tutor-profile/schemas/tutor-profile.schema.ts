import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TutorProfileDocument = TutorProfile & Document;

@Schema({ timestamps: true })
export class TutorProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  bio: string;

  @Prop({ required: true })
  experience: string;

  @Prop()
  profileImage: string;

  @Prop({ type: [String], required: true })
  subjects: string[];

  @Prop({ type: [String], required: true })
  grades: string[];

  @Prop({ type: [{ subject: String, certificateUrl: String }] })
  certificates: { subject: string; certificateUrl: string }[];


  @Prop({ type: [String] })
  availability: string[];

  @Prop()
  phoneNumber: string;

  @Prop()
  location: string;

  @Prop({ default: false })
  isVerified: boolean;
}

export const TutorProfileSchema = SchemaFactory.createForClass(TutorProfile);