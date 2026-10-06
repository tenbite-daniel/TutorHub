import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

const isProduction = (env: EnvironmentVariables) =>
  env.NODE_ENV === Environment.Production;

/**
 * Environment variables the backend needs.
 * The app refuses to start if a required variable is missing, instead of
 * silently falling back to an insecure default.
 */
export class EnvironmentVariables {
  @IsOptional()
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 5000;

  @IsOptional()
  @IsString()
  FRONTEND_URL: string = 'http://localhost:3000';

  /** Number of reverse proxies in front of the app (0 = trust none). */
  @IsOptional()
  @IsInt()
  @Min(0)
  TRUST_PROXY_HOPS: number = 0;

  // --- Always required ---
  @IsString()
  @IsNotEmpty()
  MONGODB_URI: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET: string;

  @IsString()
  @IsNotEmpty()
  COOKIE_SECRET: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CALLBACK_URL: string;

  // --- Required in production only ---
  @ValidateIf(isProduction)
  @IsString()
  @IsNotEmpty()
  CLOUDINARY_CLOUD_NAME?: string;

  @ValidateIf(isProduction)
  @IsString()
  @IsNotEmpty()
  CLOUDINARY_API_KEY?: string;

  @ValidateIf(isProduction)
  @IsString()
  @IsNotEmpty()
  CLOUDINARY_API_SECRET?: string;

  @ValidateIf(isProduction)
  @IsString()
  @IsNotEmpty()
  BREVO_API_KEY?: string;

  @ValidateIf(isProduction)
  @IsString()
  @IsNotEmpty()
  EMAIL_FROM_ADDRESS?: string;

  @IsOptional()
  @IsString()
  EMAIL_FROM_NAME: string = 'TutorHub - Ethiopia';
}

export function validate(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    const missing = errors
      .map((e) => `  - ${e.property}: ${Object.values(e.constraints ?? {}).join(', ')}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${missing}`);
  }

  return validated;
}
