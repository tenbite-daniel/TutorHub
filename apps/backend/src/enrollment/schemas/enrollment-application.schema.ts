import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EnrollmentApplicationDocument = EnrollmentApplication & Document;

@Schema({ timestamps: true })
export class EnrollmentApplication {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  tutorId: Types.ObjectId;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  grade: string;

  @Prop({ required: true })
  preferredSchedule: string;

  @Prop({ required: true })
  goals: string;

  @Prop()
  experience: string;

  @Prop()
  additionalNotes: string;

  @Prop({ 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  })
  status: string;

  @Prop()
  tutorResponse: string;
}

export const EnrollmentApplicationSchema = SchemaFactory.createForClass(EnrollmentApplication);