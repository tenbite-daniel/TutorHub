import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { TutorProfileModule } from './tutor-profile/tutor-profile.module';
import { UploadModule } from './upload/upload.module';
import { HealthModule } from './health/health.module';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const uri = configService.getOrThrow<string>('MONGODB_URI');
        console.log('🔗 Connecting to MongoDB...');
        return {
          uri,
          serverSelectionTimeoutMS: 5000,
          onConnectionCreate: (connection) => {
            connection.on('connected', () => console.log('✅ MongoDB connected successfully!'));
            connection.on('error', (err: any) => console.error('❌ MongoDB connection error:', err.message));
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute globally
    }]),
    AuthModule,
    EnrollmentModule,
    TutorProfileModule,
    UploadModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
